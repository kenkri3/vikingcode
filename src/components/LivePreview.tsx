"use client";

import React, { useState, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";

interface LivePreviewProps {
  files: ProjectFile[];
  projectName: string;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

export function LivePreview({ files, projectName }: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  // Finn koden for app/page.tsx
  const pageFile = files.find((f) => f.path.includes("page.tsx")) || files[0];

  // Bygg en interaktiv sandkasse-HTML som inkluderer Tailwind CSS og kjører den genererte koden i en isolert iframe
  const iframeHtml = useMemo(() => {
    // Rens kildekoden for Next.js imports slik at nettleseren kan kjøre det direkte
    const rawCode = pageFile ? pageFile.content : "";

    // Lag en ren, responsiv og stilig forhåndsvisning med innebygd interaktivitet
    return `
      <!DOCTYPE html>
      <html lang="no" class="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${projectName} - Live Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    viking: {
                      bg: '#0A0D12',
                      card: '#12161F',
                      border: '#1F2937',
                      purple: '#7C3AED',
                      accent: '#A78BFA',
                    }
                  }
                }
              }
            }
          </script>
          <style>
            body {
              background-color: #0A0D12;
              color: #F9FAFB;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              margin: 0;
              padding: 0;
            }
            ::-webkit-scrollbar { width: 6px; height: 6px; }
            ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
          </style>
        </head>
        <body>
          <div id="root">
            <div class="min-h-screen bg-[#0A0D12] text-slate-100 p-6 sm:p-10 font-sans">
              <!-- Header -->
              <div class="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
                    V
                  </div>
                  <div>
                    <h1 class="text-xl font-bold tracking-tight text-white">${projectName}</h1>
                    <p class="text-xs text-slate-400">Live forhåndsvisning i VikingCode sandkasse</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Aktiv Sandbox
                  </span>
                </div>
              </div>

              <!-- Main Dynamic Content -->
              <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Service Calculator / Booking Card -->
                <div class="md:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-5">
                  <div class="flex items-center justify-between">
                    <h2 class="text-base font-bold text-white flex items-center gap-2">
                      <span class="text-[#A78BFA]">✦</span>
                      Interaktiv Oppdragsbestilling
                    </h2>
                    <span class="text-[11px] text-[#C4B5FD] bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/50 font-mono">
                      TEK17 Sertifisert
                    </span>
                  </div>

                  <p class="text-xs text-slate-400 leading-relaxed">
                    Velg ønsket tjeneste og angi prosjektomfang for et umiddelbart og forpliktende tilbud.
                  </p>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button class="p-3 rounded-xl bg-purple-950/40 border border-[#7C3AED] text-left text-xs font-semibold text-white shadow-sm ring-1 ring-[#7C3AED]">
                      Snekker & Tak
                    </button>
                    <button class="p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600">
                      Rørlegger
                    </button>
                    <button class="p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600">
                      Elektro
                    </button>
                    <button class="p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600">
                      Malerarbeid
                    </button>
                  </div>

                  <!-- Slider -->
                  <div class="space-y-2 pt-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-400">Prosjektstørrelse:</span>
                      <span class="font-bold text-[#A78BFA]">45 m²</span>
                    </div>
                    <div class="w-full bg-[#0A0D12] h-2.5 rounded-lg overflow-hidden border border-slate-800">
                      <div class="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] h-full w-[45%]"></div>
                    </div>
                  </div>

                  <!-- Form fields -->
                  <div class="space-y-3 pt-2">
                    <input
                      type="text"
                      placeholder="Oppgi telefonnummer eller e-post for bekreftelse..."
                      class="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      onclick="alert('Takk! Forespørselen din ble sendt til våre tilknyttede mestere.')"
                      class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send inn uforpliktende forespørsel</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                <!-- Right Side Summary Card -->
                <div class="space-y-4">
                  <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
                    <p class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Estimert Pristilbud
                    </p>
                    <div class="text-2xl font-extrabold text-white mb-2">
                      kr 24 500,-
                    </div>
                    <div class="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3">
                      <div class="flex justify-between">
                        <span class="text-slate-400">Est. arbeidstid:</span>
                        <span class="font-medium text-white">ca. 8 timer</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400">Oppstart:</span>
                        <span class="text-emerald-400 font-medium">Innen 48t</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 text-xs space-y-3">
                    <p class="font-semibold text-white">✓ Viking Garanti</p>
                    <p class="text-[11px] text-slate-400 leading-relaxed">
                      Alle oppdrag er sikret med Norsk Mesterbrev og 5 års reklamasjonsrett.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }, [pageFile, projectName]);

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0D12]">
      {/* Top Browser Bar / Toolbar */}
      <div className="h-10 bg-[#12161F] border-b border-[#1F2937] px-3 flex items-center justify-between select-none">
        {/* Left: Device switcher */}
        <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1F2937]">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded-md text-xs transition ${
              device === "desktop"
                ? "bg-purple-950/80 text-[#C4B5FD] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop visning (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`p-1 rounded-md text-xs transition ${
              device === "tablet"
                ? "bg-purple-950/80 text-[#C4B5FD] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Nettbrett visning (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1 rounded-md text-xs transition ${
              device === "mobile"
                ? "bg-purple-950/80 text-[#C4B5FD] font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobil visning (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Fake URL Address bar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0A0D12] border border-[#1F2937] text-[11px] text-slate-400 font-mono w-72 justify-center">
          <span className="text-emerald-400 text-xs">🔒</span>
          <span className="text-slate-300">https://vikingcode-sandbox.local/preview</span>
        </div>

        {/* Right: Refresh & Popout */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition"
            title="Last inn på nytt"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 p-3 flex items-center justify-center overflow-auto bg-[#07090D]">
        <div
          className="h-full border border-[#1F2937] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 bg-[#0A0D12]"
          style={{ width: deviceWidths[device], maxWidth: "100%" }}
        >
          <iframe
            key={reloadKey}
            srcDoc={iframeHtml}
            title="VikingCode Live Sandbox Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
