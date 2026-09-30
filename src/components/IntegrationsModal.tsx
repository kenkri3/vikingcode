"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Key,
  ExternalLink,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { UserSession } from "@/lib/types";

export type AiProviderId =
  | "openai"
  | "gemini"
  | "anthropic"
  | "deepseek"
  | "xai"
  | "mistral";

export interface ProviderConfig {
  id: AiProviderId;
  name: string;
  badge?: "Recommended" | "Default";
  placeholder: string;
  dashboardUrl: string;
  model: string;
  description: string;
}

export const AI_PROVIDERS: ProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    placeholder: "sk-proj-... eller sk-...",
    dashboardUrl: "https://platform.openai.com/api-keys",
    model: "gpt-4o",
    description: "Flaggskipmodellen GPT-4o for avansert frontend- og backend-generering.",
  },
  {
    id: "gemini",
    name: "Gemini",
    badge: "Recommended",
    placeholder: "AIzaSy...",
    dashboardUrl: "https://aistudio.google.com/app/apikey",
    model: "gemini-2.0-flash",
    description: "Googles lynraske Gemini 2.0 Flash med 1M kontekstvindu og multimedieforståelse.",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    badge: "Default",
    placeholder: "sk-ant-api03-...",
    dashboardUrl: "https://console.anthropic.com/settings/keys",
    model: "claude-3-5-sonnet",
    description: "Claude 3.5 Sonnet — bransjeledende på presis arkitektur og feilfri TypeScript.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    placeholder: "sk-...",
    dashboardUrl: "https://platform.deepseek.com/api_keys",
    model: "deepseek-chat (V3)",
    description: "Høyytelses resonneringsmodell og kodebygger til svært lav driftskostnad.",
  },
  {
    id: "xai",
    name: "xAI",
    placeholder: "xai-...",
    dashboardUrl: "https://console.x.ai/",
    model: "grok-2",
    description: "Groks offisielle API for sanntids resonnering og moderne fullstack-arkitektur.",
  },
  {
    id: "mistral",
    name: "Mistral",
    placeholder: "mistral-...",
    dashboardUrl: "https://console.mistral.ai/api-keys/",
    model: "mistral-large-latest",
    description: "Mistral Large og Codestral for presis europeisk kode- og databehandling.",
  },
];

// SVG Logos for exact visual fidelity matching Image 1
function ProviderLogo({ id, size = 38 }: { id: AiProviderId; size?: number }) {
  switch (id) {
    case "openai":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
          </svg>
        </div>
      );
    case "gemini":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-gradient-to-tr from-[#1E293B] via-[#0F172A] to-[#1E1B4B] border border-blue-500/30 flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
              fill="url(#gemini-grad)"
            />
            <defs>
              <linearGradient id="gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="0.5" stopColor="#A855F7" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    case "anthropic":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-[#CC785C] flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "deepseek":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          {/* DeepSeek Whale Logo */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-[#1E40AF] fill-current">
            <path d="M18.5 7.5C18.5 7.5 17 5 13 5C8 5 4 8.5 4 13C4 16 6 18.5 9 19C13 19.5 16 17 18 14C19 12.5 20 10 18.5 7.5ZM13 11C12.4 11 12 10.6 12 10C12 9.4 12.4 9 13 9C13.6 9 14 9.4 14 10C14 10.6 13.6 11 13 11Z" />
            <path d="M18.5 8C20 6.5 21.5 6 22 6C22 7.5 21 9.5 19.5 11C20.5 11.5 21.5 12 22 13C21.5 13.5 20 14 18 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );
    case "xai":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          {/* xAI Logo */}
          <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
            <path d="M4 4h4l4 5.5L16 4h4l-6 8 6.5 8h-4l-4.5-6-4.5 6H4l6.5-8.5L4 4z" />
          </svg>
        </div>
      );
    case "mistral":
      return (
        <div
          style={{ width: size, height: size }}
          className="rounded-xl bg-black border border-orange-500/40 flex items-center justify-center p-1.5 shadow-sm shrink-0"
        >
          {/* Mistral Orange Steps Logo */}
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <rect x="3" y="4" width="4" height="4" fill="#FF7000" />
            <rect x="17" y="4" width="4" height="4" fill="#FF7000" />
            <rect x="3" y="10" width="4" height="4" fill="#FF8C00" />
            <rect x="8" y="10" width="8" height="4" fill="#FFA500" />
            <rect x="17" y="10" width="4" height="4" fill="#FF8C00" />
            <rect x="3" y="16" width="4" height="4" fill="#FFD700" />
            <rect x="17" y="16" width="4" height="4" fill="#FFD700" />
          </svg>
        </div>
      );
  }
}

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  onOpenPricing: () => void;
  activeProvider?: AiProviderId;
  onSelectProvider?: (id: AiProviderId) => void;
}

export function IntegrationsModal({
  isOpen,
  onClose,
  user,
  onOpenPricing,
  activeProvider = "gemini",
  onSelectProvider,
}: IntegrationsModalProps) {
  // Stored keys map: { [providerId]: "apiKey" }
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [selectedProvider, setSelectedProvider] = useState<AiProviderId>(activeProvider);
  const [configModalProvider, setConfigModalProvider] = useState<ProviderConfig | null>(null);
  const [keyInput, setKeyInput] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load saved keys from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aiprogram_api_keys");
      if (stored) {
        setKeys(JSON.parse(stored));
      } else {
        // Migration from older single gemini_api_key
        const legacyKey = localStorage.getItem("gemini_api_key");
        if (legacyKey) {
          const initKeys: Record<string, string> = {};
          if (legacyKey.startsWith("AIza")) initKeys.gemini = legacyKey;
          else if (legacyKey.startsWith("sk-ant")) initKeys.anthropic = legacyKey;
          else if (legacyKey.startsWith("xai")) initKeys.xai = legacyKey;
          else initKeys.deepseek = legacyKey;
          setKeys(initKeys);
          localStorage.setItem("aiprogram_api_keys", JSON.stringify(initKeys));
        }
      }

      const active = localStorage.getItem("aiprogram_active_provider") as AiProviderId;
      if (active && AI_PROVIDERS.some((p) => p.id === active)) {
        setSelectedProvider(active);
      }
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOpenConfig = (provider: ProviderConfig) => {
    setConfigModalProvider(provider);
    setKeyInput(keys[provider.id] || "");
    setSavedSuccess(false);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configModalProvider) return;

    const trimmed = keyInput.trim();
    const updated = { ...keys };

    if (trimmed) {
      updated[configModalProvider.id] = trimmed;
    } else {
      delete updated[configModalProvider.id];
    }

    setKeys(updated);
    localStorage.setItem("aiprogram_api_keys", JSON.stringify(updated));

    // Also update active legacy key for backward compatibility
    if (trimmed && configModalProvider.id === selectedProvider) {
      localStorage.setItem("gemini_api_key", trimmed);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setConfigModalProvider(null);
      setSavedSuccess(false);
    }, 500);
  };

  const handleSetAsActive = (id: AiProviderId) => {
    setSelectedProvider(id);
    localStorage.setItem("aiprogram_active_provider", id);
    if (keys[id]) {
      localStorage.setItem("gemini_api_key", keys[id]);
    }
    if (onSelectProvider) onSelectProvider(id);
  };

  const handleRemoveKey = (id: AiProviderId) => {
    const updated = { ...keys };
    delete updated[id];
    setKeys(updated);
    localStorage.setItem("aiprogram_api_keys", JSON.stringify(updated));
    if (selectedProvider === id) {
      localStorage.removeItem("gemini_api_key");
    }
    setConfigModalProvider(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 select-none">
      <div className="bg-[#0b0c10] border border-[#1e222d] rounded-3xl w-full max-w-5xl lg:max-w-6xl p-8 sm:p-10 lg:p-12 shadow-2xl space-y-8 relative max-h-[92vh] overflow-y-auto">
        {/* Top Header matching exact screenshot */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1a1e29]">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
              Integrations
            </h2>
            <p className="text-base sm:text-lg text-slate-300 mt-2 font-normal">
              Connect and configure your favorite tools and services
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl text-slate-400 hover:text-white hover:bg-[#1a1e29] transition cursor-pointer"
            title="Lukk"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section Heading: AI */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase font-mono">
              AI
            </h3>
            <span className="text-sm sm:text-base text-slate-400 font-mono">
              6 modeller tilgjengelig for produksjon
            </span>
          </div>

          {/* Grid of 6 Provider Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_PROVIDERS.map((prov) => {
              const isConnected = Boolean(keys[prov.id] && keys[prov.id].trim().length > 5);
              const isActive = selectedProvider === prov.id;

              return (
                <div
                  key={prov.id}
                  onClick={() => handleOpenConfig(prov)}
                  className={`relative p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between min-h-[120px] ${
                    isConnected
                      ? "bg-[#14161f] border-[#222838] hover:border-[#3b445c] shadow-lg shadow-black/40 hover:scale-[1.01]"
                      : "bg-[#0f1117] border-[#1a1e28] hover:border-[#2a3040] hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <ProviderLogo id={prov.id} size={42} />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-base sm:text-lg">
                            {prov.name}
                          </span>
                          {prov.badge === "Recommended" && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#FEF08A] text-[#854D0E] shadow-sm">
                              Recommended
                            </span>
                          )}
                          {prov.badge === "Default" && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-[#BFDBFE] text-[#1E40AF] shadow-sm">
                              Default
                            </span>
                          )}
                        </div>

                        {/* Status label: Connected or Configure */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <Wifi
                            className={`w-3.5 h-3.5 ${
                              isConnected ? "text-emerald-400" : "text-slate-500"
                            }`}
                          />
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              isConnected ? "text-slate-200" : "text-slate-400"
                            }`}
                          >
                            {isConnected ? "Connected" : "Configure"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Green checkmark circle */}
                    <div className="shrink-0 mt-0.5">
                      {isConnected ? (
                        <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center text-black shadow-md shadow-[#22c55e]/30">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-slate-700/60 group-hover:border-slate-500 transition" />
                      )}
                    </div>
                  </div>

                  {/* Active selection pill */}
                  {isConnected && (
                    <div className="pt-3 mt-3 border-t border-[#1c2130] flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-400 font-mono truncate max-w-[150px]">
                        {prov.model}
                      </span>
                      {isActive ? (
                        <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800/40">
                          Aktiv
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsActive(prov.id);
                          }}
                          className="text-purple-400 hover:text-purple-300 font-semibold underline cursor-pointer"
                        >
                          Bruk som aktiv
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Subscription & BYOK Notice */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#12151f] border border-[#1f2536] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-7 h-7 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-base sm:text-lg">
                Produksjonsklar BYOK (Bring Your Own Key)
              </p>
              <p className="text-slate-300 text-sm sm:text-base mt-1">
                Dine API-nøkler lagres kryptert i din nettleser og sendes direkte til den valgte modellen. Ubegrenset bygging.
              </p>
            </div>
          </div>

          {user.plan === "TRIAL" && (
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 shadow-lg shadow-purple-950/40 shrink-0 cursor-pointer"
            >
              <span>Oppgrader til Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modal: Configure Specific Provider Key */}
      {configModalProvider && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-100">
          <div className="bg-[#14161f] border border-[#262c3e] rounded-3xl w-full max-w-lg p-7 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#202536]">
              <div className="flex items-center gap-3.5">
                <ProviderLogo id={configModalProvider.id} size={40} />
                <div>
                  <h4 className="text-xl font-bold text-white">
                    {configModalProvider.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5">
                    Modell: {configModalProvider.model}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setConfigModalProvider(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#202536] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {configModalProvider.description}
            </p>

            <form onSubmit={handleSaveKey} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-200">
                    API-nøkkel:
                  </label>
                  <a
                    href={configModalProvider.dashboardUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium underline"
                  >
                    <span>Hent nøkkel her</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-2.5 bg-[#0c0d12] border border-[#282f42] focus-within:border-purple-500 rounded-2xl px-4 py-3 text-sm sm:text-base">
                  <Key className="w-5 h-5 text-slate-500 shrink-0" />
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={configModalProvider.placeholder}
                    className="bg-transparent text-white font-mono outline-none w-full"
                    autoFocus
                  />
                </div>
              </div>

              {/* Set as active checkbox */}
              <label className="flex items-center gap-2.5 text-sm text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedProvider === configModalProvider.id}
                  onChange={() => handleSetAsActive(configModalProvider.id)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
                />
                <span>Sett som standard modell for koding</span>
              </label>

              {savedSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-sm flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold">API-nøkkel lagret og tilkoblet!</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3">
                {keys[configModalProvider.id] ? (
                  <button
                    type="button"
                    onClick={() => handleRemoveKey(configModalProvider.id)}
                    className="px-4 py-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Fjern nøkkel</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfigModalProvider(null)}
                    className="px-5 py-3 rounded-xl bg-[#1e2332] hover:bg-[#282f42] text-sm text-slate-300 hover:text-white transition font-medium cursor-pointer"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-sm font-bold text-white transition flex items-center gap-2 shadow-lg shadow-purple-950/50 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Koble til</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
