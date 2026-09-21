import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, ShieldAlert, Award, CreditCard } from "lucide-react";
import { VikingLogo } from "@/components/VikingLogo";

export const metadata = {
  title: "Vilkår og Salgsbetingelser | AIProgram.no",
  description: "Brukervilkår, salgsbetingelser og immaterielle rettigheter for programvarebyggeren AIProgram.no.",
};

export default function VilkarPage() {
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
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-[#C4B5FD] text-xs font-semibold">
            <FileText className="w-4 h-4 text-[#A78BFA]" />
            Norske Salgs- og Tjenestevilkår (B2B/B2C)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Vilkår og Betingelser
          </h1>
          <p className="text-sm text-slate-400">
            Gjeldende fra 21. september 2026 • Tjenesteleveranse for <strong>aiprogram.no</strong>
          </p>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">100 % Kodeeierskap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All kildekode, databaser og filer bygget i AIProgram.no eies 100 % av deg uten lisensavgifter.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <CreditCard className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-sm font-bold text-white">Ingen Bindingstid</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Månedsabonnement kan avsluttes når som helst med ett klikk via Stripe Kundeportal.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Egen Driftskonto</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Du publiserer direkte på egen Railway-konto og GitHub. Ingen skjulte påslag på serverdrift.
            </p>
          </div>
        </div>

        {/* Legal Text */}
        <article className="space-y-8 text-sm sm:text-[15px] leading-relaxed text-slate-300">
          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">1. Avtalens parter og omfang</h2>
            <p>
              Denne avtalen inngås mellom brukeren («Kunden») og <strong>AIChat Norge AS</strong> (utgiver av AIProgram.no og en del av Vikingnet-økosystemet). Avtalen regulerer all bruk av programvarebyggeren, API-er, kodegenerering og relaterte tjenester på <code>aiprogram.no</code>.
            </p>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">2. Immaterielle rettigheter og kodeeierskap</h2>
            <p className="font-semibold text-white">
              Kunden har eksklusiv og ubegrenset eiendomsrett til all kildekode som produseres av systemet.
            </p>
            <p>
              Når du eksporterer et prosjekt til GitHub eller laster ned kildekoden som ZIP, kan du fritt bruke, endre, videreselge eller publisere koden kommersielt uten royalty-krav fra AIProgram.no. Plattformens underliggende motor og AI-grensesnitt forblir AIProgram.no sin eiendom.
            </p>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">3. Priser, betaling og fakturering</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
              <li>Alle priser for abonnement og tokens er oppgitt i norske kroner (NOK) eksklusive MVA (merverdiavgift for bedriftskunder).</li>
              <li>Betaling skjer forskuddsvis via <strong>Stripe</strong> med betalingskort (Visa, Mastercard, American Express).</li>
              <li>Abonnementet fornyes automatisk månedlig inntil det sies opp av Kunden via Stripe Kundeportal.</li>
              <li>Ved oppsigelse beholder Kunden tilgang til gjenværende tokens ut den gjeldende faktureringsperioden.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">4. Token-forbruk og sikkerhetsventil</h2>
            <p>
              AIProgram.no opererer med en streng token-sikkerhetsventil. Hvert byggeoppdrag og hver instruks trekker et beregnet antall tokens basert på kompleksitet og filantall. Kunden kan aldri bli etterfakturert for overforbruk; dersom kvoten nås, pauses kodesyntesen inntil neste fornyelse eller frivillig token-påfyll.
            </p>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">5. Ansvarsbegrensning</h2>
            <p>
              AIProgram.no benytter avanserte generative kunstig intelligens-modeller for å skape kildekode. Selv om vi tilstreber høyeste kodestandard og sikkerhet, er Kunden selv ansvarlig for å gjennomgå, kvalitetssikre og teste programvaren før den settes i reell produksjon eller behandler sensitive data.
            </p>
            <p className="text-xs text-slate-400">
              AIProgram.no fraskriver seg ethvert indirekte tap, følgeskader eller driftsavbrudd som følge av feil i generert programvare eller tredjepartstjenester som Railway eller GitHub.
            </p>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">6. Gjeldende rett og tvister</h2>
            <p>
              Denne avtalen er underlagt norsk rett. Eventuelle tvister som ikke lar seg løse i minnelighet, skal behandles ved Oslo tingrett som rett verneting.
            </p>
          </section>
        </article>

        {/* Footer info */}
        <div className="pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AIProgram.no — Alle rettigheter forbeholdt.</p>
          <div className="flex gap-4">
            <Link href="/personvern" className="hover:text-white transition underline">Personvernerklæring</Link>
            <Link href="/om-oss" className="hover:text-white transition underline">Om oss</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
