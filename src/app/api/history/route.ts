import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { devAnalysesStore } from "../analyze/route";

export async function GET(req: NextRequest) {
  try {
    let userId: string | null = null;
    let supabase: any = null;

    try {
      supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // Dev mode
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const riskLevel = searchParams.get("risk") || "all";
    const source = searchParams.get("source") || "all";

    const isMockEnv =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

    let results: any[] = [];

    if (!isMockEnv && userId) {
      let query = supabase
        .from("analyses")
        .select("id, message, source, language, word_count, risk_score, risk_level, scam_types, summary, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (riskLevel !== "all") {
        query = query.eq("risk_level", riskLevel);
      }
      if (source !== "all") {
        query = query.eq("source", source);
      }

      const { data, error } = await query;
      if (!error && data) {
        results = data;
      }
    } else {
      // In dev fallback or guest mode, retrieve from devAnalysesStore
      results = Array.from(devAnalysesStore.values());
      if (userId && userId !== "guest-session") {
        results = results.filter((item) => item.user_id === userId);
      }

      if (riskLevel !== "all") {
        results = results.filter((item) => item.risk_level === riskLevel);
      }
      if (source !== "all") {
        results = results.filter((item) => item.source === source);
      }
    }

    // Apply text search filter if provided
    if (search) {
      results = results.filter(
        (item) =>
          item.message.toLowerCase().includes(search) ||
          item.summary.toLowerCase().includes(search) ||
          (Array.isArray(item.scam_types) && item.scam_types.some((t: string) => t.toLowerCase().includes(search)))
      );
    }

    return NextResponse.json({ analyses: results });
  } catch (err: any) {
    console.error("History fetch error:", err);
    return NextResponse.json({ error: "Failed to retrieve history." }, { status: 500 });
  }
}
