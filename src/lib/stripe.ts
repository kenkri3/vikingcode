/**
 * 💳 Stripe integrasjon for AIProgram.no (NOK eks. mva / B2B)
 */

function getStripeInstance() {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    return null;
  }
  try {
    // Dynamic require so Next.js build never fails if stripe is not installed locally
    const req = eval("require");
    const StripeClass = req("stripe");
    return new StripeClass(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia" as any,
      appInfo: {
        name: "AIProgram.no",
        version: "1.0.0",
      },
    });
  } catch {
    return null;
  }
}

export const stripe: any = getStripeInstance();

export const isStripeConfigured = () => {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_") && stripe);
};

export interface StripeProductTier {
  id: string;
  name: string;
  priceNok: number; // I kroner
  priceOre: number; // I øre (Stripe standard)
  tokens: number;
  interval: "month" | "one_time";
  description: string;
}

export const STRIPE_TIERS: Record<string, StripeProductTier> = {
  STARTER: {
    id: "STARTER",
    name: "Starter",
    priceNok: 490,
    priceOre: 49000,
    tokens: 500000,
    interval: "month",
    description: "500 000 tokens per måned, full tilgang til live sandkasse og eksport til GitHub.",
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    priceNok: 990,
    priceOre: 99000,
    tokens: 1500000,
    interval: "month",
    description: "1 500 000 tokens per måned, 1-klikks Railway distribusjon og ubegrenset prosjektstørrelse.",
  },
  MESTER: {
    id: "MESTER",
    name: "Mester",
    priceNok: 2490,
    priceOre: 249000,
    tokens: 5000000,
    interval: "month",
    description: "5 000 000 tokens per måned, dedikert AI-arkitekt og prioritert prosessering.",
  },
  TOPUP_250K: {
    id: "TOPUP_250K",
    name: "Token Påfyll (250k)",
    priceNok: 199,
    priceOre: 19900,
    tokens: 250000,
    interval: "one_time",
    description: "Engangspåfyll av 250 000 tokens som legges direkte til din eksisterende saldo.",
  },
};
