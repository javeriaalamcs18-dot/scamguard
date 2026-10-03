import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { devAnalysesStore } from "../../analyze/route";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
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

    const isMockEnv =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

    if (!isMockEnv && userId) {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single();

      if (error || !data) {
        // Fallback to dev store if not found in db
        const devItem = devAnalysesStore.get(id);
        if (devItem) return NextResponse.json({ analysis: devItem });
        return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
      }

      return NextResponse.json({ analysis: data });
    }

    const devItem = devAnalysesStore.get(id);
    if (!devItem) {
      return NextResponse.json({ error: "Analysis not found." }, { status: 404 });
    }

    return NextResponse.json({ analysis: devItem });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to retrieve analysis." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
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

    const isMockEnv =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("mock-scamguard");

    if (!isMockEnv && userId) {
      const { error } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        return NextResponse.json({ error: "Could not delete analysis." }, { status: 400 });
      }
    }

    devAnalysesStore.delete(id);
    return NextResponse.json({ success: true, message: "Analysis deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to delete analysis." }, { status: 500 });
  }
}
