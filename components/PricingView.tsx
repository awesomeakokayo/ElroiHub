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
    ["Starter Combo", "$255", "$300", "AI Starter\nGraphics Basic\nLanding Page"],
    ["Growth Combo", "$595", "$700", "AI Growth\nGraphics Standard\nBusiness Website"],
    ["Premium Combo", "$1,105", "$1,300", "AI Pro\nGraphics Premium\nProfessional Website"],
    ["Business Combo", "$1,955", "$2,300", "AI Enterprise\nBrand Identity\nE-Commerce Website"],
  ],
} as const;

const tabs = [
  ["ai", "AI SERVICES"],
  ["graphics", "GRAPHICS DESIGN"],
  ["web", "WEB DEVELOPEMENT"],
  ["combo", "COMBO PACKAGES"],
] as const;

export default function PricingView() {
  const [tab, setTab] = useState<keyof typeof data>("ai");

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = tabs.map(([k]) => k);
    const idx = keys.indexOf(tab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setTab(keys[(idx + 1) % keys.length] as keyof typeof data);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setTab(keys[(idx - 1 + keys.length) % keys.length] as keyof typeof data);
    }
  };

  const descriptions: Record<keyof typeof data, string> = {
    ai: "Automate processes, integrate AI tools, and build custom AI workflows for your business.",
    graphics: "Professional graphic design, brand identity, and social media content that captures attention.",
    web: "Custom websites, e-commerce platforms, and web applications built for performance and growth.",
    combo: "Bundle AI + Graphic Design + Web Development and save up to 15% with our limited-time combo packages.",
  };

  return (
    <div>
      <div className="pricing-tabs" role="tablist" aria-label="Services pricing" onKeyDown={onKeyDown}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            id={`tab-${key}`}
            className={tab === key ? "active" : ""}
            role="tab"
            aria-selected={tab === key}
            aria-controls={`panel-${key}`}
            tabIndex={tab === key ? 0 : -1}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="pricing-description" id="pricing-desc">
        {descriptions[tab]}
      </p>

      {tab === "combo" && (
        <div className="promo-banner" role="status">
          Limited-time promo pricing. Bundle AI + Graphic Design + Web Development and save up to 15%.
        </div>
      )}

      <div className="pricing-grid" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} aria-describedby="pricing-desc">
        {data[tab].map((entry) => {
          const [name, price, descOrOriginal, maybeDesc] = entry as readonly string[];
          const isCombo = tab === "combo";
          const original = isCombo ? descOrOriginal : undefined;
          const desc = isCombo ? maybeDesc! : descOrOriginal;
          return (
          <article className={`price-card${isCombo ? " combo-card" : ""}`} key={name}>
            <div className="price-top">
              <span className="pill">{name}</span>
              <div className="price-stack">
                {original && <span className="price-original">{original}</span>}
                <span className="price">{price}</span>
              </div>
            </div>
            <p className={isCombo ? "combo-desc" : undefined}>{desc}</p>
            <Link href={`/schedule?package=${encodeURIComponent(name)}`} className="price-btn" aria-label={`Get started with ${name}`}>
              Get Started
            </Link>
          </article>
          );
        })}
      </div>
    </div>
  );
}
