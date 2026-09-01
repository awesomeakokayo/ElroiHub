import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import CheckoutClient from "./CheckoutClient";
import { findPlanByName } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Complete Your Purchase",
  description: "Complete your ElRoi Hub purchase and activate your plan.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const planParam = params?.plan || "";
  const plan = findPlanByName(planParam) || findPlanByName("Growth") || findPlanByName("AI Growth")!;

  return (
    <main className="checkout-page">
      <SiteHeader />
      <div>
        <Link href="/pricing" className="checkout-back">
          <span className="checkout-back-icon" aria-hidden="true">‹</span> Back to Pricing
        </Link>
        <h1>
          Complete Your <span className="gold">Purchase</span>
        </h1>
        <div className="checkout-divider" />
        <CheckoutClient plan={plan} />
      </div>
      <Footer />
    </main>
  );
}
