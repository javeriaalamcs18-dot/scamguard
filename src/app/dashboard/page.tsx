"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  History,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/history"),
        ]);

        const statsData = await statsRes.json();
        const historyData = await historyRes.json();

        setStats(statsData);
        setRecentAnalyses(historyData.analyses || []);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const usage = stats?.usage || {
    plan: "free",
    wordsUsed: 0,
    wordLimit: 5000,
    wordsRemaining: 5000,
    usagePercentage: 0,
  };

  const highRiskCount = recentAnalyses.filter(
    (a) => a.risk_level === "very_high" || a.risk_level === "high"
  ).length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Security Overview
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your security usage limits, monitor identified risks, and manage your subscription.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-500/20 text-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Message
          </Link>
          <Link
            href="/managed-billing"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm transition"
          >
            <CreditCard className="w-4 h-4" />
            Billing
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Plan card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Current Plan</span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-extrabold text-white capitalize">{usage.plan}</h3>
            {usage.plan === "free" && (
              <Link href="/pricing" className="text-xs text-cyan-400 hover:underline font-semibold">
                Upgrade &rarr;
              </Link>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {usage.plan === "business" ? "Unlimited fair-use quota" : `${usage.wordLimit.toLocaleString()} monthly words`}
          </p>
        </div>

        {/* Monthly usage */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Monthly Usage</span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-extrabold text-white">
              {usage.wordsUsed.toLocaleString()}
            </h3>
            <span className="text-xs text-slate-400">
              / {usage.wordLimit === -1 ? "∞" : usage.wordLimit.toLocaleString()} words
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usage.usagePercentage > 85 ? "bg-red-500" : "bg-cyan-500"
              }`}
              style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Words Remaining */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Remaining Words</span>
          <h3 className="text-2xl font-extrabold text-white mt-2">
            {usage.wordLimit === -1 ? "Unlimited" : usage.wordsRemaining.toLocaleString()}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            {usage.usagePercentage}% consumed this cycle
          </p>
        </div>

        {/* High Risk Intercepted */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">High Risk Alerts</span>
          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-extrabold text-red-400">{highRiskCount}</h3>
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Critical threats flagged in your history
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Analyses & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analyses list (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Recent Scam Analyses
            </h3>
            <Link href="/history" className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1">
              View All History <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No messages analyzed yet.</p>
              <Link
                href="/editor"
                className="mt-3 inline-block text-xs font-semibold text-cyan-400 hover:underline"
              >
                Analyze your first suspicious text &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.slice(0, 5).map((item) => {
                const isHigh = item.risk_level === "very_high" || item.risk_level === "high";
                return (
                  <Link
                    key={item.id}
                    href={`/history/${item.id}`}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-blue-500/40 block transition group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isHigh ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {item.risk_level?.replace("_", " ")} ({item.risk_score}/100)
                        </span>
                        <span className="text-xs text-slate-400">{item.source}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-mono truncate mb-1">
                      "{item.message}"
                    </p>

                    <p className="text-xs text-slate-400 group-hover:text-slate-200 line-clamp-1 transition">
                      {item.summary}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions & Security Tips Sidebar (1 col) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/editor"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Analyze Suspicious Text
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                href="/pricing"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <span className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Upgrade Subscription Tier
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </Link>

              <Link
                href="/managed-billing"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition"
              >
                <span className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  Manage Stripe Billing & Invoices
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </Link>
            </div>
          </div>

          {/* Quick Security Tips */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Security Golden Rules
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Never give out an OTP, even if the caller claims to be your bank manager.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                Always open banking apps directly; never click link buttons inside SMS.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                If someone asks for advance money to release a prize or job, it is a scam.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
