import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLAN_CONFIGS, PlanType } from "@/lib/usage/service";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing stripe-signature or webhook secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan as PlanType) || "pro";
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          // 1. Update user profile plan
          await supabaseAdmin
            .from("profiles")
            .update({ plan, updated_at: new Date().toISOString() })
            .eq("id", userId);

          // 2. Upsert subscription record
          await supabaseAdmin.from("subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            plan,
            status: "active",
            updated_at: new Date().toISOString(),
          });

          // 3. Update current month's usage limit
          const planConfig = PLAN_CONFIGS[plan] || PLAN_CONFIGS.free;
          const currentMonth = new Date().toISOString().slice(0, 7);
          await supabaseAdmin
            .from("usage")
            .update({
              word_limit: planConfig.monthlyWordLimit,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("month", currentMonth);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        const status = subscription.status;

        // Find associated user by customer ID
        const { data: subRecord } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (subRecord?.user_id) {
          await supabaseAdmin
            .from("subscriptions")
            .update({
              status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", subRecord.user_id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: subRecord } = await supabaseAdmin
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (subRecord?.user_id) {
          // Revert user to free plan
          await supabaseAdmin
            .from("profiles")
            .update({ plan: "free", updated_at: new Date().toISOString() })
            .eq("id", subRecord.user_id);

          await supabaseAdmin
            .from("subscriptions")
            .update({
              plan: "free",
              status: "canceled",
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", subRecord.user_id);
        }
        break;
      }

      default:
        // Ignore unhandled events
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed internally" },
      { status: 500 }
    );
  }
}
