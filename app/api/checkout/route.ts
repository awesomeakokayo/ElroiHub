import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPlan } from "@/lib/pricing";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-08-27.basil" as any });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const planQuery: string = (body.plan || body.name || "").toString().trim();
    const email: string = (body.email || "").toString().trim();
    const fullName: string = (body.fullName || body.name || "").toString().trim();
    const phone: string = (body.phone || "").toString().trim();
    const businessName: string = (body.businessName || "").toString().trim();

    if (!planQuery) return NextResponse.json({ error: "Missing plan." }, { status: 400 });
    const plan = getPlan(planQuery);
    if (!plan) return NextResponse.json({ error: `Unknown plan: ${planQuery}` }, { status: 400 });

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (fullName.length < 2) return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    if (fullName.length > 80) return NextResponse.json({ error: "Name too long." }, { status: 400 });
    if (phone && phone.length > 20) return NextResponse.json({ error: "Phone too long." }, { status: 400 });

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin || "http://localhost:3000").replace(/\/$/, "");
    const stripe = getStripe();

    // Mock mode if no Stripe key — still returns a success URL for local dev without Stripe
    if (!stripe) {
      const params = new URLSearchParams({
        plan: plan.name,
        email,
        mock: "1",
      });
      const url = `${siteUrl}/checkout/success?${params.toString()}`;
      return NextResponse.json({ url, mock: true });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "usd",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description.slice(0, 400),
            },
            unit_amount: plan.priceCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan: plan.name,
        planId: plan.id,
        fullName,
        phone,
        businessName,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${encodeURIComponent(plan.name)}`,
      cancel_url: `${siteUrl}/checkout?plan=${encodeURIComponent(plan.name)}&cancelled=1`,
      // allow promotion codes if you want: allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout] error", err);
    return NextResponse.json({ error: err?.message || "Checkout failed." }, { status: 500 });
  }
}
