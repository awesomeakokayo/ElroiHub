export type PlanId = string;

export type Plan = {
  id: string; // slug
  name: string;
  priceCents: number; // USD cents
  priceLabel: string; // $100
  originalCents?: number;
  originalLabel?: string;
  description: string;
  category: "ai" | "graphics" | "web" | "combo";
  interval?: "month"; // if subscription
};

// Single source of truth — matches PricingView.tsx but normalized to cents (USD)
// Add or edit here and both UI + Stripe will stay in sync
export const PLANS: Plan[] = [
  // AI
  { id: "ai-starter", name: "AI Starter", priceCents: 10000, priceLabel: "$100", description: "AI consultation, basic AI tool setup, prompt systems, workflow recommendations", category: "ai" },
  { id: "ai-growth", name: "AI Growth", priceCents: 25000, priceLabel: "$250", description: "AI automation for 1–2 business processes, custom prompt systems, AI tool integration, training", category: "ai" },
  { id: "ai-pro", name: "AI Pro", priceCents: 50000, priceLabel: "$500", description: "Advanced AI automation, multiple workflow integrations, custom AI systems, implementation & support", category: "ai" },
  { id: "ai-enterprise", name: "AI Enterprise", priceCents: 100000, priceLabel: "$1,000", description: "Fully customized AI solutions, advanced automation, integrations & ongoing support.", category: "ai" },
  // Graphics
  { id: "graphics-basic", name: "Basic", priceCents: 5000, priceLabel: "$50", description: "5 social media designs", category: "graphics" },
  { id: "graphics-standard", name: "Standard", priceCents: 10000, priceLabel: "$100", description: "12 social media designs", category: "graphics" },
  { id: "graphics-premium", name: "Premium", priceCents: 20000, priceLabel: "$200", description: "20 social media designs + 5 promotional designs + basic brand graphics", category: "graphics" },
  { id: "graphics-brand", name: "Brand Identity", priceCents: 30000, priceLabel: "$300", description: "Logo, color palette, typography, brand guidelines & social media assets", category: "graphics" },
  // Web
  { id: "web-landing", name: "Landing Page", priceCents: 15000, priceLabel: "$150", description: "1-page professional website", category: "web" },
  { id: "web-business", name: "Business Website", priceCents: 30000, priceLabel: "$300", description: "4–6 pages, responsive design & contact forms", category: "web" },
  { id: "web-pro", name: "Professional Website", priceCents: 50000, priceLabel: "$500", description: "6–10 pages, advanced features & integrations", category: "web" },
  { id: "web-ecommerce", name: "E-Commerce Website", priceCents: 80000, priceLabel: "$800", description: "Online store, product pages, cart, checkout & payment integration", category: "web" },
  { id: "web-custom", name: "Custom Web Application", priceCents: 150000, priceLabel: "$1,500", description: "Customized web-based systems & advanced functionality", category: "web" },
  // Combo — total after 15% off, original is pre-discount
  { id: "combo-starter", name: "Starter Combo", priceCents: 25500, priceLabel: "$255", originalCents: 30000, originalLabel: "$300", description: "AI Starter\nGraphics Basic\nLanding Page", category: "combo" },
  { id: "combo-growth", name: "Growth Combo", priceCents: 59500, priceLabel: "$595", originalCents: 70000, originalLabel: "$700", description: "AI Growth\nGraphics Standard\nBusiness Website", category: "combo" },
  { id: "combo-premium", name: "Premium Combo", priceCents: 110500, priceLabel: "$1,105", originalCents: 130000, originalLabel: "$1,300", description: "AI Pro\nGraphics Premium\nProfessional Website", category: "combo" },
  { id: "combo-business", name: "Business Combo", priceCents: 195500, priceLabel: "$1,955", originalCents: 230000, originalLabel: "$2,300", description: "AI Enterprise\nBrand Identity\nE-Commerce Website", category: "combo" },
];

const byName = new Map(PLANS.map(p => [p.name.toLowerCase(), p]));
const byId = new Map(PLANS.map(p => [p.id, p]));

export function getPlanByName(name: string): Plan | undefined {
  return byName.get(name.toLowerCase());
}
export function getPlanById(id: string): Plan | undefined {
  return byId.get(id);
}
export function getPlan(query: string): Plan | undefined {
  return getPlanById(query) || getPlanByName(query);
}

export function formatUSD(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(cents / 100);
}
export function formatUSDPrecise(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
