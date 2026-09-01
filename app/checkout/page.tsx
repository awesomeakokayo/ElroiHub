import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CheckoutClient from "@/components/CheckoutClient";
import { getPlan } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Complete Your Purchase",
  description: "Complete your ElRoi Hub plan purchase — secure checkout in USD via Stripe.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cancelled?: string }>;
}) {
  const { plan: planQuery, cancelled } = await searchParams;
  const plan = planQuery ? getPlan(planQuery) : undefined;

  return (
    <main className="inner-page checkout-page">
      <SiteHeader />
      <div>
        <Link href="/pricing" className="checkout-back">
          <img className="checkout-back-icon" src="https://www.figma.com/api/mcp/asset/e5f4df0f-a553-4d9b-9126-bf5441e59554.svg" alt="" aria-hidden="true" />
          <span>Back to Pricing</span>
        </Link>

        <h1>
          Complete Your <span className="gold">Purchase</span>
        </h1>
        <div className="checkout-divider" />

        {cancelled && <div className="checkout-cancelled">Payment cancelled. You can try again.</div>}

        {!plan ? (
          <div className="checkout-card" style={{ padding: 28 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No plan selected.</p>
            <p style={{ margin: "8px 0 16px", color: "#555" }}>Choose a plan from pricing to continue.</p>
            <Link href="/pricing" className="btn btn-gold" style={{ display: "inline-flex", width: "auto", minWidth: 0, padding: "0 24px" }}>
              Go to Pricing
            </Link>
          </div>
        ) : (
          <CheckoutClient plan={plan} />
        )}
      </div>
      <Footer />
    </main>
  );
}
