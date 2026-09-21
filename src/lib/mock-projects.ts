import { Project } from "./types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-vikingmester",
    userId: "user-demo-1",
    name: "VikingMester - Håndverkerportal",
    description: "Komplett booking- og tilbudssystem for norske håndverkerbedrifter med kalender og kalkulator.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/vikingmester-portal",
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
  const [selectedService, setSelectedService] = useState('snekker');
  const [squareMeters, setSquareMeters] = useState(45);
  const [urgency, setUrgency] = useState('standard');
  const [contact, setContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const baseRates: Record<string, { rate: number; name: string }> = {
    snekker: { rate: 850, name: 'Snekker & Tak' },
    rorlegger: { rate: 1150, name: 'Rørlegger' },
    elektro: { rate: 1050, name: 'Elektro' },
    maler: { rate: 720, name: 'Malerarbeid' },
  };

  const currentRate = baseRates[selectedService] || baseRates.snekker;
  const calculatedEstimate = Math.round(
    (squareMeters * 380) + (currentRate.rate * 8) * (urgency === 'haster' ? 1.35 : 1.0)
  );

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans p-4 sm:p-8 md:p-10">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40">
            V
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              VikingMester - Håndverkerportal
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40">TEK17 Sertifisert</span>
            </h1>
            <p className="text-xs text-slate-400">Autonom oppdragsflyt og prisberegning for mesterbedrifter</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Aktiv Sandbox
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-[#A78BFA]">✦</span>
              Interaktiv Oppdragsbestilling
            </h2>
            <span className="text-[11px] text-[#C4B5FD] bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/50 font-mono">
              TEK17 Sertifisert
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Velg ønsket tjeneste og angi prosjektomfang for et umiddelbart og forpliktende tilbud.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'snekker', label: 'Snekker & Tak' },
              { id: 'rorlegger', label: 'Rørlegger' },
              { id: 'elektro', label: 'Elektro' },
              { id: 'maler', label: 'Malerarbeid' },
            ].map((srv) => (
              <button
                key={srv.id}
                type="button"
                onClick={() => setSelectedService(srv.id)}
                className={\`p-3 rounded-xl text-left text-xs font-semibold transition cursor-pointer \${
                  selectedService === srv.id
                    ? 'bg-purple-950/70 border border-[#7C3AED] text-white ring-1 ring-[#7C3AED] shadow-md shadow-purple-950/50'
                    : 'bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:border-slate-600 hover:text-white'
                }\`}
              >
                {srv.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Prosjektstørrelse:</span>
              <span className="font-bold text-[#A78BFA]">{squareMeters} m²</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              value={squareMeters}
              onChange={(e) => setSquareMeters(Number(e.target.value))}
              className="w-full accent-[#7C3AED] bg-[#0A0D12] h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Oppgi telefonnummer eller e-post for bekreftelse..."
              className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => {
                if (!contact.trim()) {
                  alert('Vennligst oppgi et telefonnummer eller en e-postadresse.');
                  return;
                }
                setSubmitted(true);
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Forespørsel sendt! En mester ringer innen 1 time.</span>
                </>
              ) : (
                <>
                  <span>Send inn uforpliktende forespørsel</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 shadow-xl">
            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Estimert Pristilbud
            </p>
            <div className="text-2xl font-extrabold text-white mb-2">
              kr {calculatedEstimate.toLocaleString('no-NO')},-
            </div>
            <div className="space-y-2 text-xs text-slate-300 border-t border-[#1F2937] pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Valgt fag:</span>
                <span className="font-medium text-white">{currentRate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Est. arbeidstid:</span>
                <span className="font-medium text-white">ca. {Math.round(squareMeters / 6 + 4)} timer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Oppstart:</span>
                <span className="text-emerald-400 font-medium">Innen 48t</span>
              </div>
            </div>
          </div>

          <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-5 text-xs space-y-3">
            <p className="font-semibold text-white">✓ Viking Garanti</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Alle oppdrag er sikret med Norsk Mesterbrev og 5 års reklamasjonsrett i henhold til håndverkertjenesteloven.
            </p>
          </div>
        </div>
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
  {
    id: "proj-vikingnet",
    userId: "user-demo-1",
    name: "Vikingnet",
    description: "B2B bedriftsnettverk og ressursportal med medlemskatalog og kunnskapsdatabase.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/vikingnet-portal",
    railwayId: "rw_net_prod_102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Globe, Users, BookOpen, Search, ArrowUpRight, Sparkles, Building2 } from 'lucide-react';

export default function VikingNetPortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('Alle');

  const members = [
    { name: 'Vestfold Entreprenør AS', industry: 'Bygg & Anlegg', city: 'Tønsberg', rating: 4.9, activeProjects: 14 },
    { name: 'Horten Tech Hub', industry: 'IT & Programvare', city: 'Horten', rating: 5.0, activeProjects: 8 },
    { name: 'Oslofjord Logistikk', industry: 'Transport', city: 'Sandefjord', rating: 4.8, activeProjects: 22 },
    { name: 'Nordic VVS Spesialist', industry: 'VVS & Energi', city: 'Tønsberg', rating: 4.7, activeProjects: 11 },
  ];

  const filtered = members.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInd = selectedIndustry === 'Alle' || m.industry === selectedIndustry;
    return matchesSearch && matchesInd;
  });

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">
            VN
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Vikingnet Bedriftsportal
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/40">B2B Nettverk</span>
            </h1>
            <p className="text-xs text-slate-400">Verdiskapende samarbeid og felles anbudsportal</p>
          </div>
        </div>
        <button
          onClick={() => alert('Søknadsskjema åpnet: Bli medlem i Vikingnet')}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md"
        >
          + Bli partner
        </button>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Søk etter bedrift, bransje eller by..."
              className="w-full bg-[#12161F] border border-[#1F2937] focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {['Alle', 'Bygg & Anlegg', 'IT & Programvare', 'Transport'].map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={\`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer \${
                  selectedIndustry === ind
                    ? 'bg-blue-950/80 text-blue-300 border border-blue-700/50'
                    : 'bg-[#12161F] text-slate-400 border border-[#1F2937] hover:text-white'
                }\`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((m, idx) => (
            <div key={idx} className="bg-[#12161F] border border-[#1F2937] hover:border-blue-500/50 rounded-2xl p-5 transition group">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">{m.name}</h3>
                  <p className="text-xs text-slate-400">{m.industry} • {m.city}</p>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0A0D12] text-amber-300 border border-slate-800">
                  ★ {m.rating}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs text-slate-400">
                <span>{m.activeProjects} aktive anbud</span>
                <button
                  onClick={() => alert(\`Kobler deg opp med \${m.name}...\`)}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Kontakt</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
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

model NetworkMember {
  id        String   @id @default(uuid())
  name      String
  industry  String
  city      String
  rating    Float    @default(5.0)
  createdAt DateTime @default(now())
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
  {
    id: "proj-vikingcrm",
    userId: "user-demo-1",
    name: "VikingCRM",
    description: "Intelligent B2B CRM og salgspipeline for oppfølging av leads og tilbud.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/vikingcrm",
    railwayId: "rw_crm_prod_44",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Kanban, UserCheck, DollarSign, Plus, CheckCircle, Clock } from 'lucide-react';

export default function VikingCRM() {
  const [deals, setDeals] = useState([
    { id: '1', title: 'Takomlegging Villa', customer: 'Lars Holm', val: '185 000 kr', stage: 'lead' },
    { id: '2', title: 'Totalrehabilitering Bad', customer: 'Kari Lie', val: '240 000 kr', stage: 'befaring' },
    { id: '3', title: 'El-kontroll Næringsbygg', customer: 'Nordic Eiendom', val: '65 000 kr', stage: 'tilbud' },
    { id: '4', title: 'Maling Fasadeprosjekt', customer: 'Sameiet Sentrum', val: '120 000 kr', stage: 'vunnet' },
  ]);

  const [newDealTitle, setNewDealTitle] = useState('');

  const addDeal = () => {
    if (!newDealTitle.trim()) return;
    setDeals([
      ...deals,
      {
        id: String(Date.now()),
        title: newDealTitle,
        customer: 'Ny kunde',
        val: '95 000 kr',
        stage: 'lead',
      },
    ]);
    setNewDealTitle('');
  };

  const stages = [
    { id: 'lead', label: '1. Nye Henvendelser' },
    { id: 'befaring', label: '2. Befaring Avtalt' },
    { id: 'tilbud', label: '3. Tilbud Sendt' },
    { id: 'vunnet', label: '4. Akseptert / Vunnet' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            VikingCRM Salgspipeline
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">Sanntid</span>
          </h1>
          <p className="text-xs text-slate-400">Automatisk oppfølging og anbudskonvertering</p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newDealTitle}
            onChange={(e) => setNewDealTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addDeal()}
            placeholder="Nytt oppdrag..."
            className="bg-[#12161F] border border-[#1F2937] rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
          />
          <button
            onClick={addDeal}
            className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Legg til</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stg) => {
          const colDeals = deals.filter((d) => d.stage === stg.id);
          return (
            <div key={stg.id} className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-4 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2937] mb-3">
                <span className="text-xs font-bold text-slate-300">{stg.label}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0A0D12] text-slate-400 border border-slate-800">
                  {colDeals.length}
                </span>
              </div>
              <div className="space-y-3 flex-1">
                {colDeals.map((d) => (
                  <div key={d.id} className="bg-[#0E121A] border border-[#1F2937] rounded-xl p-3.5 shadow-sm space-y-2 hover:border-[#7C3AED]/50 transition">
                    <p className="text-xs font-bold text-white">{d.title}</p>
                    <p className="text-[11px] text-slate-400">{d.customer}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-[#1F2937] text-[11px]">
                      <span className="font-semibold text-emerald-400">{d.val}</span>
                      <button
                        onClick={() => {
                          const next = stg.id === 'lead' ? 'befaring' : stg.id === 'befaring' ? 'tilbud' : 'vunnet';
                          setDeals(deals.map((deal) => (deal.id === d.id ? { ...deal, stage: next } : deal)));
                        }}
                        className="text-[10px] text-[#A78BFA] hover:text-white font-medium cursor-pointer"
                      >
                        Neste fase →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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

model Deal {
  id        String   @id @default(uuid())
  title     String
  customer  String
  value     Float
  stage     String   @default("lead")
  createdAt DateTime @default(now())
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
  {
    id: "proj-helge",
    userId: "user-demo-1",
    name: "Helge",
    description: "Kundeadministrasjon, timeføring og faktureringsmodul for selvstendig næringsdrivende.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/helge-admin",
    railwayId: "rw_helge_prod_12",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Clock, Play, Square, CheckCircle, FileText, Download } from 'lucide-react';

export default function HelgeAdmin() {
  const [isTracking, setIsTracking] = useState(false);
  const [seconds, setSeconds] = useState(3840); // 1t 4m

  const formatTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    return \`\${hrs}t \${mins}m\`;
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Helge Kundeadministrasjon
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/40">Fakturamodul</span>
          </h1>
          <p className="text-xs text-slate-400">Automatisk timeføring, prosjektstyring og EHF-fakturaer</p>
        </div>
        <button
          onClick={() => alert('Genererer EHF-fakturafiler for forrige måned...')}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Eksporter EHF</span>
        </button>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Aktiv Timeføring</h2>
          <div className="p-4 rounded-xl bg-[#0A0D12] border border-[#1F2937] flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Pågående prosjekt:</p>
              <p className="text-sm font-bold text-white">Kunde: Sande Eiendom - Våtromskontroll</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-mono font-bold text-[#A78BFA]">{formatTime(seconds)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={\`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer \${
                isTracking ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white'
              }\`}
            >
              {isTracking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTracking ? 'Stopp timeføring' : 'Start timeføring'}</span>
            </button>
          </div>
        </div>

        <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Månedlig oversikt</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#1F2937] pb-2">
              <span className="text-slate-400">Timer ført:</span>
              <span className="font-bold text-white">142,5 timer</span>
            </div>
            <div className="flex justify-between border-b border-[#1F2937] pb-2">
              <span className="text-slate-400">Fakturerbart:</span>
              <span className="font-bold text-emerald-400">128 250 kr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Utestående faktura:</span>
              <span className="font-bold text-amber-400">34 000 kr</span>
            </div>
          </div>
        </div>
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

model TimeEntry {
  id        String   @id @default(uuid())
  client    String
  hours     Float
  rate      Float
  createdAt DateTime @default(now())
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
  {
    id: "proj-opplevhorten",
    userId: "user-demo-1",
    name: "Opplev Horten",
    description: "Turist-, arrangements- og opplevelsesguide for kystbyen Horten.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/opplev-horten",
    railwayId: "rw_horten_prod_77",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Compass, MapPin, Calendar, Star, ChevronRight } from 'lucide-react';

export default function OpplevHorten() {
  const [filter, setFilter] = useState('Alle');

  const places = [
    { title: 'Karljohansvern Orlogsstasjon', cat: 'Kultur & Historie', rating: 4.9, img: '🏛️', open: 'Åpent hele året' },
    { title: 'Marinemuseet', cat: 'Museum', rating: 4.8, img: '⚓', open: 'Tirs-Søn 11-16' },
    { title: 'Horten Gjestehavn & Sjøbad', cat: 'Friluftsliv', rating: 4.7, img: '🌊', open: 'Alltid åpent' },
    { title: 'Preus Museum (Fotografi)', cat: 'Museum', rating: 4.9, img: '📷', open: 'Ons-Søn 11-16' },
  ];

  const filtered = filter === 'Alle' ? places : places.filter((p) => p.cat === filter);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-cyan-900/40">
            ⛵
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Opplev Horten
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">Lokalguide</span>
            </h1>
            <p className="text-xs text-slate-400">Kultur, kyststi, museer og skjærgårdsopplevelser</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="flex gap-2 overflow-x-auto">
          {['Alle', 'Kultur & Historie', 'Museum', 'Friluftsliv'].map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={\`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer \${
                filter === c ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50' : 'bg-[#12161F] text-slate-400 border border-[#1F2937]'
              }\`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((p, idx) => (
            <div key={idx} className="bg-[#12161F] border border-[#1F2937] hover:border-cyan-500/50 rounded-2xl p-5 transition group cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{p.img}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition">{p.title}</h3>
                  <p className="text-xs text-slate-400">{p.cat} • {p.open}</p>
                </div>
                <span className="text-[11px] font-mono text-amber-300">★ {p.rating}</span>
              </div>
            </div>
          ))}
        </div>
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

model Attraction {
  id        String   @id @default(uuid())
  title     String
  category  String
  rating    Float
  createdAt DateTime @default(now())
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
  {
    id: "proj-eidsfossmarked",
    userId: "user-demo-1",
    name: "Eidsfossmarked",
    description: "Markedsportal og digital standplass-bestilling for det historiske jernverket på Eidsfoss.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/eidsfoss-marked",
    railwayId: "rw_eidsfoss_prod_09",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Store, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export default function EidsfossMarked() {
  const [standType, setStandType] = useState('Standard (3x3m)');
  const [booked, setBooked] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Eidsfoss Jernverksmarked
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">Kulturmarked</span>
          </h1>
          <p className="text-xs text-slate-400">Kunsthåndverk, antikviteter, lokalmat og historisk sus</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Bestill Standplass til Vårmarkedet</h2>
          <p className="text-xs text-slate-400">Sikre deg plass i Gata eller Gamle Verkstedbygningen.</p>

          <div className="space-y-2">
            {['Standard Bod (3x3m) - kr 950,-', 'Matbod med strøm - kr 1 450,-', 'Hobby- og kunstbord - kr 550,-'].map((opt) => (
              <button
                key={opt}
                onClick={() => setStandType(opt)}
                className={\`w-full p-3 rounded-xl text-left text-xs font-semibold transition cursor-pointer \${
                  standType === opt
                    ? 'bg-emerald-950/50 border border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-[#0E121A] border border-[#1F2937] text-slate-400 hover:text-white'
                }\`}
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={() => setBooked(true)}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
          >
            {booked ? '✓ Standplass reservert! Vi sender bekreftelse.' : 'Bekreft reservasjon'}
          </button>
        </div>

        <div className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 space-y-3 text-xs">
          <h3 className="font-bold text-white">Markedsinformasjon</h3>
          <p className="text-slate-400">Dato: Lørdag og søndag 17.–18. mai 2026</p>
          <p className="text-slate-400">Sted: Eidsfoss Gamle Jernverk, Vestfold</p>
          <div className="p-3 bg-[#0E121A] rounded-xl border border-slate-800">
            <p className="font-semibold text-emerald-400">Forventet publikum</p>
            <p className="text-slate-300">Over 4 500 besøkende i løpet av helgen.</p>
          </div>
        </div>
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

model StandBooking {
  id        String   @id @default(uuid())
  type      String
  exhibitor String
  status    String   @default("CONFIRMED")
  createdAt DateTime @default(now())
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
  {
    id: "proj-opplevtonsberg",
    userId: "user-demo-1",
    name: "Opplev Tønsberg",
    description: "Norges eldste bys offisielle opplevelsesportal – Slottsfjellet, Brygga og kulturliv.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/opplev-tonsberg",
    railwayId: "rw_tonsberg_prod_55",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Sun, Utensils, Music, Anchor, Star } from 'lucide-react';

export default function OpplevTonsberg() {
  const [category, setCategory] = useState('Brygga & Servering');

  const highlights = [
    { name: 'Brygga i Tønsberg', desc: 'Restauranter, uteliv og båtliv langs kanalen', icon: '⛵', rating: 4.9 },
    { name: 'Slottsfjellstårnet', desc: 'Middelalderhistorie og fantastisk utsikt over byen', icon: '🏰', rating: 4.8 },
    { name: 'Haugar Kunstmuseum', desc: 'Moderne samtidskunst i historiske omgivelser', icon: '🎨', rating: 4.7 },
    { name: 'Slottsfjellfestivalen', desc: 'Skandinavias råeste musikkfestival på fjellet', icon: '🎵', rating: 5.0 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-10 font-sans">
      <header className="max-w-4xl mx-auto flex items-center justify-between pb-6 border-b border-[#1F2937] mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Opplev Tønsberg
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40">Norges eldste by</span>
          </h1>
          <p className="text-xs text-slate-400">Byguide for kultur, bespisning, Slottsfjellet og kystopplevelser</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {highlights.map((h, idx) => (
            <div key={idx} className="bg-[#12161F] border border-[#1F2937] hover:border-purple-600/50 rounded-2xl p-5 transition group cursor-pointer">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{h.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition">{h.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{h.desc}</p>
                </div>
                <span className="text-[11px] font-mono text-amber-300">★ {h.rating}</span>
              </div>
            </div>
          ))}
        </div>
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

model Event {
  id        String   @id @default(uuid())
  title     String
  location  String
  date      DateTime
  createdAt DateTime @default(now())
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
