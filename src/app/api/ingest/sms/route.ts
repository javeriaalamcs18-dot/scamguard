import { NextRequest, NextResponse } from "next/server";
import { runScamAnalysisPipeline } from "@/lib/ai/pipeline";
import { checkAndRecordUsage } from "@/lib/usage/service";
import { devAnalysesStore } from "../../analyze/route";

export async function POST(req: NextRequest) {
  try {
    let messageText = "";
    let senderNumber = "Unknown";
    let userId = "guest-session";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      messageText = body.text || body.message || body.Body || "";
      senderNumber = body.from || body.sender || body.From || "Unknown";
      if (body.userId) userId = body.userId;
    } else {
      // Handle standard webhook form-urlencoded (e.g. Twilio SMS webhook)
      const formData = await req.formData();
      messageText = (formData.get("Body") as string) || (formData.get("text") as string) || "";
      senderNumber = (formData.get("From") as string) || "Unknown";
    }

    if (!messageText.trim()) {
      return NextResponse.json({ error: "Missing SMS message content." }, { status: 400 });
    }

    const compositeMessage = `Sender Phone: ${senderNumber}\nSMS Text: ${messageText}`.trim();
    const wordCount = messageText.split(/\s+/).length;

    // Check usage
    const usageCheck = await checkAndRecordUsage(userId, wordCount);
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.error, limitReached: true }, { status: 429 });
    }

    const result = await runScamAnalysisPipeline(compositeMessage, {
      source: "SMS",
      language: "auto",
      userId,
    });

    const analysisId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    devAnalysesStore.set(analysisId, {
      id: analysisId,
      user_id: userId,
      message: compositeMessage,
      source: "SMS",
      language: "auto",
      word_count: wordCount,
      ...result,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: analysisId,
      data: result,
      source: "SMS",
      sender: senderNumber,
      wordCount,
      remainingWords: usageCheck.remainingWords,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process incoming SMS." }, { status: 500 });
  }
}
