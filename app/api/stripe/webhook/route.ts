import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) {
    // No stripe configured — acknowledge so Stripe doesn't retry in mock mode
    return NextResponse.json({ received: true, mock: true });
  }
  const stripe = new Stripe(key, { apiVersion: "2025-08-27.basil" as any });
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    console.error("[webhook] signature failed", err?.message);
    return NextResponse.json({ error: `Webhook Error: ${err?.message}` }, { status: 400 });
  }

  // For now just log; extend to persist to DB / send email via Resend
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log("[webhook] checkout.session.completed", {
      id: session.id,
      email: session.customer_details?.email || session.customer_email,
      plan: (session.metadata as any)?.plan,
      amount: session.amount_total,
    });
    // TODO: mark plan Active, send confirmation email, etc.
  }
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    console.log("[webhook] payment_intent.succeeded", pi.id, pi.amount);
  }

  return NextResponse.json({ received: true });
}

// Stripe needs raw body — disable Next's body parsing for this route is handled by reading text() above
export const runtime = "nodejs";
