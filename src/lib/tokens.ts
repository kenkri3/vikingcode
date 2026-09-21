import { PlanConfig, PlanTier, UserSession } from "./types";

export const PLAN_CONFIGS: Record<PlanTier, PlanConfig> = {
  TRIAL: {
    name: "Prøveperiode",
    displayName: "AI Trial",
    tier: "TRIAL",
    priceMonthly: 0,
    tokensPerMonth: 50000,
    maxTrialPrompts: 3,
    features: [
      "50 000 tokens inkludert",
      "Maks 3 genereringer",
      "Full tilgang til Live Preview sandbox",
      "Kodeeditor med syntaksfremheving",
      "Eksport til GitHub og Railway er låst",
    ],
    allowsZipExport: false,
    allowsGithubExport: false,
    allowsRailwayDeploy: false,
    hasPostgres: false,
  },
  STARTER: {
    name: "Starter",
    displayName: "AI Starter",
    tier: "STARTER",
    priceMonthly: 490,
    tokensPerMonth: 500000,
    features: [
      "500 000 tokens / mnd",
      "Ubegrenset antall prompter innenfor kvoten",
      "Last ned fullverdig ZIP-arkiv lokalt",
      "Push til eget GitHub-repo (1 aktivt prosjekt)",
      "Standard genereringshastighet",
    ],
    allowsZipExport: true,
    allowsGithubExport: true,
    allowsRailwayDeploy: false,
    hasPostgres: false,
  },
  PRO: {
    name: "Pro",
    displayName: "AI Pro",
    tier: "PRO",
    priceMonthly: 990,
    tokensPerMonth: 1500000,
    features: [
      "1 500 000 tokens / mnd",
      "1-klikks Railway Template (til kundens egen konto)",
      "Ferdig konfigurert railway.json og PostgreSQL-skjema",
      "Ubegrenset GitHub & ZIP-eksport",
      "Høyere hastighet og prioriterte noder",
    ],
    allowsZipExport: true,
    allowsGithubExport: true,
    allowsRailwayDeploy: true,
    hasPostgres: true,
  },
  MESTER: {
    name: "Mester",
    displayName: "AI Mester",
    tier: "MESTER",
    priceMonthly: 2490,
    tokensPerMonth: 5000000,
    features: [
      "5 000 000 tokens / mnd (Byrålisens)",
      "Multi-database støtte (PostgreSQL, Redis)",
      "Maksimal prioritet og ultrarask generering",
      "Dedikert webhook og autonom agent-tilgang",
      "Prioritert support fra AI Program-teamet",
    ],
    allowsZipExport: true,
    allowsGithubExport: true,
    allowsRailwayDeploy: true,
    hasPostgres: true,
  },
};

export const TOP_UP_OFFER = {
  tokens: 500000,
  price: 199,
  name: "Top-up Påfylling",
  description: "500 000 ekstra tokens ved tom saldo.",
};

export interface TokenCheckResult {
  allowed: boolean;
  errorCode?: "TRIAL_LIMIT_EXCEEDED" | "INSUFFICIENT_TOKENS" | "ACCOUNT_INACTIVE";
  message?: string;
  tokensRemaining: number;
  trialPromptsUsed: number;
}

export function verifyTokenQuota(user: UserSession): TokenCheckResult {
  if (!user.isActive) {
    return {
      allowed: false,
      errorCode: "ACCOUNT_INACTIVE",
      message: "Kontoen din er deaktivert. Kontakt support@aiprogram.no.",
      tokensRemaining: user.tokensRemaining,
      trialPromptsUsed: user.trialPromptsUsed,
    };
  }

  if (user.plan === "TRIAL") {
    if (user.trialPromptsUsed >= 3) {
      return {
        allowed: false,
        errorCode: "TRIAL_LIMIT_EXCEEDED",
        message: "Du har brukt dine 3 gratis prøvegenereringer. Oppgrader for å fortsette å bygge!",
        tokensRemaining: user.tokensRemaining,
        trialPromptsUsed: user.trialPromptsUsed,
      };
    }
  }

  if (user.tokensRemaining <= 0) {
    return {
      allowed: false,
      errorCode: "INSUFFICIENT_TOKENS",
      message: "Du har brukt opp dine tilgjengelige tokens. Fyll på eller oppgrader pakken din!",
      tokensRemaining: 0,
      trialPromptsUsed: user.trialPromptsUsed,
    };
  }

  return {
    allowed: true,
    tokensRemaining: user.tokensRemaining,
    trialPromptsUsed: user.trialPromptsUsed,
  };
}

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 3.5);
}
