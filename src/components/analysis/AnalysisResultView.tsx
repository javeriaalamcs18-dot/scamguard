"use client";

import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  ExternalLink,
  ChevronRight,
  LifeBuoy,
  PhoneCall,
  Lock,
} from "lucide-react";
import { ScamAnalysisResult, RiskLevel } from "@/lib/ai/types";

interface Props {
  result: ScamAnalysisResult;
  analysisId?: string;
  onReset?: () => void;
}

export default function AnalysisResultView({ result, analysisId, onReset }: Props) {
  const [selectedInteraction, setSelectedInteraction] = useState<string>("viewed_only");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackRating, setFeedbackRating] = useState<"helpful" | "unhelpful" | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "very_high":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          badge: "bg-red-500 text-white",
          glow: "cyber-glow-red",
          title: "VERY HIGH RISK",
          icon: AlertOctagon,
        };
      case "high":
        return {
          bg: "bg-orange-500/10",
          border: "border-orange-500/30",
          text: "text-orange-400",
          badge: "bg-orange-500 text-white",
          glow: "",
          title: "HIGH RISK",
          icon: AlertTriangle,
        };
      case "medium":
        return {
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          text: "text-amber-400",
          badge: "bg-amber-500 text-slate-900 font-bold",
          glow: "",
          title: "MEDIUM RISK",
          icon: AlertTriangle,
        };
      case "low":
      default:
        return {
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          text: "text-emerald-400",
          badge: "bg-emerald-500 text-white",
          glow: "cyber-glow-green",
          title: "LOW RISK / NO OVERT SIGNS",
          icon: ShieldCheck,
        };
    }
  };

  const riskStyle = getRiskColor(result.risk_level);
  const RiskIcon = riskStyle.icon;

  const handleFeedback = async (rating: "helpful" | "unhelpful") => {
    setFeedbackRating(rating);
    setSubmittingFeedback(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis_id: analysisId || "adhoc-analysis",
          rating,
          comment: feedbackComment || undefined,
        }),
      });
      setFeedbackSubmitted(true);
    } catch {
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const interactionOptions = [
    { id: "viewed_only", label: "I only viewed it", key: null },
    { id: "clicked_link", label: "I clicked the link", key: "clicked_link" },
    { id: "replied", label: "I replied to the sender", key: "shared_credentials" },
    { id: "entered_password", label: "I entered a password", key: "shared_credentials" },
    { id: "shared_otp", label: "I shared an OTP / Code", key: "shared_otp" },
    { id: "shared_bank", label: "I shared bank / card info", key: "shared_bank_card" },
    { id: "sent_money", label: "I sent money", key: "sent_money" },
    { id: "downloaded_file", label: "I downloaded a file / APK", key: "downloaded_file" },
  ];

  const getDamageControlAdvice = () => {
    const selected = interactionOptions.find((o) => o.id === selectedInteraction);
    if (!selected || !selected.key) {
      return [
        "You are in a safe position! Do not click any links or reply to the sender.",
        "Delete the message and block the sender's phone number or account.",
        "Warn friends and family if this looks like a widespread campaign.",
      ];
    }
    const adviceList = (result.damage_control as any)?.[selected.key];
    if (adviceList && adviceList.length > 0) {
      return adviceList;
    }
    return [
      "Contact your service provider or bank immediately via their verified official helpline.",
      "Review your accounts for any unauthorized activity and change credentials immediately.",
    ];
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Risk Banner Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border ${riskStyle.border} ${riskStyle.bg} ${riskStyle.glow} transition-all`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 ${riskStyle.text}`}>
              <RiskIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${riskStyle.badge}`}>
                  {riskStyle.title}
                </span>
                <span className="text-xs text-slate-400 capitalize">
                  Confidence: <span className="text-slate-200 font-semibold">{result.confidence}</span>
                </span>
                {result.detected_language && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {result.detected_language}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Risk Score: <span className={riskStyle.text}>{result.risk_score}</span>
                <span className="text-base text-slate-400 font-normal"> / 100</span>
              </h2>
            </div>
          </div>

          {onReset && (
            <button
              onClick={onReset}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition"
            >
              Analyze Another Message
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
            Analysis Summary
          </h3>
          <p className="text-base text-slate-100 font-medium leading-relaxed">{result.summary}</p>
        </div>
      </div>

      {/* 2. Grid: Scam Types & Possible Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scam Types */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Identified Scam Classification
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.scam_types.map((type, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-cyan-300 text-sm font-semibold"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Possible Objectives */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            Possible Attacker Objectives
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.possible_objectives.map((obj, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-300 text-sm font-medium"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Evidence Engine & Manipulation Tactics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Concrete Evidence */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Why Is It Suspicious? (Concrete Evidence)
          </h3>
          {result.evidence.length === 0 ? (
            <p className="text-sm text-slate-400">No explicit threat signals were observed in this text.</p>
          ) : (
            <div className="space-y-3">
              {result.evidence.map((ev, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{ev.signal}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ev.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manipulation Tactics */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            Psychological Manipulation Tactics
          </h3>
          {result.manipulation_tactics.length === 0 ? (
            <p className="text-sm text-slate-400">No overt social engineering tactics detected.</p>
          ) : (
            <div className="space-y-3">
              {result.manipulation_tactics.map((tac, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <div className="flex items-start gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-purple-300">{tac.tactic}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tac.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Scam Attack Path (Key Differentiating Feature) */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Potential Scam Attack Progression Path
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Understanding the progression helps you anticipate what the attacker wants next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {result.attack_path.map((step, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl bg-slate-950 border border-blue-900/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-400 border border-blue-500/30">
                    Step {step.step || idx + 1}
                  </span>
                  {idx < result.attack_path.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-600 hidden lg:block" />
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Contextual "DO NOT SHARE" & Safe Verification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DO NOT SHARE */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2 mb-3">
            <XCircle className="w-4 h-4" />
            Contextual: DO NOT SHARE Under Any Circumstances
          </h3>
          <div className="space-y-2">
            {result.do_not_share.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm font-semibold text-red-200 bg-red-950/40 border border-red-900/50 px-3 py-2 rounded-lg"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Safe Verification */}
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4" />
            How To Safely Verify
          </h3>
          <div className="space-y-2">
            {result.safe_verification.map((item, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 border border-slate-800 px-3 py-2.5 rounded-lg flex items-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Interactive Damage Control Questionnaire */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/80 border border-blue-500/30">
        <div className="flex items-center gap-2.5 mb-2">
          <LifeBuoy className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Have you already interacted with this message?</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Select what happened so ScamGuard can provide tailored damage-control actions immediately.
        </p>

        {/* Options */}
        <div className="flex flex-wrap gap-2 mb-6">
          {interactionOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedInteraction(opt.id)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl transition ${
                selectedInteraction === opt.id
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Dynamic Advice */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Recommended Immediate Actions:
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {getDamageControlAdvice().map((advice: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 7. Educational Explanation */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
        <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          Educational Security Insight
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">{result.educational_explanation}</p>
        <p className="text-[11px] text-slate-400 mt-3 italic">{result.disclaimer}</p>
      </div>

      {/* 8. User Feedback Widget */}
      <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-center">
        {!feedbackSubmitted ? (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Was this analysis helpful?</h4>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleFeedback("helpful")}
                disabled={submittingFeedback}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Helpful
              </button>
              <button
                onClick={() => handleFeedback("unhelpful")}
                disabled={submittingFeedback}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                Not Helpful
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Thank you for helping keep the community safe!
          </p>
        )}
      </div>
    </div>
  );
}
