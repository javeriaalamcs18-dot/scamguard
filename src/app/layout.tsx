import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScamGuard AI — Understand the Scam Before You Act",
  description:
    "AI-powered scam detection and cybersecurity safety assistant. Paste suspicious SMS, WhatsApp, emails, job offers, or payment alerts to analyze warning signs, attack paths, and safe actions.",
  keywords: [
    "scam detection",
    "phishing detector",
    "cybersecurity",
    "fraud prevention",
    "OTP scam",
    "Easypaisa scam",
    "JazzCash scam",
    "AI scam analysis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
