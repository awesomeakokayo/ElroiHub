export type Plan = {
  id: string; // slug
  name: string;
  price: string; // e.g. "$100" or "$1,105"
  priceCents: number;
  category: "ai" | "graphics" | "web" | "combo";
  categoryLabel: string;
  description: string;
  features: string[];
};

function parsePrice(price: string): number {
  const cleaned = price.replace(/[$,]/g, "").replace("+", "");
  const n = parseFloat(cleaned);
  return Math.round(n * 100);
}

const raw = {
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

const labels: Record<string, string> = {
  ai: "AI SERVICES",
  graphics: "GRAPHICS DESIGN",
  web: "WEB DEVELOPEMENT",
  combo: "COMBO PACKAGES",
};

function toFeatures(desc: string): string[] {
  if (desc.includes("\n")) return desc.split("\n");
  if (desc.includes("+")) return desc.split("+").map(s => s.trim()).filter(Boolean);
  // generic split by comma for single description
  return [desc];
}

export const allPlans: Plan[] = Object.entries(raw).flatMap(([cat, entries]) =>
  entries.map((entry) => {
    const e = entry as readonly string[];
    const isCombo = cat === "combo";
    const name = e[0];
    const price = e[1];
    const desc = (isCombo ? (e[3] as string) : (e[2] as string)) || "";
    return {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name,
      price,
      priceCents: parsePrice(price),
      category: cat as Plan["category"],
      categoryLabel: labels[cat],
      description: desc,
      features: toFeatures(desc).slice(0, 5),
    };
  })
);

export function findPlanByName(name: string): Plan | undefined {
  const lower = name.toLowerCase();
  return allPlans.find(p => p.name.toLowerCase() === lower || p.id === lower.replace(/[^a-z0-9]+/g, "-"));
}

export function findPlanById(id: string): Plan | undefined {
  return allPlans.find(p => p.id === id);
}
