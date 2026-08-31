import SiteHeader from "@/components/SiteHeader";
import PricingView from "@/components/PricingView";

export default function PricingPage(){
 return <main className="inner-page"><SiteHeader/><div className="inner-head"><div className="section-kicker">Pricing</div><h1 className="section-title"><span className="gold">Flexible</span> Packages</h1><p className="inner-copy">Choose the service that matches where your business is today. Every package is built to create measurable value.</p></div><PricingView/></main>
}
