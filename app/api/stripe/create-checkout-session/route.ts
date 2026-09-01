import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan, planId, price, priceCents, customer } = body as {
      plan: string;
      planId: string;
      price: string;
      priceCents: number;
      customer: { name: string; email: string; phone: string; business?: string };
    };

    if (!plan || !priceCents || !customer?.email || !customer?.name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);
    if (!emailOk) return NextResponse.json({ error: "Invalid email." }, { status: 400 });

    // Ensure dollars, not naira - price already in dollars
    const amount = typeof priceCents === "number" ? priceCents : Math.round(parseFloat(String(price).replace(/[^0-9.]/g, "")) * 100);
    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid price." }, { status: 400 });
    }

    const secret = process.env.STRIPE_SECRET_KEY;

    // If no Stripe keys, return mock success for local dev / demo
    if (!secret) {
      return NextResponse.json({
        mock: true,
        message: "Stripe not configured - mock checkout. Configure STRIPE_SECRET_KEY to enable real payments.",
      });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-12-18.acacia" as any });

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://elroihub.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ElRoi Hub — ${plan}`,
              description: `Subscription: ${plan} - Billed monthly in USD`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        planId: planId || plan,
        customer_name: customer.name,
        customer_phone: customer.phone || "",
        business: customer.business || "",
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan)}`,
      cancel_url: `${origin}/checkout?plan=${encodeURIComponent(plan)}&canceled=1`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("create-checkout-session error", err);
    const msg = err instanceof Error ? err.message : "Unable to create checkout session.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
