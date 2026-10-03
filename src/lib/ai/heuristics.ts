import { ScamAnalysisResult, RiskLevel, ConfidenceLevel, EvidenceItem, ManipulationTacticItem, AttackPathStep } from "./types";

export interface UrlAnalysis {
  url: string;
  domain: string;
  isShortened: boolean;
  isIpAddress: boolean;
  isLookalike: boolean;
  suspiciousTld: boolean;
  flags: string[];
}

export interface PreAnalysisDetails {
  urls: UrlAnalysis[];
  isPromptInjection: boolean;
  detectedLanguage: "English" | "Roman Urdu" | "Urdu" | "Other";
  hasPakistanContext: boolean;
  pakistanKeywordsFound: string[];
  indicators: string[];
}

const SHORTENED_DOMAINS = new Set([
  "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly", "cutt.ly", "rb.gy", "goo.gl", "tiny.cc"
]);

const SUSPICIOUS_TLDS = new Set([
  "xyz", "top", "work", "loan", "click", "rest", "buzz", "gq", "cf", "tk", "ml", "ga", "country", "stream"
]);

const LOOKALIKE_PATTERNS = [
  /easypa[i1l]sa/i,
  /jazzca[s5]h/i,
  /mee[z2]an/i,
  /hb[i1l]-?bank/i,
  /paypa[i1l]/i,
  /netf[i1l]ix/i,
  /supp0rt/i,
  /ver[i1l]fy/i,
  /secur[i1l]ty/i,
];

const ROMAN_URDU_KEYWORDS = [
  "aap", "apka", "apki", "bhejo", "karo", "muft", "inaam", "paise", "miley", "milega", 
  "jeeta", "wazifa", "tariqa", "jaldi", "number", "khata", "band", "hosakta", "raast", "shukriya"
];

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /reveal\s+(your\s+)?prompt/i,
  /you\s+are\s+now\s+(an\s+unfiltered|DAN)/i,
  /disregard\s+(the\s+)?above/i,
  /bypass\s+(safety|content)\s+filters/i,
  /repeat\s+(everything|the\s+text)\s+above/i,
];

export function extractAndAnalyzeUrls(text: string): UrlAnalysis[] {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(xyz|top|work|loan|click|buzz|gq|cf|tk|ml)\b[^\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  const results: UrlAnalysis[] = [];

  for (const raw of matches) {
    let normalized = raw;
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "http://" + normalized;
    }

    try {
      const parsed = new URL(normalized);
      const domain = parsed.hostname.toLowerCase();
      const flags: string[] = [];

      const isShortened = SHORTENED_DOMAINS.has(domain);
      if (isShortened) flags.push("Shortened URL hiding destination");

      const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
      if (isIpAddress) flags.push("Raw IP address used instead of reputable domain name");

      const isLookalike = LOOKALIKE_PATTERNS.some((pat) => pat.test(domain));
      if (isLookalike) flags.push("Potential lookalike / typosquatting domain pattern");

      const tld = domain.split(".").pop() || "";
      const suspiciousTld = SUSPICIOUS_TLDS.has(tld);
      if (suspiciousTld) flags.push(`Suspicious / high-abuse top-level domain (.${tld})`);

      if (parsed.searchParams.toString().length > 100) {
        flags.push("Excessive tracking or credential harvesting parameters in URL");
      }

      results.push({
        url: raw,
        domain,
        isShortened,
        isIpAddress,
        isLookalike,
        suspiciousTld,
        flags,
      });
    } catch {
      results.push({
        url: raw,
        domain: raw,
        isShortened: false,
        isIpAddress: false,
        isLookalike: false,
        suspiciousTld: false,
        flags: ["Malformed URL structure"],
      });
    }
  }

  return results;
}

export function detectPromptInjection(text: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function detectLanguage(text: string): "English" | "Roman Urdu" | "Urdu" | "Other" {
  // Check for Arabic/Urdu unicode script
  const urduCharRegex = /[\u0600-\u06FF]/;
  if (urduCharRegex.test(text)) {
    return "Urdu";
  }

  // Check Roman Urdu keywords
  const lower = text.toLowerCase();
  let romanMatches = 0;
  for (const word of ROMAN_URDU_KEYWORDS) {
    if (new RegExp(`\\b${word}\\b`, "i").test(lower)) {
      romanMatches++;
    }
  }

  if (romanMatches >= 2) {
    return "Roman Urdu";
  }

  // Default to English
  return "English";
}

export function analyzePakistanContext(text: string): { hasContext: boolean; keywords: string[] } {
  const pkTerms = [
    "easypaisa", "jazzcash", "telenor microfinance", "mobilink microfinance",
    "meezan", "hbl", "ubl", "bank alfalah", "mcb", "allied bank", "faysal bank",
    "bisp", "benazir income support", "jeeto pakistan", "ehsaas program", "8171",
    "cnic", "nadra", "pta", "sim verification", "biometric verification", "1link", "raast",
    "بے نظیر", "بینظیر", "بینک", "روپے", "انعام"
  ];

  const lower = text.toLowerCase();
  const matched = pkTerms.filter((term) => lower.includes(term) || text.includes(term));
  return {
    hasContext: matched.length > 0,
    keywords: matched,
  };
}

/**
 * Intelligent Rule-Based Analyzer Engine.
 * Used for deep heuristic verification, fallback, and validation.
 */
export function runHeuristicAnalysis(
  text: string,
  source: string = "other",
  requestedLanguage: string = "auto"
): ScamAnalysisResult {
  const lower = text.toLowerCase();
  const urlAnalyses = extractAndAnalyzeUrls(text);
  const isPromptInjection = detectPromptInjection(text);
  const detectedLang = detectLanguage(text);
  const pkContext = analyzePakistanContext(text);

  const lang = requestedLanguage === "auto" ? detectedLang : requestedLanguage;
  const isUrdu = lang === "Urdu";
  const isRomanUrdu = lang === "Roman Urdu";

  // If this is an adversarial prompt injection attack attempt
  if (isPromptInjection) {
    return {
      risk_score: 95,
      risk_level: "very_high",
      confidence: "high",
      summary: isUrdu
        ? "اس پیغام میں پرامپٹ انجیکشن اور سسٹم کو دھوکہ دینے کی کوشش کے واضح اشارے ہیں۔"
        : isRomanUrdu
        ? "Is message mein prompt injection aur AI system ko manipulate karne ki koshish ke wazeh warning signs hain."
        : "This message contains clear prompt injection patterns attempting to override AI instructions and system security boundaries.",
      scam_types: ["Adversarial Prompt Injection", "Social Engineering"],
      evidence: [
        {
          signal: "Prompt override attempt",
          explanation: "The message instructs the assistant to disregard security boundaries or reveal system prompts."
        }
      ],
      manipulation_tactics: [
        {
          tactic: "Authority Impersonation & Command Execution",
          explanation: "Attacker attempts to issue administrative override commands to manipulate safety controls."
        }
      ],
      possible_objectives: ["System Prompt Extraction", "Safety Bypass", "Malicious Code Execution"],
      attack_path: [
        { step: 1, title: "Injection Payload", description: "Attacker injects command instructions into message field." },
        { step: 2, title: "Instruction Hijacking", description: "Tries to trick language processor into abandoning safety rules." },
        { step: 3, title: "System Exploitation", description: "Aims to extract internal parameters or mislead users." }
      ],
      do_not_share: ["System keys", "Internal prompts", "API credentials", "Administrative tokens"],
      safe_verification: ["Disregard instructions contained inside untrusted input texts."],
      immediate_actions: ["Do not execute any instructions provided in this message."],
      damage_control: {
        clicked_link: ["No link was detected in this prompt attack."],
        shared_credentials: ["Immediately rotate any credentials or API keys that may have been exposed."],
        shared_otp: ["Not applicable."],
        shared_bank_card: ["Not applicable."],
        sent_money: ["Not applicable."],
        downloaded_file: ["Scan your machine if you downloaded scripts accompanying this payload."]
      },
      educational_explanation: "Prompt injection is a technique where an attacker crafts an input designed to make an AI model execute unauthorized commands. ScamGuard treats all user messages strictly as passive data.",
      disclaimer: "AI-assisted assessment. Always treat suspicious messages with caution.",
      extracted_urls: [],
      detected_language: detectedLang
    };
  }

  // Evidence accumulation
  const evidence: EvidenceItem[] = [];
  const manipulationTactics: ManipulationTacticItem[] = [];
  const possibleObjectives: string[] = [];
  const scamTypes: string[] = [];
  const doNotShare: string[] = [];
  const safeVerification: string[] = [];
  const immediateActions: string[] = [];
  let riskScore = 10; // baseline neutral

  // Check for routine telecom promotional loyalty rewards (e.g. UPTCL, Ufone, Jazz daily Spin the Wheel bonus MBs)
  const isTelecomLoyaltyReward =
    (lower.includes("mb data") || lower.includes("gb data") || lower.includes("spin the wheel") || lower.includes("spin & win") || lower.includes("recharge bonus") || lower.includes("daily reward")) &&
    !lower.includes("fee") && !lower.includes("processing") && !lower.includes("deposit") && !/\botp\b/i.test(lower) && !/\bpin\b/i.test(lower) && !lower.includes("password") && urlAnalyses.length === 0;

  // 1. Prize / Reward / Lottery (English, Roman Urdu, Urdu Script)
  const prizeKeywords = [
    "won", "prize", "lottery", "congratulations", "inaam", "jeeta", "mubarak", "claim your prize", 
    "bisp", "benazir", "jeeto pakistan", "cash reward", "cash prize",
    "جیت", "جیتیں", "مبارک", "انعام", "لاٹری", "بے نظیر", "بینظیر", "قرعہ اندازی", "روپے"
  ];
  const hasPrize = !isTelecomLoyaltyReward && prizeKeywords.some(k => lower.includes(k) || text.includes(k));
  if (hasPrize) {
    riskScore += 55; // Substantial weight for unsolicited cash/lottery/prize claims
    scamTypes.push("Prize / Lottery Scam");
    evidence.push({
      signal: "Unsolicited reward or prize claim",
      explanation: isUrdu
        ? "بغیر کسی مقابلے یا قرعہ اندازی کے انعام یا رقم جیتنے کا دعویٰ کیا گیا ہے۔"
        : isRomanUrdu
        ? "Baghair kisi entry ya lottery ke inaam ya paise milne ka dawa kiya gaya hai."
        : "Claims you have won an unearned prize, grant, or cash reward to elicit impulsive compliance."
    });
    manipulationTactics.push({
      tactic: "Reward Exploitation & Excitement",
      explanation: "Offers unexpected wealth to make the recipient drop their guard and act impulsively."
    });
    possibleObjectives.push("Advance fee fraud", "Personal identity details", "Bank access");
  } else if (isTelecomLoyaltyReward) {
    riskScore = 12;
    scamTypes.push("Legitimate Telecom Promotional Campaign");
    evidence.push({
      signal: "Recognized official telecom reward context (data bundle)",
      explanation: "Message refers to routine in-app gamification (bonus MBs). It does not demand money, card details, or passwords."
    });
    safeVerification.push(
      "Verify your data bonus by opening the official UPTCL / Ufone app or checking your standard data balance.",
      "Ensure you never pay money or share passwords to claim routine telecom rewards."
    );
  }

  // 2. Urgency & Account Suspension / Closure Threats
  const urgencyKeywords = [
    "urgent", "immediately", "within 24 hours", "account suspended", "blocked", "action required", 
    "jaldi", "fori", "khata band", "block kardiya", "deactivated", "last warning", "suspicious activity",
    "closed today", "account will be closed", "termination",
    "فوری", "بلاک", "بند", "معطل", "وارننگ", "خاتمہ"
  ];
  const hasUrgency = urgencyKeywords.some(k => lower.includes(k) || text.includes(k));
  if (hasUrgency) {
    riskScore += 35;
    scamTypes.push("Urgent Coercion / Threat Scam");
    evidence.push({
      signal: "Artificial urgency or penalty threat",
      explanation: isUrdu
        ? "اکاؤنٹ بند یا معطل ہونے کا فوری خوف پیدا کیا گیا ہے تاکہ آپ بغیر تصدیق کے قدم اٹھائیں۔"
        : isRomanUrdu
        ? "Khaata band hone ya jurmana hone ka fori darr dikhaya gaya hai taake aap baghair soche faisla lein."
        : "Creates severe urgency or threat of account suspension/closure to bypass rational verification."
    });
    manipulationTactics.push({
      tactic: "Fear & Urgency",
      explanation: "Pushes you to act immediately under fear of losing money, account access, or SIM service."
    });
  }

  // 3. Bank / Card / Financial Security Impersonation
  const bankCardKeywords = [
    "card", "bank", "debit", "credit", "account", "hbl", "meezan", "ubl", "alfalah", "mcb", "visa", "mastercard",
    "بینک", "اکاؤنٹ", "کارڈ"
  ];
  const hasBankCard = bankCardKeywords.some(k => lower.includes(k) || text.includes(k));
  if (hasBankCard && (hasUrgency || lower.includes("verify") || lower.includes("suspicious"))) {
    riskScore += 25;
    scamTypes.push("Banking / Card Impersonation");
    evidence.push({
      signal: "Financial institution or payment card reference under duress",
      explanation: "Appeals to banking or payment card security to demand identity verification."
    });
    doNotShare.push("Debit/Credit Card CVV", "Card Expiry Date", "Bank Account PIN");
  }

  // 4. OTP / PIN / Password Credential harvesting (using word boundary to avoid false positives like 'spin')
  const otpPatterns = [
    /\botp\b/i,
    /\bpin\b/i,
    /\bpasswords?\b/i,
    /\bone[- ]time password\b/i,
    /\bverification code\b/i,
    /\b\d[- ]digit (code|pin)\b/i,
    /\bcode bhejo\b/i,
    /\bshare code\b/i,
    /\bcvv\b/i,
    /او ٹی پی/,
    /پاس ورڈ/,
    /پن/
  ];
  const hasOtp = otpPatterns.some((pat) => pat.test(text));
  if (hasOtp) {
    riskScore += 40;
    scamTypes.push("OTP & Credential Phishing");
    evidence.push({
      signal: "Request for OTP, PIN, or Security Credentials",
      explanation: isRomanUrdu
        ? "Message mein OTP ya PIN share karne ka mutalba hai jo ke official banks kabhi nahi maangtay."
        : "Demands an OTP, PIN, or verification code. Official banks and platforms NEVER ask for your OTP."
    });
    manipulationTactics.push({
      tactic: "Trust Exploitation & Pretexting",
      explanation: "Pretends that giving the code is necessary to 'verify' or 'secure' your account."
    });
    possibleObjectives.push("Account Takeover", "Unauthorized Fund Transfer", "OTP Hijacking");
    doNotShare.push("OTP (One-Time Password)", "Account PIN", "Login Password", "CVV / Card Security Code");
  }

  // 5. Financial & Pakistan specific context
  if (pkContext.hasContext) {
    const isPkFinancialScam = lower.includes("account") || lower.includes("paisa") || lower.includes("cash") || lower.includes("block") || lower.includes("wazifa") || lower.includes("verify") || lower.includes("inaam") || text.includes("روپے") || text.includes("انعام");
    if (isPkFinancialScam) {
      riskScore += 25;
      scamTypes.push("Mobile Banking / Digital Wallet Impersonation");
      evidence.push({
        signal: `Reference to Pakistan financial / civic entities (${pkContext.keywords.slice(0, 3).join(", ")})`,
        explanation: isRomanUrdu
          ? `${pkContext.keywords.join(", ")} ke naam par suspicious transaction ya verification ka mutalba hai.`
          : `Uses names of well-known Pakistani services (${pkContext.keywords.join(", ")}) to build fake credibility.`
      });
      doNotShare.push("CNIC number & issue date", "Easypaisa / JazzCash PIN", "Mobile banking login details");
    }
  }

  // 6. Courier / Fake Delivery
  const courierKeywords = ["package", "delivery", "courier", "parcel", "tcs", "leopard", "pakistan post", "address incomplete", "reschedule delivery", "customs fee", "پارسل", "ڈلیوری"];
  const hasCourier = courierKeywords.some(k => lower.includes(k) || text.includes(k));
  if (hasCourier) {
    riskScore += 30;
    scamTypes.push("Fake Courier & Delivery Scam");
    evidence.push({
      signal: "Unsolicited parcel delivery update with action requirement",
      explanation: "Alleges an undelivered parcel or incomplete address requiring urgent payment or link click."
    });
    manipulationTactics.push({
      tactic: "Curiosity & Small Fee Hook",
      explanation: "Promises a valuable parcel for a small fake redelivery or customs fee."
    });
    possibleObjectives.push("Credit card details", "Payment phishing", "Personal identification");
  }

  // 7. Fake Job / High return Investment
  const jobOrInvestKeywords = ["work from home", "earn daily", "investment", "guaranteed profit", "part time job", "like youtube videos", "daily profit", "crypto investment", "doubling money"];
  const hasJobOrInvest = jobOrInvestKeywords.some(k => lower.includes(k));
  if (hasJobOrInvest) {
    riskScore += 35;
    scamTypes.push("Fake Job / Task / Investment Fraud");
    evidence.push({
      signal: "Unrealistic earnings or task-based investment scheme",
      explanation: "Promises high daily income with zero experience or guaranteed financial returns."
    });
    manipulationTactics.push({
      tactic: "Greed & Low-Effort High-Reward Trap",
      explanation: "Entices victims with easy money promises before asking for an advance deposit or task fee."
    });
    possibleObjectives.push("Advance deposit fraud", "Bank account money laundering", "Identity theft");
  }

  // 8. URL risks
  if (urlAnalyses.length > 0) {
    const suspiciousUrls = urlAnalyses.filter(u => u.flags.length > 0);
    if (suspiciousUrls.length > 0) {
      riskScore += 30;
      scamTypes.push("Malicious Link / Phishing Gateway");
      for (const sUrl of suspiciousUrls) {
        evidence.push({
          signal: `Suspicious URL detected: ${sUrl.domain}`,
          explanation: sUrl.flags.join(", ")
        });
      }
    } else {
      riskScore += 15;
      evidence.push({
        signal: `Contains external link: ${urlAnalyses[0].domain}`,
        explanation: "Message directs you to click an external link rather than opening official applications directly."
      });
    }
  }

  // 9. Normal / Harmless Message Detection
  const normalKeywords = ["meeting tomorrow", "dinner tonight", "happy birthday", "see you at", "how are you", "sounds good", "thanks for lunch", "call me when free"];
  const isClearlyNormal = normalKeywords.some(k => lower.includes(k)) && evidence.length === 0 && urlAnalyses.length === 0;
  if (isClearlyNormal) {
    riskScore = 5;
  }

  // Bound risk score between 0 and 100
  riskScore = Math.min(Math.max(riskScore, 5), 98);
  if (evidence.length === 0 && !hasUrgency && !hasPrize && !hasOtp) {
    riskScore = Math.min(riskScore, 20);
  }

  // Determine Risk Level
  let riskLevel: RiskLevel = "low";
  if (riskScore >= 75) riskLevel = "very_high";
  else if (riskScore >= 55) riskLevel = "high";
  else if (riskScore >= 30) riskLevel = "medium";
  else riskLevel = "low";

  // Confidence
  let confidence: ConfidenceLevel = "high";
  if (evidence.length === 1) confidence = "medium";
  if (evidence.length === 0) confidence = "low";

  // Default scam types if none flagged
  if (scamTypes.length === 0) {
    scamTypes.push(riskLevel === "low" ? "Legitimate / Low Risk Communication" : "Suspicious Communication");
  }

  // Attack Path generation
  const attackPath: AttackPathStep[] = [];
  if (hasPrize) {
    attackPath.push({ step: 1, title: "The Hook", description: "Bait victim with unearned prize, lottery win, or grant." });
    attackPath.push({ step: 2, title: "Urgency Pressure", description: "Claim the reward will expire if not claimed immediately." });
    if (urlAnalyses.length > 0) {
      attackPath.push({ step: 3, title: "Phishing Redirect", description: "Direct recipient to lookalike form or website." });
    }
    if (hasOtp) {
      attackPath.push({ step: attackPath.length + 1, title: "Credential / OTP Theft", description: "Victim is instructed to share verification OTP or pay advance fee." });
    }
    attackPath.push({ step: attackPath.length + 1, title: "Financial Loss / Takeover", description: "Attacker empties funds or hijacks victim's digital account." });
  } else if (hasUrgency || pkContext.hasContext || hasBankCard) {
    attackPath.push({ step: 1, title: "Impersonation Pretext", description: "Sender claims to be bank, courier, or security authority." });
    attackPath.push({ step: 2, title: "Panic / Suspension Threat", description: "Threatens that account or SIM card will be permanently blocked." });
    if (urlAnalyses.length > 0 || hasOtp) {
      attackPath.push({ step: 3, title: "Fake Verification Gateway", description: "Requests login credentials, PIN, or OTP under guise of biometric update." });
      attackPath.push({ step: 4, title: "Unauthorized Access", description: "Attacker uses intercepted details to initiate transfers." });
    }
  } else {
    attackPath.push({ step: 1, title: "Initial Contact", description: "Sender initiates contact via message or SMS." });
    attackPath.push({ step: 2, title: "Engagement Attempt", description: "Tests recipient responsiveness for further social engineering." });
  }

  // Standard safe verification & immediate actions
  safeVerification.push(
    "Never click links provided directly inside unsolicited SMS or chat messages.",
    "Open the official mobile banking or delivery app directly from your phone's home screen.",
    "Independently look up the official customer helpline number on the back of your debit card or verified website.",
    "Do not call back phone numbers sent within the suspicious text itself."
  );

  immediateActions.push(
    "Do not reply to or forward this message.",
    "Do not share any OTP, PIN, CNIC, or password under any circumstances.",
    "Block the sender's phone number or social profile."
  );

  if (doNotShare.length === 0) {
    doNotShare.push("Passwords & PINs", "One-Time Passwords (OTPs)", "CNIC details", "Credit/Debit Card CVV");
  }

  // Damage control recommendations
  const damageControl = {
    clicked_link: [
      "Do not enter any passwords or personal details into the opened webpage.",
      "Close the browser tab immediately and clear recent browser cache.",
      "Check your device for any unauthorized background downloads."
    ],
    shared_credentials: [
      "Immediately open the official website/app from a secure device and change your password.",
      "Enable Multi-Factor Authentication (MFA / 2FA) where available.",
      "Check security settings and revoke any unfamiliar active sessions or authorized devices."
    ],
    shared_otp: [
      "Call your bank or mobile wallet helpline immediately to temporarily freeze your account.",
      "Inform the fraud support team that an unauthorized party received an OTP.",
      "Review your transaction history for unauthorized transfers."
    ],
    shared_bank_card: [
      "Instantly block your debit/credit card via your official mobile banking app.",
      "Contact your card issuer's emergency fraud line to report compromised CVV or card number.",
      "Request a replacement card with a new card number."
    ],
    sent_money: [
      "Contact your bank or mobile wallet service (Easypaisa/JazzCash/Bank) immediately with the transaction reference ID.",
      "File a formal dispute and fraud complaint with local cybercrime authorities (e.g. FIA Cyber Crime in Pakistan).",
      "Retain all screenshots, transaction receipts, and chat logs for evidence."
    ],
    downloaded_file: [
      "Do not open or run the downloaded file or APK installer.",
      "Immediately delete the file from your downloads folder and empty trash.",
      "Run a reputable antivirus/antimalware scan across your device.",
      "If you granted accessibility permissions to an APK, revoke them in device settings."
    ]
  };

  // Summary and Educational Explanation
  let summary = "";
  let educational = "";

  if (riskLevel === "very_high") {
    summary = isUrdu
      ? "اس پیغام میں دھوکہ دہی اور فراڈ کے انتہائی سنگین اشارے ملے ہیں۔ یہ آپ کی رقوم یا حساس ڈیٹا حاصل کرنے کی کوشش دکھائی دیتی ہے۔"
      : isRomanUrdu
      ? "Is message mein fraud aur scam ke bohat wazeh warning signs hain. Yeh aapke account ya OTP hasil karne ki koshish lagti hai."
      : "This message exhibits multiple high-severity warning signs characteristic of an active fraud or phishing attempt.";
    educational = "Legitimate institutions and banks will never threaten sudden suspension via casual SMS, nor will they ask you to provide an OTP or click arbitrary third-party links to verify your account.";
  } else if (riskLevel === "high") {
    summary = isUrdu
      ? "اس پیغام میں کئی مشکوک عناصر پائے گئے ہیں۔ احتیاط برتیں اور بغیر تصدیق کے کوئی قدم نہ اٹھائیں۔"
      : isRomanUrdu
      ? "Is message mein ahem warning signs hain. Kisi bhi link par click na karein aur helpline se verify karein."
      : "This message shows several warning signs. Caution is strongly advised before taking any action or replying.";
    educational = "Scammers frequently use urgent pretexts such as parcel delivery issues or prize claims to create fear or excitement, causing victims to bypass standard verification.";
  } else if (riskLevel === "medium") {
    summary = "This message contains ambiguous or mildly suspicious elements that warrant verification through independent channels.";
    educational = "Even when a message appears somewhat plausible, always verify unexpected requests through known official contact channels.";
  } else {
    summary = "No major warning signs were detected in this message based on available evidence.";
    educational = "While no overt scam indicators were flagged, always practice general security awareness when interacting with unexpected digital messages.";
  }

  return {
    risk_score: riskScore,
    risk_level: riskLevel,
    confidence,
    summary,
    scam_types: scamTypes,
    evidence,
    manipulation_tactics: manipulationTactics,
    possible_objectives: possibleObjectives.length > 0 ? possibleObjectives : ["Unspecified / Information Gathering"],
    attack_path: attackPath,
    do_not_share: Array.from(new Set(doNotShare)),
    safe_verification: safeVerification,
    immediate_actions: immediateActions,
    damage_control: damageControl,
    educational_explanation: educational,
    disclaimer: "ScamGuard AI provides an AI-assisted security assessment based on pattern detection. It does not constitute formal legal or financial advice. Always verify critical matters independently.",
    extracted_urls: urlAnalyses.map(u => u.url),
    detected_language: detectedLang
  };
}
