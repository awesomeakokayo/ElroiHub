import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { findPlanByName } from "@/lib/plans";
import OnboardingBooking from "./OnboardingBooking";

export const metadata: Metadata = {
  title: "Payment Confirmed",
  description: "Your ElRoi Hub plan is active. Book your onboarding call.",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; session_id?: string; mock?: string }>;
}) {
  const params = await searchParams;
  const planName = params?.plan || "Growth";
  const plan = findPlanByName(planName) || findPlanByName("Growth")!;
  // If Stripe session exists, we could verify it server-side, but for now use plan param
  const displayPrice = plan.price.startsWith("$") ? plan.price : `$${plan.price}`;

  // Next billing approx 30 days from now
  const nextBilling = new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  const nextBillingStr = nextBilling.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <main className="checkout-success-page">
      <SiteHeader />
      <div>
        {/* Payment Confirmed */}
        <div className="success-page">
          <img src="/assets/icon-badge.svg" alt="" className="success-payment-mark" aria-hidden="true" />
          <div className="success-status-pill">Payment Confirmed</div>
          <h1>
            Welcome to <span className="gold">El Roi Hub</span>
          </h1>
          <p className="success-lead">Your {plan.name} Plan is now active. Our team will reach out within 24 hours to get your onboarding started.</p>

          <div className="success-plan-card">
            <div>
              <div className="success-plan-label">Plan</div>
              <div className="success-plan-value">{plan.name}</div>
            </div>
            <div>
              <div className="success-plan-label">Amount</div>
              <div className="success-plan-value">{displayPrice}/mo</div>
            </div>
            <div>
              <div className="success-plan-label">Status</div>
              <div className="success-plan-value active">✓ Active</div>
            </div>
            <div>
              <div className="success-plan-label">Next Billing</div>
              <div className="success-plan-value">{nextBillingStr}</div>
            </div>
          </div>
        </div>

        <div className="success-next-divider">
          <span>What&apos;s Next</span>
        </div>

        {/* Schedule a Call - reuses Book a Call format */}
        <section className="onboarding-section" aria-labelledby="onboarding-heading">
          <div className="onboarding-kicker">Schedule a Call</div>
          <h2 id="onboarding-heading">Book Your Onboarding Call</h2>
          <p className="onboarding-copy">Let&apos;s get acquainted. A 30-minute kickoff call with your dedicated account manager to align on your brand goals, content direction, and first month&apos;s plan.</p>

          <OnboardingBooking plan={plan.name} />
        </section>
      </div>
      <Footer />
    </main>
  );
}
