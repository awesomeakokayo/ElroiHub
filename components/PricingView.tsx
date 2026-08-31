"use client";

import { useState } from "react";
import Link from "next/link";

const data = {
  ai: [
    ["AI Starter", "$100", "AI consultation, basic AI tool setup, prompt systems, workflow recommendations"],
    ["AI Growth", "$250", "AI automation for 1–2 business processes, custom prompt systems, AI tool integration, training"],
    ["AI Pro", "$500", "Advanced AI automation, multiple workflow integrations, custom AI systems, implementation & support"],
    ["AI Enterprise", "$1000+", "Fully customized AI solutions, advanced automation, integrations & ongoing support."],
  ],
  graphics: [
    ["Basic", "$50", "5 social media designs"],
    ["Standard", "$100", "12 social media designs"],
    ["Premium", "$200", "20 social media designs + 5 promotional designs + basic brand graphics"],
    ["Brand Identity", "$300", "Logo, color palette, typography, brand guidelines & social media assets"],
  ],
  web: [
    ["Landing Page", "$150", "1-page professional website"],
    ["Business Website", "$300", "4–6 pages, responsive design & contact forms"],
    ["Professional Website", "$500", "6–10 pages, advanced features & integrations"],
    ["E-Commerce Website", "$800", "Online store, product pages, cart, checkout & payment integration"],
    ["Custom Web Application", "$1500+", "Customized web-based systems & advanced functionality"],
  ],
  combo: [
    ["Starter Combo", "$255", "AI Starter + Graphics Basic + Landing Page"],
    ["Growth Combo", "$595", "AI Growth + Graphics Standard + Business Website"],
    ["Premium Combo", "$1,105", "AI Pro + Graphics Premium + Professional Website"],
    ["Business Combo", "$1,955", "AI Enterprise + Brand Identity + E-Commerce Website"],
  ],
} as const;

const tabs = [
  ["ai", "AI SERVICES"],
  ["graphics", "GRAPHICS DESIGN"],
  ["web", "WEB DEVELOPMENT"],
  ["combo", "COMBO PACKAGES"],
] as const;

export default function PricingView() {
  const [tab, setTab] = useState<keyof typeof data>("ai");

  return (
    <div>
      <div className="pricing-tabs" role="tablist" aria-label="Services pricing">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? "active" : ""}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="pricing-description">
        Automate processes, integrate AI tools, and build custom AI workflows for your business.
      </p>

      {tab === "combo" && (
        <p className="promo">
          Limited-time promo pricing. Bundle AI + Graphic Design + Web Development and save up to 15%.
        </p>
      )}

      <div className="pricing-grid">
        {data[tab].map(([name, price, desc]) => (
          <article className="price-card" key={name}>
            <div className="price-top">
              <span className="pill">{name}</span>
              <span className="price">{price}</span>
            </div>
            <p>{desc}</p>
            <Link href={`/schedule?package=${encodeURIComponent(name)}`} className="price-btn">
              Get Started
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
