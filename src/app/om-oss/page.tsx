import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Globe, Shield, Terminal, ArrowRight } from "lucide-react";
import { VikingLogo } from "@/components/VikingLogo";

export const metadata = {
  title: "Om oss | AIProgram.no",
  description: "Om AIProgram.no, visjonen for autonom programvareutvikling og tilknytningen til Vikingnet-økosystemet.",
};

export default function OmOssPage() {
  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-200 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-14 bg-[#0A0D12]/95 backdrop-blur-md border-b border-[#1F2937] px-4 sm:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
          <VikingLogo size={28} />
          <span className="text-sm font-extrabold tracking-tight text-white">AIProgram<span className="text-[#A78BFA]">.no</span></span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-[#12161F] border border-[#1F2937]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Tilbake til forsiden
        </Link>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-8 space-y-12">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#C4B5FD] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
            Vår visjon og teknologi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Fremtidens programvare skapes i sanntid
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            AIProgram.no er Norges ledende autonome kodebygger. Vi fjerner barrierene mellom forretningsidé og produksjonsklar kode.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <h3 className="text-base font-bold text-white">Vibecoding på norsk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snakk til byggeren på flytende norsk. Systemet forstår fagterminologi, norske lover (som TEK17), betalinger (Vipps) og B2B-arbeidsflyter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Full frihet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vi låser deg aldri inne. Du eier all kode 100 %. Pushe direkte til ditt eget GitHub-repo og kjør på din egen Railway-konto til kostpris.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Viking-økosystemet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Utviklet av AIChat Norge AS i samarbeid med Vikingnet. Bygget for å drive vekst i norsk næringsliv.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#12161F] to-[#1F2937]/60 border border-purple-800/40 text-center space-y-4 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-black text-white">Klar til å bygge din neste applikasjon?</h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Test gratis med 50 000 tokens i dag. Ingen kredittkort kreves for å starte.
          </p>
          <div className="pt-2">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-bold text-sm transition shadow-lg shadow-purple-900/30 cursor-pointer"
            >
              <span>Åpne byggeren nå</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AIProgram.no — Utgiver: AIChat Norge AS.</p>
          <div className="flex gap-4">
            <Link href="/personvern" className="hover:text-white transition underline">Personvernerklæring</Link>
            <Link href="/vilkar" className="hover:text-white transition underline">Vilkår & Betingelser</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
