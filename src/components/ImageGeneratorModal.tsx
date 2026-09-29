"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  Wand2,
  RefreshCw,
  Compass,
} from "lucide-react";

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertImage?: (url: string) => void;
}

export function ImageGeneratorModal({
  isOpen,
  onClose,
  onInsertImage,
}: ImageGeneratorModalProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");
  const [category, setCategory] = useState<string>("frisor");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    url: string;
    source: "1min.ai" | "unsplash";
    model?: string;
    prompt: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (forceAi = true) => {
    if (!prompt.trim() && !category) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim() || `Bilde for ${category}`,
          category,
          aspectRatio,
          forceAi,
        }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setGeneratedResult({
          url: data.url,
          source: data.source,
          model: data.model,
          prompt: data.prompt,
        });
      } else {
        setErrorMessage(data.error || "Kunne ikke generere bilde.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Feil under generering av bilde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult?.url) return;
    navigator.clipboard.writeText(generatedResult.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "Frisør / Salong", prompt: "Modern minimalist Scandinavian hair salon interior, warm oak details, soft natural lighting", cat: "frisor" },
    { label: "Håndverker / Snekker", prompt: "Master carpenter building custom wooden terrace, Scandinavian architecture, high resolution", cat: "handverker" },
    { label: "Restaurant / Kafe", prompt: "Cozy Nordic restaurant interior, artisan plated food, warm ambient lighting", cat: "restaurant" },
    { label: "Tannlege / Klinikk", prompt: "Modern bright medical clinic, welcoming reception, calming clean Scandinavian aesthetic", cat: "helse" },
    { label: "Tech / SaaS", prompt: "Modern software dashboard workstation with sleek laptop and subtle dark theme lighting", cat: "tech" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#14141a] border border-[#2a2a36] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22222e] bg-[#181822]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-950/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>AI Bildegenerator</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
                  1min.AI & Unsplash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Generer unike bilder med Flux Schnell eller hent kuraterte høyoppløselige bilder
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#252532] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">
              Hurtigforslag for bransjer:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(p.prompt);
                    setCategory(p.cat);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#1f1f2a] hover:bg-[#2a2a3a] border border-[#2e2e3e] text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Beskrivelse av bildet (Prompt):
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="F.eks. Skandinavisk frisørsalong med store speil, lyst eiketre og varme toner..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#0e0e13] border border-[#2a2a36] rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition resize-none"
            />
          </div>

          {/* Controls: Aspect Ratio */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                Format / Størrelsesforhold:
              </label>
              <div className="flex items-center gap-1.5 bg-[#0e0e13] p-1 rounded-xl border border-[#262634]">
                {(["16:9", "1:1", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                      aspectRatio === ratio
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {ratio === "16:9" ? "16:9 Liggende" : ratio === "1:1" ? "1:1 Kvadrat" : "9:16 Stående"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end">
              <button
                type="button"
                disabled={isLoading || (!prompt.trim() && !category)}
                onClick={() => handleGenerate(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-purple-950/40"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Genererer med 1min.AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generer AI-bilde (Flux Schnell)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleGenerate(false)}
                className="px-3.5 py-2 rounded-xl bg-[#22222e] hover:bg-[#2c2c3c] text-slate-300 hover:text-white text-xs font-medium border border-[#343446] transition cursor-pointer"
                title="Hent kuratert høyoppløselig bilde fra Unsplash umiddelbart"
              >
                Hent fra Unsplash
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {/* Result Card */}
          {generatedResult && (
            <div className="p-4 rounded-xl bg-[#0c0c10] border border-[#262634] space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Generert bilde</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                    {generatedResult.source === "1min.ai" ? "1min.AI (Flux Schnell)" : "Unsplash CDN"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded-lg bg-[#1f1f2a] hover:bg-[#282836] border border-[#2e2e3e] text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Kopiert URL!" : "Kopier URL"}</span>
                  </button>
                  {onInsertImage && (
                    <button
                      type="button"
                      onClick={() => {
                        onInsertImage(generatedResult.url);
                        onClose();
                      }}
                      className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-medium text-white transition cursor-pointer shadow-sm"
                    >
                      Bruk i prosjekt
                    </button>
                  )}
                </div>
              </div>

              <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black/40 border border-[#1f1f28]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={generatedResult.url}
                  alt={generatedResult.prompt}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-[11px] text-slate-400 font-mono truncate">
                {generatedResult.url}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#22222e] bg-[#111116] flex items-center justify-between text-xs text-slate-400">
          <span>Støtter 1min.AI API med modellen Flux Schnell via miljøvariabelen <code>1_MIN_AI</code>.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#22222c] hover:bg-[#2b2b38] text-slate-300 hover:text-white transition cursor-pointer"
          >
            Lukk
          </button>
        </div>
      </div>
    </div>
  );
}
