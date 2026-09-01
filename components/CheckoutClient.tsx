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

  async function handleContinue() {
    setError("");
    if (!fullName.trim() || fullName.trim().length < 2) { setError("Full name is required."); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Valid email is required."); return; }
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
        // If Stripe is configured, redirect to Checkout. In mock mode, data.url is our success page.
        // For mock, also try Stripe.js redirect if publishable key present and url looks like Stripe
        if (data.mock) {
          window.location.href = data.url;
          return;
        }
        // If Stripe Checkout URL, just redirect
        if (data.url.startsWith("http")) {
          window.location.href = data.url;
          return;
        }
        // fallback: try Stripe.js
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
    <div className="checkout-layout">
      {/* Left — Your Details */}
      <section className="checkout-card">
        <h2 className="checkout-card-title">Your Details</h2>
        <label className="field">
          <span>FULL NAME *</span>
          <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Adaeze Okonkwo" maxLength={80} />
        </label>
        <label className="field">
          <span>EMAIL ADDRESS *</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="adaeze@brand.com" maxLength={254} />
        </label>
        <label className="field">
          <span>PHONE NUMBER *</span>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" maxLength={20} />
        </label>
        <label className="field">
          <span>BUSINESS NAME (OPTIONAL)</span>
          <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Your Brand Co." maxLength={80} />
        </label>
        <button className="checkout-cta" onClick={handleContinue} disabled={loading}>
          {loading ? "Redirecting…" : "Continue to payment"}
        </button>
        {error && <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#fdf0f0", color: "#7a1a1a", border: "1px solid #e7b7b7", fontSize: 13 }}>{error}</div>}
      </section>

      {/* Right — Order Summary */}
      <aside className="checkout-card order-summary">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <h2 className="checkout-card-title" style={{ marginBottom: 0 }}>Order Summary</h2>
          <div style={{ textAlign: "right", fontFamily: "var(--font-fractul)", fontWeight: 600, color: "#0c200e", fontSize: "clamp(20px,2.2vw,28px)", lineHeight: 1 }}>
            {formatUSD(plan.priceCents)}<span style={{ fontSize: 11, fontWeight: 500, color: "#1a3d1a", letterSpacing: ".04em" }}>/month</span>
          </div>
        </div>
        <div style={{ display: "inline-flex", margin: "8px 0 14px", padding: "4px 12px", borderRadius: 999, border: "1px solid #dfe8df", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#1a3d1a", background: "#f4f7f3" }}>
          {plan.name}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: "#555", marginBottom: 6 }}>Social Media Management</div>
        <ul style={{ margin: "0 0 14px 16px", padding: 0, fontSize: 13, lineHeight: 1.6, color: "#333" }}>
          <li>Management of up to 4 platforms</li>
          <li>20–24 custom posts monthly</li>
          <li>8–12 edited reels/videos</li>
          <li>Custom graphics/flyers</li>
          <li>Monthly content calendar</li>
          <li style={{ color: "#777" }}>+ 3 more features</li>
        </ul>
        <div style={{ height: 1, background: "#eef1ee", margin: "14px 0" }} />
        <div className="order-row"><span>Subtotal</span><strong>{formatUSD(subtotal)}</strong></div>
        <div className="order-row"><span>Setup Fee</span><strong>{setupFee === 0 ? "$0" : formatUSD(setupFee)}</strong></div>
        <div style={{ height: 1, background: "#1a3d1a", margin: "10px 0" }} />
        <div className="order-row total"><span>Total</span><strong>{formatUSD(total)}</strong></div>
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "#f0faf0", color: "#1a3d1a", fontSize: 11, lineHeight: 1.5, border: "1px solid #dff0df" }}>
          Cancel anytime. No hidden fees. First month billed on subscription start.
        </div>
      </aside>
    </div>
  );
}
