"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  ArrowUp,
  Brain,
  LayoutDashboard,
  Calendar,
  Globe,
  ShoppingBag,
  Image as ImageIcon,
  Loader2,
  X,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { VikingLogo } from "./VikingLogo";

interface StartScreenProps {
  onStartBuilding: (prompt: string) => void;
  isLoading: boolean;
}

export function StartScreen({ onStartBuilding, isLoading }: StartScreenProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("AI Program Ultra");

  // Re-imagine from URL state
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);

  // Add Image state
  const [attachedImage, setAttachedImage] = useState<{ name: string; dataUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const starterTemplates = [
    {
      title: "Bookingportal for Tjenesteytere",
      brand: "Booking & Tjenester",
      description: "Interaktiv priskalkulator, timebestilling-kalender og kontaktskjema.",
      prompt: "Bygg en komplett bookingportal med interaktiv priskalkulator, kalender for timebestilling og responsivt kontaktskjema.",
      icon: Calendar,
    },
    {
      title: "SaaS Analyse Dashboard",
      brand: "SaaS / Cloud",
      description: "MRR-metrikker, aktivitet, pipeline og interaktive grafer.",
      prompt: "Lag et moderne SaaS-dashboard med sanntids analyse av månedlig omsetning (MRR), brukergrafer og ren metrikkoversikt.",
      icon: LayoutDashboard,
    },
    {
      title: "Moderne Bedriftsnettside",
      brand: "Bedrift & Konsulent",
      description: "Konverteringsoptimalisert side med team, anmeldelser og kontaktskjema.",
      prompt: "Bygg en moderne og elegant nettside for min bedrift med tjenestekort, referanser, FAQ og kontaktskjema.",
      icon: Globe,
    },
    {
      title: "E-handel & Butikk",
      brand: "Nettbutikk",
      description: "Varekatalog, handlekurv-skuff og Vipps hurtigbetaling.",
      prompt: "Lag en moderne nettbutikk med produktkatalog, filtere, interaktiv handlekurv og Vipps hurtigkasse.",
      icon: ShoppingBag,
    },
  ];

  // Handle URL Scrape & Re-imagine
  const handleScrapeUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isScrapingUrl) return;

    setIsScrapingUrl(true);
    setUrlError("");

    try {
      const res = await fetch("/api/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kunne ikke hente nettsiden");
      }

      setAttachedUrl(data.url);
      setPrompt(data.suggestedPrompt || `Gjenskap og moderniser nettsiden for ${data.brandName || data.title} (${data.url}).`);
      setIsUrlModalOpen(false);
      setInputUrl("");
    } catch (err: any) {
      setUrlError(err.message || "Kunne ikke analysere URL-en. Vennligst sjekk adressen.");
    } finally {
      setIsScrapingUrl(false);
    }
  };

  // Handle Image Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        name: file.name,
        dataUrl: reader.result as string,
      });
      if (!prompt.trim()) {
        setPrompt("Gjenskap designet og oppsettet fra det vedlagte skjermbildet som en responsiv, moderne webapplikasjon.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    let finalPrompt = prompt.trim();
    if (attachedUrl && !finalPrompt.includes(attachedUrl)) {
      finalPrompt += `\n[Mål-URL for gjenskaping: ${attachedUrl}]`;
    }
    if (attachedImage) {
      finalPrompt += `\n[Skjermbilde vedlagt: Gjenskap det visuelle uttrykket fra ${attachedImage.name}]`;
    }

    onStartBuilding(finalPrompt);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 min-h-[calc(100vh-3.5rem-3.5rem)] md:min-h-[calc(100vh-3.5rem)] max-w-4xl mx-auto select-none overflow-y-auto pb-20 md:pb-6">
      {/* Centered Heading */}
      <div className="text-center mb-5 sm:mb-8 space-y-2 sm:space-y-3 pt-2 sm:pt-0">
        <div className="flex justify-center mb-1 sm:mb-2">
          <VikingLogo size={42} />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
          Hva vil du bygge i dag?
        </h1>
        <p className="text-xs sm:text-base text-slate-400 max-w-lg mx-auto">
          Beskriv hva du vil bygge med ren tekst, gjenskap fra en eksisterende URL, eller last opp et skjermbilde.
        </p>
      </div>

      {/* Hidden File Input for Add Image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Spacious Central Prompt Box (Gemini & ChatGPT style with Image 1 Buttons) */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#12161F] border border-[#1F2937] focus-within:border-[#7C3AED] focus-within:shadow-[0_0_30px_-5px_rgba(124,58,237,0.35)] rounded-2xl p-3.5 sm:p-4 mb-8 transition-all space-y-3"
      >
        {/* Attached context badges (URL / Image) */}
        {(attachedUrl || attachedImage) && (
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {attachedUrl && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/50 text-purple-300 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate max-w-[200px]">{attachedUrl}</span>
                <button
                  type="button"
                  onClick={() => setAttachedUrl(null)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Fjern URL"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {attachedImage && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-xs font-medium">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[160px]">{attachedImage.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachedImage(null)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="Fjern bilde"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prompt Input Textarea */}
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
          placeholder="Describe the page you want to build... (f.eks. 'Lag en luksuriøs nettside for et arkitektkontor med prosjektgalleri og kontaktskjema')"
          className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none resize-none leading-relaxed font-sans"
        />

        {/* Action Toolbar Inside Box: [ Re-imagine from URL ] [ Add Image ] (Exact Image 1) */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F2937]/70">
          <div className="flex items-center gap-2">
            {/* Pill 1: Re-imagine from URL (Exact Image 1) */}
            <button
              type="button"
              onClick={() => setIsUrlModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b202c] hover:bg-[#252c3c] border border-[#2d3748] text-xs font-medium text-slate-200 hover:text-white transition shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Re-imagine from URL</span>
            </button>

            {/* Pill 2: Add Image (Exact Image 1) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1b202c] hover:bg-[#252c3c] border border-[#2d3748] text-xs font-medium text-slate-200 hover:text-white transition shadow-sm cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Add Image</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {selectedModel}
            </span>

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
        </div>
      </form>

      {/* Modal: Re-imagine from URL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161822] border border-[#2b3348] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242b3d]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Re-imagine from URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#242b3d] transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Lim inn URL-en til en eksisterende nettside. AI-agenten henter merkevaren, tjenestene og innholdet automatisk, og gjenskaper en moderne, luksuriøs versjon for deg.
            </p>

            <form onSubmit={handleScrapeUrlSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Nettadresse (URL):
                </label>
                <div className="flex items-center gap-2 bg-[#0e1017] border border-[#2d3748] focus-within:border-purple-500 rounded-xl px-3 py-2 text-xs">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://bedrift.no eller blomsterbutikk.no"
                    className="bg-transparent text-white outline-none w-full font-sans"
                    autoFocus
                  />
                </div>
                {urlError && (
                  <p className="text-[11px] text-rose-400 mt-1">{urlError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-[#202534] hover:bg-[#283042] text-xs text-slate-300 hover:text-white transition"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={!inputUrl.trim() || isScrapingUrl}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-lg shadow-purple-950/50"
                >
                  {isScrapingUrl ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyserer nettside...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Hent og Gjenskap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="p-4 rounded-xl bg-[#12161F]/70 hover:bg-[#161C27] border border-[#1F2937] hover:border-[#7C3AED]/60 text-left transition group shadow-sm cursor-pointer"
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
