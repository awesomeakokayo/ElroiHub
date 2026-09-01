import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { getPlan, formatUSD } from "@/lib/pricing";
import SuccessBookingWrapper from "@/components/SuccessBookingWrapper";

export const metadata: Metadata = {
  title: "Payment Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; plan?: string; mock?: string; email?: string }>;
}) {
  const { session_id, plan: planQ, mock, email } = await searchParams;
  // Try to verify session server-side if Stripe is configured — fallback to mock/plan query
  let plan = planQ ? getPlan(planQ) : undefined;
  let amountLabel: string | null = null;
  let sessionEmail = email || "";
  let isPaid = !!mock; // mock mode considered paid for dev

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" as any });
      const session = await stripe.checkout.sessions.retrieve(session_id);
      isPaid = session.payment_status === "paid" || session.status === "complete";
      if (session.customer_details?.email) sessionEmail = session.customer_details.email;
      else if (session.customer_email) sessionEmail = session.customer_email;
      if (session.amount_total) amountLabel = new Intl.NumberFormat("en-US", { style: "currency", currency: (session.currency || "usd").toUpperCase() }).format((session.amount_total as number) / 100);
      const metaPlan = (session.metadata as any)?.plan;
      if (!plan && metaPlan) plan = getPlan(metaPlan);
    } catch (e) {
      console.error("[success] stripe fetch failed", e);
    }
  }

  // Fallback to plan's price if no session amount
  if (!amountLabel && plan) amountLabel = formatUSD(plan.priceCents);
  const planName = plan?.name || "Growth";
  const nextBilling = new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <main className="inner-page checkout-success-page">
      <SiteHeader />
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        {/* Payment Confirmed header */}
        <div style={{ textAlign: "center", padding: "8px 0 18px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1a3d1a", display: "grid", placeItems: "center", margin: "0 auto 12px", border: "2px solid rgba(255,255,255,0.12)" }}>
            <span style={{ width: 28, height: 28, borderRadius: 999, background: "#affc9e", display: "grid", placeItems: "center", color: "#1a3d1a", fontWeight: 800 }}>✓</span>
          </div>
          <div style={{ display: "inline-flex", padding: "6px 14px", borderRadius: 999, background: "#affc9e", color: "#1a3d1a", fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase" }}>Payment Confirmed</div>
          <h1 className="section-title" style={{ fontSize: "clamp(28px,4vw,44px)", textAlign: "center", marginTop: 12, color: "#fff" }}>
            Welcome to <span className="gold">El Roi Hub</span>
          </h1>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 8 }}>
            Your <strong style={{ color: "#fff" }}>{planName} Plan</strong> is now active. Our team will reach out within 24 hours to get your onboarding started.
          </p>
          {/* Plan summary pill */}
          <div style={{ margin: "16px auto 0", maxWidth: 420, background: "#fff", borderRadius: 14, padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, textAlign: "center", color: "#1a3d1a", fontSize: 11 }}>
            <div><div style={{ opacity: 0.6, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>Plan</div><strong>{planName}</strong></div>
            <div><div style={{ opacity: 0.6, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>Amount</div><strong>{amountLabel || "$0"}/mo</strong></div>
            <div><div style={{ opacity: 0.6, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>Status</div><strong style={{ color: "#1a7a1a" }}>● Active</strong></div>
            <div><div style={{ opacity: 0.6, fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>Next billing</div><strong>{nextBilling}</strong></div>
          </div>
          {!isPaid && !mock && (
            <p style={{ textAlign: "center", color: "#ffae00", fontSize: 12, marginTop: 10 }}>Payment verification pending — if you just paid, refresh in a few seconds.</p>
          )}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.1)", margin: "18px 0" }} />
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>What&apos;s Next</div>

        {/* Booking — reuse ScheduleForm UI but as onboarding */}
        <SuccessBookingWrapper planName={planName} email={sessionEmail} sessionId={session_id} />
      </div>
      <Footer />
    </main>
  );
}
