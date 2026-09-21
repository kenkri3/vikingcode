"use client";

import React, { useState } from "react";
import { Sparkles, ArrowUp, Plus, Brain, LayoutDashboard, Calendar, Globe, ShoppingBag } from "lucide-react";
import { VikingLogo } from "./VikingLogo";

interface StartScreenProps {
  onStartBuilding: (prompt: string) => void;
  isLoading: boolean;
}

export function StartScreen({ onStartBuilding, isLoading }: StartScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Gemini 3.8 Flash High");

  const starterTemplates = [
    {
      title: "Bookingportal for håndverkere",
      brand: "VikingMester",
      description: "Interaktiv priskalkulator, befaring-kalender og TEK17 garantimodul.",
      prompt: "Bygg en komplett bookingportal for håndverkere med priskalkulator, befaring-kalender, og kontaktskjema for VikingMester.",
      icon: Calendar,
    },
    {
      title: "SaaS Analyse Dashboard",
      brand: "VikingCRM",
      description: "MRR-metrikker, kundetilsig, lead-pipeline og fakturaoversikt.",
      prompt: "Lag et moderne SaaS-dashboard med sanntids analyse av månedlig omsetning (MRR), kundevekst og konverteringsrater for VikingCRM.",
      icon: LayoutDashboard,
    },
    {
      title: "Landingsside for Bedrifter",
      brand: "VikingNet",
      description: "Konverteringsoptimalisert side med Trustpilot, kontaktskjema og CTA.",
      prompt: "Bygg en ultrarask og konverteringsoptimalisert landingsside for norske bedrifter med kontaktskjema og anmeldelser for VikingNet.",
      icon: Globe,
    },
    {
      title: "Lokal E-handelsløsning",
      brand: "AI Program",
      description: "Vareoversikt med Vipps-kasse og automatisk ordrebekreftelse.",
      prompt: "Lag en lettbent e-handelsløsning for lokale håndverksprodukter med Vipps-betaling og automatisk ordrebekreftelse.",
      icon: ShoppingBag,
    },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onStartBuilding(prompt);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-3.5rem)] max-w-4xl mx-auto select-none">
      {/* Centered Heading (ChatGPT style) */}
      <div className="text-center mb-8 space-y-3">
        <div className="flex justify-center mb-2">
          <VikingLogo size={48} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          Hva vil du bygge i dag?
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
          Beskriv programvaren eller nettsiden på valgfritt språk. AIProgram.no genererer produksjonsklar kildekode, live forhåndsvisning og distribusjon på sekunder.
        </p>
      </div>

      {/* Spacious Central Prompt Box (Gemini & ChatGPT style) */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#12161F] border border-[#1F2937] focus-within:border-[#7C3AED] focus-within:shadow-[0_0_30px_-5px_rgba(124,58,237,0.35)] rounded-2xl p-3 sm:p-4 mb-8 transition-all"
      >
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Spør om hva som helst... f.eks. 'Lag en bookingportal for rørleggere med priskalkulator og SMS-varsling'"
          className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none resize-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]/70">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A212E] transition"
              title="Legg til vedlegg"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Reasoning Pill (ChatGPT "Tenk" style) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A0D12] border border-[#1F2937] text-[11px] text-slate-300 font-medium">
              <Brain className="w-3 h-3 text-[#A78BFA]" />
              <span>Autonom Agent</span>
            </div>

            {/* Model picker */}
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {selectedModel}
            </span>
          </div>

          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className={`p-2 rounded-xl transition flex items-center justify-center ${
              prompt.trim() && !isLoading
                ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-900/40 cursor-pointer"
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Quick starter templates */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Raske snarveier for Viking-økosystemet
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {starterTemplates.map((tmpl) => {
            const IconComponent = tmpl.icon;
            return (
              <button
                key={tmpl.title}
                onClick={() => onStartBuilding(tmpl.prompt)}
                className="p-4 rounded-xl bg-[#12161F]/70 hover:bg-[#161C27] border border-[#1F2937] hover:border-[#7C3AED]/60 text-left transition group shadow-sm"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-[#A78BFA] group-hover:text-purple-300 transition" />
                    <span className="text-xs font-bold text-white group-hover:text-[#C4B5FD] transition">
                      {tmpl.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 bg-[#0A0D12] px-2 py-0.5 rounded border border-slate-800">
                    {tmpl.brand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {tmpl.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
