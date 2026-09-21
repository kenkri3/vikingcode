"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VikingLogo } from "@/components/VikingLogo";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Rocket,
  ShieldCheck,
  Lock,
  Layers,
  Code2,
  Terminal,
  Database,
  Cpu,
  Zap,
  Globe,
  HelpCircle,
  ChevronRight,
  Download,
  Github,
  Check,
  DollarSign,
  Users,
  Compass,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [promptInput, setPromptInput] = useState("");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);

  const handleStartBuilding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = promptInput.trim()
      ? `/app?prompt=${encodeURIComponent(promptInput.trim())}`
      : "/app";
    router.push(target);
  };

  const handleCheckout = async (planKey: string) => {
    setIsCheckoutLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey.startsWith("TOPUP") ? undefined : planKey,
          isTopup: planKey.startsWith("TOPUP"),
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Kunne ikke starte betaling.");
      }
    } catch (err) {
      console.error(err);
      alert("En feil oppstod under kobling til Stripe.");
    } finally {
      setIsCheckoutLoading(null);
    }
  };

  const samplePrompts = [
    "Bygg en komplett bookingportal for håndverkere med priskalkulator og TEK17 garantimodul",
    "Lag et moderne SaaS dashboard med Stripe-abonnement, fakturahistorikk og team-medlemmer",
    "Bygg en B2B kundeportal med PDF-tilbudsgenerator og sanntids chat",
    "Lag et interaktivt lagerstyringssystem med strekkodeskanning og leverandørintegrasjon",
  ];

  const faqs = [
    {
      q: "Hvem eier kildekoden som bygges på AIProgram.no?",
      a: "Du eier 100 % av all kildekode, datamodeller og konfigurasjonsfiler som genereres. Det er absolutt ingen vendor lock-in. Du kan når som helst laste ned et komplett ZIP-arkiv eller pushe prosjektet direkte til ditt eget private GitHub-repository.",
    },
    {
      q: "Hvordan fungerer hosting og serverdrift?",
      a: "Du har full frihet og kontroll over din egen infrastruktur. AIProgram klargjør automatisk `railway.json` og produksjonsklare Docker- og Nixpacks-konfigurasjoner. Med 1 klikk distribueres koden til din egen Railway- eller GitHub-konto med optimal ytelse, sikkerhet og skalerbarhet.",
    },
    {
      q: "Hva skjer hvis jeg går tom for tokens?",
      a: "Du kan enten oppgradere til en større månedsplan (Pro eller Mester) eller kjøpe rimelige hurtigpåfyllingspakker (250 000 tokens for kun 199 kr) helt uten å endre ditt faste abonnement.",
    },
    {
      q: "Kan jeg prøve plattformen gratis?",
      a: "Ja! Alle nye kontoer får en gratis prøveperiode med 50 000 tokens og 3 fulle byggeprompter. Du trenger ikke legge inn kredittkort for å teste hvordan AI-agenten genererer arkitektur, frontend og database.",
    },
    {
      q: "Hvordan logger SuperAdmin inn?",
      a: "Hvis du drifter AIProgram.no for din organisasjon, konfigurerer du enkelt `ADMIN_EMAIL` og `ADMIN_PASSWORD` i Railway miljøvariabler. Ved innlogging på `/login` gjenkjenner systemet admin-opplysningene umiddelbart og gir ubegrenset MESTER-tilgang til backend.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 selection:bg-[#7C3AED] selection:text-white">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0A0D12]/90 backdrop-blur-md border-b border-[#1F2937]/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <VikingLogo size={32} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-[#C4B5FD] transition">
                AIProgram
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-950/90 text-[#C4B5FD] border border-purple-800/50">
                .no
              </span>
            </div>
            <span className="text-[10px] text-slate-400 -mt-0.5">Viking-økosystemet</span>
          </div>
        </Link>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#hvordan" className="hover:text-white transition">
            Hvordan det fungerer
          </a>
          <a href="#funksjoner" className="hover:text-white transition">
            Funksjoner
          </a>
          <a href="#priser" className="hover:text-white transition">
            Priser
          </a>
          <Link href="/om-oss" className="hover:text-white transition">
            Om oss
          </Link>
          <Link href="/personvern" className="hover:text-white transition">
            Personvern
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-3.5 py-1.5 rounded-xl border border-[#1F2937] hover:border-slate-600 bg-[#12161F] text-xs font-semibold text-slate-200 hover:text-white transition"
          >
            Logg inn
          </Link>
          <Link
            href="/app"
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-xs font-bold text-white shadow-lg shadow-purple-900/30 flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Åpne Builder</span>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-900/30 to-indigo-800/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-[#C4B5FD] text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span>Norges neste generasjons AI-agent for programvarebygging</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
          Bygg ekte programvare med AI. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#C4B5FD] via-[#A78BFA] to-[#7C3AED] bg-clip-text text-transparent">
            Direkte til din egen infrastruktur.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Beskriv hva du ønsker å bygge – på norsk, engelsk eller ditt favorittspråk. Vår autonome AI-agent designer databasen, skriver
          komplett TypeScript- og React-kode, og klargjør 1-klikks distribusjon til din egen
          Railway- og GitHub-konto med 100 % kildekode-eierskap og produksjonsklar arkitektur.
        </p>

        {/* Interactive Prompt Input Box */}
        <div className="max-w-3xl mx-auto mb-6">
          <form
            onSubmit={handleStartBuilding}
            className="p-2 rounded-2xl bg-[#12161F] border border-[#1F2937] shadow-2xl focus-within:border-[#7C3AED] transition-all flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1 flex items-center">
              <Sparkles className="w-5 h-5 text-[#A78BFA] absolute left-3.5 shrink-0 pointer-events-none" />
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="F.eks: Bygg en bookingportal for håndverkere med priskalkulator og kalender..."
                className="w-full bg-transparent pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition shrink-0 cursor-pointer"
            >
              <span>Start bygging</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Prompt Suggestion Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Prøv en idé:</span>
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPromptInput(sp);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#181E2B] hover:bg-[#1F2937] border border-[#1F2937] text-slate-300 hover:text-white transition text-left truncate max-w-[280px]"
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-8 border-t border-[#1F2937]/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">100 % Kildekode-eierskap</p>
              <p className="text-slate-400">Ingen vendor lock-in, din kildekode for alltid.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <Rocket className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">1-Klikk Railway Deploy</p>
              <p className="text-slate-400">Distribuer til egen sky uten forsinkelser.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Norsk Personvern & GDPR</p>
              <p className="text-slate-400">Trygge rammer tilpasset norske bedrifter.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Full Arkitektur-Frihet</p>
              <p className="text-slate-400">Deploy til din egen sky eller hosting med 1 klikk.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Workspace Preview Mockup */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-28">
        <div className="rounded-2xl border border-[#1F2937] bg-[#0E121A] p-2 shadow-2xl relative overflow-hidden group">
          {/* Top Bar simulating IDE */}
          <div className="h-9 bg-[#12161F] rounded-t-xl px-4 flex items-center justify-between border-b border-[#1F2937] text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <span className="ml-2 font-mono text-slate-400 text-[11px]">
                aiprogram.no/app — VikingCode Workspace
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950/80 text-[#C4B5FD] text-[10px] font-semibold border border-purple-800/40">
                Gemini 3.8 Flash High
              </span>
              <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Agent
              </span>
            </div>
          </div>

          {/* Split View Content Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px] bg-[#0A0D12] text-left">
            {/* Left Col (5 cols): Agent Thought & Chat */}
            <div className="md:col-span-5 p-4 border-r border-[#1F2937] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#12161F] border border-[#1F2937]">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Brukerforespørsel
                  </p>
                  <p className="text-xs text-slate-200">
                    &quot;Bygg en komplett bookingportal for håndverkere med priskalkulator og
                    TEK17 garantimodul.&quot;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span className="text-xs font-bold text-white">AIProgram Agent handlinger</span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="px-2 py-1 rounded bg-[#12161F] text-slate-300 font-mono flex items-center justify-between">
                      <span>✓ Analyserte MesterAIAgentFrame</span>
                      <span className="text-purple-400">#L300-450</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-[#12161F] text-slate-300 font-mono flex items-center justify-between">
                      <span>✓ Thought for 5.8s: TEK17 garantimodul</span>
                      <span className="text-emerald-400">Klar</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-[#12161F] text-slate-300 font-mono flex items-center justify-between">
                      <span>✓ Genererte prisma/schema.prisma & railway.json</span>
                      <span className="text-blue-400">PostgreSQL</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#12161F] border border-[#1F2937] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-300">Sanntids token-saldo:</span>
                </div>
                <span className="font-bold text-white">42 500 / 50 000 tokens</span>
              </div>
            </div>

            {/* Right Col (7 cols): Live Code & Preview Mockup */}
            <div className="md:col-span-7 p-4 flex flex-col justify-between space-y-4 bg-gradient-to-br from-[#0A0D12] to-[#12161F]">
              <div>
                <div className="flex items-center justify-between border-b border-[#1F2937] pb-2 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#181E2B] text-white font-medium border border-[#1F2937]">
                      Live Forhåndsvisning
                    </span>
                    <span className="px-2.5 py-1 text-slate-400 hover:text-white font-mono">
                      app/page.tsx
                    </span>
                    <span className="px-2.5 py-1 text-slate-400 hover:text-white font-mono">
                      railway.json
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Link
                      href="/app"
                      className="px-2.5 py-1 rounded bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-[11px] flex items-center gap-1 transition"
                    >
                      <Rocket className="w-3 h-3" />
                      <span>Test i fullskjerm</span>
                    </Link>
                  </div>
                </div>

                {/* Simulated App Card */}
                <div className="p-4 rounded-xl bg-[#0A0D12] border border-[#1F2937] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">VikingMester Befaring</h4>
                      <p className="text-[11px] text-slate-400">
                        Priskalkulator med TEK17 garanti og kalenderbooking
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Aktiv
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-[#12161F] border border-[#1F2937]">
                      <span className="text-slate-400 text-[10px]">Areal</span>
                      <p className="font-bold text-white">85 m² Våtrom</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#12161F] border border-[#1F2937]">
                      <span className="text-slate-400 text-[10px]">Fastprisestimat</span>
                      <p className="font-bold text-emerald-400">142 500 kr eks. mva</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button Strip */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#1F2937]/70 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-auto">
                  <Github className="w-3.5 h-3.5" />
                  Synkroniseres til ditt personlige repo
                </span>
                <Link
                  href="/app"
                  className="px-3 py-1.5 rounded-lg bg-[#181E2B] hover:bg-[#202838] border border-[#1F2937] text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Last ned ZIP</span>
                </Link>
                <Link
                  href="/app"
                  className="px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy til Railway</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 3-Step Workflow ("Slik fungerer AIProgram") */}
      <section id="hvordan" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1F2937]">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest mb-2">
            Fra idé til produksjon
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Tre enkle steg til ditt neste system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] hover:border-purple-800/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 font-black text-sm mb-4">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Beskriv ideen på valgfritt språk</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Skriv på norsk, engelsk eller ditt favorittspråk. Vår AI-agent forstår komplekse
                forretningskrav, norske bransjestandarder, priskalkulatorer og datamodeller umiddelbart.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2937] text-[11px] text-purple-300 font-mono">
              → Gemini 3.8 Flash High & Autonom AI
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] hover:border-purple-800/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 font-black text-sm mb-4">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Iterér og se appen live</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Se forhåndsvisningen oppdatere seg i sanntid. Rediger kildekoden direkte i editoren
                eller gi videre instrukser til agenten for justeringer.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2937] text-[11px] text-emerald-400 font-mono">
              → Sanntids Live Preview & Editor
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] hover:border-purple-800/60 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center text-purple-300 font-black text-sm mb-4">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Deploy til din egen sky</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kildekoden synkroniseres til ditt private GitHub-repo med ferdig `railway.json`. Åpne
                Railway og start appen med 1 klikk – produksjonsklar arkitektur med full suverenitet.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2937] text-[11px] text-blue-400 font-mono">
              → 1-Klikk Cloud Deployment
            </div>
          </div>
        </div>
      </section>

      {/* 5. Features Grid */}
      <section id="funksjoner" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1F2937]">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest mb-2">
            Bygget for fart og profesjonelle krav
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Alt du trenger for å bygge, drifte og eie
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <Cpu className="w-6 h-6 text-[#A78BFA] mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">Autonom AI-Agent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drevet av Gemini 3.8 Flash High med dyp forståelse for moderne TypeScript, Next.js App Router, Tailwind CSS og
              Prisma ORM.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <Database className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">PostgreSQL & Prisma</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Genererer komplette databaseskjemaer, relasjoner og migrasjoner klare for
              produksjonsdatabaser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <ShieldCheck className="w-6 h-6 text-blue-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">100 % Kildekode-eierskap</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All kode tilhører deg. Ingen lisensavgifter per bruker eller begrensninger på
              videresalg til dine kunder.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <Rocket className="w-6 h-6 text-purple-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">Klar for Railway & GitHub</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inkluderer `railway.json` og Nixpacks-konfigurasjon. Start produksjonsklar hosting på
              din egen Railway-konto.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <DollarSign className="w-6 h-6 text-amber-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">Stripe Sikker Fakturering</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Enkel betaling i norske kroner (NOK) med automatisk bilag, MVA-spesifikasjon og
              kundeportal for abonnement.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937]">
            <Users className="w-6 h-6 text-teal-400 mb-3" />
            <h3 className="text-base font-bold text-white mb-1.5">SuperAdmin Konsoll</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Logg inn direkte med `ADMIN_EMAIL` og `ADMIN_PASSWORD` for å overvåke API-status,
              Stripe og systemtokens.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section (Stripe integration ready) */}
      <section id="priser" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1F2937]">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest mb-2">
            Enkle og forutsigbare priser i NOK
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Velg planen som passer ditt tempo
          </p>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-3">
            Ingen skjulte gebyrer. Forutsigbare priser i NOK med full fleksibilitet til å skalere og tilpasse etter din byggetakt.
          </p>
        </div>

        {/* 4 Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
          {/* Plan 1: Trial */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Prøveperiode
              </span>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-black text-white">0 kr</span>
                <span className="text-xs text-slate-400"> / test</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                For deg som vil oppleve kraften i AI-agenten før du bestemmer deg.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>50 000 tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 gratis byggeprompter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Sanntids forhåndsvisning</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Eksport til GitHub/Railway er låst</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="mt-8 w-full py-2.5 rounded-xl border border-[#1F2937] hover:border-slate-500 bg-[#181E2B] text-center text-xs font-bold text-white transition"
            >
              Start gratis prøve
            </Link>
          </div>

          {/* Plan 2: Starter */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Starter
              </span>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-black text-white">490 kr</span>
                <span className="text-xs text-slate-400"> / mnd</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                Ideelt for grundere og mindre prosjekter som vil bygge og deploye raskt.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">250 000 tokens / mnd</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>~30–50 fullstack genereringer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>1-klikk Railway Template deploy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Push til privat GitHub-repo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Last ned ZIP-arkiv</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("STARTER")}
              disabled={isCheckoutLoading === "STARTER"}
              className="mt-8 w-full py-2.5 rounded-xl border border-purple-800/60 bg-purple-950/50 hover:bg-purple-900 text-center text-xs font-bold text-[#C4B5FD] hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              {isCheckoutLoading === "STARTER" ? "Kobler til Stripe..." : "Velg Starter"}
            </button>
          </div>

          {/* Plan 3: Pro (Highlighted) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181E2B] to-[#12161F] border-2 border-[#7C3AED] shadow-xl shadow-purple-950/40 relative flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Mest Populær
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#A78BFA] uppercase tracking-wider">
                Pro Utvikler
              </span>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-black text-white">990 kr</span>
                <span className="text-xs text-slate-400"> / mnd</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                For bedrifter, konsulenter og serie-grundere som bygger og videreutvikler ukentlig.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span className="font-bold text-white">1 000 000 tokens / mnd</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span>~150–250 genereringer</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span>Alt i Starter inkludert</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span>Flere samtidige prosjekter</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                  <span>Prioritert agentkø & support</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("PRO")}
              disabled={isCheckoutLoading === "PRO"}
              className="mt-8 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-center text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition disabled:opacity-50 cursor-pointer"
            >
              {isCheckoutLoading === "PRO" ? "Kobler til Stripe..." : "Start med Pro"}
            </button>
          </div>

          {/* Plan 4: Mester */}
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mester Enterprise
              </span>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-black text-white">2 490 kr</span>
                <span className="text-xs text-slate-400"> / mnd</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                Maksimal kapasitet for etablerte byråer med høye produksjonskrav.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">3 000 000 tokens / mnd</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Ubegrenset prosjektarkivering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Dedikert norsk arkitekt-support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Skreddersydde API-nøkler</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => handleCheckout("MESTER")}
              disabled={isCheckoutLoading === "MESTER"}
              className="mt-8 w-full py-2.5 rounded-xl border border-purple-800/60 bg-purple-950/50 hover:bg-purple-900 text-center text-xs font-bold text-[#C4B5FD] hover:text-white transition disabled:opacity-50 cursor-pointer"
            >
              {isCheckoutLoading === "MESTER" ? "Kobler til Stripe..." : "Velg Mester"}
            </button>
          </div>
        </div>

        {/* Quick Top-Up Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#12161F] to-[#12161F] border border-purple-800/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#A78BFA]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Trenger du kun litt ekstra kraft nå?</h4>
              <p className="text-xs text-slate-300">
                Kjøp et hurtigpåfyll på <span className="text-white font-bold">250 000 tokens</span>{" "}
                for kun <span className="text-emerald-400 font-bold">199 kr</span> uten å endre
                ditt månedlige abonnement.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleCheckout("TOPUP_250K")}
            disabled={isCheckoutLoading === "TOPUP_250K"}
            className="px-5 py-2.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 border border-purple-700/50 text-white text-xs font-bold whitespace-nowrap transition cursor-pointer"
          >
            {isCheckoutLoading === "TOPUP_250K" ? "Kobler til Stripe..." : "Kjøp påfyll (199 kr)"}
          </button>
        </div>
      </section>

      {/* 7. Viking Ecosystem Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-[#1F2937]">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest mb-2">
            Viking-familien
          </h2>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Et integrert digitalt økosystem for norske bedrifter
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-xl bg-[#12161F] border border-purple-700/60 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <VikingLogo size={20} />
              <span className="font-bold text-white text-xs">AIProgram.no</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Vår kjerneplattform for autonom AI-programvarebygging og raske prototypinger.
            </p>
          </div>

          <a
            href="https://vikingnet.no"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] hover:border-slate-500 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-xs group-hover:text-[#A78BFA] transition">
                Vikingnet.no
              </span>
              <Compass className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Norsk sky- og nettverksinfrastruktur med dedikert drift og sikkerhet.
            </p>
          </a>

          <a
            href="https://vikingmester.no"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] hover:border-slate-500 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-xs group-hover:text-[#A78BFA] transition">
                VikingMester.no
              </span>
              <Compass className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Spesialiserte fagsystemer og kalkulatorer for norske håndverkere og byggmestre.
            </p>
          </a>

          <a
            href="https://vikingcrm.no"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] hover:border-slate-500 transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-xs group-hover:text-[#A78BFA] transition">
                VikingCRM.no
              </span>
              <Compass className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Norsk kundeoppfølging, tilbudsprosesser og pipeline for voksende selskaper.
            </p>
          </a>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1F2937]">
        <div className="text-center mb-12">
          <HelpCircle className="w-8 h-8 text-[#A78BFA] mx-auto mb-2" />
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ofte stilte spørsmål
          </h2>
        </div>

        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-2"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                {faq.q}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-3.5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-purple-950/70 via-[#12161F] to-[#0A0D12] border border-purple-800/50 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Klar til å bygge ditt neste program?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Test AI-agenten nå. Få arkitektur, frontend og PostgreSQL-skjema generert på sekunder.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-sm font-bold text-white shadow-xl shadow-purple-900/50 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Åpne AIProgram Workspace</span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl border border-[#1F2937] hover:border-slate-500 bg-[#12161F] text-sm font-semibold text-slate-200 hover:text-white transition"
            >
              Logg inn til SuperAdmin / Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Global Footer */}
      <footer className="border-t border-[#1F2937] bg-[#0E121A] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <VikingLogo size={24} />
              <span className="font-extrabold text-white text-sm">AIProgram.no</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Autonom programvarebygging for norske bedrifter. Drevet av Vikingnet-økosystemet med
              full kildekode-eierskap og Stripe-sikkerhet.
            </p>
          </div>

          {/* Col 2: Produkter */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Produkter</p>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/app" className="hover:text-white transition">
                  AIProgram Builder
                </Link>
              </li>
              <li>
                <a href="#priser" className="hover:text-white transition">
                  Priser & Abonnement
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Bruker- & SuperAdmin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Juridisk & Trygghet */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Juridisk & Sikkerhet</p>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/personvern" className="hover:text-white transition">
                  Personvernerklæring (GDPR)
                </Link>
              </li>
              <li>
                <Link href="/vilkar" className="hover:text-white transition">
                  Vilkår for bruk & Kildekode-eierskap
                </Link>
              </li>
              <li>
                <Link href="/om-oss" className="hover:text-white transition">
                  Om selskapet & Visjon
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontakt & Admin */}
          <div className="space-y-2">
            <p className="font-bold text-white text-xs uppercase tracking-wider">Admin & Support</p>
            <p className="text-[11px] text-slate-400">
              E-post: <span className="text-white font-mono">post@aiprogram.no</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Domene: <span className="text-purple-400 font-mono">https://aiprogram.no</span>
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 hover:text-white bg-[#12161F] border border-[#1F2937] px-2.5 py-1 rounded-lg transition"
              >
                <Lock className="w-3 h-3 text-[#A78BFA]" />
                <span>SuperAdmin Logg inn</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#1F2937]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} AIProgram.no. Alle rettigheter reservert. En del av Vikingnet-økosystemet.</p>
          <div className="flex items-center gap-4">
            <Link href="/personvern" className="hover:text-white transition">
              Personvern
            </Link>
            <Link href="/vilkar" className="hover:text-white transition">
              Vilkår
            </Link>
            <Link href="/om-oss" className="hover:text-white transition">
              Om oss
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
