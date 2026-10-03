"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, Sparkles, Zap, Building2, AlertCircle } from "lucide-react";

export default function PricingPage() {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (tier: "pro" | "business") => {
    setLoadingTier(tier);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = `/login?redirect=/pricing`;
          return;
        }
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Transparent Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Choose Your Safety Plan
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Start protecting yourself with our free tier, or upgrade for higher volume and advanced enterprise features.
        </p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* FREE */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Free Plan</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Ideal for personal protection against suspicious messages.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
              <li className="flex items-center gap-2.5 font-semibold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                5,000 words per month
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Full Scam Attack Path breakdown
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Contextual Do-Not-Share warnings
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Interactive Damage Control guide
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                English & Roman Urdu analysis
              </li>
            </ul>
          </div>

          <Link
            href="/editor"
            className="mt-8 w-full py-3 rounded-xl text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
          >
            Current Default Plan
          </Link>
        </div>

        {/* PRO */}
        <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900 border border-cyan-500/50 shadow-2xl shadow-blue-500/20 flex flex-col justify-between relative">
          <span className="absolute -top-3.5 right-8 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-cyan-400 text-slate-950 shadow-md">
            Most Popular
          </span>

          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Pro Plan</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              For active freelancers, small teams, and power users.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$12</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
              <li className="flex items-center gap-2.5 font-bold text-cyan-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                20,000 words per month
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Deep heuristic URL & lookalike domain inspection
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Priority threat analysis queue
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Full historical archive & report exports
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Urdu, Roman Urdu & English support
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("pro")}
            disabled={loadingTier === "pro"}
            className="mt-8 w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 text-xs transition duration-200"
          >
            {loadingTier === "pro" ? "Redirecting to Stripe..." : "Upgrade to Pro"}
          </button>
        </div>

        {/* BUSINESS */}
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Business Plan</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              For security operations, enterprises, and organizational teams.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$49</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-6">
              <li className="flex items-center gap-2.5 font-bold text-white">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Unlimited monthly words (fair-use)
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Dedicated threat intelligence hooks
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Multi-seat team dashboard
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Custom webhook alert triggers
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Priority 24/7 dedicated support
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleSubscribe("business")}
            disabled={loadingTier === "business"}
            className="mt-8 w-full py-3 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
          >
            {loadingTier === "business" ? "Redirecting to Stripe..." : "Subscribe to Business"}
          </button>
        </div>
      </div>
    </div>
  );
}
