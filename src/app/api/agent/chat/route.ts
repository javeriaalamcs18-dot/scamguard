import { NextRequest, NextResponse } from "next/server";
import { runScamGuardAgent } from "@/lib/ai/agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const agentResponse = await runScamGuardAgent(message.trim(), history);

    return NextResponse.json({
      success: true,
      ...agentResponse,
    });
  } catch (err: any) {
    console.error("Agent error:", err);
    return NextResponse.json({ error: "The agent encountered an error. Please try again." }, { status: 500 });
  }
}
