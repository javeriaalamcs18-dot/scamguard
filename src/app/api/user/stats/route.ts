import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserUsageStatus } from "@/lib/usage/service";

export async function GET(req: NextRequest) {
  try {
    let userId = "guest-session";
    let userEmail = "guest@scamguard.ai";
    let fullName = "Guest User";

    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userId = user.id;
        userEmail = user.email || "";
        fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
      }
    } catch {
      // In dev fallback
    }

    const usageStatus = await getUserUsageStatus(userId);

    return NextResponse.json({
      user: {
        id: userId,
        email: userEmail,
        fullName,
        isGuest: userId === "guest-session",
      },
      usage: usageStatus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load user stats." }, { status: 500 });
  }
}
