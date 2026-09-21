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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0A0D12] border border-[#1F2937] rounded-2xl shadow-2xl p-6 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#12161F] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/50 text-xs font-semibold text-[#C4B5FD]">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            AI Program Planer & Abonnement
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Velg pakken tilpasset din byggetakt
          </h2>
          <p className="text-sm text-slate-400">
            Koden eksporteres direkte til ditt eget GitHub-repo og distribueres på din egen Railway-konto. Du eier all kode 100 %.
          </p>
        </div>

        {/* Current status pill */}
        <div className="mb-6 p-4 rounded-xl bg-[#12161F] border border-[#1F2937] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-700/50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Nåværende aktiv konto:</p>
              <p className="text-sm font-bold text-white flex items-center gap-2">
                {user.plan === "TRIAL" ? "Prøveperiode (Gratis)" : `AI ${user.plan}`}
                <span className="text-xs font-normal text-slate-400">
                  ({user.tokensRemaining.toLocaleString("no-NO")} tokens gjenstår)
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleChooseTopUp}
            disabled={loadingTier === "TOPUP"}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9061F9] hover:from-[#6D28D9] hover:to-[#7C3AED] text-xs font-bold text-white shadow-lg shadow-purple-900/30 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            {loadingTier === "TOPUP" ? "Kobler til Stripe..." : "Kjøp påfyll (199 kr / 250k tokens)"}
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => {
            const plan = PLAN_CONFIGS[tier];
            const isCurrent = user.plan === tier;
            const isPopular = tier === "PRO";

            return (
              <div
                key={tier}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                  isPopular
                    ? "bg-[#12161F] border-[#7C3AED] shadow-xl shadow-purple-950/40 ring-1 ring-[#7C3AED]"
                    : "bg-[#0E121A] border-[#1F2937] hover:border-slate-700"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#7C3AED] text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
                    Mest Populær
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    {tier === "MESTER" && <Crown className="w-4 h-4 text-amber-400" />}
                  </div>

                  <div className="mb-4">
                    <span className="text-2xl font-extrabold text-white">
                      {plan.priceMonthly === 0 ? "0 kr" : `${plan.priceMonthly} kr`}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/ mnd</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#0A0D12] border border-[#1F2937] mb-4">
                    <p className="text-[11px] text-slate-400">Inkludert kvote:</p>
                    <p className="text-xs font-bold text-[#C4B5FD] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#A78BFA]" />
                      {plan.tokensPerMonth.toLocaleString("no-NO")} tokens
                    </p>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 mb-6">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleChoosePlan(tier)}
                    disabled={isCurrent || loadingTier === tier}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                      isCurrent
                        ? "bg-slate-800 text-slate-400 cursor-default"
                        : isPopular
                        ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-900/40"
                        : "bg-[#181E2B] hover:bg-[#1F2937] text-white border border-[#1F2937]"
                    }`}
                  >
                    {isCurrent
                      ? "Nåværende pakke"
                      : loadingTier === tier
                      ? "Kobler til Stripe..."
                      : `Velg ${plan.name}`}
                    {!isCurrent && loadingTier !== tier && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-[#1F2937] text-center text-xs text-slate-500">
          Alle priser eks. mva. Sikker betaling via Stripe. Hosting og database driftes på din egen Railway-konto for full autonomi og kontroll.
        </div>
      </div>
    </div>
  );
}
