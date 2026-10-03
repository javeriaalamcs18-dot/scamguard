import { runHeuristicAnalysis, extractAndAnalyzeUrls } from "./heuristics";
import { ScamAnalysisResult } from "./types";

export interface AgentMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  analysis?: ScamAnalysisResult;
  toolCalls?: {
    name: string;
    input: string;
    result: string;
  }[];
}

export interface AgentResponse {
  message: string;
  toolCalls?: {
    name: string;
    input: string;
    result: string;
  }[];
  analysis?: ScamAnalysisResult;
  suggestedQuestions?: string[];
}

export async function runScamGuardAgent(
  userQuery: string,
  history: AgentMessage[] = []
): Promise<AgentResponse> {
  const lower = userQuery.toLowerCase();
  const toolCalls: { name: string; input: string; result: string }[] = [];

  // Check if input contains an URL
  const urls = extractAndAnalyzeUrls(userQuery);
  if (urls.length > 0) {
    toolCalls.push({
      name: "inspect_domain_safety",
      input: urls[0].url,
      result: `Domain ${urls[0].domain} inspected. Lookalike: ${urls[0].isLookalike}, Suspicious TLD: ${urls[0].suspiciousTld}, IP address: ${urls[0].isIpAddress}.`,
    });
  }

  // Check if user is asking a general advice question or providing message to analyze
  const isQuestion =
    lower.startsWith("what should i do") ||
    lower.startsWith("someone called") ||
    lower.startsWith("i clicked") ||
    lower.startsWith("i shared") ||
    lower.startsWith("can you check") ||
    lower.startsWith("how to verify");

  // Run deep threat analyzer tool
  toolCalls.push({
    name: "analyze_threat_signals",
    input: userQuery.slice(0, 80) + (userQuery.length > 80 ? "..." : ""),
    result: "Evaluated emotional urgency, reward hooks, credential demands, and regional context.",
  });

  const analysis = runHeuristicAnalysis(userQuery, "Chat", "auto");

  let replyText = "";
  const suggestions: string[] = [];

  if (analysis.risk_level === "very_high" || analysis.risk_level === "high") {
    replyText = `⚠️ **Warning:** Based on my investigation, this content shows strong warning signs of a **${analysis.scam_types.join(
      ", "
    )}** (Risk Score: **${analysis.risk_score}/100**).\n\n${analysis.summary}\n\n🛑 **Critical Guidance:** Under no circumstances should you share: **${analysis.do_not_share.join(
      ", "
    )}**.\n\nDid you already interact or click any link? Let me know so I can guide you through damage control.`;

    suggestions.push(
      "I already clicked the link, what now?",
      "I shared my OTP, how to block it?",
      "What is the official number to verify this?"
    );
  } else if (analysis.risk_level === "medium") {
    replyText = `🔍 **Assessment:** This message contains ambiguous elements (Risk Score: **${analysis.risk_score}/100**). ${analysis.summary}\n\nI recommend verifying this independently through official channels rather than replying directly.`;
    suggestions.push("How can I verify this safely?", "Is this phone number registered?");
  } else {
    replyText = `🛡️ **Safe / Low Risk:** No overt scam or phishing threat signals were identified in this message (Risk Score: **${analysis.risk_score}/100**).\n\n${analysis.summary}\n\nAlways maintain standard security hygiene and never share account passwords or SMS verification codes with third parties.`;
    suggestions.push("Check another suspicious link", "How to identify fake bank calls?");
  }

  // Handle specific interaction followups
  if (lower.includes("clicked") || lower.includes("opened the link")) {
    replyText = `🚨 **Immediate Incident Response (Clicked Link):**\n1. Disconnect your browser tab immediately.\n2. Do NOT enter any passwords or payment information on the page.\n3. Clear your browser history and cache.\n4. Check your downloads folder for any unrequested files or APKs and delete them without opening.`;
  } else if (lower.includes("shared otp") || lower.includes("gave otp") || lower.includes("pin")) {
    replyText = `🚨 **Critical Emergency Protocol (Shared OTP / PIN):**\n1. Call your bank or mobile wallet (Easypaisa/JazzCash) helpline **immediately** from another phone.\n2. Request a temporary account lock / session termination.\n3. Inform the fraud support desk that an unauthorized party received an OTP.\n4. Review recent transactions for any unapproved transfers.`;
  }

  return {
    message: replyText,
    toolCalls,
    analysis,
    suggestedQuestions: suggestions,
  };
}
