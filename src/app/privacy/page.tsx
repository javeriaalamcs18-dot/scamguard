export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-2">Last updated: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Data Minimization & Message Handling</h2>
          <p>
            ScamGuard AI treats all submitted messages strictly as passive, untrusted data for security evaluation. We explicitly instruct users never to input active secrets, including passwords, OTPs, PINs, full debit/credit card numbers, or CVVs.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. User Isolation & Row Level Security (RLS)</h2>
          <p>
            When logged in, your analysis history is cryptographically associated solely with your authenticated user identifier in Supabase PostgreSQL. Strict Row Level Security policies guarantee that no other user or organization can view or query your personal evaluations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Third-Party Integrations</h2>
          <p>
            Payment transactions and billing data are securely managed by Stripe. We do not store or process payment card details on ScamGuard servers. AI analysis requests are processed via secure server-side pipelines with zero client exposure of API keys.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. User Rights & Data Deletion</h2>
          <p>
            You retain full ownership of your data and can delete individual analyses from your history or clear your analysis history at any time.
          </p>
        </section>
      </div>
    </div>
  );
}
