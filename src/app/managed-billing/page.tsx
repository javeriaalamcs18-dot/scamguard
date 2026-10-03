"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, ShieldCheck, Sparkles, ExternalLink, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

export default function ManagedBillingPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if redirected with checkout success
    const params = new URLSearchParams(window.location.search);
    if (params.get("session_id") || params.get("mock_checkout_success")) {
      setMessage("Subscription setup completed successfully! Your plan has been upgraded.");
    }

    async function loadData() {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load billing stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleOpenCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || "No active Stripe customer portal available for free tier.");
      }
    } catch {
      setMessage("Unable to open billing portal at this time.");
    } finally {
      setPortalLoading(false);
    }
  };

  const usage = stats?.usage || {
    plan: "free",
    wordsUsed: 0,
    wordLimit: 5000,
    wordsRemaining: 5000,
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          Subscription & Billing
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Managed Billing</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review your subscription tier, billing period, and invoice payment methods.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Billing Card */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Active Subscription</span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl font-extrabold text-white capitalize">{usage.plan} Tier</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Active
              </span>
            </div>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Change Plan / Upgrade
          </Link>
        </div>

        {/* Quota breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Monthly Allowance</span>
            <p className="text-lg font-bold text-white mt-1">
              {usage.wordLimit === -1 ? "Unlimited" : `${usage.wordLimit.toLocaleString()} words`}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Words Analyzed</span>
            <p className="text-lg font-bold text-cyan-400 mt-1">
              {usage.wordsUsed.toLocaleString()} words
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400">Remaining</span>
            <p className="text-lg font-bold text-emerald-400 mt-1">
              {usage.wordLimit === -1 ? "Unlimited" : `${usage.wordsRemaining.toLocaleString()} words`}
            </p>
          </div>
        </div>

        {/* Customer Portal Action */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Stripe Customer Portal</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Update credit card details, view past payment receipts, or manage renewal status.
            </p>
          </div>

          <button
            onClick={handleOpenCustomerPortal}
            disabled={portalLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            {portalLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            Open Stripe Portal
          </button>
        </div>
      </div>
    </div>
  );
}
