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
      <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%" }}>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontSize: 14, marginBottom: 18 }}>
          <span aria-hidden>‹</span> Back to Pricing
        </Link>
        <h1 className="section-title" style={{ fontSize: "clamp(32px,4vw,56px)", lineHeight: 1.05, margin: "0 0 12px" }}>
          Complete Your <span className="gold">Purchase</span>
        </h1>
        <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "12px 0 28px" }} />
        {cancelled && <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: "#fdf0f0", color: "#7a1a1a", border: "1px solid #e7b7b7" }}>Payment cancelled. You can try again.</div>}
        {!plan ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, color: "#1d1d1d" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No plan selected.</p>
            <p style={{ margin: "8px 0 16px", color: "#555" }}>Choose a plan from pricing to continue.</p>
            <Link href="/pricing" className="btn btn-gold" style={{ display: "inline-flex", width: "auto", minWidth: 0, padding: "0 24px" }}>Go to Pricing</Link>
          </div>
        ) : (
          <CheckoutClient plan={plan} />
        )}
      </div>
      <Footer />
    </main>
  );
}
