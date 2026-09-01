"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Plan } from "@/lib/plans";

export default function CheckoutClient({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", business: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const priceLabel = plan.price;
  const priceNumber = plan.price.replace("$", "");
  // For Order Summary display - ensure dollars
  const displayPrice = plan.price.startsWith("$") ? plan.price : `$${plan.price}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.name,
          planId: plan.id,
          price: plan.price,
          priceCents: plan.priceCents,
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start payment.");
      if (data.url) {
        window.location.href = data.url;
      } else if (data.mock) {
        // No Stripe keys - simulate success
        router.push(`/checkout/success?plan=${encodeURIComponent(plan.name)}&mock=1`);
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  // Features for summary - use plan.features or fallback
  const features = plan.features.length ? plan.features : [plan.description];
  // Pad to show +3 more if needed to match design
  const shownFeatures = features.slice(0, 5);

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="checkout-flow-grid">
        {/* Your Details */}
        <div className="checkout-card checkout-details-card">
          <div>
            <h2 className="checkout-card-title">Your Details</h2>
            <div className="checkout-details-fields" style={{ marginTop: 32 }}>
              <label className="field">
                <span>Full Name *</span>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Adaeze Okonkwo" maxLength={80} required />
              </label>
              <label className="field">
                <span>Email Address *</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="adaeze@brand.com" maxLength={254} required />
              </label>
              <label className="field">
                <span>Phone Number *</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" maxLength={20} inputMode="tel" required />
              </label>
              <label className="field">
                <span>Business Name (Optional)</span>
                <input name="business" value={form.business} onChange={handleChange} placeholder="Your Brand Co." maxLength={120} />
              </label>
            </div>
          </div>
          {error && <div className="checkout-error" role="alert">{error}</div>}
          <button type="submit" className="checkout-pay-button" disabled={loading}>
            {loading ? "Processing…" : "Continue to payment"}
          </button>
        </div>

        {/* Order Summary */}
        <div className="checkout-card checkout-summary-card">
          <div className="checkout-summary-top">
            <div className="checkout-summary-title-wrap">
              <h2 className="checkout-card-title">Order Summary</h2>
              <span className="checkout-summary-plan">{plan.name}</span>
              <span className="checkout-summary-service">{plan.categoryLabel}</span>
            </div>
            <div className="checkout-summary-price-wrap" aria-label={`Price ${displayPrice} per month`}>
              <span className="checkout-summary-price">{displayPrice}</span>
              <span className="checkout-summary-month">/month</span>
            </div>
          </div>

          <div className="checkout-feature-box">
            <ul className="checkout-feature-list">
              {shownFeatures.map((f, i) => (
                <li key={i}>
                  <svg className="checkout-feature-icon" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="6.5" fill="#246129" />
                    <path d="M3.5 6.7L5.4 8.6L9.5 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {features.length > 5 && <div className="checkout-more-features">+ {features.length - 5} more features</div>}
            {features.length <= 5 && <div className="checkout-more-features">+ 3 more features</div>}
          </div>

          <div className="checkout-costs">
            <div className="checkout-cost-row"><span>Subtotal</span><strong>{displayPrice}</strong></div>
            <div className="checkout-cost-row"><span>Setup Fee</span><strong>$0</strong></div>
            <div className="checkout-total"><span>Total</span><strong>{displayPrice}</strong></div>
          </div>

          <div className="checkout-trust-note">
            Cancel anytime. No hidden fees. First month billed on subscription start.
          </div>
        </div>
      </div>
    </form>
  );
}
