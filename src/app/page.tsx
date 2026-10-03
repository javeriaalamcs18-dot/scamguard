import Link from "next/link";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  ExternalLink,
  HelpCircle,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const scamTypes = [
    { title: "Bank & Digital Wallet Impersonation", desc: "Fake Easypaisa, JazzCash, HBL, Meezan alerts demanding immediate phone calls or verification." },
    { title: "OTP & Credential Harvesting", desc: "Coercive SMS asking for one-time passwords, login pins, or biometric re-registration." },
    { title: "Prize & Lottery Grants", desc: "Unsolicited Jeeto Pakistan, BISP/8171, or car prize notifications requiring upfront 'processing fees'." },
    { title: "Fake Delivery & Courier Links", desc: "Phishing links alleging an incomplete parcel address or unpaid customs tax." },
    { title: "Work From Home & Task Scams", desc: "Fake Telegram job recruiters promising high daily pay for liking videos or rating maps." },
    { title: "Malicious Lookalike Domains", desc: "Typosquatting websites mimicking legitimate banking gateways to harvest payment cards." },
  ];

  const faqs = [
    {
      q: "How is ScamGuard AI different from standard antivirus or spam filters?",
      a: "Antivirus looks for known malicious software files. ScamGuard analyzes social engineering psychology, urgency tricks, lookalike domains, and reveals the attacker's progression path so you understand why it's dangerous before you act.",
    },
    {
      q: "Does ScamGuard support Pakistani financial services like Easypaisa & JazzCash?",
      a: "Yes! ScamGuard is specifically tuned to recognize Pakistani financial pretexts, Roman Urdu phrasing, CNIC scams, BISP grants, and mobile wallet verification tricks without making false assumptions.",
    },
    {
      q: "Is it safe to paste messages into ScamGuard?",
      a: "Yes. User messages are treated strictly as untrusted text data and sanitized. We never ask for or store real passwords, OTPs, or credit card numbers, and we advise users never to paste sensitive secret credentials.",
    },
    {
      q: "What if I already clicked the link or shared an OTP?",
      a: "ScamGuard features an interactive Damage Control questionnaire that gives you immediate, step-by-step containment instructions depending on whether you shared credentials, sent money, or downloaded an APK.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden cyber-grid-pattern">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield className="w-4 h-4 text-cyan-400" />
            Next-Generation Scam & Fraud Defense
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Understand the Scam <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
              Before You Act.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Paste any suspicious SMS, WhatsApp message, email, job offer, or payment alert. Let AI explain the warning signs, uncover the attacker’s progression path, identify what to protect, and guide your next move.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/editor"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-500/25 transition duration-200 flex items-center justify-center gap-2 group text-base"
            >
              <span>Analyze a Message</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition duration-200 text-base"
            >
              See How It Works
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Language (English, Roman Urdu, Urdu)
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Attack Path Breakdown
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Immediate Damage Control Guide
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">3-Step Process</h2>
            <h3 className="text-3xl font-extrabold text-white">How ScamGuard AI Protects You</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 relative">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5">
                1
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Paste Suspicious Text</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Copy the text from your SMS, WhatsApp, bank alert, or email and paste it into the secure ScamGuard analyzer.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 relative">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg mb-5">
                2
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Multi-Vector AI Analysis</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our engine extracts concrete evidence, psychological manipulation tactics, lookalike domains, and calculates an objective risk score.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-slate-900/70 border border-slate-800/80 relative">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-lg mb-5">
                3
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Act With Total Confidence</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive contextual "Do Not Share" warnings, safe verification instructions, and tailored damage-control steps if you already interacted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY SCAMGUARD */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">The ScamGuard Difference</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
                Don’t just get told "It’s a scam." <br />
                Understand the trap.
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Traditional bots just label a message as bad without context. ScamGuard breaks down the social engineering tactics, reveals what the attacker expects you to do next, and protects you from falling into similar traps in the future.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Full Scam Attack Path</h4>
                    <p className="text-xs text-slate-400">See the exact 4-stage chain from hook to fund drainage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Interactive Damage Control</h4>
                    <p className="text-xs text-slate-400">Already clicked or sent an OTP? Get immediate incident response.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Contextual "Do Not Share"</h4>
                    <p className="text-xs text-slate-400">Dynamic protection list tailored to requested details (CNIC, OTP, PIN, CVV).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase">
                  <AlertTriangle className="w-4 h-4" /> Very High Risk (94/100)
                </span>
                <span className="text-xs text-slate-400">Easypaisa OTP Scam</span>
              </div>
              <div className="my-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                "Muazziz Saarif: Apka account block kardiya gaya hai. Fori unlock karne ke liye apna 4-digit PIN aur OTP code reply karein..."
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-red-950/40 border border-red-900/60 text-red-200">
                  <strong>DO NOT SHARE:</strong> Easypaisa PIN, OTP, CNIC number
                </div>
                <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/60 text-cyan-200">
                  <strong>ATTACK PATH:</strong> Fake Suspension &rarr; Panic &rarr; OTP Request &rarr; Account Emptying
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCAM TYPES GRID */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Threat Coverage</h2>
            <h3 className="text-3xl font-extrabold text-white">Scam Patterns Detected by ScamGuard</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scamTypes.map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition">
                <ShieldAlert className="w-6 h-6 text-cyan-400 mb-3" />
                <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING TEASER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Subscription Plans</h2>
          <h3 className="text-3xl font-extrabold text-white">Simple, Transparent Pricing</h3>
          <p className="text-slate-400 text-sm mt-2">Start free with 5,000 words per month. Upgrade anytime for higher volume.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Free Tier</h4>
              <p className="text-xs text-slate-400 mb-4">For individuals checking personal alerts.</p>
              <div className="text-3xl font-extrabold text-white mb-6">
                $0 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> 5,000 words per month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Full Attack Path breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Damage Control guide</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> English & Roman Urdu</li>
              </ul>
            </div>
            <Link
              href="/editor"
              className="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
            >
              Start Free
            </Link>
          </div>

          {/* Pro */}
          <div className="p-7 rounded-2xl bg-blue-950/40 border border-cyan-500/40 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative">
            <span className="absolute -top-3 right-6 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-cyan-500 text-slate-950">
              Popular
            </span>
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Pro Protection</h4>
              <p className="text-xs text-slate-400 mb-4">For power users and busy freelancers.</p>
              <div className="text-3xl font-extrabold text-white mb-6">
                $12 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> 20,000 words per month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Priority heuristic processing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Analysis history export</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Advanced URL inspection</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md transition"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* Business */}
          <div className="p-7 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-white mb-1">Business Safety</h4>
              <p className="text-xs text-slate-400 mb-4">For organizations and security teams.</p>
              <div className="text-3xl font-extrabold text-white mb-6">
                $49 <span className="text-xs text-slate-400 font-normal">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Unlimited words per month</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Multi-seat dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Enterprise API access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Priority 24/7 support</li>
              </ul>
            </div>
            <Link
              href="/pricing"
              className="mt-8 w-full py-2.5 rounded-xl text-center text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition"
            >
              View Business Tier
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">Frequently Asked Questions</h2>
            <h3 className="text-3xl font-extrabold text-white">Got Questions? We’ve Got Answers.</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h4 className="text-base font-bold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900 relative">
        <div className="max-w-4xl mx-auto text-center p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900/90 border border-blue-500/30 shadow-2xl">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Stay One Step Ahead of Scammers.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Never act on panic or fake excitement again. Verify unexpected requests in seconds with ScamGuard AI.
          </p>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-cyan-500/25 transition text-base"
          >
            <span>Analyze Your First Message</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
