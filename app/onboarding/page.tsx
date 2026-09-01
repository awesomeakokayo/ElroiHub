import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import SuccessBookingWrapper from "@/components/SuccessBookingWrapper";

export const metadata: Metadata = { title: "Book Your Onboarding Call" };

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ plan?: string; email?: string }> }) {
  const { plan, email } = await searchParams;
  return (
    <main className="inner-page checkout-success-page">
      <SiteHeader />
      <div>
        <div className="success-page">
          <img className="success-payment-mark" src="https://www.figma.com/api/mcp/asset/494cd464-1eaf-4831-aa5f-1ffa3f2673f6.png" alt="" aria-hidden="true" />
          <div className="success-status-pill">Payment Confirmed</div>
          <h1>Welcome to <span className="gold">El Roi Hub</span></h1>
          <p className="success-lead">Your Growth Plan is now active. Our team will reach out within 24 hours to get your onboarding started.</p>
        </div>
        <div className="success-next-divider"><span>What&apos;s Next</span></div>
        <SuccessBookingWrapper planName={plan || "Growth"} email={email || ""} />
      </div>
      <Footer />
    </main>
  );
}
