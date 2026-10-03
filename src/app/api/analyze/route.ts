import { NextRequest, NextResponse } from "next/server";
import { runScamAnalysisPipeline, validateInputMessage } from "@/lib/ai/pipeline";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkAndRecordUsage } from "@/lib/usage/service";

// In-memory analysis storage for guest / dev mode
export const devAnalysesStore: Map<string, any> = new Map();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, source = "other", language = "auto" } = body;

    // 1. Input Validation
    const validation = validateInputMessage(message || "");
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 2. Auth identification
    let userId: string = "guest-session";
    let userEmail: string | undefined = undefined;

    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        userEmail = user.email;
      }
    } catch {
      // In guest or local mode, continue
    }

    // 3. Usage & Plan Limit Check
    const usageCheck = await checkAndRecordUsage(userId, validation.wordCount);
    if (!usageCheck.allowed) {
      return NextResponse.json(
        {
          error: usageCheck.error,
          limitReached: true,
          remainingWords: usageCheck.remainingWords,
        },
        { status: 429 }
      );
    }

    // 4. Run AI Analysis Pipeline (Pre-analyzer, prompt injection defense, AI provider / heuristics, Zod validation)
    const analysisResult = await runScamAnalysisPipeline(message, {
      source,
      language,
      userId,
    });

    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // 5. Save to Supabase if authenticated, or store in memory
    const isMockEnv =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

    if (!isMockEnv && userId !== "guest-session") {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.from("analyses").insert({
          id: analysisId,
          user_id: userId,
          message,
          source,
          language,
          word_count: validation.wordCount,
          risk_score: analysisResult.risk_score,
          risk_level: analysisResult.risk_level,
          confidence: analysisResult.confidence,
          summary: analysisResult.summary,
          scam_types: analysisResult.scam_types,
          manipulation_tactics: analysisResult.manipulation_tactics,
          objectives: analysisResult.possible_objectives,
          evidence: analysisResult.evidence,
          attack_path: analysisResult.attack_path,
          do_not_share: analysisResult.do_not_share,
          safe_verification: analysisResult.safe_verification,
          immediate_actions: analysisResult.immediate_actions,
          damage_control: analysisResult.damage_control,
          educational_explanation: analysisResult.educational_explanation,
          disclaimer: analysisResult.disclaimer,
        });
      } catch (dbErr) {
        console.warn("Could not save to Supabase database, storing in fallback memory:", dbErr);
      }
    }

    // Always store in memory for quick retrieval in /history or dev
    devAnalysesStore.set(analysisId, {
      id: analysisId,
      user_id: userId,
      message,
      source,
      language,
      word_count: validation.wordCount,
      ...analysisResult,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: analysisId,
      data: analysisResult,
      wordCount: validation.wordCount,
      remainingWords: usageCheck.remainingWords,
    });
  } catch (error: any) {
    console.error("Analysis pipeline error:", error);
    return NextResponse.json(
      { error: error.message || "We couldn't complete the analysis right now. Please try again." },
      { status: 500 }
    );
  }
}
