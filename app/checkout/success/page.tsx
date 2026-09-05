import type { Metadata } from "next";
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
  let plan = planQ ? getPlan(planQ) : undefined;
  let amountLabel: string | null = null;
  let sessionEmail = email || "";
  let isPaid = !!mock;

  if (session_id && process.env.STRIPE_SECRET_KEY) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" as any });
      const session = await stripe.checkout.sessions.retrieve(session_id);
      isPaid = session.payment_status === "paid" || session.status === "complete";
      if (session.customer_details?.email) sessionEmail = session.customer_details.email;
      else if (session.customer_email) sessionEmail = session.customer_email;
      if (session.amount_total) amountLabel = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format((session.amount_total as number) / 100);
      const metaPlan = (session.metadata as any)?.plan;
      if (!plan && metaPlan) plan = getPlan(metaPlan);
    } catch (e) {
      console.error("[success] stripe fetch failed", e);
    }
  }

  if (!amountLabel && plan) amountLabel = formatUSD(plan.priceCents);
  const planName = plan?.name || "Growth";
  const nextBilling = new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <>
      <main className="inner-page checkout-success-page">
        <SiteHeader />
        <div className="success-page">
          <img className="success-payment-mark" src="https://www.figma.com/api/mcp/asset/494cd464-1eaf-4831-aa5f-1ffa3f2673f6.png" alt="" aria-hidden="true" />

          <div className="success-status-pill">Payment Confirmed</div>

          <h1>Welcome to <span className="gold">El Roi Hub</span></h1>
          <p className="success-lead">Your Growth Plan is now active. Our team will reach out within 24 hours to get your onboarding started.</p>

          <div className="success-plan-card">
            <div><div className="success-plan-label">Plan</div><div className="success-plan-value">{planName}</div></div>
            <div><div className="success-plan-label">Amount</div><div className="success-plan-value">{amountLabel || "$0"}/mo</div></div>
            <div><div className="success-plan-label">Status</div><div className="success-plan-value active">✓ Active</div></div>
            <div><div className="success-plan-label">Next Billing</div><div className="success-plan-value">{nextBilling}</div></div>
          </div>

          {!isPaid && !mock && (
            <p style={{ textAlign: "center", color: "#ffae00", fontSize: 12, marginTop: 10 }}>Payment verification pending — if you just paid, refresh in a few seconds.</p>
          )}

          <div className="success-next-divider"><span>What&apos;s Next</span></div>

          <SuccessBookingWrapper planName={planName} email={sessionEmail} sessionId={session_id} amountLabel={amountLabel || (plan ? formatUSD(plan.priceCents) : undefined)} />
        </div>
      </main>
      <Footer />
    </>
  );
}
