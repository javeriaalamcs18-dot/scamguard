# SCAMGUARD AI — Cybersecurity & Scam Defense Assistant

> **"Understand the Scam Before You Act."**

**ScamGuard AI** is a production-ready SaaS application designed to help everyday internet users, freelancers, and businesses analyze suspicious SMS, WhatsApp messages, emails, job offers, bank alerts, and payment requests.

Instead of merely saying *"This is a scam"*, ScamGuard reveals the **attacker's psychological manipulation tactics**, reconstructs the **multi-step attack progression path**, identifies **contextual information you must never share**, and delivers **instant damage-control guidance** if the user has already clicked a link, entered a password, shared an OTP, or sent money.

---

## 🛡️ Core Highlights

- **Multi-Vector Threat Analysis**: Evaluates urgency, prize promises, impersonation, lookalike domains, shortened URLs, and credential harvesting patterns.
- **Scam Attack Path Visualization**: Generates a step-by-step flowchart showing how an attacker progresses from initial contact to fund or credential drainage.
- **Interactive Damage-Control System**: Live containment instructions tailored to what the user did (*"I clicked the link"*, *"I entered a password"*, *"I shared an OTP"*, *"I sent money"*).
- **Pakistan-Specific Fraud Logic**: Custom context detection for Easypaisa, JazzCash, 1Link, Raast, BISP/8171, and SIM biometric re-verification fraud.
- **Multilingual Support**: Real-time detection and explanations in **English**, **Roman Urdu**, and **Urdu (اردو)**.
- **Prompt Injection Defense**: User messages are treated strictly as untrusted passive data—adversarial injection attempts are safely analyzed as threat payloads.
- **Tiered Word Quotas**: Free (5,000 words/mo), Pro (20,000 words/mo), Business (Unlimited).
- **Stripe Subscriptions**: Complete Checkout, Customer Portal, and Webhook signature verification architecture.
- **Supabase PostgreSQL & RLS**: Strict Row-Level Security ensuring zero cross-tenant leakage.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router, Turbopack, React 19, TypeScript) |
| **Styling** | Tailwind CSS v4, Poppins Font, Security Color System |
| **Icons** | Lucide React |
| **Database** | Supabase PostgreSQL (`uuid-ossp`, JSONB schemas, Indexes) |
| **Authentication** | Supabase Auth (`@supabase/ssr`) |
| **Payments** | Stripe SDK (Checkout, Customer Portal, Webhooks) |
| **AI Layer** | Modular AI Provider abstraction (OpenAI, OpenRouter, Groq) with robust local heuristics fallback |
| **Validation** | Zod Schema Validation |
| **Testing** | Automated TSX Test Suite (27 test scenarios) |

---

## 📁 Project Architecture

```
d:/scamguard
├── public/                 # Static assets and icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/    # Analysis pipeline API endpoint
│   │   │   ├── feedback/   # User feedback submissions
│   │   │   ├── history/    # Analysis history retrieval & deletion
│   │   │   │   └── [id]/   # Single analysis report endpoint
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/ # Stripe Checkout session creator
│   │   │   │   ├── portal/   # Stripe Customer Portal session
│   │   │   │   └── webhook/  # Verified Stripe webhook handler
│   │   │   └── user/
│   │   │       └── stats/  # Real-time usage & quota checker
│   │   ├── about/          # Mission & product philosophy
│   │   ├── dashboard/      # Usage progress, high-risk counts, quick actions
│   │   ├── editor/         # Main interactive analysis interface
│   │   ├── forgot-password/# Password recovery
│   │   ├── history/        # Filterable history archive
│   │   │   └── [id]/       # Full printable analysis report
│   │   ├── login/          # Supabase authentication
│   │   ├── managed-billing/# Stripe subscription manager
│   │   ├── pricing/        # 3-tier subscription matrix
│   │   ├── privacy/        # Privacy disclosures
│   │   ├── settings/       # Profile preferences & cache control
│   │   ├── signup/         # Account creation
│   │   ├── terms/          # Terms of service
│   │   ├── globals.css     # Cybersecurity color variables & glow effects
│   │   ├── layout.tsx      # Root layout with Poppins font & navigation
│   │   └── page.tsx        # High-conversion landing page
│   ├── components/
│   │   ├── analysis/       # Visual risk meter, attack path, damage control
│   │   └── layout/         # Security Navbar & Footer
│   └── lib/
│       ├── ai/             # Provider abstraction, pipeline, heuristics, schema
│       ├── stripe/         # Stripe SDK configuration
│       ├── supabase/       # Browser, server, and admin Supabase clients
│       └── usage/          # Usage tracking & quota service
├── supabase/
│   └── schema.sql          # Complete PostgreSQL DDL with RLS & Triggers
├── tests/
│   └── scam-engine.test.ts # 27-scenario automated verification suite
├── .env.example            # Environment configuration blueprint
└── package.json
```

---

## ⚡ Quick Start & Local Setup

### 1. Clone & Install Dependencies
```bash
cd d:/scamguard
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Auth & Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI Provider (OpenAI, OpenRouter, Groq, etc.)
AI_PROVIDER_API_KEY=your-ai-provider-api-key
AI_PROVIDER_MODEL=gpt-4o-mini
AI_PROVIDER_BASE_URL=https://api.openai.com/v1

# Stripe Subscription Billing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

*(Note: Out-of-the-box, ScamGuard includes safe development defaults with zero external dependencies, allowing full testing and development even before credentials are plugged in).*

### 3. Setup Supabase Database
In your Supabase project SQL Editor, run the contents of [`supabase/schema.sql`](supabase/schema.sql). This will:
1. Create `profiles`, `analyses`, `subscriptions`, `usage`, and `feedback` tables.
2. Enable Row-Level Security (RLS) on all user-owned tables.
3. Configure the `on_auth_user_created` trigger for automatic profile and quota allocation.
4. Establish indexes on critical query paths.

### 4. Run the 27 Automated Tests
```bash
npm run test
```
All 27 test scenarios will run and verify:
- Harmless message neutrality
- Fake prize & lottery detection
- Bank impersonation & urgent coercion
- OTP theft and contextual "Do Not Share" warnings
- Easypaisa, JazzCash & BISP recognition
- Lookalike domain & IP-based URL inspection
- Urdu script and Roman Urdu linguistics
- Prompt injection boundary defense
- Immediate damage control actions
- Monthly quota limits (Free 5k, Pro 20k, Business unlimited)
- Zod schema validation & offline fallback resilience

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Privacy Implementation

1. **Untrusted Data Isolation**: User inputs are treated strictly as data payloads and never evaluated as runtime instructions.
2. **Server-Side Key Isolation**: All Stripe secret keys and AI API keys are restricted to server execution paths (`admin.ts`, route handlers).
3. **Cryptographic Webhook Verification**: Stripe webhooks verify signatures via `stripe.webhooks.constructEvent()` before altering database subscription state.
4. **Data Minimization & User Rights**: Users can search, export, or delete individual analyses or their entire history at any time.

---

## 🚢 Production Deployment

### Vercel / Cloudflare Pages / AWS Amplify
1. Push code to your Git repository.
2. Import repository into Vercel or your hosting provider.
3. Add the environment variables specified in `.env.example`.
4. Configure your Stripe Webhook endpoint to `https://your-domain.com/api/stripe/webhook` listening for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Deploy!
