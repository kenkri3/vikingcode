import { Project } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-vikingmester",
    userId: "user-demo-1",
    name: "VikingMester - Håndverkerportal",
    description: "Komplett booking- og tilbudssystem for norske håndverkerbedrifter med kalender og kalkulator.",
    hasDatabase: true,
    githubRepo: "viking-org/vikingmester-portal",
    railwayId: "rw_mester_prod_89",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Calendar, Hammer, ShieldCheck, Clock, CheckCircle2, ChevronRight, Phone, Star, Sparkles } from 'lucide-react';

export default function BookingPortal() {
  const [selectedService, setSelectedService] = useState('tømrer');
  const [squareMeters, setSquareMeters] = useState(45);
  const [urgency, setUrgency] = useState('standard');
  const [submitted, setSubmitted] = useState(false);

  const baseRates: Record<string, number> = {
    tømrer: 850,
    rørlegger: 1100,
    elektriker: 1050,
    maler: 720
  };

  const calculatedEstimate = Math.round(
    (squareMeters * 350) + (baseRates[selectedService] * 4) * (urgency === 'haster' ? 1.4 : 1.0)
  );

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans p-6 md:p-12">
      {/* Top Banner */}
      <header className="max-w-5xl mx-auto flex items-center justify-between pb-8 border-b border-[#1F2937]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Hammer className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              VikingMester <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-[#C4B5FD] border border-purple-700/50">Pro Portal</span>
            </h1>
            <p className="text-xs text-slate-400">Autonom oppdragsflyt og prisberegning for håndverkere</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            8 Mestere på vakt i Vestfold
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Booking & Calculator (7 cols) */}
        <section className="lg:col-span-7 bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#A78BFA]" />
            Beregn pristilbud & book befaring
          </h2>
          <p className="text-sm text-slate-400 mb-6">Velg fagfelt og oppgi ca. areal for veiledende estimat.</p>

          {/* Service Picker */}
          <label className="text-xs font-medium uppercase tracking-wider text-slate-400 block mb-2">1. Velg håndverkerfag</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { id: 'tømrer', label: 'Tømrer / Snekker' },
              { id: 'rørlegger', label: 'Rørlegger' },
              { id: 'elektriker', label: 'Elektriker' },
              { id: 'maler', label: 'Malerarbeid' },
            ].map((srv) => (
              <button
                key={srv.id}
                onClick={() => setSelectedService(srv.id)}
                className={\`p-3 rounded-xl text-left border text-xs font-medium transition-all \${
                  selectedService === srv.id
                    ? 'bg-purple-950/40 border-[#7C3AED] text-white shadow-md shadow-purple-950/50 ring-1 ring-[#7C3AED]'
                    : 'bg-[#0E121A] border-[#1F2937] text-slate-400 hover:border-slate-600'
                }\`}
              >
                {srv.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium uppercase tracking-wider text-slate-400">2. Estimert prosjektareal</label>
              <span className="text-sm font-semibold text-[#A78BFA]">{squareMeters} m²</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={squareMeters}
              onChange={(e) => setSquareMeters(Number(e.target.value))}
              className="w-full accent-[#7C3AED] bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Urgency */}
          <div className="mb-8">
            <label className="text-xs font-medium uppercase tracking-wider text-slate-400 block mb-2">3. Ønsket oppstart</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUrgency('standard')}
                className={\`py-2.5 px-4 rounded-xl text-xs font-medium border text-center transition-all \${
                  urgency === 'standard'
                    ? 'bg-purple-950/40 border-[#7C3AED] text-white ring-1 ring-[#7C3AED]'
                    : 'bg-[#0E121A] border-[#1F2937] text-slate-400 hover:border-slate-600'
                }\`}
              >
                Standard (innen 14 dager)
              </button>
              <button
                onClick={() => setUrgency('haster')}
                className={\`py-2.5 px-4 rounded-xl text-xs font-medium border text-center transition-all \${
                  urgency === 'haster'
                    ? 'bg-purple-950/40 border-[#7C3AED] text-white ring-1 ring-[#7C3AED]'
                    : 'bg-[#0E121A] border-[#1F2937] text-slate-400 hover:border-slate-600'
                }\`}
              >
                Hasteoppdrag (innen 48 timer)
              </button>
            </div>
          </div>

          {/* Contact Input Form */}
          <div className="space-y-4 pt-4 border-t border-[#1F2937]">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Ditt telefonnummer eller e-post</label>
              <input
                type="text"
                placeholder="f.eks. 900 00 000 eller post@firma.no"
                className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>
            <button
              onClick={() => setSubmitted(true)}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Befaring forespurt! Vi ringer innen 1 time.
                </>
              ) : (
                <>
                  Bekreft uforpliktende befaring
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>

        {/* Right: Estimate Breakdown & Trust Badges (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Veiledende Prisestimat</h3>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-extrabold text-white">kr {calculatedEstimate.toLocaleString('no-NO')}</span>
              <span className="text-xs text-slate-400">inkl. mva</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 border-t border-[#1F2937] pt-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Fagområde:</span>
                <span className="capitalize font-medium text-white">{selectedService}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beregnet arbeidstid:</span>
                <span className="font-medium text-white">ca. {Math.round(squareMeters / 10 + 4)} timer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Mester-garanti:</span>
                <span className="text-emerald-400 font-medium">5 års reklamasjonsrett</span>
              </div>
            </div>
          </div>

          <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hvorfor velge VikingMester?</h4>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Sentralt godkjente fagfolk</p>
                <p className="text-[11px] text-slate-400">Kvalitetssikret i henhold til våtromsnormen og TEK17.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#A78BFA] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-white">Fastprisavtaler</p>
                <p className="text-[11px] text-slate-400">Ingen skjulte tilleggsfakturaer eller uforutsette kostnader.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
`,
      },
      {
        path: "prisma/schema.prisma",
        content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Booking {
  id          String   @id @default(uuid())
  service     String
  squareMeter Int
  contact     String
  status      String   @default("PENDING")
  estimate    Float
  createdAt   DateTime @default(now())
}
`,
      },
      {
        path: "railway.json",
        content: `{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
`,
      },
    ],
  },
];
