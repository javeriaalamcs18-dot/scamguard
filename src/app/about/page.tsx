import Link from "next/link";
import { Shield, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Shield className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">About ScamGuard AI</h1>
        <p className="text-slate-400 text-base mt-3 max-w-2xl mx-auto leading-relaxed">
          Empowering internet users to decode social engineering, protect sensitive credentials, and navigate the digital world safely.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
        <h2 className="text-xl font-bold text-white">Why ScamGuard Was Built</h2>
        <p>
          Every day, millions of people receive deceptive SMS alerts, WhatsApp lottery claims, urgent bank threats, and fake delivery notifications. Most victims fall prey not because they lack intelligence, but because modern scammers exploit cognitive biases like artificial urgency, excitement, and fear.
        </p>
        <p>
          Existing spam filters simply tag messages as spam without explaining <em>why</em>. ScamGuard AI was created with a fundamental guiding philosophy:
        </p>
        <blockquote className="p-4 rounded-xl bg-blue-950/40 border-l-4 border-cyan-500 text-white font-semibold italic text-base">
          "Understand the scam before you act."
        </blockquote>
        <p>
          We provide transparent evidence, map the exact social engineering attack path, provide contextual warnings on what never to share, and give concrete damage-control steps if you already interacted with the threat.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg text-sm transition"
        >
          <span>Try ScamGuard Analyzer</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
