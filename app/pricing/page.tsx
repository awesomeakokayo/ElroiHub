import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import PricingView from "@/components/PricingView";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Explore Elroi Hub pricing for AI services, graphic design, web development, and combo packages.",
};

export default function PricingPage() {
  return (
    <>
      <main className="inner-page pricing-page">
        <SiteHeader />
        <div className="pricing-wrap">
          <PricingView />
        </div>
      </main>
      <Footer />
    </>
  );
}
