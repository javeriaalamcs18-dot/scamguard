export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Terms of Service</h1>
        <p className="text-xs text-slate-400 mt-2">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. AI-Assisted Advisory Notice</h2>
          <p>
            ScamGuard AI generates risk evaluations and security recommendations through probabilistic pattern analysis and heuristic threat detection. It does not replace direct verification with verified institutional hotlines, banking representatives, or law enforcement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Acceptable Use Policy</h2>
          <p>
            You agree not to use ScamGuard to test, reverse-engineer, or optimize adversarial payloads for malicious distribution, nor to attempt to bypass prompt injection boundaries or disrupt system infrastructure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Subscription Terms & Word Quotas</h2>
          <p>
            Free tier users receive 5,000 words per billing month. Paid Pro and Business subscriptions are billed recurringly through Stripe. You may cancel renewal at any time via the Managed Billing portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Limitation of Liability</h2>
          <p>
            ScamGuard AI is not liable for financial loss, unauthorized account transfers, or personal damages resulting from user interactions with external threat actors or unverified third parties.
          </p>
        </section>
      </div>
    </div>
  );
}
