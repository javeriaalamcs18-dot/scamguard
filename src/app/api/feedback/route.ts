import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysis_id, rating, comment } = body;

    if (!analysis_id || !rating || (rating !== "helpful" && rating !== "unhelpful")) {
      return NextResponse.json({ error: "Invalid feedback payload." }, { status: 400 });
    }

    let userId: string | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;

      const isMockEnv =
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

      if (!isMockEnv) {
        await supabase.from("feedback").insert({
          user_id: userId,
          analysis_id,
          rating,
          comment: comment || null,
        });
      }
    } catch {
      // In dev or guest mode, proceed
    }

    return NextResponse.json({ success: true, message: "Thank you for your feedback!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record feedback." }, { status: 500 });
  }
}
