import { NextRequest, NextResponse } from "next/server";
import { runScamAnalysisPipeline } from "@/lib/ai/pipeline";
import { checkAndRecordUsage } from "@/lib/usage/service";
import { devAnalysesStore } from "../../analyze/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { from, subject = "", body: emailBody, userId = "guest-session" } = body;

    if (!emailBody && !subject) {
      return NextResponse.json({ error: "Missing email content to analyze." }, { status: 400 });
    }

    // Construct full email inspection payload
    const compositeMessage = `From: ${from || "Unknown Sender"}\nSubject: ${subject}\n\n${emailBody || ""}`.trim();
    const wordCount = compositeMessage.split(/\s+/).length;

    // Check usage
    const usageCheck = await checkAndRecordUsage(userId, wordCount);
    if (!usageCheck.allowed) {
      return NextResponse.json({ error: usageCheck.error, limitReached: true }, { status: 429 });
    }

    // Run AI pipeline with Email source
    const result = await runScamAnalysisPipeline(compositeMessage, {
      source: "Email",
      language: "auto",
      userId,
    });

    // Check for display name spoofing
    if (from && (from.toLowerCase().includes("bank") || from.toLowerCase().includes("support") || from.toLowerCase().includes("security"))) {
      if (from.toLowerCase().includes("@gmail.com") || from.toLowerCase().includes("@yahoo.com") || from.toLowerCase().includes("@hotmail.com")) {
        result.evidence.unshift({
          signal: "Sender Email Spoofing / Mismatched Domain",
          explanation: `The sender claims to be '${from}' but uses a free public webmail address instead of an authenticated institutional corporate domain.`
        });
        if (result.risk_score < 75) {
          result.risk_score = 80;
          result.risk_level = "very_high";
        }
      }
    }

    const analysisId = `email_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    devAnalysesStore.set(analysisId, {
      id: analysisId,
      user_id: userId,
      message: compositeMessage,
      source: "Email",
      language: "auto",
      word_count: wordCount,
      ...result,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      id: analysisId,
      data: result,
      source: "Email",
      wordCount,
      remainingWords: usageCheck.remainingWords,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to analyze incoming email." }, { status: 500 });
  }
}
