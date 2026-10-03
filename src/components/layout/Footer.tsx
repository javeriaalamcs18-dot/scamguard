import Link from "next/link";
import { Shield, Lock, AlertTriangle, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4 stroke-[2.4]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SCAMGUARD AI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Understand the scam before you act. AI-powered scam detection, risk assessment, attack path visualization, and immediate damage-control assistance.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg max-w-md">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Do not paste OTPs, banking PINs, or full payment card numbers.</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/editor" className="hover:text-cyan-400 transition">
                  Analyze Message
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyan-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-cyan-400 transition">
                  Analysis History
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-cyan-400 transition">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/managed-billing" className="hover:text-cyan-400 transition">
                  Billing & Subscriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Resources */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Legal & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-cyan-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition">
                  About ScamGuard
                </Link>
              </li>
              <li>
                <a
                  href="https://www.fia.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition inline-flex items-center gap-1"
                >
                  FIA Cyber Crime Wing <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer box */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <p>
            <strong className="text-slate-300">Safety Notice & Disclaimer:</strong> ScamGuard AI provides an AI-assisted heuristic assessment based on pattern recognition and social engineering indicators. ScamGuard does not guarantee 100% accuracy and does not constitute formal legal or financial advice. When in doubt, always independently verify unexpected communications with the official institution using contact details from their official website or the back of your bank card.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-400 gap-2">
            <span>&copy; {new Date().getFullYear()} ScamGuard AI. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
