"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (riskFilter !== "all") params.set("risk", riskFilter);
      if (sourceFilter !== "all") params.set("source", sourceFilter);

      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      setAnalyses(data.analyses || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [riskFilter, sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadHistory();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this analysis from your history?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAnalyses(analyses.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getRiskBadge = (level: string, score: number) => {
    switch (level) {
      case "very_high":
        return {
          bg: "bg-red-500/20 text-red-400 border-red-500/30",
          label: `Very High (${score}/100)`,
        };
      case "high":
        return {
          bg: "bg-orange-500/20 text-orange-400 border-orange-500/30",
          label: `High (${score}/100)`,
        };
      case "medium":
        return {
          bg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
          label: `Medium (${score}/100)`,
        };
      case "low":
      default:
        return {
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
          label: `Low (${score}/100)`,
        };
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5" />
            Security Archive
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analysis History</h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, filter, review full attack paths, and delete past message evaluations.
          </p>
        </div>

        <Link
          href="/editor"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-sm shadow-md transition"
        >
          Analyze New Message
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, scam types, or message content..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 outline-none"
          />
        </form>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-cyan-500 outline-none"
        >
          <option value="all">All Risk Levels</option>
          <option value="very_high">Very High Risk</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>

        {/* Source Filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-cyan-500 outline-none"
        >
          <option value="all">All Sources</option>
          <option value="SMS">SMS</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
          <option value="Telegram">Telegram</option>
          <option value="Facebook">Facebook</option>
          <option value="Website">Website</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="button"
          onClick={loadHistory}
          className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* List of Analyses */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Loading analysis history...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No matching analyses found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filters, or analyze a new message to start building your record.
          </p>
          <Link
            href="/editor"
            className="mt-4 inline-block text-xs font-semibold px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            Go to Analyzer
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {analyses.map((item) => {
            const badge = getRiskBadge(item.risk_level, item.risk_score);
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-blue-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                      {item.source}
                    </span>
                    {Array.isArray(item.scam_types) && item.scam_types.length > 0 && (
                      <span className="text-xs text-cyan-400 font-medium">
                        {item.scam_types.slice(0, 2).join(", ")}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 ml-auto md:ml-0">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono truncate mb-1">
                    "{item.message}"
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/history/${item.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
