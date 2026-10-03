import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
});

export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro_default",
  business: process.env.STRIPE_BUSINESS_PRICE_ID || "price_business_default",
};
