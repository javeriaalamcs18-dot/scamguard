import { createServerSupabaseClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";

export type PlanType = "free" | "pro" | "business";

export interface PlanLimits {
  name: string;
  monthlyWordLimit: number; // -1 for unlimited
  priceMonthly: number;
}

export const PLAN_CONFIGS: Record<PlanType, PlanLimits> = {
  free: {
    name: "Free",
    monthlyWordLimit: 5000,
    priceMonthly: 0,
  },
  pro: {
    name: "Pro",
    monthlyWordLimit: 20000,
    priceMonthly: 12,
  },
  business: {
    name: "Business",
    monthlyWordLimit: -1, // Unlimited
    priceMonthly: 49,
  },
};

export interface UserUsageStatus {
  plan: PlanType;
  wordsUsed: number;
  wordLimit: number;
  wordsRemaining: number;
  usagePercentage: number;
  canAnalyze: boolean;
  message?: string;
}

// In-memory development store for mock execution & local testing
const inMemoryUsageStore: Map<string, { plan: PlanType; wordsUsed: number }> = new Map();

export function resetMockUsage() {
  inMemoryUsageStore.clear();
}

export function setMockUserUsage(userId: string, plan: PlanType, wordsUsed: number) {
  inMemoryUsageStore.set(userId, { plan, wordsUsed });
}

export function getCurrentMonthString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function getUserUsageStatus(userId: string): Promise<UserUsageStatus> {
  const month = getCurrentMonthString();
  const isMockEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

  if (isMockEnv || inMemoryUsageStore.has(userId)) {
    const record = inMemoryUsageStore.get(userId) || { plan: "free", wordsUsed: 0 };
    const planConfig = PLAN_CONFIGS[record.plan] || PLAN_CONFIGS.free;
    const isUnlimited = planConfig.monthlyWordLimit === -1;
    const remaining = isUnlimited ? 999999 : Math.max(0, planConfig.monthlyWordLimit - record.wordsUsed);
    const percentage = isUnlimited
      ? 0
      : Math.min(100, Math.round((record.wordsUsed / planConfig.monthlyWordLimit) * 100));

    return {
      plan: record.plan,
      wordsUsed: record.wordsUsed,
      wordLimit: planConfig.monthlyWordLimit,
      wordsRemaining: remaining,
      usagePercentage: percentage,
      canAnalyze: isUnlimited || remaining > 0,
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    // 1. Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .single();

    const plan: PlanType = (profile?.plan as PlanType) || "free";
    const planConfig = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free;
    const isUnlimited = planConfig.monthlyWordLimit === -1;

    // 2. Fetch usage for current month
    const { data: usageRow } = await supabase
      .from("usage")
      .select("words_used, word_limit")
      .eq("user_id", userId)
      .eq("month", month)
      .single();

    const wordsUsed = usageRow?.words_used || 0;
    const limit = isUnlimited ? -1 : (usageRow?.word_limit || planConfig.monthlyWordLimit);
    const remaining = isUnlimited ? 999999 : Math.max(0, limit - wordsUsed);
    const percentage = isUnlimited ? 0 : Math.min(100, Math.round((wordsUsed / limit) * 100));

    return {
      plan,
      wordsUsed,
      wordLimit: limit,
      wordsRemaining: remaining,
      usagePercentage: percentage,
      canAnalyze: isUnlimited || remaining > 0,
    };
  } catch {
    // Graceful fallback to default free status
    return {
      plan: "free",
      wordsUsed: 0,
      wordLimit: 5000,
      wordsRemaining: 5000,
      usagePercentage: 0,
      canAnalyze: true,
    };
  }
}

export async function checkAndRecordUsage(
  userId: string,
  wordCount: number
): Promise<{ allowed: boolean; error?: string; remainingWords: number }> {
  const currentStatus = await getUserUsageStatus(userId);
  const planConfig = PLAN_CONFIGS[currentStatus.plan] || PLAN_CONFIGS.free;
  const isUnlimited = planConfig.monthlyWordLimit === -1;

  if (!isUnlimited) {
    if (currentStatus.wordsUsed + wordCount > planConfig.monthlyWordLimit) {
      return {
        allowed: false,
        error: `Monthly analysis limit reached (${currentStatus.wordsUsed} / ${planConfig.monthlyWordLimit} words used). Please upgrade to Pro or Business for more words.`,
        remainingWords: currentStatus.wordsRemaining,
      };
    }
  }

  // Update usage count
  const isMockEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

  if (isMockEnv || inMemoryUsageStore.has(userId)) {
    const existing = inMemoryUsageStore.get(userId) || { plan: currentStatus.plan, wordsUsed: 0 };
    existing.wordsUsed += wordCount;
    inMemoryUsageStore.set(userId, existing);
    const newRemaining = isUnlimited ? 999999 : Math.max(0, planConfig.monthlyWordLimit - existing.wordsUsed);
    return { allowed: true, remainingWords: newRemaining };
  }

  try {
    const adminSupabase = createAdminClient();
    const month = getCurrentMonthString();

    const { error } = await adminSupabase.rpc("increment_usage", {
      p_user_id: userId,
      p_month: month,
      p_words: wordCount,
      p_limit: planConfig.monthlyWordLimit,
    });

    if (error) {
      // If RPC is not created, do upsert
      const newWords = currentStatus.wordsUsed + wordCount;
      await adminSupabase.from("usage").upsert({
        user_id: userId,
        month,
        words_used: newWords,
        word_limit: planConfig.monthlyWordLimit,
        updated_at: new Date().toISOString(),
      });
    }

    const newRemaining = isUnlimited ? 999999 : Math.max(0, planConfig.monthlyWordLimit - (currentStatus.wordsUsed + wordCount));
    return { allowed: true, remainingWords: newRemaining };
  } catch (err) {
    console.error("Failed to record usage in database:", err);
    // Allow request to proceed even if usage logging had a minor db blip
    return { allowed: true, remainingWords: currentStatus.wordsRemaining };
  }
}
