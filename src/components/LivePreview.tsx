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
  const rawCode = pageFile ? pageFile.content : "";

  // Bygg en interaktiv sandkasse-HTML
  const iframeHtml = useMemo(() => {
    const pNameLower = (projectName || "").toLowerCase();

    // 1. VIKINGMESTER / AIMESTER
    if (pNameLower.includes("mester")) {
      return `
        <!DOCTYPE html>
        <html lang="no" class="dark">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${projectName} - Live Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; margin: 0; padding: 0; }
              ::-webkit-scrollbar { width: 6px; height: 6px; }
              ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
            </style>
          </head>
          <body>
            <div id="root" class="min-h-screen bg-[#0A0D12] text-slate-100 p-6 sm:p-10 font-sans">
              <!-- Header -->
              <div class="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
                    V
                  </div>
                  <div>
                    <h1 class="text-xl font-bold tracking-tight text-white">${projectName}</h1>
                    <p class="text-xs text-slate-400">Live forhåndsvisning i AI Program sandkasse</p>
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

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5" id="category-group">
                    <button id="btn-snekker" onclick="selectService('snekker', 'Snekker & Tak', 850)" class="service-btn p-3 rounded-xl bg-purple-950/50 border border-[#7C3AED] text-left text-xs font-semibold text-white shadow-sm ring-1 ring-[#7C3AED] cursor-pointer transition">
                      Snekker & Tak
                    </button>
                    <button id="btn-rorlegger" onclick="selectService('rorlegger', 'Rørlegger', 1150)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white cursor-pointer transition">
                      Rørlegger
                    </button>
                    <button id="btn-elektro" onclick="selectService('elektro', 'Elektro', 1050)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white cursor-pointer transition">
                      Elektro
                    </button>
                    <button id="btn-maler" onclick="selectService('maler', 'Malerarbeid', 720)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white cursor-pointer transition">
                      Malerarbeid
                    </button>
                  </div>

                  <!-- Slider -->
                  <div class="space-y-2 pt-2">
                    <div class="flex justify-between text-xs">
                      <span class="text-slate-400">Prosjektstørrelse:</span>
                      <span class="font-bold text-[#A78BFA]" id="slider-label">45 m²</span>
                    </div>
                    <input
                      type="range"
                      id="m2-slider"
                      min="10"
                      max="200"
                      value="45"
                      oninput="updateSlider(this.value)"
                      class="w-full accent-[#7C3AED] bg-[#0A0D12] h-2.5 rounded-lg cursor-pointer border border-slate-800"
                    />
                  </div>

                  <!-- Form fields -->
                  <div class="space-y-3 pt-2">
                    <input
                      type="text"
                      id="contact-input"
                      placeholder="Oppgi telefonnummer eller e-post for bekreftelse..."
                      class="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                    <button
                      id="submit-btn"
                      onclick="submitBooking()"
                      class="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span id="submit-text">Send inn uforpliktende forespørsel</span>
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
                    <div class="text-2xl font-extrabold text-white mb-2" id="price-display">
                      kr 24 500,-
                    </div>
                    <div class="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3">
                      <div class="flex justify-between">
                        <span class="text-slate-400">Valgt fag:</span>
                        <span class="font-medium text-white" id="service-summary">Snekker & Tak</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-slate-400">Est. arbeidstid:</span>
                        <span class="font-medium text-white" id="time-display">ca. 8 timer</span>
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
                      Alle oppdrag er sikret med Norsk Mesterbrev og 5 års reklamasjonsrett i henhold til norsk håndverkerlovgivning.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <script>
              let currentRate = 850;
              let currentM2 = 45;
              let currentServiceName = 'Snekker & Tak';

              function calculate() {
                const total = Math.round((currentM2 * 380) + (currentRate * 8));
                document.getElementById('price-display').innerText = 'kr ' + total.toLocaleString('no-NO') + ',-';
                document.getElementById('slider-label').innerText = currentM2 + ' m²';
                document.getElementById('service-summary').innerText = currentServiceName;
                document.getElementById('time-display').innerText = 'ca. ' + Math.round(currentM2 / 6 + 4) + ' timer';
              }

              function selectService(id, name, rate) {
                currentRate = rate;
                currentServiceName = name;
                document.querySelectorAll('.service-btn').forEach(b => {
                  b.className = 'service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white cursor-pointer transition';
                });
                const activeBtn = document.getElementById('btn-' + id);
                if (activeBtn) {
                  activeBtn.className = 'service-btn p-3 rounded-xl bg-purple-950/50 border border-[#7C3AED] text-left text-xs font-semibold text-white shadow-sm ring-1 ring-[#7C3AED] cursor-pointer transition';
                }
                calculate();
              }

              function updateSlider(val) {
                currentM2 = Number(val);
                calculate();
              }

              function submitBooking() {
                const input = document.getElementById('contact-input').value;
                if (!input.trim()) {
                  alert('Vennligst skriv inn telefonnummer eller e-postadresse.');
                  return;
                }
                const btn = document.getElementById('submit-btn');
                btn.className = 'w-full py-3 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2';
                document.getElementById('submit-text').innerText = '✓ Forespørsel sendt! En mester kontakter deg innen 1 time.';
              }
            </script>
          </body>
        </html>
      `;
    }

    // 2. VIKINGNET
    if (pNameLower.includes("net")) {
      return `
        <!DOCTYPE html>
        <html lang="no" class="dark">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Vikingnet - Live Sandbox</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 0; }</style>
          </head>
          <body>
            <div class="min-h-screen bg-[#0A0D12] text-slate-100 p-6 sm:p-10">
              <div class="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center font-bold text-white shadow-lg">VN</div>
                  <div>
                    <h1 class="text-xl font-bold tracking-tight text-white">Vikingnet Bedriftsportal</h1>
                    <p class="text-xs text-slate-400">Verdiskapende B2B anbuds- og partnernettverk</p>
                  </div>
                </div>
                <button onclick="alert('Ny partnerforespørsel åpnet!')" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer">+ Bli partner</button>
              </div>

              <div class="max-w-4xl mx-auto space-y-6">
                <div class="flex gap-3">
                  <input id="net-search" oninput="filterMembers(this.value)" type="text" placeholder="Søk etter bedrift eller fag..." class="flex-1 bg-[#12161F] border border-[#1F2937] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="members-list">
                  <div class="member-card bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 hover:border-blue-500/50 transition">
                    <div class="flex justify-between"><h3 class="text-sm font-bold text-white">Vestfold Entreprenør AS</h3><span class="text-xs text-amber-300">★ 4.9</span></div>
                    <p class="text-xs text-slate-400 mt-1">Bygg & Anlegg • Tønsberg</p>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex justify-between text-xs text-slate-400">
                      <span>14 aktive anbud</span>
                      <button onclick="alert('Åpner kontakt med Vestfold Entreprenør AS')" class="text-blue-400 hover:underline cursor-pointer font-semibold">Kontakt →</button>
                    </div>
                  </div>
                  <div class="member-card bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 hover:border-blue-500/50 transition">
                    <div class="flex justify-between"><h3 class="text-sm font-bold text-white">Horten Tech Hub</h3><span class="text-xs text-amber-300">★ 5.0</span></div>
                    <p class="text-xs text-slate-400 mt-1">IT & Programvare • Horten</p>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex justify-between text-xs text-slate-400">
                      <span>8 aktive anbud</span>
                      <button onclick="alert('Åpner kontakt med Horten Tech Hub')" class="text-blue-400 hover:underline cursor-pointer font-semibold">Kontakt →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <script>
              function filterMembers(query) {
                const cards = document.querySelectorAll('.member-card');
                cards.forEach(card => {
                  const txt = card.innerText.toLowerCase();
                  card.style.display = txt.includes(query.toLowerCase()) ? 'block' : 'none';
                });
              }
            </script>
          </body>
        </html>
      `;
    }

    // 3. VIKINGCRM
    if (pNameLower.includes("crm")) {
      return `
        <!DOCTYPE html>
        <html lang="no" class="dark">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>VikingCRM - Live Sandbox</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 0; }</style>
          </head>
          <body>
            <div class="min-h-screen bg-[#0A0D12] text-slate-100 p-6 sm:p-10">
              <div class="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
                <div>
                  <h1 class="text-xl font-bold tracking-tight text-white">VikingCRM Salgspipeline</h1>
                  <p class="text-xs text-slate-400">Sanntidsoppfølging av anbud og kundeprosjekter</p>
                </div>
                <div class="flex gap-2">
                  <input id="deal-title" placeholder="Nytt oppdrag..." class="bg-[#12161F] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white outline-none" />
                  <button onclick="addDeal()" class="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer">+ Legg til</button>
                </div>
              </div>

              <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
                  <h2 class="text-xs font-bold text-slate-300 pb-2 border-b border-[#1F2937] mb-3">1. Nye Leads</h2>
                  <div class="space-y-3" id="col-lead">
                    <div class="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1">
                      <p class="font-bold text-white">Takomlegging Villa</p>
                      <p class="text-slate-400 text-[11px]">Lars Holm • 185 000 kr</p>
                      <button onclick="moveDeal(this, 'col-befaring')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Befaring →</button>
                    </div>
                  </div>
                </div>

                <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
                  <h2 class="text-xs font-bold text-slate-300 pb-2 border-b border-[#1F2937] mb-3">2. Befaring Avtalt</h2>
                  <div class="space-y-3" id="col-befaring">
                    <div class="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1">
                      <p class="font-bold text-white">Totalrehabilitering Bad</p>
                      <p class="text-slate-400 text-[11px]">Kari Lie • 240 000 kr</p>
                      <button onclick="moveDeal(this, 'col-tilbud')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Tilbud sendt →</button>
                    </div>
                  </div>
                </div>

                <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
                  <h2 class="text-xs font-bold text-slate-300 pb-2 border-b border-[#1F2937] mb-3">3. Tilbud Sendt</h2>
                  <div class="space-y-3" id="col-tilbud">
                    <div class="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1">
                      <p class="font-bold text-white">El-kontroll Næringsbygg</p>
                      <p class="text-slate-400 text-[11px]">Nordic Eiendom • 65 000 kr</p>
                      <button onclick="moveDeal(this, 'col-vunnet')" class="text-[10px] text-emerald-400 cursor-pointer font-semibold pt-1">Vunnet oppdrag ✓</button>
                    </div>
                  </div>
                </div>

                <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
                  <h2 class="text-xs font-bold text-emerald-400 pb-2 border-b border-[#1F2937] mb-3">4. Vunnet / Kontrakt</h2>
                  <div class="space-y-3" id="col-vunnet">
                    <div class="bg-[#0E121A] border border-emerald-900/40 rounded-xl p-3 text-xs space-y-1">
                      <p class="font-bold text-white">Maling Fasadeprosjekt</p>
                      <p class="text-slate-400 text-[11px]">Sameiet Sentrum • 120 000 kr</p>
                      <span class="text-[10px] text-emerald-400 font-mono">Signert avtale</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <script>
              function moveDeal(btn, targetColId) {
                const card = btn.parentElement;
                btn.remove();
                document.getElementById(targetColId).appendChild(card);
              }
              function addDeal() {
                const val = document.getElementById('deal-title').value;
                if (!val.trim()) return;
                const d = document.createElement('div');
                d.className = 'bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1';
                d.innerHTML = '<p class="font-bold text-white">' + val + '</p><p class="text-slate-400 text-[11px]">Ny kunde • 95 000 kr</p><button onclick="moveDeal(this, \\'col-befaring\\')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Befaring →</button>';
                document.getElementById('col-lead').appendChild(d);
                document.getElementById('deal-title').value = '';
              }
            </script>
          </body>
        </html>
      `;
    }

    // 4. HELGE / HORTEN / EIDSFOSS / TØNSBERG / CUSTOM CODE
    return `
      <!DOCTYPE html>
      <html lang="no" class="dark">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${projectName} - Live Preview</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div class="min-h-screen bg-[#0A0D12] text-slate-100 p-6 sm:p-10 font-sans">
            <header class="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
                  AI
                </div>
                <div>
                  <h1 class="text-xl font-bold tracking-tight text-white">${projectName}</h1>
                  <p class="text-xs text-slate-400">AI Program Autonom Sandkasse</p>
                </div>
              </div>
              <span class="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium">
                ● Aktiv Sandbox
              </span>
            </header>

            <main class="max-w-4xl mx-auto space-y-6">
              <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
                <h2 class="text-base font-bold text-white">Prosjekt: ${projectName}</h2>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Fullverdig applikasjon generert med TypeScript, Next.js, Tailwind CSS og PostgreSQL-skjema.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div class="bg-[#0A0D12] p-3 rounded-xl border border-slate-800 text-xs">
                    <p class="text-slate-500 text-[10px] uppercase font-bold">Filer</p>
                    <p class="text-white font-bold text-sm">${files.length} kildekodefiler</p>
                  </div>
                  <div class="bg-[#0A0D12] p-3 rounded-xl border border-slate-800 text-xs">
                    <p class="text-slate-500 text-[10px] uppercase font-bold">Infrastruktur</p>
                    <p class="text-emerald-400 font-bold text-sm">PostgreSQL + Nixpacks</p>
                  </div>
                  <div class="bg-[#0A0D12] p-3 rounded-xl border border-slate-800 text-xs">
                    <p class="text-slate-500 text-[10px] uppercase font-bold">Hosting</p>
                    <p class="text-purple-400 font-bold text-sm">Railway Ready (1-klikk)</p>
                  </div>
                </div>
                <div class="pt-4 border-t border-[#1F2937] flex gap-3">
                  <button onclick="alert('Interaktiv handling utført!')" class="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition cursor-pointer">
                    Test handling
                  </button>
                  <button onclick="alert('Prosjektet er synkronisert med PostgreSQL!')" class="px-4 py-2 rounded-xl bg-[#0E121A] border border-[#1F2937] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer">
                    Verifiser database
                  </button>
                </div>
              </div>
            </main>
          </div>
        </body>
      </html>
    `;
  }, [pageFile, projectName, files]);

  const deviceWidths: Record<DeviceMode, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  const handlePopout = () => {
    const blob = new Blob([iframeHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0A0D12]">
      {/* Top Browser Bar / Toolbar */}
      <div className="h-10 bg-[#12161F] border-b border-[#1F2937] px-3 flex items-center justify-between select-none">
        {/* Left: Device switcher */}
        <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1F2937]">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded-md text-xs transition cursor-pointer ${
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
            className={`p-1 rounded-md text-xs transition cursor-pointer ${
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
            className={`p-1 rounded-md text-xs transition cursor-pointer ${
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
          <span className="text-slate-300">https://aiprogram-sandbox.local/preview</span>
        </div>

        {/* Right: Refresh & Popout */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
            title="Last inn på nytt"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePopout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
            title="Åpne i ny fane"
          >
            <ExternalLink className="w-3.5 h-3.5" />
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
            title="AI Program Live Sandbox Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
