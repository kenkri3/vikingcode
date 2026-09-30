"use client";

import React, { useState } from "react";
import { PLAN_CONFIGS, TOP_UP_OFFER } from "@/lib/tokens";
import { PlanTier, UserSession } from "@/lib/types";
import { Check, Zap, Sparkles, X, Shield, Lock, Crown, ArrowRight, ExternalLink } from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  onSelectPlan: (tier: PlanTier) => void;
  onTopUp: () => void;
}

export function PricingModal({
  isOpen,
  onClose,
  user,
  onSelectPlan,
  onTopUp,
}: PricingModalProps) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  if (!isOpen) return null;

  const tiers: PlanTier[] = ["TRIAL", "STARTER", "PRO", "MESTER"];

  const handleChoosePlan = async (tier: PlanTier) => {
    if (tier === "TRIAL") {
      onSelectPlan(tier);
      onClose();
      return;
    }

    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        onSelectPlan(tier);
        onClose();
      }
    } catch {
      onSelectPlan(tier);
      onClose();
    } finally {
      setLoadingTier(null);
    }
  };

  const handleChooseTopUp = async () => {
    setLoadingTier("TOPUP");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTopup: true }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        onTopUp();
        onClose();
      }
    } catch {
      onTopUp();
      onClose();
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl xl:max-w-7xl max-h-[94vh] overflow-y-auto bg-[#0A0D14] border border-[#222838] rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-6 sm:p-10 lg:p-12 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-[#151A26] transition cursor-pointer"
          title="Lukk"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-700/60 text-sm font-semibold text-[#D8B4FE]">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            AI Program Planer & Abonnement
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Velg pakken tilpasset din byggetakt
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Koden eksporteres direkte til ditt eget GitHub-repo og distribueres på din egen Railway-konto. Du eier all kode 100 %.
          </p>
        </div>

        {/* Current status banner */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#121622] border border-[#232B3E] flex flex-wrap items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/50 border border-purple-600/50 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Nåværende aktiv konto:</p>
              <div className="flex flex-wrap items-center gap-2.5 mt-0.5">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {user.plan === "TRIAL" ? "Prøveperiode (Gratis)" : `AI ${user.plan}`}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#A78BFA] bg-purple-950/60 px-3 py-0.5 rounded-full border border-purple-800/40">
                  {user.tokensRemaining.toLocaleString("no-NO")} tokens gjenstår
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleChooseTopUp}
            disabled={loadingTier === "TOPUP"}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9061F9] hover:from-[#6D28D9] hover:to-[#7C3AED] text-sm sm:text-base font-bold text-white shadow-xl shadow-purple-950/50 flex items-center gap-2 transition hover:scale-[1.02] disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-5 h-5 text-white" />
            <span>{loadingTier === "TOPUP" ? "Kobler til Stripe..." : "Kjøp påfyll (199 kr / 250k tokens)"}</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const plan = PLAN_CONFIGS[tier];
            const isCurrent = user.plan === tier;
            const isPopular = tier === "PRO";

            return (
              <div
                key={tier}
                className={`relative flex flex-col justify-between p-6 sm:p-7 rounded-3xl border transition-all ${
                  isPopular
                    ? "bg-[#141926] border-[#7C3AED] shadow-2xl shadow-purple-950/60 ring-2 ring-[#7C3AED]/70 lg:scale-[1.03]"
                    : "bg-[#0E121B] border-[#22293A] hover:border-slate-600 shadow-xl"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-xs font-black tracking-wider uppercase text-white shadow-lg shadow-purple-950/80">
                    Mest Populær
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{plan.name}</h3>
                    {tier === "MESTER" && <Crown className="w-6 h-6 text-amber-400" />}
                  </div>

                  <div className="mb-5 flex items-baseline">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {plan.priceMonthly === 0 ? "0 kr" : `${plan.priceMonthly} kr`}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-400 ml-2">/ mnd</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#080A10] border border-[#1F2636] mb-5">
                    <p className="text-xs sm:text-sm font-medium text-slate-400">Inkludert kvote:</p>
                    <p className="text-sm sm:text-base font-bold text-[#D8B4FE] flex items-center gap-1.5 mt-0.5">
                      <Zap className="w-4 h-4 text-[#A78BFA]" />
                      {plan.tokensPerMonth.toLocaleString("no-NO")} tokens
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm sm:text-[15px] text-slate-200 mb-8 leading-snug">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4.5 h-4.5 text-[#A78BFA] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleChoosePlan(tier)}
                    disabled={isCurrent || loadingTier === tier}
                    className={`w-full py-3.5 px-5 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      isCurrent
                        ? "bg-slate-800/80 text-slate-400 cursor-default border border-slate-700/50"
                        : isPopular
                        ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xl shadow-purple-950/60 hover:scale-[1.02]"
                        : "bg-[#181F2E] hover:bg-[#222B3F] text-white border border-[#2B354C] hover:scale-[1.02]"
                    }`}
                  >
                    <span>
                      {isCurrent
                        ? "Nåværende pakke"
                        : loadingTier === tier
                        ? "Kobler til Stripe..."
                        : `Velg ${plan.name}`}
                    </span>
                    {!isCurrent && loadingTier !== tier && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-[#1F2636] text-center text-sm sm:text-base text-slate-400 leading-relaxed max-w-4xl mx-auto">
          Alle priser eks. mva. Sikker betaling via Stripe. Hosting og database driftes på din egen Railway-konto for full autonomi og kontroll.
        </div>
      </div>
    </div>
  );
}
