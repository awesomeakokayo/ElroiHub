import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!secret || !stripeSecret) {
    // No webhook configured — acknowledge for local dev
    return NextResponse.json({ received: true, mock: true });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-12-18.acacia" as any });

  try {
    const event = stripe.webhooks.constructEvent(body, sig, secret);
    // Handle relevant events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Stripe checkout completed:", session.id, session.metadata);
      // Here you would fulfill the order: mark plan active, send email, etc.
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("webhook error", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
