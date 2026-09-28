"use client";

import React, { useState, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Sparkles,
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

  // Finn kildekoden for app/page.tsx eller første fil
  const pageFile = files.find((f) => f.path.includes("page.tsx")) || files[0];
  const rawCode = pageFile ? pageFile.content : "";

  // Bygg en 100% dynamisk, interaktiv sandkasse-HTML basert på faktisk kildekode
  const iframeHtml = useMemo(() => {
    const codeLower = rawCode.toLowerCase();
    const isHealth =
      codeLower.includes("mediklinikk") ||
      codeLower.includes("healthportal") ||
      codeLower.includes("helse") ||
      codeLower.includes("klinikk") ||
      codeLower.includes("pasient") ||
      codeLower.includes("allmennlege") ||
      codeLower.includes("lege") ||
      codeLower.includes("resept") ||
      projectName.toLowerCase().includes("helse") ||
      projectName.toLowerCase().includes("klinikk");

    const isCarpenter =
      !isHealth && (
        codeLower.includes("mestersnekker") ||
        codeLower.includes("carpenterwebsite") ||
        codeLower.includes("woodtype") ||
        codeLower.includes("moreroyal") ||
        (codeLower.includes("snekker") && !codeLower.includes("rorlegger"))
      );

    const isCraftsman =
      !isHealth &&
      !isCarpenter && (
        codeLower.includes("snekker") ||
        codeLower.includes("håndverk") ||
        codeLower.includes("tak") ||
        codeLower.includes("bad") ||
        codeLower.includes("maler") ||
        codeLower.includes("tek17") ||
        codeLower.includes("squaremeters") ||
        projectName.toLowerCase().includes("mester")
      );

    const isCRM =
      !isHealth && (
        codeLower.includes("crm") ||
        codeLower.includes("pipeline") ||
        codeLower.includes("leads") ||
        codeLower.includes("deals") ||
        projectName.toLowerCase().includes("crm")
      );

    const isNetwork =
      !isHealth && (
        codeLower.includes("vikingnet") ||
        codeLower.includes("partner") ||
        codeLower.includes("bedrift") ||
        projectName.toLowerCase().includes("net")
      );

    // 0. DEDIKERT HELSEPORTAL (MediKlinikk)
    if (isHealth) {
      return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MediKlinikk Helseportal - Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#0A0D12] text-slate-100 min-h-screen">
    <div id="root" class="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      <!-- Header -->
      <header class="flex items-center justify-between pb-5 border-b border-[#1F2937]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#38BDF8] flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-950/40 text-lg">
            🩺
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              MediKlinikk Helseportal
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
                Helsenett & BankID
              </span>
            </h1>
            <p class="text-xs text-slate-400">Pasientjournal, digital legekonsultasjon og timebestilling</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium shrink-0">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Vakthavende lege ledig nå
        </span>
      </header>

      <!-- Navigation Tabs -->
      <div class="flex gap-2 border-b border-[#1F2937] pb-3" id="tab-nav">
        <button id="tab-btn-booking" onclick="switchTab('booking')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white shadow-lg shadow-purple-900/30 transition cursor-pointer">
          Bestill Konsultasjon
        </button>
        <button id="tab-btn-prescriptions" onclick="switchTab('prescriptions')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#12161F] text-slate-400 hover:text-white border border-[#1F2937] transition cursor-pointer">
          Mine e-Resepter (3)
        </button>
        <button id="tab-btn-journal" onclick="switchTab('journal')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#12161F] text-slate-400 hover:text-white border border-[#1F2937] transition cursor-pointer">
          Pasientjournal & Lab
        </button>
      </div>

      <!-- Tab 1: Booking -->
      <div id="tab-content-booking" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <!-- Left: Configurator -->
          <div class="lg:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
            <div class="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span class="text-[#38BDF8]">✦</span>
                1. Velg Spesialitet / Tjeneste
              </h2>
              <span class="text-[11px] text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 font-mono">
                Uten henvisning
              </span>
            </div>

            <!-- Service Selector -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="health-services">
              <button id="hs-allmennlege" onclick="setService('allmennlege', 'Allmennlege & Akuttimer', 'Dr. Anne Lise Berg', 890, 650)" class="hs-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer">
                <div class="flex justify-between items-center"><span class="font-bold">Allmennlege</span><span class="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Ledig i dag</span></div>
                <p class="text-[11px] text-slate-300 mt-1">Dr. Anne Lise Berg</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Sykemelding, e-resept og allmennsjekk.</p>
              </button>
              <button id="hs-fysio" onclick="setService('fysio', 'Fysioterapi & Manuellterapi', 'Martine Solheim', 820, 590)" class="hs-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <div class="flex justify-between items-center"><span class="font-bold">Fysioterapi</span><span class="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Ledig i morgen</span></div>
                <p class="text-[11px] text-slate-300 mt-1">Martine Solheim (Spesialfysio)</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Muskel/ledd, rygg/nakke og opptrening.</p>
              </button>
              <button id="hs-psykolog" onclick="setService('psykolog', 'Psykolog & Samtaleterapi', 'Dr. Kristoffer Haug', 1350, 1190)" class="hs-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <div class="flex justify-between items-center"><span class="font-bold">Psykolog</span><span class="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Ledig i morgen</span></div>
                <p class="text-[11px] text-slate-300 mt-1">Dr. Kristoffer Haug</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Kognitiv terapi, stressmestring og angst.</p>
              </button>
              <button id="hs-hudlege" onclick="setService('hudlege', 'Dermatolog & Hudlege', 'Dr. Jonas Lind', 1250, 950)" class="hs-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <div class="flex justify-between items-center"><span class="font-bold">Dermatolog / Hud</span><span class="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Ledig torsdag</span></div>
                <p class="text-[11px] text-slate-300 mt-1">Dr. Jonas Lind (Overlege)</p>
                <p class="text-[10px] text-slate-400 mt-0.5">Føflekkscanning, utslett og eksem.</p>
              </button>
            </div>

            <!-- Consultation Mode -->
            <div class="space-y-2 pt-2 border-t border-[#1F2937]">
              <span class="text-xs text-slate-300 font-semibold">Konsultasjonsform:</span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="consult-mode-group">
                <button id="cm-video" onclick="setConsultMode('video')" class="cm-btn p-3 rounded-xl bg-cyan-950/60 border border-cyan-500 text-left text-xs text-white ring-1 ring-cyan-500 transition cursor-pointer flex items-center gap-2.5">
                  <span class="text-base">📹</span>
                  <div>
                    <p class="font-bold">Digital Videokonsultasjon</p>
                    <p class="text-[10px] text-slate-400">Raskt og sikkert hjemmefra</p>
                  </div>
                </button>
                <button id="cm-clinic" onclick="setConsultMode('clinic')" class="cm-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-2.5">
                  <span class="text-base">🏥</span>
                  <div>
                    <p class="font-bold">Fysisk Oppmøte på Klinikk</p>
                    <p class="text-[10px] text-slate-400">Sentrum Helsehus, Storgata 14</p>
                  </div>
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div class="space-y-2 pt-2 border-t border-[#1F2937]">
              <span class="text-xs text-slate-300 font-semibold">Ledig tidspunkt:</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="slot-group">
                <button onclick="setSlot(this, 'I dag kl. 14:30')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#7C3AED] border border-[#7C3AED] text-white font-bold transition cursor-pointer">I dag kl. 14:30</button>
                <button onclick="setSlot(this, 'I dag kl. 15:45')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer">I dag kl. 15:45</button>
                <button onclick="setSlot(this, 'I dag kl. 16:30')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer">I dag kl. 16:30</button>
                <button onclick="setSlot(this, 'I morgen kl. 09:15')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer">I morgen kl. 09:15</button>
                <button onclick="setSlot(this, 'I morgen kl. 11:00')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer">I morgen kl. 11:00</button>
                <button onclick="setSlot(this, 'I morgen kl. 13:30')" class="slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer">I morgen kl. 13:30</button>
              </div>
            </div>

            <!-- Booking Inputs & Submit -->
            <div class="space-y-3 pt-2 border-t border-[#1F2937]">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input type="text" id="patient-name-inp" placeholder="Pasientens fulle navn..." class="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition" />
                <input type="tel" id="patient-phone-inp" placeholder="Mobilnummer (for SMS-videolenke)..." class="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition" />
              </div>
              <button id="book-btn" onclick="submitHealthBooking()" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer">
                <span id="book-btn-text">Bekreft timebestilling med BankID</span>
                <span>→</span>
              </button>
            </div>
          </div>

          <!-- Right: Summary Card -->
          <div class="space-y-4">
            <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 shadow-2xl space-y-4">
              <div>
                <p class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Konsultasjonstakst</p>
                <div class="text-3xl font-extrabold text-white tracking-tight" id="health-price-display">kr 650,-</div>
                <p class="text-[10px] text-slate-400 mt-0.5">Egenandel inkl. journalføring</p>
              </div>
              <div class="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3 font-mono">
                <div class="flex justify-between"><span class="text-slate-400">Tjeneste:</span><span class="font-semibold text-white" id="sum-service">Allmennlege</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Behandler:</span><span class="font-semibold text-white text-[11px]" id="sum-doctor">Dr. Anne Lise Berg</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Format:</span><span class="font-semibold text-cyan-300" id="sum-mode">Digital Video</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Tidspunkt:</span><span class="font-bold text-[#A78BFA]" id="sum-slot">I dag kl. 14:30</span></div>
              </div>
              <div class="pt-3 border-t border-[#1F2937] space-y-2 text-[11px] text-slate-400">
                <div class="flex items-center gap-1.5 text-emerald-400 font-medium"><span>✓</span><span>Ingen henvisning nødvendig</span></div>
                <div class="flex items-center gap-1.5 text-emerald-400 font-medium"><span>✓</span><span>E-resept rett til apoteket</span></div>
                <div class="flex items-center gap-1.5 text-emerald-400 font-medium"><span>✓</span><span>Helsenett og HelseID sikret</span></div>
              </div>
            </div>

            <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4 text-xs space-y-2">
              <p class="font-bold text-amber-400 flex items-center gap-1.5">⚠ Akutt medisinsk nødhjelp</p>
              <p class="text-[11px] text-slate-400 leading-relaxed">Ved livstruende tilstander ring <strong>113</strong>. Ved akutt legevaktbehov ring <strong>116 117</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 2: Prescriptions -->
      <div id="tab-content-prescriptions" class="hidden space-y-4">
        <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
          <div class="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <div>
              <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <span class="text-cyan-400">💊</span>
                Aktive e-Resepter i Reseptformidleren
              </h2>
              <p class="text-xs text-slate-400">Synkronisert mot Helsenorge og landets apoteker</p>
            </div>
            <span class="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40 font-mono">
              3 gyldige resepter
            </span>
          </div>

          <div class="space-y-3">
            <div class="p-4 rounded-xl bg-[#0E121A] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-xs font-bold text-white">Ventoline Inhalasjonspulver 0.2mg</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Forskriver: Dr. Anne Lise Berg (Allmennlege)</p>
                <p class="text-[10px] text-slate-500 font-mono mt-0.5">Gyldig til: 15.11.2026</p>
              </div>
              <button id="rx-btn-1" onclick="renewRx(1)" class="px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer">
                Be om fornyelse
              </button>
            </div>

            <div class="p-4 rounded-xl bg-[#0E121A] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-xs font-bold text-white">Cetirizin 10mg mikstur</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Forskriver: Dr. Jonas Lind (Hudlege)</p>
                <p class="text-[10px] text-slate-500 font-mono mt-0.5">Gyldig til: 22.04.2027</p>
              </div>
              <button id="rx-btn-2" onclick="renewRx(2)" class="px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition cursor-pointer">
                Be om fornyelse
              </button>
            </div>

            <div class="p-4 rounded-xl bg-[#0E121A] border border-[#1F2937] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 class="text-xs font-bold text-white">Somac 20mg enterotabletter</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Forskriver: Dr. Henrik Dale (Gastro)</p>
                <p class="text-[10px] text-slate-500 font-mono mt-0.5">Gyldig til: 08.01.2027</p>
              </div>
              <span class="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                ✓ Fornyelse godkjent av lege
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 3: Journal & Lab -->
      <div id="tab-content-journal" class="hidden space-y-4">
        <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
          <div class="border-b border-[#1F2937] pb-3">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="text-[#A78BFA]">📋</span>
              Pasientjournal & Labresultater
            </h2>
            <p class="text-xs text-slate-400">Elektronisk pasientjournal (EPJ) og akkrediterte laboratorieanalyser</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div class="p-4 rounded-xl bg-[#0E121A] border border-[#1F2937] space-y-2">
              <h3 class="font-bold text-white">Siste konsultasjonsnotat</h3>
              <p class="text-[11px] text-slate-300">Dato: 14. august 2026</p>
              <p class="text-[11px] text-slate-400 leading-relaxed">Årlig helsekontroll utført. BT 120/78, normal hjerte/lunge-stetoskopi. Pasienten rapporterer god allmenntilstand.</p>
              <span class="text-[10px] text-[#A78BFA] font-mono block pt-1">Signert: Dr. Anne Lise Berg (Autorisert Allmennlege)</span>
            </div>

            <div class="p-4 rounded-xl bg-[#0E121A] border border-[#1F2937] space-y-2">
              <h3 class="font-bold text-white">Laboratorieresultater (Helseprofil)</h3>
              <div class="space-y-1.5 text-[11px] font-mono">
                <div class="flex justify-between"><span class="text-slate-400">Hemoglobin:</span><span class="text-emerald-400 font-bold">14.8 g/dL (Normal)</span></div>
                <div class="flex justify-between"><span class="text-slate-400">S-Ferritin:</span><span class="text-emerald-400 font-bold">85 µg/L (Normal)</span></div>
                <div class="flex justify-between"><span class="text-slate-400">S-Vitamin D:</span><span class="text-emerald-400 font-bold">78 nmol/L (Optimal)</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Total Kolesterol:</span><span class="text-emerald-400 font-bold">4.6 mmol/L (Normal)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentServiceName = 'Allmennlege';
      let currentDoctorName = 'Dr. Anne Lise Berg';
      let currentClinicPrice = 890;
      let currentVideoPrice = 650;
      let currentMode = 'video';
      let currentSlot = 'I dag kl. 14:30';

      function calcPrice() {
        const p = currentMode === 'video' ? currentVideoPrice : currentClinicPrice;
        document.getElementById('health-price-display').innerText = 'kr ' + p.toLocaleString('no-NO') + ',-';
        document.getElementById('sum-service').innerText = currentServiceName;
        document.getElementById('sum-doctor').innerText = currentDoctorName;
        document.getElementById('sum-mode').innerText = currentMode === 'video' ? 'Digital Video' : 'Oppmøte Klinikk';
        document.getElementById('sum-slot').innerText = currentSlot;
      }

      function setService(id, name, doctor, cPrice, vPrice) {
        currentServiceName = name;
        currentDoctorName = doctor;
        currentClinicPrice = cPrice;
        currentVideoPrice = vPrice;
        document.querySelectorAll('#health-services .hs-btn').forEach(b => {
          b.className = 'hs-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer';
        });
        const target = document.getElementById('hs-' + id);
        if (target) {
          target.className = 'hs-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer';
        }
        calcPrice();
      }

      function setConsultMode(mode) {
        currentMode = mode;
        const vBtn = document.getElementById('cm-video');
        const cBtn = document.getElementById('cm-clinic');
        if (mode === 'video') {
          vBtn.className = 'cm-btn p-3 rounded-xl bg-cyan-950/60 border border-cyan-500 text-left text-xs text-white ring-1 ring-cyan-500 transition cursor-pointer flex items-center gap-2.5';
          cBtn.className = 'cm-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-2.5';
        } else {
          cBtn.className = 'cm-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs text-white ring-1 ring-[#7C3AED] transition cursor-pointer flex items-center gap-2.5';
          vBtn.className = 'cm-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-2.5';
        }
        calcPrice();
      }

      function setSlot(btn, slot) {
        currentSlot = slot;
        document.querySelectorAll('#slot-group .slot-btn').forEach(b => {
          b.className = 'slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white transition cursor-pointer';
        });
        btn.className = 'slot-btn px-3 py-2 rounded-xl text-xs font-mono bg-[#7C3AED] border border-[#7C3AED] text-white font-bold transition cursor-pointer';
        calcPrice();
      }

      function submitHealthBooking() {
        const phone = document.getElementById('patient-phone-inp').value.trim();
        const name = document.getElementById('patient-name-inp').value.trim();
        if (!phone || !name) {
          alert('Vennligst oppgi både pasientens navn og mobilnummer for bekreftelse.');
          return;
        }
        const btn = document.getElementById('book-btn');
        btn.className = 'w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer';
        document.getElementById('book-btn-text').innerText = '✓ Time bestilt! Bekreftelse og videolenke sendt til ' + phone;
      }

      function switchTab(tab) {
        ['booking', 'prescriptions', 'journal'].forEach(t => {
          const content = document.getElementById('tab-content-' + t);
          const btn = document.getElementById('tab-btn-' + t);
          if (t === tab) {
            content.classList.remove('hidden');
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#7C3AED] text-white shadow-lg shadow-purple-900/30 transition cursor-pointer';
          } else {
            content.classList.add('hidden');
            btn.className = 'px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#12161F] text-slate-400 hover:text-white border border-[#1F2937] transition cursor-pointer';
          }
        });
      }

      function renewRx(num) {
        const btn = document.getElementById('rx-btn-' + num);
        btn.outerHTML = '<span class="text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg flex items-center gap-1.5">✓ Fornyelse oversendt fastlege</span>';
      }
    </script>
  </body>
</html>`;
    }

    // 1. DEDIKERT SNEKKERPORTAL (MesterSnekker'n AS)
    if (isCarpenter) {
      return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MesterSnekker'n AS - Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#0A0D12] text-slate-100 min-h-screen">
    <div id="root" class="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      <!-- Header -->
      <header class="flex items-center justify-between pb-5 border-b border-[#1F2937]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
            🔨
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              MesterSnekker'n AS
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40 font-mono">
                TEK17 & Mesterbrev
              </span>
            </h1>
            <p class="text-xs text-slate-400">Tradisjonshåndverk, nybygg og moderne snekkerarbeid</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium shrink-0">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Aktiv Sandkasse
        </span>
      </header>

      <!-- Hero Card -->
      <div class="bg-gradient-to-r from-[#12161F] via-[#161B26] to-[#12161F] border border-[#1F2937] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <span class="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">✦ Kvalitetsarbeid som varer</span>
        <h2 class="text-xl sm:text-2xl font-extrabold text-white mt-1">Skal du bygge terrasse, tilbygg eller pusse opp?</h2>
        <p class="text-xs sm:text-sm text-slate-300 mt-1">Vi leverer solid norsk snekker- og tømrerarbeid med millimeterpresisjon og 5 års garanti.</p>
      </div>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left: Interactive Snekkerkalkulator -->
        <div class="lg:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span class="text-[#A78BFA]">✦</span>
              1. Velg snekkertjeneste
            </h2>
            <span class="text-[11px] text-[#C4B5FD] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
              Fast timeprisgaranti
            </span>
          </div>

          <!-- Service Buttons -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2" id="carpenter-services">
            <button id="s-terrasse" onclick="setService('terrasse', 'Terrasse & Veranda', 850)" class="service-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer">
              <div class="flex justify-between"><span>Terrasse & Veranda</span><span class="text-[#A78BFA]">850 kr/t</span></div>
              <p class="text-[10px] text-slate-400 mt-1">Platting, rekkverk og trapper i kvalitetsvirke.</p>
            </button>
            <button id="s-tilbygg" onclick="setService('tilbygg', 'Tilbygg & Rehabilitering', 950)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
              <div class="flex justify-between"><span>Tilbygg & Rehabilitering</span><span class="text-[#A78BFA]">950 kr/t</span></div>
              <p class="text-[10px] text-slate-400 mt-1">Stueutvidelse, råloft eller ny etasje i TEK17.</p>
            </button>
            <button id="s-kledning" onclick="setService('kledning', 'Kledning & Etterisolering', 890)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
              <div class="flex justify-between"><span>Kledning & Etterisolering</span><span class="text-[#A78BFA]">890 kr/t</span></div>
              <p class="text-[10px] text-slate-400 mt-1">Ny fasadekledning med 10-15cm ekstra isolasjon.</p>
            </button>
            <button id="s-innvendig" onclick="setService('innvendig', 'Innvendig Snekring & Spiler', 920)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
              <div class="flex justify-between"><span>Innvendig Snekring</span><span class="text-[#A78BFA]">920 kr/t</span></div>
              <p class="text-[10px] text-slate-400 mt-1">Spilevegger i eik, garderober og listverk.</p>
            </button>
          </div>

          <!-- M2 Slider -->
          <div class="space-y-2 pt-2 border-t border-[#1F2937]">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300 font-semibold">Prosjektstørrelse:</span>
              <span class="font-bold text-[#A78BFA] text-sm" id="m2-val">35 m²</span>
            </div>
            <input type="range" id="slider" min="10" max="150" value="35" oninput="updateM2(this.value)" class="w-full accent-[#7C3AED] bg-[#0A0D12] h-2.5 rounded-lg cursor-pointer border border-slate-800" />
            <div class="flex justify-between text-[10px] text-slate-500 font-mono"><span>10 m²</span><span>75 m²</span><span>150 m²</span></div>
          </div>

          <!-- Material Selection -->
          <div class="space-y-2 pt-2 border-t border-[#1F2937]">
            <span class="text-xs text-slate-300 font-semibold">Materialvalg:</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="wood-group">
              <button id="w-impregnert" onclick="setWood('impregnert', 'Furu Impregnert kl. AB', 1.0)" class="wood-btn px-2.5 py-2 rounded-xl bg-purple-950/70 border border-[#7C3AED] text-left text-xs text-white transition cursor-pointer font-semibold">Furu Impregnert</button>
              <button id="w-termo" onclick="setWood('termo', 'Termofuru', 1.25)" class="wood-btn px-2.5 py-2 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer">Termofuru</button>
              <button id="w-moreroyal" onclick="setWood('moreroyal', 'MøreRoyal Grå', 1.45)" class="wood-btn px-2.5 py-2 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer">MøreRoyal</button>
              <button id="w-kebony" onclick="setWood('kebony', 'Kebony Clear', 1.75)" class="wood-btn px-2.5 py-2 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer">Kebony Premium</button>
            </div>
          </div>

          <!-- Contact & Befaring -->
          <div class="space-y-3 pt-2 border-t border-[#1F2937]">
            <input type="text" id="contact-input" placeholder="Oppgi telefonnummer for gratis befaring..." class="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition" />
            <button id="submit-btn" onclick="submitBooking()" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer">
              <span id="btn-text">Bestill uforpliktende gratis befaring</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Right: Summary Card -->
        <div class="space-y-4">
          <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Estimert Totalpris (inkl. mva)</p>
              <div class="text-3xl font-extrabold text-white tracking-tight" id="price-display">kr 43 200,-</div>
              <p class="text-[10px] text-slate-400 mt-0.5">Veiledende inkl. arbeid og materialer</p>
            </div>
            <div class="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3 font-mono">
              <div class="flex justify-between"><span class="text-slate-400">Valgt fag:</span><span class="font-semibold text-white" id="summary-service">Terrasse & Veranda</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Timepris:</span><span class="font-semibold text-white" id="summary-rate">850 kr/t</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Est. arbeidstid:</span><span class="font-semibold text-white" id="summary-hours">ca. 29 timer</span></div>
              <div class="flex justify-between"><span class="text-slate-400">Materialvirke:</span><span class="font-semibold text-white" id="summary-wood">Furu Impregnert kl. AB</span></div>
            </div>
          </div>

          <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 text-xs space-y-2">
            <p class="font-bold text-white flex items-center gap-1.5 text-emerald-400">✓ Mestergaranti & TEK17</p>
            <p class="text-[11px] text-slate-400 leading-relaxed">Alle oppdrag utføres av autoriserte tømrermestere med fastprisavtale og 5 års reklamasjonsrett.</p>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentRate = 850;
      let currentM2 = 35;
      let currentName = 'Terrasse & Veranda';
      let woodMult = 1.0;
      let woodName = 'Furu Impregnert kl. AB';

      function calc() {
        const estHours = Math.round(currentM2 * 0.6 + 8);
        const labor = estHours * currentRate;
        const mat = Math.round(currentM2 * 420 * woodMult);
        const total = labor + mat;
        document.getElementById('price-display').innerText = 'kr ' + total.toLocaleString('no-NO') + ',-';
        document.getElementById('m2-val').innerText = currentM2 + ' m²';
        document.getElementById('summary-service').innerText = currentName;
        document.getElementById('summary-rate').innerText = currentRate + ' kr/t';
        document.getElementById('summary-hours').innerText = 'ca. ' + estHours + ' timer';
        document.getElementById('summary-wood').innerText = woodName;
      }

      function setService(id, name, rate) {
        currentRate = rate;
        currentName = name;
        document.querySelectorAll('#carpenter-services .service-btn').forEach(b => {
          b.className = 'service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer';
        });
        const target = document.getElementById('s-' + id);
        if (target) {
          target.className = 'service-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer';
        }
        calc();
      }

      function setWood(id, name, mult) {
        woodMult = mult;
        woodName = name;
        document.querySelectorAll('#wood-group .wood-btn').forEach(b => {
          b.className = 'wood-btn px-2.5 py-2 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs text-slate-400 hover:text-white transition cursor-pointer';
        });
        const target = document.getElementById('w-' + id);
        if (target) {
          target.className = 'wood-btn px-2.5 py-2 rounded-xl bg-purple-950/70 border border-[#7C3AED] text-left text-xs text-white transition cursor-pointer font-semibold';
        }
        calc();
      }

      function updateM2(val) {
        currentM2 = parseInt(val, 10);
        calc();
      }

      function submitBooking() {
        const inp = document.getElementById('contact-input');
        if (!inp.value.trim()) {
          alert('Vennligst oppgi et gyldig telefonnummer.');
          return;
        }
        const btn = document.getElementById('submit-btn');
        btn.className = 'w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer';
        document.getElementById('btn-text').innerText = '✓ Befaring bestilt! Snekkeren ringer deg innen 24t.';
      }
    </script>
  </body>
</html>`;
    }

    // 1. CRAFTSMAN / SNEKKER / TEK17 APPLIKASJON
    if (isCraftsman) {
      return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} - Live Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#0A0D12] text-slate-100 min-h-screen">
    <div id="root" class="max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      <!-- Header -->
      <header class="flex items-center justify-between pb-5 border-b border-[#1F2937]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
            M
          </div>
          <div>
            <h1 class="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              ${projectName}
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40 font-mono">
                TEK17 Sertifisert
              </span>
            </h1>
            <p class="text-xs text-slate-400">Autonomt generert av AI Program (aiprogram.no)</p>
          </div>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium shrink-0">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Aktiv Sandkasse
        </span>
      </header>

      <!-- Main Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <!-- Left: Interactive Form -->
        <div class="lg:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span class="text-[#A78BFA]">✦</span>
              Interaktiv Priskalkulator & Oppdrag
            </h2>
            <span class="text-[11px] text-[#C4B5FD] bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
              Fastprisgaranti
            </span>
          </div>

          <!-- Service Category Buttons -->
          <div>
            <label class="block text-xs font-semibold text-slate-300 mb-2">Velg håndverkertjeneste:</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="service-group">
              <button id="btn-snekker" onclick="setService('snekker', 'Snekker & Tak', 850)" class="service-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer">
                <p>Snekker & Tak</p>
                <p class="text-[10px] text-slate-300 mt-1 font-mono">850 kr/t</p>
              </button>
              <button id="btn-rorlegger" onclick="setService('rorlegger', 'Rørlegger', 1150)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <p>Rørlegger</p>
                <p class="text-[10px] text-slate-400 mt-1 font-mono">1 150 kr/t</p>
              </button>
              <button id="btn-elektro" onclick="setService('elektro', 'Elektro', 1050)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <p>Elektro</p>
                <p class="text-[10px] text-slate-400 mt-1 font-mono">1 050 kr/t</p>
              </button>
              <button id="btn-maler" onclick="setService('maler', 'Malerarbeid', 720)" class="service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer">
                <p>Malerarbeid</p>
                <p class="text-[10px] text-slate-400 mt-1 font-mono">720 kr/t</p>
              </button>
            </div>
          </div>

          <!-- M2 Slider -->
          <div class="space-y-2 pt-1">
            <div class="flex justify-between text-xs">
              <span class="text-slate-300 font-semibold">Prosjektstørrelse:</span>
              <span class="font-bold text-[#A78BFA] text-sm" id="m2-val">45 m²</span>
            </div>
            <input
              type="range"
              id="slider"
              min="10"
              max="250"
              value="45"
              oninput="updateM2(this.value)"
              class="w-full accent-[#7C3AED] bg-[#0A0D12] h-2.5 rounded-lg cursor-pointer border border-slate-800"
            />
          </div>

          <!-- Urgency Toggle -->
          <div class="flex items-center gap-3 pt-1">
            <span class="text-xs text-slate-300 font-semibold">Oppstart:</span>
            <button id="urg-std" onclick="setUrgency('std', 1.0)" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/70 border border-[#7C3AED] text-white cursor-pointer transition">
              Standard (1-2 uker)
            </button>
            <button id="urg-rush" onclick="setUrgency('rush', 1.35)" class="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white cursor-pointer transition">
              Haster innen 48t (+35%)
            </button>
          </div>

          <!-- Contact Form -->
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
              class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span id="btn-text">Send inn uforpliktende forespørsel</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <!-- Right: Real-time Price Summary Card (Never cut off!) -->
        <div class="space-y-4">
          <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 shadow-2xl space-y-4">
            <div>
              <p class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Estimert Pristilbud
              </p>
              <div class="text-3xl font-extrabold text-white tracking-tight" id="price-display">
                kr 24 500,-
              </div>
            </div>

            <div class="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3">
              <div class="flex justify-between">
                <span class="text-slate-400">Valgt fag:</span>
                <span class="font-semibold text-white" id="summary-service">Snekker & Tak</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Timepris:</span>
                <span class="font-semibold text-white" id="summary-rate">850 kr/t</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Est. arbeidstid:</span>
                <span class="font-semibold text-white" id="summary-hours">ca. 11 timer</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Oppstart:</span>
                <span class="font-semibold text-emerald-400" id="summary-urgency">Standard</span>
              </div>
            </div>
          </div>

          <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 text-xs space-y-2">
            <p class="font-bold text-white flex items-center gap-1.5 text-emerald-400">
              ✓ Norsk Mestergaranti
            </p>
            <p class="text-[11px] text-slate-400 leading-relaxed">
              Arbeidet utføres av autoriserte mesterbedrifter i henhold til TEK17 med 5 års lovfestet reklamasjonsrett.
            </p>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentRate = 850;
      let currentM2 = 45;
      let currentName = 'Snekker & Tak';
      let urgencyMultiplier = 1.0;

      function calc() {
        const total = Math.round((currentM2 * 380 + currentRate * 8) * urgencyMultiplier);
        document.getElementById('price-display').innerText = 'kr ' + total.toLocaleString('no-NO') + ',-';
        document.getElementById('m2-val').innerText = currentM2 + ' m²';
        document.getElementById('summary-service').innerText = currentName;
        document.getElementById('summary-rate').innerText = currentRate + ' kr/t';
        document.getElementById('summary-hours').innerText = 'ca. ' + Math.round(currentM2 / 5 + 4) + ' timer';
        document.getElementById('summary-urgency').innerText = urgencyMultiplier > 1 ? 'Haster (48t)' : 'Standard';
      }

      function setService(id, name, rate) {
        currentRate = rate;
        currentName = name;
        document.querySelectorAll('.service-btn').forEach(b => {
          b.className = 'service-btn p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-left text-xs font-medium text-slate-400 hover:border-slate-600 hover:text-white transition cursor-pointer';
        });
        const target = document.getElementById('btn-' + id);
        if (target) {
          target.className = 'service-btn p-3 rounded-xl bg-purple-950/60 border border-[#7C3AED] text-left text-xs font-semibold text-white ring-1 ring-[#7C3AED] transition cursor-pointer';
        }
        calc();
      }

      function updateM2(val) {
        currentM2 = Number(val);
        calc();
      }

      function setUrgency(type, mult) {
        urgencyMultiplier = mult;
        const std = document.getElementById('urg-std');
        const rush = document.getElementById('urg-rush');
        if (type === 'std') {
          std.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-950/70 border border-[#7C3AED] text-white cursor-pointer transition';
          rush.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white cursor-pointer transition';
        } else {
          rush.className = 'px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-950/70 border border-amber-600 text-amber-200 cursor-pointer transition';
          std.className = 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white cursor-pointer transition';
        }
        calc();
      }

      function submitBooking() {
        const inp = document.getElementById('contact-input').value;
        if (!inp.trim()) {
          alert('Vennligst oppgi et telefonnummer eller e-postadresse.');
          return;
        }
        const btn = document.getElementById('submit-btn');
        btn.className = 'w-full py-3.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2';
        document.getElementById('btn-text').innerText = '✓ Forespørsel registrert! En mester kontakter deg innen kort tid.';
      }

      calc();
    </script>
  </body>
</html>`;
    }

    // 2. CRM / PIPELINE APPLIKASJON
    if (isCRM) {
      return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} - CRM</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; padding: 0; }</style>
  </head>
  <body class="bg-[#0A0D12] text-slate-100 min-h-screen p-4 sm:p-8">
    <div class="max-w-5xl mx-auto space-y-6 pb-20">
      <header class="flex items-center justify-between pb-5 border-b border-[#1F2937]">
        <div>
          <h1 class="text-xl font-bold tracking-tight text-white">${projectName}</h1>
          <p class="text-xs text-slate-400">Sanntids salgspipeline og oppdragsstyring</p>
        </div>
        <div class="flex gap-2">
          <input id="deal-title" placeholder="Nytt oppdrag / kunde..." class="bg-[#12161F] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white outline-none" />
          <button onclick="addDeal()" class="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold cursor-pointer">+ Legg til</button>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
          <h2 class="text-xs font-bold text-slate-300 pb-2 border-b border-[#1F2937] mb-3 uppercase">1. Nye Leads</h2>
          <div class="space-y-3" id="col-lead">
            <div class="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1">
              <p class="font-bold text-white">Takomlegging Villa</p>
              <p class="text-slate-400 text-[11px]">Lars Holm • 185 000 kr</p>
              <button onclick="move(this, 'col-befaring')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Befaring →</button>
            </div>
          </div>
        </div>

        <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
          <h2 class="text-xs font-bold text-slate-300 pb-2 border-b border-[#1F2937] mb-3 uppercase">2. Befaring Avtalt</h2>
          <div class="space-y-3" id="col-befaring">
            <div class="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1">
              <p class="font-bold text-white">Totalrehabilitering Bad</p>
              <p class="text-slate-400 text-[11px]">Kari Lie • 240 000 kr</p>
              <button onclick="move(this, 'col-tilbud')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Tilbud sendt →</button>
            </div>
          </div>
        </div>

        <div class="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4">
          <h2 class="text-xs font-bold text-emerald-400 pb-2 border-b border-[#1F2937] mb-3 uppercase">3. Tilbud Sendt / Vunnet</h2>
          <div class="space-y-3" id="col-tilbud">
            <div class="bg-[#0E121A] border border-emerald-900/40 rounded-xl p-3 text-xs space-y-1">
              <p class="font-bold text-white">El-kontroll Næringsbygg</p>
              <p class="text-slate-400 text-[11px]">Nordic Eiendom • 65 000 kr</p>
              <span class="text-[10px] text-emerald-400 font-mono">Signert avtale</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      function move(btn, targetId) {
        const card = btn.parentElement;
        btn.remove();
        document.getElementById(targetId).appendChild(card);
      }
      function addDeal() {
        const inp = document.getElementById('deal-title');
        if (!inp.value.trim()) return;
        const d = document.createElement('div');
        d.className = 'bg-[#0E121A] border border-[#1F2937] rounded-xl p-3 text-xs space-y-1';
        d.innerHTML = '<p class="font-bold text-white">' + inp.value + '</p><p class="text-slate-400 text-[11px]">Ny kunde • 95 000 kr</p><button onclick="move(this, \\'col-befaring\\')" class="text-[10px] text-[#A78BFA] cursor-pointer font-semibold pt-1">Befaring →</button>';
        document.getElementById('col-lead').appendChild(d);
        inp.value = '';
      }
    </script>
  </body>
</html>`;
    }

    // 3. FULL DYNAMISK REACT / BABEL STANDALONE SANDKASSE (BOLT.NEW STYLE)
    return `<!DOCTYPE html>
<html lang="no" class="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName} - Live Forhåndsvisning</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              brand: { 500: '#7C3AED', 600: '#6D28D9' }
            }
          }
        }
      };
    </script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      body { background-color: #0A0D12; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#0A0D12] text-slate-100 min-h-screen">
    <div id="root">
      <div class="flex flex-col items-center justify-center min-h-[380px] p-6 text-slate-400 gap-3">
        <div class="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-mono text-slate-400">Kompilerer og starter React-sandkasse...</p>
      </div>
    </div>

    <script>
      const ICON_SVGS = {
        HeartPulse: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
        Calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
        Clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        ShieldCheck: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
        CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
        Check: '<path d="M20 6 9 17l-5-5"/>',
        Video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
        MapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
        Pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
        FileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
        Phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
        Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>',
        ChevronRight: '<path d="m9 18 6-6-6-6"/>',
        ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
        Activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
        Award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
        AlertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
        Hammer: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-6.36 6.36a1 1 0 0 0-.29.71v3.38l-4 4"/><path d="m18 10 4-4"/>',
        Ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/>',
        Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
        Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
        Trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
        Trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
        ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
        ArrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
        ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
        Copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
        Layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
        Database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
        Server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
        Play: '<polygon points="6 3 20 12 6 21 6 3"/>',
        RotateCw: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
        CheckCheck: '<path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/>',
        X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
        Menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
        Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'
      };

      function createIcon(name) {
        return function IconComp(props) {
          const className = (props && props.className) || 'w-4 h-4 inline-block';
          const innerSvg = ICON_SVGS[name] || '<circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/>';
          return React.createElement('svg', {
            ...props,
            className: className,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            dangerouslySetInnerHTML: { __html: innerSvg }
          });
        };
      }

      const lucideProxy = new Proxy({}, {
        get: (target, prop) => {
          if (typeof prop === 'string') {
            return createIcon(prop);
          }
          return createIcon('Check');
        }
      });

      // Sandkasse Mock Fetch
      const origFetch = window.fetch;
      window.fetch = async (url, options) => {
        console.log('[Sandkasse API]:', url, options);
        if (typeof url === 'string' && url.includes('/api/')) {
          return new Response(JSON.stringify({
            success: true,
            status: 200,
            message: 'Sandkasse mock-respons',
            timestamp: new Date().toISOString()
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return origFetch(url, options);
      };

      // Mock Next.js navigation & components
      const Link = (props) => React.createElement('a', { href: props.href || '#', ...props }, props.children);
      const Image = (props) => React.createElement('img', { ...props, alt: props.alt || '' });

      function runSandbox() {
        const rootEl = document.getElementById('root');
        let code = ${JSON.stringify(rawCode).replace(/<\/script>/gi, "<\\/script>")};

        if (!code || !code.trim()) {
          rootEl.innerHTML = '<div class="p-8 text-center text-slate-500 font-mono text-xs">Venter på kildekode...</div>';
          return;
        }

        try {
          // Remove "use client";
          code = code.replace(/['"]use client['"];?/g, '');

          // Strip React imports
          code = code.replace(/import\s+(?:React,\s*)?(?:\{[^}]*\})?\s*from\s*['"]react['"];?/g, '');

          // Replace lucide-react imports with proxy assignments
          code = code.replace(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/g, (match, p1) => {
            const icons = p1.split(',').map(s => s.trim()).filter(Boolean);
            return icons.map(icon => 'const ' + icon + ' = lucideProxy.' + icon + ';').join('\\n');
          });

          // Replace next/link and next/image
          code = code.replace(/import\s+Link\s+from\s*['"]next\\/link['"];?/g, 'const Link = (props) => React.createElement("a", { href: props.href || "#", ...props }, props.children);');
          code = code.replace(/import\s+Image\s+from\s*['"]next\\/image['"];?/g, 'const Image = (props) => React.createElement("img", { ...props, alt: props.alt || "" });');

          // Strip remaining imports
          code = code.replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, '');

          // Export handling
          let defaultCompName = 'App';
          if (/export\s+default\s+function\s+([A-Za-z0-9_]+)/.test(code)) {
            defaultCompName = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/)[1];
            code = code.replace(/export\s+default\s+function/, 'function');
          } else if (/export\s+default\s+([A-Za-z0-9_]+)/.test(code)) {
            defaultCompName = code.match(/export\s+default\s+([A-Za-z0-9_]+)/)[1];
            code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, '');
          }

          if (typeof Babel === 'undefined') {
            throw new Error('Babel Standalone biblioteket laster inn... Prøv på nytt om et øyeblikk.');
          }

          // Transpile with Babel
          const transpiled = Babel.transform(code, {
            presets: ['react', 'typescript'],
            filename: 'preview.tsx'
          }).code;

          // Execute
          const execFn = new Function(
            'React',
            'useState',
            'useEffect',
            'useMemo',
            'useCallback',
            'useRef',
            'lucideProxy',
            'Link',
            'Image',
            transpiled + '\\nreturn typeof ' + defaultCompName + ' !== "undefined" ? ' + defaultCompName + ' : null;'
          );

          const Component = execFn(
            React,
            React.useState,
            React.useEffect,
            React.useMemo,
            React.useCallback,
            React.useRef,
            lucideProxy,
            Link,
            Image
          );

          if (!Component) {
            throw new Error('Fant ingen gyldig React-komponent å rendre i app/page.tsx.');
          }

          // Render
          const root = ReactDOM.createRoot(rootEl);
          root.render(React.createElement(Component));
        } catch (err) {
          console.error('[Sandbox Compiler Error]:', err);
          rootEl.innerHTML = \`
            <div class="p-6 max-w-2xl mx-auto my-8 bg-[#12161F] border border-amber-500/40 rounded-2xl shadow-2xl space-y-4">
              <div class="flex items-center gap-3 text-amber-400">
                <span class="text-xl">⚡</span>
                <h3 class="font-bold text-sm">Sanntids React-sandkasse</h3>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">
                Koden evalueres i sanntid. Ved kildekodesyntaks under redigering:
                <code class="block mt-2 p-3 bg-[#0A0D12] text-amber-300 font-mono text-[11px] rounded-xl border border-amber-900/50 overflow-x-auto whitespace-pre-wrap">\${err.message}</code>
              </p>
              <div class="pt-2 border-t border-[#1F2937] flex items-center justify-between">
                <span class="text-[11px] text-slate-400">Next.js 15 & Prisma PostgreSQL aktiv</span>
                <button onclick="location.reload()" class="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl cursor-pointer">
                  Last inn på nytt
                </button>
              </div>
            </div>
          \`;
        }
      }

      if (typeof Babel !== 'undefined' && typeof React !== 'undefined') {
        runSandbox();
      } else {
        window.addEventListener('load', runSandbox);
        setTimeout(runSandbox, 1500);
      }
    </script>
  </body>
</html>`;
  }, [rawCode, projectName, files]);

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
      {/* Top Sandbox Toolbar */}
      <div className="h-9 bg-[#12161F]/60 border-b border-[#1E2430] px-3 flex items-center justify-between select-none shrink-0">
        {/* Left: Device switcher */}
        <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1E2430]">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1 rounded-md text-xs transition cursor-pointer ${
              device === "desktop"
                ? "bg-[#1E2430] text-slate-100 font-medium"
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
                ? "bg-[#1E2430] text-slate-100 font-medium"
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
                ? "bg-[#1E2430] text-slate-100 font-medium"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobil visning (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Live Sandbox indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sandkasse: {pageFile?.path || "app/page.tsx"}
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-[10px] text-slate-400 hidden md:inline">Next.js 15 & Tailwind JIT</span>
        </div>

        {/* Right: Refresh & Popout */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setReloadKey((prev) => prev + 1)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1E2430] transition cursor-pointer"
            title="Last inn på nytt"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePopout}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1E2430] transition cursor-pointer"
            title="Åpne i ny fane"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 p-2 sm:p-3 flex items-start justify-center overflow-auto bg-[#07090D]">
        <div
          className="h-full w-full border border-[#1E2430] rounded-lg overflow-hidden shadow-lg transition-all duration-300 bg-[#0A0D12]"
          style={{ width: deviceWidths[device], maxWidth: "100%" }}
        >
          <iframe
            key={reloadKey}
            srcDoc={iframeHtml}
            title="AI Program Live Sandbox Preview"
            className="w-full h-full border-none min-h-[550px]"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  );
}
