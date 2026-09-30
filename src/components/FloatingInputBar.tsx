"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Mic,
  ArrowUp,
  Square,
  ChevronDown,
  Code2,
  X,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";

interface FloatingInputBarProps {
  onSendMessage: (text: string, model: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  disabled?: boolean;
  projectName?: string;
}

export function FloatingInputBar({
  onSendMessage,
  isLoading,
  onStop,
  disabled = false,
  projectName = "Web Dev",
}: FloatingInputBarProps) {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState("AI Program Ultra");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [hasContextPill, setHasContextPill] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // URL Scraping state
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [isScrapingUrl, setIsScrapingUrl] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [attachedUrl, setAttachedUrl] = useState<string | null>(null);

  // Image attachment state
  const [attachedImage, setAttachedImage] = useState<{ name: string; dataUrl: string } | null>(null);

  const handleSend = () => {
    if (!text.trim() && !attachedUrl && !attachedImage) return;
    if (isLoading || disabled) return;

    let messageToSend = text.trim();
    if (attachedUrl && !messageToSend.includes(attachedUrl)) {
      messageToSend += `\n[Gjenskap fra URL: ${attachedUrl}]`;
    }
    if (attachedImage) {
      messageToSend += `\n[Vedlagt designskjermbilde: ${attachedImage.name}]`;
    }

    const effectiveModel = selectedModel || "AI Program Ultra";
    onSendMessage(messageToSend, effectiveModel);

    setText("");
    setAttachedUrl(null);
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

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
      setText((prev) =>
        prev.trim()
          ? `${prev}\n\n${data.suggestedPrompt}`
          : data.suggestedPrompt || `Gjenskap og moderniser nettsiden for ${data.brandName || data.title} (${data.url}).`
      );
      setIsUrlModalOpen(false);
      setInputUrl("");
    } catch (err: any) {
      setUrlError(err.message || "Kunne ikke analysere URL-en. Vennligst sjekk adressen.");
    } finally {
      setIsScrapingUrl(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedImage({
        name: file.name,
        dataUrl: reader.result as string,
      });
      if (!text.trim()) {
        setText("Gjenskap designet og oppsettet fra det vedlagte skjermbildet.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="p-3 pb-20 md:pb-4 sm:p-4 bg-[#18181c]/95 border-t border-[#26262e] backdrop-blur-md">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      <div className="relative max-w-4xl lg:max-w-5xl mx-auto bg-[#212128] border border-[#2e2e38] focus-within:border-[#424250] rounded-3xl p-3 sm:p-4 transition-all shadow-xl">
        {/* Model dropdown overlay */}
        {modelDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setModelDropdownOpen(false)}
            />
            <div className="absolute bottom-full right-3 mb-2 w-64 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                Aktiv AI Modell
              </p>
              <div className="w-full flex flex-col items-start px-2.5 py-2 rounded-lg bg-[#2c2c36] text-white">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-xs text-white">AI Program Ultra</span>
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Autonom kodebygger og avansert resonnering
                </span>
              </div>
            </div>
          </>
        )}

        {/* Attached Badges (URL or Image) */}
        {(attachedUrl || attachedImage) && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2 px-1">
            {attachedUrl && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/50 text-purple-300 text-[11px] font-mono">
                <Globe className="w-3 h-3 text-purple-400 shrink-0" />
                <span className="truncate max-w-[180px]">{attachedUrl}</span>
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-[11px] font-medium">
                <ImageIcon className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[140px]">{attachedImage.name}</span>
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

        {/* Quick Vibe-Action Chips for 1-click micro-edits */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs text-slate-300">
          <span className="text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Raske justeringer:</span>
          </span>
          <button
            type="button"
            onClick={() => onSendMessage("Gjør ikonene mindre og elegante (w-5 h-5)", selectedModel)}
            className="px-2.5 py-1 rounded-full bg-[#181a24] hover:bg-[#232736] border border-[#2b3042] text-xs font-medium transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
          >
            📐 Små ikoner
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Endre fargen til dyp maritim blå", selectedModel)}
            className="px-2.5 py-1 rounded-full bg-[#181a24] hover:bg-[#232736] border border-[#2b3042] text-xs font-medium transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
          >
            🎨 Dyp Blå
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Endre fargen til frisk smaragdgrønn", selectedModel)}
            className="px-2.5 py-1 rounded-full bg-[#181a24] hover:bg-[#232736] border border-[#2b3042] text-xs font-medium transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
          >
            🌿 Smaragdgrønn
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Endre fargen til varm gyllen rav", selectedModel)}
            className="px-2.5 py-1 rounded-full bg-[#181a24] hover:bg-[#232736] border border-[#2b3042] text-xs font-medium transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
          >
            ✨ Varm Rav
          </button>
          <button
            type="button"
            onClick={() => onSendMessage("Optimaliser design og layout for mobilskjermer", selectedModel)}
            className="px-2.5 py-1 rounded-full bg-[#181a24] hover:bg-[#232736] border border-[#2b3042] text-xs font-medium transition shrink-0 whitespace-nowrap cursor-pointer hover:text-white"
          >
            📱 Mobiloptimer
          </button>
        </div>

        {/* Text input area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={adjustHeight}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Describe the page you want to build... / Beskriv hva du vil bygge eller endre..."
          className="w-full bg-transparent text-[15px] sm:text-base text-slate-100 placeholder-slate-400 outline-none resize-none px-2.5 py-1.5 max-h-40 font-sans leading-relaxed"
        />

        {/* Action bar inside input box */}
        <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-[#2a2a34] text-xs sm:text-sm">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Pill 1: Re-imagine from URL (Exact Image 1) */}
            <button
              type="button"
              onClick={() => setIsUrlModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b202c] hover:bg-[#262c3c] border border-[#2d3748] text-xs font-medium text-slate-200 hover:text-white transition cursor-pointer"
              title="Gjenskap nettside fra URL"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Re-imagine from URL</span>
            </button>

            {/* Pill 2: Add Image (Exact Image 1) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b202c] hover:bg-[#262c3c] border border-[#2d3748] text-xs font-medium text-slate-200 hover:text-white transition cursor-pointer"
              title="Legg til skjermbilde / bilde"
            >
              <ImageIcon className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Add Image</span>
            </button>

            {/* Context Tag Pill: [ </> Web Dev  ✕ ] */}
            {hasContextPill && (
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b2536] border border-[#2b3a54] text-purple-300 text-xs font-medium transition select-none">
                <Code2 className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="max-w-[120px] truncate">{projectName || "Web Dev"}</span>
                <button
                  type="button"
                  onClick={() => setHasContextPill(false)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Fjern kontekst"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Model Mode Pill: AI Program Ultra */}
            <button
              type="button"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="h-8 px-3 rounded-full bg-[#2a2a34] hover:bg-[#343442] border border-[#383846] text-xs font-medium text-slate-200 hover:text-white transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 select-none shadow-sm"
            >
              <span className="whitespace-nowrap font-medium text-xs">{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Send or Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center cursor-pointer shadow-md"
                title="Stopp generering"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim() && !attachedUrl && !attachedImage}
                className={`w-8 h-8 rounded-full transition flex items-center justify-center shadow-md ${
                  text.trim() || attachedUrl || attachedImage
                    ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer"
                    : "bg-[#2a2a34] text-slate-500 cursor-not-allowed"
                }`}
                title="Send instruks"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Re-imagine from URL (Portaled to document.body to avoid parent container bounds / clipping) */}
      {isUrlModalOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsUrlModalOpen(false);
          }}
        >
          <div
            className="bg-[#141620] border border-[#2b3348] rounded-2xl w-full max-w-md overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(124,58,237,0.15)] p-6 space-y-4 my-auto relative animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242b3d]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Re-imagine from URL</h3>
                  <p className="text-[10px] text-slate-400">Ekstraher merkevare, innhold og struktur</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUrlModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#202534] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Lim inn URL-en til en eksisterende nettside. AI-agenten henter merkevaren, tjenestene og strukturen automatisk, og gjenskaper en moderne, luksuriøs versjon for deg.
            </p>

            <form onSubmit={handleScrapeUrlSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                  Nettadresse (URL):
                </label>
                <div className="flex items-center gap-2 bg-[#0b0c10] border border-[#2d3748] focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/50 rounded-xl px-3.5 py-2.5 text-xs transition">
                  <LinkIcon className="w-4 h-4 text-purple-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://bedrift.no eller blomsterbutikk.no"
                    className="bg-transparent text-white placeholder-slate-500 outline-none w-full font-sans text-xs"
                    autoFocus
                  />
                </div>
                {urlError && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                    <span>⚠️</span> {urlError}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1e2330]">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c202c] hover:bg-[#262c3c] text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer border border-[#2b3345]"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={!inputUrl.trim() || isScrapingUrl}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-semibold text-white transition flex items-center gap-2 shadow-lg shadow-purple-950/60 cursor-pointer"
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
        </div>,
        document.body
      )}
    </div>
  );
}
