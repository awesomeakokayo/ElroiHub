import SiteHeader from "@/components/SiteHeader";
import PricingView from "@/components/PricingView";

export default function PricingPage() {
  return (
    <main className="inner-page pricing-page">
      <SiteHeader />
      <div className="pricing-wrap">
        <p className="pricing-description">
          Automate processes, integrate AI tools, and build custom AI workflows for your business.
        </p>
        <PricingView />
      </div>
    </main>
  );
}
