"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { Plan } from "@/lib/pricing";
import { formatUSD } from "@/lib/pricing";

const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
let stripePromise: Promise<any> | null = null;
function getStripe() {
  if (!publishable) return null;
  if (!stripePromise) stripePromise = loadStripe(publishable);
  return stripePromise;
}

const figmaCheckIcon = "https://www.figma.com/api/mcp/asset/0ffbf45b-f830-44a0-99da-1bf49d46c614.svg";

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = plan.priceCents;
  const setupFee = 0;
  const total = subtotal + setupFee;

  const featureList = [
    "Management of up to 4 platforms",
    "20–24 custom posts monthly",
    "8–12 edited reels/videos",
    "Custom graphics/flyers",
    "Monthly content calendar",
  ];

  async function handleContinue() {
    setError("");
    if (!fullName.trim() || fullName.trim().length < 2) { setError("Full name is required."); return; }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setError("Valid email is required."); return; }
    if (!phone.trim()) { setError("Phone number is required."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.name, fullName: fullName.trim(), email: email.trim(), phone: phone.trim(), businessName: businessName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        if (data.mock || data.url.startsWith("http")) {
          window.location.href = data.url;
          return;
        }
        const stripe = await getStripe();
        if (stripe && data.sessionId) {
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) throw new Error(error.message);
          return;
        }
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (e: any) {
      setError(e.message || "Unable to start payment.");
      setLoading(false);
    }
  }

  return (
    <div className="checkout-flow-grid">
      <section className="checkout-card checkout-details-card">
        <div>
          <h2 className="checkout-card-title">Your Details</h2>
          <div className="checkout-details-fields" style={{ marginTop: 32 }}>
            <label className="field">
              <span>FULL NAME *</span>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Adaeze Okonkwo" maxLength={80} />
            </label>
            <label className="field">
              <span>EMAIL ADDRESS *</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="adaeze@company.com" maxLength={254} />
            </label>
            <label className="field">
              <span>PHONE NUMBER *</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 801 234 5678" maxLength={20} />
            </label>
            <label className="field">
              <span>BUSINESS NAME (OPTIONAL)</span>
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your Brand Co." maxLength={80} />
            </label>
          </div>
        </div>

        <div>
          <button className="checkout-pay-button" onClick={handleContinue} disabled={loading}>
            {loading ? "Redirecting…" : "Continue to payment"}
          </button>
          {error && <div className="checkout-error">{error}</div>}
        </div>
      </section>

      <aside className="checkout-card checkout-summary-card">
        <div className="checkout-summary-top">
          <div className="checkout-summary-title-wrap">
            <h2 className="checkout-card-title">Order Summary</h2>
            <span className="checkout-summary-plan">{plan.name}</span>
            <div className="checkout-summary-service">Social Media Management</div>
          </div>
          <div className="checkout-summary-price-wrap">
            <span className="checkout-summary-price">{formatUSD(plan.priceCents)}</span>
            <span className="checkout-summary-month">/month</span>
          </div>
        </div>

        <div className="checkout-feature-box">
          <ul className="checkout-feature-list">
            {featureList.map((feature) => (
              <li key={feature}>
                <img className="checkout-feature-icon" src={figmaCheckIcon} alt="" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
            <li><span className="checkout-more-features">+ 3 more features</span></li>
          </ul>
        </div>

        <div className="checkout-costs">
          <div className="checkout-cost-row"><span>Subtotal</span><strong>{formatUSD(subtotal)}</strong></div>
          <div className="checkout-cost-row"><span>Setup Fee</span><strong style={{ color: "#5cb85c" }}>{setupFee === 0 ? "$0" : formatUSD(setupFee)}</strong></div>
          <div className="checkout-total"><span>Total</span><strong>{formatUSD(total)}</strong></div>
        </div>

        <div className="checkout-trust-note">Cancel anytime. No hidden fees. First month billed on subscription start.</div>
      </aside>
    </div>
  );
}
