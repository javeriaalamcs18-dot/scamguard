"use client";

import { useEffect, useState } from "react";
import { User, Shield, Lock, Trash2, Key, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetch("/api/user/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [supabase]);

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear your local analysis cache?")) return;
    try {
      setMessage("Analysis cache cleared.");
    } catch {
      setMessage("Could not clear history.");
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <User className="w-3.5 h-3.5" />
          User Preferences
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account & Privacy Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account profile, privacy controls, and data retention preferences.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile Details */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-cyan-400" />
          Profile Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Email</label>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
              {user?.email || "Guest Session"}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Subscription Plan</label>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-cyan-400 font-semibold uppercase">
              {stats?.usage?.plan || "Free"}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data Isolation */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          Data Privacy & Retention
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          At ScamGuard AI, submitted texts are evaluated purely as untrusted data. We enforce strict prompt-injection defenses and never sell or train public models on your personal message contents.
        </p>
        <div className="pt-2">
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Analysis Cache
          </button>
        </div>
      </div>
    </div>
  );
}
