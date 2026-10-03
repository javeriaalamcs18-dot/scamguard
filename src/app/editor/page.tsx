"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Sparkles,
  AlertTriangle,
  Lock,
  ArrowRight,
  RefreshCw,
  Copy,
  Info,
  CheckCircle,
  MessageSquare,
  Link2,
  Mail,
  Send,
  ExternalLink,
  Code2,
} from "lucide-react";
import AnalysisResultView from "@/components/analysis/AnalysisResultView";
import { ScamAnalysisResult } from "@/lib/ai/types";

type InputTab = "message" | "url" | "email" | "forwarding";

const SAMPLE_MESSAGES = [
  {
    name: "Easypaisa Fake Prize",
    source: "SMS",
    lang: "Roman Urdu",
    text: "Muazziz Saarif! Mubarak ho! Aap ne Jeeto Pakistan 100,000 Cash Prize jeeta hai. Apna inaam claim karne ke liye fori 0312-9876543 par call karein aur Easypaisa par 2,000 processing fee bhejein!",
  },
  {
    name: "Urgent Bank OTP Phishing",
    source: "SMS",
    lang: "English",
    text: "URGENT BANK ALERT: Your debit card ending in 4102 has been temporarily suspended due to suspicious activity. To verify identity and unlock your account immediately, reply with your 6-digit OTP code or visit http://meezan-bank-secure.top/verify.",
  },
  {
    name: "Telecom Data Reward (Safe)",
    source: "SMS",
    lang: "English",
    text: "Congratulations! You've won 50 MB data with SPIN the Wheel, valid until 11:59 pm. App up your life with UPTCL.",
  },
  {
    name: "Fake Courier Delivery Link",
    source: "WhatsApp",
    lang: "English",
    text: "Your shipment #PK-98214 cannot be delivered due to missing house number and unpaid customs duty of Rs. 350. Please update your delivery details within 12 hours at: http://bit.ly/tcs-redelivery-express",
  },
  {
    name: "Telegram / Part-time Job",
    source: "Telegram",
    lang: "English",
    text: "Hello! We offer flexible work from home. Earn Rs. 5,000 to Rs. 15,000 daily just by liking YouTube videos and rating hotels on Google Maps. No experience needed! Contact Telegram @HR_Recruiter_Official to start now.",
  },
];

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState<InputTab>("message");

  // Standard message state
  const [message, setMessage] = useState("");
  const [source, setSource] = useState("SMS");
  const [language, setLanguage] = useState("auto");

  // URL state
  const [urlInput, setUrlInput] = useState("");

  // Email state
  const [emailSender, setEmailSender] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScamAnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const [usageStats, setUsageStats] = useState<any>(null);

  // Character and word counters
  const currentTextToCount =
    activeTab === "url"
      ? urlInput
      : activeTab === "email"
      ? `${emailSender} ${emailSubject} ${emailBody}`
      : message;

  const charCount = currentTextToCount.length;
  const wordCount = currentTextToCount.trim() ? currentTextToCount.trim().split(/\s+/).length : 0;

  useEffect(() => {
    fetch("/api/user/stats")
      .then((res) => res.json())
      .then((data) => setUsageStats(data.usage))
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    setError(null);
    let payloadMessage = "";
    let payloadSource = source;

    if (activeTab === "message") {
      if (!message.trim()) {
        setError("Please enter or paste a message to analyze.");
        return;
      }
      payloadMessage = message;
    } else if (activeTab === "url") {
      if (!urlInput.trim()) {
        setError("Please enter a website address or link to analyze.");
        return;
      }
      payloadMessage = `Suspicious URL: ${urlInput.trim()}`;
      payloadSource = "Website";
    } else if (activeTab === "email") {
      if (!emailBody.trim() && !emailSubject.trim()) {
        setError("Please provide the email subject or body to analyze.");
        return;
      }
      payloadMessage = `From: ${emailSender || "Unknown Sender"}\nSubject: ${emailSubject}\n\n${emailBody}`;
      payloadSource = "Email";
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: payloadMessage,
          source: payloadSource,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setResult(data.data);
      setAnalysisId(data.id);

      // Refresh usage stats
      fetch("/api/user/stats")
        .then((res) => res.json())
        .then((s) => setUsageStats(s.usage))
        .catch(() => {});
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample: (typeof SAMPLE_MESSAGES)[0]) => {
    setActiveTab("message");
    setMessage(sample.text);
    setSource(sample.source);
    setLanguage(sample.lang === "Roman Urdu" ? "Roman Urdu" : "auto");
    setError(null);
  };

  const handleReset = () => {
    setResult(null);
    setMessage("");
    setUrlInput("");
    setEmailSender("");
    setEmailSubject("");
    setEmailBody("");
    setError(null);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5" />
          AI Fraud & Phishing Assistant
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Analyze Suspicious Content
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Understand the scam before you act. Enter an SMS, suspicious link, email, or explore automated forwarding.
        </p>
      </div>

      {/* Privacy Warning Banner */}
      <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
        <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="font-semibold text-amber-300">Privacy Safeguard:</strong> Do not paste passwords, OTPs, full credit/debit card numbers, PINs, or confidential credentials. Treat all message texts as untrusted data.
        </div>
      </div>

      {result ? (
        /* Results View */
        <AnalysisResultView result={result} analysisId={analysisId} onReset={handleReset} />
      ) : (
        /* Editor Input Form */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl relative">
          {/* Navigation Tabs for Modes */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("message")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "message"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              SMS & Chat Text
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("url")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "url"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              URL & Website Scanner
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("email")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "email"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Phishing Analyzer
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("forwarding")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === "forwarding"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "bg-slate-950 text-cyan-400 hover:text-cyan-300 border border-slate-800"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              SMS & Email Ingest API
            </button>
          </div>

          {/* TAB 1: MESSAGE TEXT */}
          {activeTab === "message" && (
            <div>
              {/* Quick Sample Selector */}
              <div className="mb-5">
                <span className="text-xs text-slate-400 font-medium block mb-2">
                  Or test with realistic message examples:
                </span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_MESSAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Area */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="message-box" className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Suspicious Message Content
                  </label>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>{charCount} chars</span>
                    <span>•</span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
                <textarea
                  id="message-box"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste the suspicious SMS, WhatsApp message, bank alert, job offer, or payment request here..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-slate-100 placeholder-slate-600 text-sm leading-relaxed resize-y outline-none transition"
                />
              </div>

              {/* Metadata Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="source-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Message Source
                  </label>
                  <select
                    id="source-select"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 outline-none"
                  >
                    <option value="SMS">SMS / Text Message</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Facebook">Facebook / Messenger</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Website">Website / Online Ad</option>
                    <option value="Other">Other / Unknown</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lang-select" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Explanation Language
                  </label>
                  <select
                    id="lang-select"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:border-cyan-500 outline-none"
                  >
                    <option value="auto">Auto Detect</option>
                    <option value="English">English</option>
                    <option value="Roman Urdu">Roman Urdu (Urdu in English alphabet)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUSPICIOUS URL SCANNER */}
          {activeTab === "url" && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                  Suspicious Website Link / URL
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://meezan-bank-secure.top/login or bit.ly/prize-verify"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  ScamGuard will inspect lookalike typosquatting domains, shortened redirect links, IP-address hosts, and high-risk top-level domains without visiting malicious code.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs text-slate-400">Try quick link samples:</span>
                <button
                  type="button"
                  onClick={() => setUrlInput("http://easypa1sa-secure.xyz/verify")}
                  className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Typosquatting Lookalike
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput("http://192.168.1.100/login/update")}
                  className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Raw IP Link
                </button>
                <button
                  type="button"
                  onClick={() => setUrlInput("http://bit.ly/tcs-redelivery-express")}
                  className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
                >
                  Shortened Link
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EMAIL PHISHING ANALYZER */}
          {activeTab === "email" && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Sender Email Address (From Header)
                </label>
                <input
                  type="text"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  placeholder="e.g. HBL Customer Support <hbl-support@gmail.com>"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Checks for display name spoofing (e.g. claiming to be a bank while sending from free webmail).
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Urgent Action Required: Account Access Suspended"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-600 text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                  Email Body Content
                </label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Paste the email message body here..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 placeholder-slate-600 text-sm outline-none resize-y transition"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AUTOMATED FORWARDING & INGESTION GUIDE */}
          {activeTab === "forwarding" && (
            <div className="space-y-6 mb-6">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200">
                <strong className="text-cyan-300 font-bold block mb-1">
                  Automated SMS & Email Forwarding Gateway
                </strong>
                You can forward incoming SMS or suspicious emails directly into ScamGuard AI programmatically using our live webhook endpoints.
              </div>

              {/* Inbound Email Endpoint */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Inbound Email Webhook
                </span>
                <code className="text-xs font-mono text-cyan-300 block bg-slate-900 p-2.5 rounded-lg border border-slate-800 break-all">
                  POST http://localhost:3000/api/ingest/email
                </code>
                <p className="text-[11px] text-slate-400">
                  Accepts JSON: <code>{`{ "from": "...", "subject": "...", "body": "..." }`}</code>. Useful for Mailgun, SendGrid inbound parse, or email client rules.
                </p>
              </div>

              {/* Inbound SMS Endpoint */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Inbound SMS Webhook
                </span>
                <code className="text-xs font-mono text-cyan-300 block bg-slate-900 p-2.5 rounded-lg border border-slate-800 break-all">
                  POST http://localhost:3000/api/ingest/sms
                </code>
                <p className="text-[11px] text-slate-400">
                  Compatible with Twilio SMS webhooks, Android SMS Forwarder apps, or custom SMS gateways.
                </p>
              </div>
            </div>
          )}

          {/* Usage Limit indicator if available */}
          {usageStats && activeTab !== "forwarding" && (
            <div className="mb-6 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span>
                Plan: <strong className="text-white capitalize">{usageStats.plan}</strong>
              </span>
              <span>
                Words Used This Month:{" "}
                <strong className="text-cyan-400">
                  {usageStats.wordsUsed.toLocaleString()} /{" "}
                  {usageStats.wordLimit === -1 ? "Unlimited" : usageStats.wordLimit.toLocaleString()}
                </strong>
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button (for tabs 1, 2, 3) */}
          {activeTab !== "forwarding" && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition duration-200"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Scanning Threat Signals & Evaluating Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {activeTab === "url"
                      ? "Scan URL & Domain"
                      : activeTab === "email"
                      ? "Analyze Phishing Email"
                      : "Analyze Message"}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
