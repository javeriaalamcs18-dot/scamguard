"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, AlertTriangle, Printer, Share2 } from "lucide-react";
import AnalysisResultView from "@/components/analysis/AnalysisResultView";

export default function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`/api/history/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Analysis not found");
        }
        setAnalysis(data.analysis);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Loading analysis record #{id}...</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-xl mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Record Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || "Unable to locate this analysis report."}</p>
        <Link
          href="/history"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis History
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Original Message Box */}
      <div className="mb-6 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Original Analyzed Message (Source: {analysis.source})
        </span>
        <p className="text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          {analysis.message}
        </p>
      </div>

      {/* Render full analysis breakdown */}
      <AnalysisResultView
        result={analysis}
        analysisId={id}
      />
    </div>
  );
}
