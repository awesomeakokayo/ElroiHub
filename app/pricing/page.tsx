import SiteHeader from "@/components/SiteHeader";
import PricingView from "@/components/PricingView";

export default function PricingPage() {
  return (
    <main className="inner-page pricing-page">
      <SiteHeader />
      <div className="pricing-wrap">
        <PricingView />
      </div>
    </main>
  );
}
