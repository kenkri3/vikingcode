import { Project } from "./types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-main",
    userId: "user-default",
    name: "Mitt Prosjekt",
    description: "Ditt nye fullstack webprosjekt generert med AI Program Ultra.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/mitt-prosjekt",
    railwayId: "rw_main_prod",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Globe,
  Code2,
  Database,
  Rocket
} from 'lucide-react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Header */}
      <header className="border-b border-[#1F2937]/80 bg-[#0A0D12]/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-black text-white shadow-lg shadow-purple-900/40">
            AI
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">Mitt Prosjekt</h1>
            <p className="text-[10px] text-slate-400">Bygget med AI Program Ultra</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#funksjoner" className="text-xs text-slate-300 hover:text-white transition hidden sm:inline-block">Funksjoner</a>
          <a href="#kontakt" className="text-xs text-slate-300 hover:text-white transition hidden sm:inline-block">Kontakt</a>
          <a href="#kontakt" className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-900/30">
            Kom i gang
          </a>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-[11px] text-[#C4B5FD] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Produksjonsklar kildekode generert i sanntid</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Velkommen til ditt nye prosjekt
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Dette er din nye webapplikasjon. Du kan be AI Program Ultra i chatten om å endre designet, opprette nye undersider, legge til database eller integrere betalinger.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <a
            href="#kontakt"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-purple-900/40"
          >
            <span>Utforsk løsningen</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#funksjoner"
            className="px-6 py-3 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition"
          >
            Se funksjoner
          </a>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section id="funksjoner" className="py-16 px-6 max-w-5xl mx-auto border-t border-[#1F2937]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-[#A78BFA]">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Autonom Koding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full TypeScript og React-kompatibilitet. AI-agenten forstår hele prosjektet og oppdaterer kildekoden direkte.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-800/40 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Fler-sides Arkitektur</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bygg og test undersider (/booking, /kontakt, /om-oss) med sanntids navigasjon i sandkassen før produksjon.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Produksjonsklar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Klar for 1-klikk deploy til Railway eller eksport til GitHub med PostgreSQL og Prisma integrert.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Contact / Lead Section */}
      <section id="kontakt" className="py-16 px-6 max-w-xl mx-auto border-t border-[#1F2937] text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Klar til å tilpasse siden?</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Skriv i chatten til venstre for å endre farger, logo, seksjoner eller legge til nye undersider.
        </p>
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Takk! Ditt henvendelsesskjema fungerer som forventet.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Skriv inn din e-post..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#12161F] border border-[#1F2937] focus:border-[#7C3AED] text-xs text-white outline-none transition"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-900/30"
            >
              Send inn
            </button>
          </form>
        )}
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-[#1F2937] py-8 text-center text-xs text-slate-500">
        <p>© 2026 Mitt Prosjekt. Generert med AI Program Ultra.</p>
      </footer>
    </div>
  );
}
`,
      },
      {
        path: "package.json",
        content: JSON.stringify(
          {
            name: "mitt-prosjekt",
            version: "0.1.0",
            private: true,
            dependencies: {
              next: "15.5.25",
              react: "^19.0.0",
              "react-dom": "^19.0.0",
              "lucide-react": "^0.475.0",
            },
          },
          null,
          2
        ),
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

model ContactMessage {
  id        String   @id @default(uuid())
  email     String
  name      String?
  message   String?
  createdAt DateTime @default(now())
}
`,
      },
    ],
  },
  {
    id: "proj-saas-dashboard",
    userId: "user-default",
    name: "SaaS & Dashboard Mal",
    description: "Moderne webapp med KPI-metrikker, aktivitetsoversikt og brukerpanel.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/saas-dashboard",
    railwayId: "rw_saas_prod",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, TrendingUp, DollarSign, Activity, Bell, Search, ArrowUpRight } from 'lucide-react';

export default function SaaSDashboard() {
  const [activeMetric, setActiveMetric] = useState('mrr');

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2937]">
          <div>
            <h1 className="text-2xl font-black text-white">SaaS Administrasjonspanel</h1>
            <p className="text-xs text-slate-400">Sanntidsoversikt over metrikker, abonnementer og aktivitet</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live produksjon
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Månedlig omsetning (MRR)</span>
            <p className="text-2xl font-black text-white">142 800 kr</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">+14.2% fra forrige mnd</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Aktive Kunder</span>
            <p className="text-2xl font-black text-white">1 420</p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">+88 nye denne uken</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
            <span className="text-xs text-slate-400 font-medium">Konverteringsrate</span>
            <p className="text-2xl font-black text-white">4.8%</p>
            <span className="text-[11px] text-blue-400 flex items-center gap-0.5">Over bransjesnittet</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
            <span className="text-xs text-slate-400 font-medium">System Uptime</span>
            <p className="text-2xl font-black text-white">99.98%</p>
            <span className="text-[11px] text-emerald-400">Railway Nixpacks aktiv</span>
          </div>
        </div>
      </div>
    </div>
  );
}
`,
      },
    ],
  },
  {
    id: "proj-bedrift-tjenester",
    userId: "user-default",
    name: "Bedrift & Tjenester Mal",
    description: "Flersidig bedriftsnettside med tjenestekort, referanser og kontaktskjema.",
    hasDatabase: true,
    githubRepo: "aiprogram-org/bedrift-tjenester",
    railwayId: "rw_biz_prod",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function BusinessWebsite() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans">
      <header className="border-b border-[#1F2937] px-6 py-4 flex items-center justify-between">
        <span className="font-extrabold text-white text-base">Nordic Consulting</span>
        <div className="flex items-center gap-4 text-xs text-slate-300">
          <a href="#tjenester">Tjenester</a>
          <a href="#om-oss">Om oss</a>
          <a href="#kontakt" className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED] text-white font-bold">Kontakt oss</a>
        </div>
      </header>

      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl sm:text-6xl font-black text-white">Førsteklasses rådgivning for moderne bedrifter</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
          Vi bistår virksomheter med digital omstilling, strategisk rådgivning og skreddersydde teknologiløsninger.
        </p>
      </section>
    </div>
  );
}
`,
      },
    ],
  },
];

export const MOCK_PROJECTS = INITIAL_PROJECTS;

const STORAGE_KEY = "aiprogram_user_projects";

/**
 * Hent prosjekter fra localStorage.
 * Renser automatisk ut eventuelle gamle legacy vikingmester/demo-prosjekter.
 */
export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Filtrer ut eventuelle gamle legacy-prosjekter
      const clean = parsed.filter(
        (p: any) =>
          p &&
          p.name &&
          !p.name.toLowerCase().includes("vikingmester") &&
          !p.id?.toLowerCase().includes("vikingmester") &&
          !p.name.toLowerCase().includes("vikingnet") &&
          !p.id?.toLowerCase().includes("vikingnet") &&
          !p.name.toLowerCase().includes("vikingcrm") &&
          !p.name.toLowerCase().includes("opplev horten") &&
          !p.name.toLowerCase().includes("eidsfoss")
      );
      if (clean.length > 0) return clean;
      return INITIAL_PROJECTS;
    }
  } catch {
    // fallback
  }
  return INITIAL_PROJECTS;
}

export function saveStoredProjects(projects: Project[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Kunne ikke lagre prosjekter:", err);
  }
}

export function createNewProject(name: string, description?: string): Project {
  const cleanId = "proj-" + Date.now();
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

  const newProj: Project = {
    id: cleanId,
    userId: "user-current",
    name: name.trim(),
    description: description || `Skreddersydd webprosjekt bygget med AI Program Ultra`,
    hasDatabase: true,
    githubRepo: `aiprogram-org/${slug}`,
    railwayId: `rw_${slug}_prod`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    files: [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Globe, Code2, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('oversikt');

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Header */}
      <header className="border-b border-[#1F2937]/80 bg-[#0A0D12]/90 backdrop-blur sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-black text-white shadow-lg shadow-purple-900/40">
            ${name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight leading-none">${name}</h1>
            <p className="text-[10px] text-slate-400">Autonomt generert av AI Program Ultra</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/40 text-[10px] text-emerald-400 font-medium font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Aktiv Sandbox
          </span>
        </div>
      </header>

      {/* 2. Hero */}
      <main className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-xs text-[#C4B5FD] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Klar for autonom koding i sanntid</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            ${name}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Skriv inn hva du vil bygge i chatten til venstre – for eksempel en profesjonell nettside for en snekker, florist, restaurant eller en SaaS-portal med Vipps og database.
          </p>
        </div>

        {/* 3. Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Fullstack & Unsplash</h3>
            <p className="text-xs text-slate-400">
              Genererer virkelige fotografier, interaktive kalkulatorer, booking og Next.js kildekode.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/40 text-purple-400 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Kirurgisk Detaljstyring</h3>
            <p className="text-xs text-slate-400">
              Endre farger, tekster, knapper og ikonstørrelser med én enkel prompt uten å miste resten.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Produksjonsklar Deploy</h3>
            <p className="text-xs text-slate-400">
              1-klikk utrulling til produksjon med tilpasset subdomene og PostgreSQL database.
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

model Item {
  id        String   @id @default(uuid())
  title     String
  status    String   @default("ACTIVE")
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
  };

  return newProj;
}
