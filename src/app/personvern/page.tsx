import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Database, CreditCard, Server, Sparkles } from "lucide-react";
import { VikingLogo } from "@/components/VikingLogo";

export const metadata = {
  title: "Personvernerklæring (GDPR) | AIProgram.no",
  description: "Personvernerklæring og databehandling for AIProgram.no iht. GDPR og norsk personopplysningslov.",
};

export default function PersonvernPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            GDPR & Datatilsynet-kompatibel
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Personvernerklæring
          </h1>
          <p className="text-sm text-slate-400">
            Sist oppdatert: 21. september 2026 • Gjelder for nettstedet og tjenesten <strong>aiprogram.no</strong>
          </p>
        </div>

        {/* Informative Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <Lock className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-sm font-bold text-white">100 % Konfidensialitet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dine prompter, ideer og kildekode deles aldri med tredjeparter for modellopplæring.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Sikker Stripe-betaling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vi lagrer aldri kortnummer. All betaling håndteres kryptert via PCI-sertifiserte Stripe.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Europeisk Skylagring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Data lagres i sikre europeiske datasentre med strenge tilgangskontroller og ISO-sertifisering.
            </p>
          </div>
        </div>

        {/* Privacy Content */}
        <article className="space-y-8 text-sm sm:text-[15px] leading-relaxed text-slate-300">
          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              1. Behandlingsansvarlig
            </h2>
            <p>
              Behandlingsansvarlig for personopplysninger som samles inn ved bruk av <strong>AIProgram.no</strong> er:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
              <li><strong>Selskap / Utgiver:</strong> AIChat Norge AS (en del av Vikingnet-økosystemet)</li>
              <li><strong>Nettsted:</strong> aiprogram.no</li>
              <li><strong>E-post for personvernhenvendelser:</strong> <a href="mailto:kontakt@aiprogram.no" className="text-[#A78BFA] underline">kontakt@aiprogram.no</a></li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">
              2. Hvilke personopplysninger vi behandler og hvorfor
            </h2>
            <p>Vi behandler kun opplysninger som er strengt nødvendige for å levere tjenesten:</p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-[#0A0D12] border border-[#1F2937]">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Konto- og kontaktinformasjon</h4>
                <p className="text-xs text-slate-400 mt-1">
                  E-postadresse, navn og firmanavn ved opprettelse av brukerkonto eller kjøp av abonnement. Grunnlag: GDPR art. 6 (1) b (oppfyllelse av avtale).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0D12] border border-[#1F2937]">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Betalingsinformasjon (Stripe)</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Transaksjons-ID, MVA-land og kundereferanse fra Stripe. Kortdetaljer behandles utelukkende av Stripe Inc. Grunnlag: GDPR art. 6 (1) c (bokføringsloven).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0D12] border border-[#1F2937]">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">Tekniske logger og kildekodedata</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Prompter du taster inn for å generere kode, samt token-forbruk per oppdrag. Dette lagres slik at du kan gjenoppta prosjektene dine i editoren.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">
              3. Underleverandører og databehandlere
            </h2>
            <p>Vi benytter utvalgte og pålitelige underleverandører for å levere AIProgram.no:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400 text-sm">
              <li><strong>Stripe Payments Europe, Ltd:</strong> Betalingsformidling, abonnementshåndtering og MVA-kvitteringer.</li>
              <li><strong>Railway Corp:</strong> Skylagring, databasehosting (PostgreSQL) og container-infrastruktur.</li>
              <li><strong>GitHub Inc:</strong> Distribusjon og kildekode-versjonering ved direkte eksport fra brukeren.</li>
              <li><strong>Botsify / OpenAI / Google Gemini:</strong> Språkmodeller for autonom kodesyntese og feilsøking.</li>
            </ul>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">
              4. Dine rettigheter (Innsyn, sletting og retting)
            </h2>
            <p>
              I henhold til GDPR har du som bruker rett til:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 text-sm">
              <li>Å be om innsyn i personopplysningene vi har lagret om deg.</li>
              <li>Å be om retting av feilaktige opplysninger.</li>
              <li>Å be om sletting av din konto og tilhørende prosjekter («retten til å bli glemt»).</li>
              <li>Å eksportere dine data i et maskinlesbart format (ZIP-kildekode eller JSON).</li>
            </ul>
            <p className="text-xs text-slate-400 pt-2">
              For å utøve dine rettigheter, kontakt oss på <a href="mailto:kontakt@aiprogram.no" className="text-[#A78BFA] underline">kontakt@aiprogram.no</a>. Vi svarer innen 30 dager.
            </p>
          </section>

          <section className="space-y-3 bg-[#12161F]/40 p-6 rounded-2xl border border-[#1F2937]">
            <h2 className="text-lg font-bold text-white">
              5. Informasjonskapsler (Cookies)
            </h2>
            <p>
              AIProgram.no benytter kun strengt nødvendige sesjonskapsler for autentisering, innlogging og token-sikkerhet. Vi benytter ingen tredjeparts sporingskapsler som selger data til annonsører.
            </p>
          </section>
        </article>

        {/* Footer info */}
        <div className="pt-8 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AIProgram.no — Alle rettigheter forbeholdt.</p>
          <div className="flex gap-4">
            <Link href="/vilkar" className="hover:text-white transition underline">Vilkår & Betingelser</Link>
            <Link href="/om-oss" className="hover:text-white transition underline">Om oss</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
