import { Project } from "./types";

export const INITIAL_PROJECTS: Project[] = [
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
import {
  Hammer,
  Ruler,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Star,
  Sparkles,
  ChevronRight,
  MapPin,
  Award,
  Check,
  ChevronDown,
  Layers,
  ArrowRight,
  FileCheck,
  HardHat,
  Home,
  CheckCircle
} from 'lucide-react';

export default function NordicCraftsmanApp() {
  const [selectedService, setSelectedService] = useState('terrasse');
  const [squareMeters, setSquareMeters] = useState(38);
  const [woodType, setWoodType] = useState('termo');
  const [hasHiddenFasteners, setHasHiddenFasteners] = useState(true);
  const [hasIntegratedLed, setHasIntegratedLed] = useState(false);
  const [hasPermitHelp, setHasPermitHelp] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'terrasse' | 'tilbygg' | 'fasade' | 'interior'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [projectNotes, setProjectNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const services = {
    terrasse: {
      title: 'Terrasser & Uterom',
      rate: 850,
      leadTime: '1–2 uker',
      tagline: 'Skreddersydde plattinger, rekkverk, trappeløp og pergolaer',
      desc: 'Vi bygger slitesterke uterom tilpasset nordiske værforhold. Velg mellom varmebehandlet termofuru, MøreRoyal eller eksklusiv Kebony med millimeterpresisjon og usynlig innfesting.',
      features: ['Usynlig kantskrue/CAMO-system', 'Integrert LED-trinnbelysning', 'Frostsikre fundamenter & søylesko', 'Bygges etter TEK17 toleransekrav'],
    },
    tilbygg: {
      title: 'Tilbygg & Påbygg',
      rate: 960,
      leadTime: '4–8 uker',
      tagline: 'Utvidelse av stue, takløft, ny etasje eller vinterhage',
      desc: 'Komplett prosjektering og oppføring av moderne tilbygg. Vi ivaretar alt fra arkitekttegninger og søknad til nøkkelferdig overlevering med fukt- og vindsperrer.',
      features: ['Søknadspliktig bistand til kommunen', 'Sømløs overgang mot eksisterende hus', 'Klimatilpasset isolasjon (Lavenergi)', '100% fastpriskontrakt'],
    },
    fasade: {
      title: 'Fasade & Etterisolering',
      rate: 890,
      leadTime: '2–4 uker',
      tagline: 'Ny kledning, 10-15cm etterisolering og energioppgradering',
      desc: 'Reduser strømregningen og gi huset et moderne løft. Vi skifter råteskadet kledning, etterisolerer og monterer moderne dobbelfals eller stående låvekledning.',
      features: ['Enova-tilskuddsberettiget energitiltak', 'Montering av vindsperre og lusing', 'Valgfrie ferdiggrunnet/beisede kledninger', '10 års produktgaranti på virke'],
    },
    interior: {
      title: 'Innvendig Finsnekring',
      rate: 920,
      leadTime: '1–3 uker',
      tagline: 'Eikespilevegger, plassbygde garderober og listefrie løsninger',
      desc: 'Eksklusive spesialinnredninger for stue, gang og kjøkken. Vi skaper sømløse overganger med akustiske spilepaneler, skjulte dører og skreddersøm.',
      features: ['Akustikk-godkjente eikespiler', 'Listefri gips- og karmoverganger', 'Integrert indirekte LED-belysning', 'Lakkert eller oljet etter fargeønske'],
    },
    tak: {
      title: 'Tak, Vinduer & Dører',
      rate: 880,
      leadTime: '2–3 uker',
      tagline: 'Utskifting av undertak, lekter, takstein og lavenergiglass',
      desc: 'Beskytt boligen mot vær og vind. Vi skifter takstein, legger nytt undertak og monterer 3-lags lavenergivinduer som tilfredsstiller moderne krav.',
      features: ['3-lags lavenergivinduer (U-verdi 0.8)', 'Takrenner i sink eller aluminium', 'Velux takvinduer med solskjerming', 'Dokumentert fuktkontroll'],
    },
  };

  const woodMultipliers = {
    impregnert: { name: 'Furu Impregnert kl. AB', pricePerSqm: 380, desc: 'Klassisk, rimelig og impregnert mot råte' },
    termo: { name: 'Varmebehandlet Termofuru', pricePerSqm: 560, desc: 'Miljøvennlig, formstabil og naturlig gråning' },
    moreroyal: { name: 'MøreRoyal Oljebehandlet Grå/Brun', pricePerSqm: 680, desc: 'Dobbeltbehandlet furu med minimalt vedlikehold' },
    kebony: { name: 'Kebony Clear Premium', pricePerSqm: 940, desc: 'Eksklusivt hardtre-alternativ med 30 års garanti' },
  };

  const galleryItems = [
    {
      id: 1,
      category: 'terrasse',
      title: 'Funkisterrasse med Utekjøkken & Pergola',
      location: 'Holmenkollen, Oslo',
      size: '92 m²',
      wood: 'MøreRoyal Grå',
      completion: 'August 2026',
      quote: '«Utrolig presist utført snekkerarbeid. Plattingen har sømløse skjøter og LED-sporene i trappetrinnene er magiske på kveldstid.»',
      author: 'Henrik & Camilla W.'
    },
    {
      id: 2,
      category: 'tilbygg',
      title: 'Moderne Stueutvidelse med Sedumtak',
      location: 'Snarøya, Bærum',
      size: '42 m²',
      wood: 'Malmfuru & 3-lags Glass',
      completion: 'Juni 2026',
      quote: '«De holdt både tidsplan og fastpris på kronen. Ryddet byggeplassen hver eneste dag. Anbefales på det varmeste!»',
      author: 'Lars Petter E.'
    },
    {
      id: 3,
      category: 'interior',
      title: 'Plassbygget Eikespilevegg & Mediamøbel',
      location: 'Bekkestua, Bærum',
      size: '18 m²',
      wood: 'Norsk Hvitpigmentert Eik',
      completion: 'September 2026',
      quote: '«Et kunstverk i stuen vår. Akustikken ble fantastisk mye bedre og de integrerte dørene er helt usynlige.»',
      author: 'Marianne S.'
    },
    {
      id: 4,
      category: 'fasade',
      title: 'Fasaderenovering & Ekstra Isolering',
      location: 'Nordstrand, Oslo',
      size: '185 m²',
      wood: 'Dobbelfals Kledning m/Spor',
      completion: 'Juli 2026',
      quote: '«Huset fremstår som flunkende nytt og strømforbruket sank merkbart allerede første måned.»',
      author: 'Knut Arild T.'
    },
    {
      id: 5,
      category: 'terrasse',
      title: 'Sjønær Bryggeplatting & Trappeløp',
      location: 'Nesøya, Asker',
      size: '64 m²',
      wood: 'Kebony Clear',
      completion: 'Mai 2026',
      quote: '«Håndverkerne var punktlige og holdt en millimeterpresisjon som imponerte både oss og naboene.»',
      author: 'Cecilie M.'
    },
    {
      id: 6,
      category: 'tilbygg',
      title: 'Arkitekttegnet Inngangsparti & Carport',
      location: 'Grefsen, Oslo',
      size: '28 m²',
      wood: 'Termofuru & Sort Stål',
      completion: 'April 2026',
      quote: '«Utrolig god kommunikasjon underveis med ukentlige oppdateringer og ingen overraskelser på sluttoppgjøret.»',
      author: 'Fredrik B.'
    }
  ];

  const faqs = [
    {
      q: 'Er befaringen virkelig 100 % uforpliktende og gratis?',
      a: 'Ja! En autorisert tømrermester kommer hjem til deg på avtalt tidspunkt, måler opp arealet, diskuterer løsninger og gir råd om materialvalg. Du mottar et skriftlig fastpristilbud innen 48 timer.'
    },
    {
      q: 'Hvordan fungerer fastprisgarantien deres?',
      a: 'Når tilbudet er godkjent, låses prisen skriftlig i en standard Norsk Standard (NS) kontrakt. Eventuelle uforutsette merkostnader dekkes av oss, med mindre du eksplisitt bestiller tilleggsarbeid skriftlig underveis.'
    },
    {
      q: 'Hva slags garanti får jeg på snekkerarbeidet?',
      a: 'Vi gir 5 års full håndverkergaranti i henhold til Bustadoppføringslova og TEK17. Alle materialer leveres med produsentgarantier på opptil 30 år mot råte.'
    },
    {
      q: 'Trenger jeg byggetillatelse for terrasse eller tilbygg?',
      a: 'Frittliggende terrasser under 0.5 meters høyde er som regel unntatt søknadsplikt. For tilbygg inntil 15 m² eller terrasser høyere enn 0.5 meter kan andre regler gjelde. Vi bistår med søknadstegninger og nabovarsel.'
    }
  ];

  const currentService = services[selectedService as keyof typeof services] || services.terrasse;
  const currentWood = woodMultipliers[woodType as keyof typeof woodMultipliers] || woodMultipliers.termo;

  // Real-world accurate calculation
  const estHours = Math.round(squareMeters * 0.75 + 12);
  const laborCost = estHours * currentService.rate;
  const materialBase = squareMeters * currentWood.pricePerSqm;
  const fastenersAddon = hasHiddenFasteners ? squareMeters * 85 : 0;
  const ledAddon = hasIntegratedLed ? 8500 : 0;
  const permitAddon = hasPermitHelp ? 9500 : 0;
  const materialCost = Math.round(materialBase + fastenersAddon + ledAddon + permitAddon);
  const subtotal = laborCost + materialCost;
  const vat = Math.round(subtotal * 0.25);
  const totalEstimate = subtotal + vat;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      alert('Vennligst oppgi et gyldig telefonnummer så vi kan avtale tidspunkt.');
      return;
    }
    setSubmitted(true);
  };

  const filteredGallery = galleryFilter === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === galleryFilter);

  return (
    <div className="min-h-screen bg-[#0C0E14] text-slate-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* 1. TOP TRUST STRIP */}
      <div className="bg-[#11141C] border-b border-[#1E2330] py-2 px-4 text-center text-[11px] font-medium text-amber-300/90 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
        <span className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          Mesterbedrift i Tømrerfaget
        </span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Sentralt Godkjent Tiltaksklasse 2
        </span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          5 Års TEK17-Garanti
        </span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Clock className="w-3.5 h-3.5" />
          Gratis befaring innen 48 timer
        </span>
      </div>

      {/* 2. STICKY MODERN NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#0C0E14]/90 backdrop-blur-md border-b border-[#1E2330] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 flex items-center justify-center text-white shadow-lg shadow-amber-950/50">
            <Hammer className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight">Nordic Tre & Håndverk</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/40">
                Mesterbedrift
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Arkitektur, nybygg og snekkerarbeid i Viken</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#tjenester" className="hover:text-amber-400 transition">Tjenester</a>
          <a href="#kalkulator" className="hover:text-amber-400 transition">Priskalkulator</a>
          <a href="#prosjekter" className="hover:text-amber-400 transition">Prosjekter</a>
          <a href="#garanti" className="hover:text-amber-400 transition">Garanti</a>
          <a href="#referanser" className="hover:text-amber-400 transition">Kundeomtaler</a>
          <a href="#kontakt" className="hover:text-amber-400 transition">Kontakt</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:22140000"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1A202E] border border-[#242C3D] text-xs font-semibold text-slate-200 transition"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>22 14 00 00</span>
          </a>
          <a
            href="#kalkulator"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md shadow-amber-950/40 transition cursor-pointer"
          >
            Bestill Befaring
          </a>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-800/40 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Norsk Håndverkstradisjon med Millimeterpresisjon</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Skreddersydde terrasser og tilbygg som hever boligens verdi.
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Vi prosjekterer og bygger arkitekttegnede uterom, tilbygg og spesialtilpasset interiørsnekring for kresne huseiere i Oslo, Bærum og Asker. Med 100 % fastprisavtale og 5 års TEK17-garanti.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#kalkulator"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-amber-950/50 flex items-center gap-2 transition cursor-pointer"
            >
              <span>Beregn Prosjektpris i Sanntid</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#prosjekter"
              className="px-6 py-3.5 rounded-xl bg-[#141822] hover:bg-[#1A202E] border border-[#242C3D] text-slate-200 font-bold text-sm transition flex items-center gap-2"
            >
              <span>Se Referanseprosjekter (6)</span>
            </a>
          </div>

          {/* Social Proof Strip */}
          <div className="pt-6 border-t border-[#1E2330] flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-white">4.9 / 5.0</span>
              <span className="text-slate-400">(142 verifiserte oppdrag)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>100 % Skriftlig Fastprisgaranti</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>5 Års Garanti iht. Norsk Lov</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY METRICS GRID */}
      <section className="px-4 sm:px-8 max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2433] space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">15+ År</span>
            <p className="text-xs font-bold text-white">Mestererfaring</p>
            <p className="text-[11px] text-slate-400">Tradisjonelt norsk tømrerfag</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2433] space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">160+</span>
            <p className="text-xs font-bold text-white">Fullførte Prosjekter</p>
            <p className="text-[11px] text-slate-400">I Oslo, Asker og Bærum</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2433] space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400">100 %</span>
            <p className="text-xs font-bold text-white">Fastprisavtale</p>
            <p className="text-[11px] text-slate-400">Ingen skjulte sluttoppgjør</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#121620] border border-[#1E2433] space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">5 År</span>
            <p className="text-xs font-bold text-white">TEK17-Garanti</p>
            <p className="text-[11px] text-slate-400">Dokumentert med FDV-perm</p>
          </div>
        </div>
      </section>

      {/* 5. SERVICES EXPLORER */}
      <section id="tjenester" className="px-4 sm:px-8 max-w-6xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Hva vi kan bygge for deg</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Spesialisert Tømrer- & Snekkerarbeid</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Fra enkle plattinger til komplekse arkitekttegnede tilbygg. Vi leverer alt med egne faglærte håndverkere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(services).map(([key, s]) => {
            const isHighlighted = selectedService === key;
            return (
              <div
                key={key}
                onClick={() => setSelectedService(key)}
                className={\`p-6 rounded-2xl transition cursor-pointer border flex flex-col justify-between \${
                  isHighlighted
                    ? 'bg-[#161B26] border-amber-500 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500'
                    : 'bg-[#11151E] border-[#1E2433] hover:border-slate-600'
                }\`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 font-mono">Timepris {s.rate} kr/t</span>
                    <span className="text-[10px] font-medium text-slate-400 bg-[#0C0E14] px-2 py-0.5 rounded border border-[#1E2433]">
                      Est. {s.leadTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
                  
                  <div className="space-y-1.5 pt-2 border-t border-[#1E2433]">
                    {s.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-400">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#1E2433] flex items-center justify-between text-xs font-semibold text-amber-400">
                  <span>Velg for priskalkulator</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. INTERACTIVE 4-STEP PRICE CALCULATOR */}
      <section id="kalkulator" className="px-4 sm:px-8 max-w-6xl mx-auto mb-20">
        <div className="bg-[#121622] border border-[#21293A] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-8 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Ruler className="w-4 h-4" />
              <span>Interaktiv Kostnadskalkulator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Beregn veiledende prosjektkostnad på sekunder
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Juster parametere nedenfor basert på dine ønsker. Kalkulatoren tar utgangspunkt i faktiske norske materialpriser og standard TEK17 arbeidstimer for 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Input Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Select Service */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">1. Prosjekttype:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(services).map(([key, s]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedService(key)}
                      className={\`px-3 py-2 rounded-xl text-left text-xs font-semibold transition border cursor-pointer \${
                        selectedService === key
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                          : 'bg-[#0E121B] text-slate-300 border-[#202838] hover:border-slate-500'
                      }\`}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Area Slider */}
              <div className="space-y-2 pt-4 border-t border-[#1E2433]">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">2. Areal / Omfang:</span>
                  <span className="text-sm font-black text-amber-400 font-mono bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                    {squareMeters} m²
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="140"
                  step="2"
                  value={squareMeters}
                  onChange={(e) => setSquareMeters(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-[#0E121B] h-2.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>12 m² (lite prosjekt)</span>
                  <span>75 m²</span>
                  <span>140 m² (stort prosjekt)</span>
                </div>
              </div>

              {/* Step 3: Material Quality Tier */}
              <div className="space-y-2 pt-4 border-t border-[#1E2433]">
                <label className="text-xs font-bold text-white block">3. Materialkvalitet:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Object.entries(woodMultipliers).map(([key, w]) => {
                    const active = woodType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setWoodType(key)}
                        className={\`p-3 rounded-xl text-left transition border cursor-pointer \${
                          active
                            ? 'bg-amber-950/60 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-[#0E121B] border-[#202838] hover:border-slate-600'
                        }\`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{w.name}</span>
                          <span className="text-[10px] font-mono text-amber-400">{w.pricePerSqm} kr/m²</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{w.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Optional Addons */}
              <div className="space-y-2 pt-4 border-t border-[#1E2433]">
                <label className="text-xs font-bold text-white block">4. Tilleggsvalg:</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0E121B] border border-[#202838] cursor-pointer hover:border-slate-500 transition">
                    <input
                      type="checkbox"
                      checked={hasHiddenFasteners}
                      onChange={(e) => setHasHiddenFasteners(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-medium">Skjult innfesting (CAMO kantskruer uten synlige skruehoder)</span>
                    <span className="text-slate-400 text-[10px] font-mono ml-auto">+85 kr/m²</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0E121B] border border-[#202838] cursor-pointer hover:border-slate-500 transition">
                    <input
                      type="checkbox"
                      checked={hasIntegratedLed}
                      onChange={(e) => setHasIntegratedLed(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-medium">Integrert 12V LED-belysning i trinn og rekkverk</span>
                    <span className="text-slate-400 text-[10px] font-mono ml-auto">+8 500 kr</span>
                  </label>
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#0E121B] border border-[#202838] cursor-pointer hover:border-slate-500 transition">
                    <input
                      type="checkbox"
                      checked={hasPermitHelp}
                      onChange={(e) => setHasPermitHelp(e.target.checked)}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-slate-200 font-medium">Komplett byggesøknad m/nabovarsel og situasjonskart</span>
                    <span className="text-slate-400 text-[10px] font-mono ml-auto">+9 500 kr</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Summary Box & Booking Request (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#0E121B] border border-[#242C3D] rounded-2xl p-6 shadow-xl space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2433] pb-3 mb-4">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Kostnadsoverslag</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                    Fastprisgaranti
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Valgt tjeneste:</span>
                    <span className="font-semibold text-white">{currentService.title}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Beregnet areal:</span>
                    <span className="font-mono text-white">{squareMeters} m²</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Materialklasse:</span>
                    <span className="font-medium text-amber-300">{currentWood.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fagarbeid (ca. {estHours} timer):</span>
                    <span className="font-mono text-white">kr {laborCost.toLocaleString('no-NO')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Materialer & tilvalg:</span>
                    <span className="font-mono text-white">kr {materialCost.toLocaleString('no-NO')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1 border-t border-[#1E2433]">
                    <span>MVA (25 %):</span>
                    <span className="font-mono">kr {vat.toLocaleString('no-NO')}</span>
                  </div>
                </div>

                {/* Big Total Price */}
                <div className="mt-5 p-4 rounded-xl bg-[#141824] border border-[#242C3D] text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Totalpris Inkl. MVA & Materialer
                  </span>
                  <div className="text-3xl font-black text-amber-400 tracking-tight font-sans">
                    kr {totalEstimate.toLocaleString('no-NO')} ,-
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Leveres nøkkelferdig med 5 års TEK17-garanti
                  </p>
                </div>
              </div>

              {/* Direct Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-3 pt-3 border-t border-[#1E2433]">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Bestill Gratis Befaring for dette anslaget
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ditt fulle navn..."
                    className="w-full bg-[#121622] border border-[#242C3D] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobilnummer..."
                      className="w-full bg-[#121622] border border-[#242C3D] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Adresse / Postnr..."
                      className="w-full bg-[#121622] border border-[#242C3D] focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={\`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer \${
                    submitted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white shadow-amber-950/40'
                  }\`}
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Befaring bekreftet! Vi ringer deg innen 24t.</span>
                    </>
                  ) : (
                    <>
                      <span>Få Skriftlig Tilbud & Gratis Befaring</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PORTFOLIO & REFERENCE GALLERY */}
      <section id="prosjekter" className="px-4 sm:px-8 max-w-6xl mx-auto mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Verifiserte Referanser</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Fullførte Prosjekter i Viken</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Alle Prosjekter' },
              { id: 'terrasse', label: 'Terrasser' },
              { id: 'tilbygg', label: 'Tilbygg' },
              { id: 'interior', label: 'Innvendig Snekring' },
              { id: 'fasade', label: 'Fasader' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setGalleryFilter(f.id as any)}
                className={\`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer border \${
                  galleryFilter === f.id
                    ? 'bg-amber-600 border-amber-500 text-white font-bold'
                    : 'bg-[#121622] border-[#202838] text-slate-300 hover:text-white'
                }\`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((p) => (
            <div
              key={p.id}
              className="bg-[#11151E] border border-[#1E2433] hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-amber-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {p.location}
                  </span>
                  <span>{p.completion}</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                  {p.title}
                </h3>

                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#181E2B] text-slate-300 border border-[#242C3D]">
                    Areal: {p.size}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#181E2B] text-amber-300 border border-[#242C3D]">
                    Material: {p.wood}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1C2230] text-[11px] text-slate-300 italic">
                  {p.quote}
                  <p className="text-[10px] font-bold text-amber-400 not-italic mt-1.5">— {p.author}</p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#1C2230] bg-[#0E121B] flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  TEK17 Sluttbefart
                </span>
                <span className="group-hover:text-amber-400 transition">Se detaljer →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. 4-STEP QUALITY PROCESS */}
      <section id="garanti" className="px-4 sm:px-8 max-w-6xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Trygghet fra start til slutt</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Slik Bygger Vi for Deg</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Forutsigbarhet, ryddighet og strenge standarder i hvert ledd.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#11151E] border border-[#1E2433] space-y-2 relative">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 font-black text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-sm font-bold text-white pt-1">Gratis Befaring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mesteren møter opp på tomten, gjør oppmåling med lasermåler og diskuterer tekniske løsninger.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11151E] border border-[#1E2433] space-y-2 relative">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 font-black text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-sm font-bold text-white pt-1">Skriftlig Fastpris</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Du mottar et komplett spesifisert tilbud basert på standard NS-kontrakt. Prisen er 100 % låst.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11151E] border border-[#1E2433] space-y-2 relative">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 font-black text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-sm font-bold text-white pt-1">Presis Utførelse</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Faste håndverkere bygger med millimeterpresisjon. Byggeplassen ryddes og sikres hver ettermiddag.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#11151E] border border-[#1E2433] space-y-2 relative">
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/40 text-amber-400 font-black text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="text-sm font-bold text-white pt-1">Overlevering & Garanti</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sluttbefaring gjennomføres sammen med deg. Du mottar full FDV-dokumentasjon og 5 års garanti.
            </p>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="px-4 sm:px-8 max-w-4xl mx-auto mb-20">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Svar på vanlige spørsmål</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ofte Stilte Spørsmål</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#11151E] border border-[#1E2433] rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left transition cursor-pointer hover:bg-[#161B26]"
                >
                  <span className="text-xs sm:text-sm font-bold text-white pr-4">{faq.q}</span>
                  <ChevronDown
                    className={\`w-4 h-4 text-amber-400 shrink-0 transition-transform \${
                      isOpen ? 'rotate-180' : ''
                    }\`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-[#1C2230]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer id="kontakt" className="bg-[#0A0C10] border-t border-[#1C2230] pt-12 pb-8 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                <Hammer className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">Nordic Tre & Håndverk AS</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Spesialister på skreddersydde uterom, tilbygg og arkitektur i tre. Autorisert mesterbedrift med Sentral Godkjenning.
            </p>
            <p className="text-[10px] font-mono text-slate-500">Org.nr: 928 471 204 MVA</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Tjenester</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#tjenester" className="hover:text-amber-400">Terrasser & Plattinger</a></li>
              <li><a href="#tjenester" className="hover:text-amber-400">Tilbygg & Påbygg</a></li>
              <li><a href="#tjenester" className="hover:text-amber-400">Fasaderenovering & ENØK</a></li>
              <li><a href="#tjenester" className="hover:text-amber-400">Eikespilevegger & Interiør</a></li>
              <li><a href="#tjenester" className="hover:text-amber-400">Tak, Vinduer & Dører</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Godkjenninger & Garantier</h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 text-amber-300">
                <Award className="w-3 h-3 text-amber-400" />
                Mesterbrev i Tømrerfaget
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                Sentralt Godkjent Tiltaksklasse 2
              </li>
              <li className="flex items-center gap-1.5 text-cyan-400">
                <FileCheck className="w-3 h-3" />
                StartBANK ID: 10428
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Check className="w-3 h-3 text-emerald-400" />
                5 Års TEK17 Garanti
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Direkte Kontakt</h4>
            <div className="space-y-2 text-[11px]">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href="tel:22140000" className="hover:text-white">22 14 00 00</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href="mailto:post@nordictre.no" className="hover:text-white">post@nordictre.no</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Verkstedveien 12, 0277 Oslo</span>
              </p>
              <p className="text-[10px] text-slate-500 pt-1">Åpningstider: Mandag – Fredag: 07:00 – 17:00</p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#1C2230] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 Nordic Tre & Håndverk AS. Alle rettigheter reservert.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Personvern</span>
            <span className="hover:text-slate-400 cursor-pointer">Brukervilkår</span>
            <span className="hover:text-slate-400 cursor-pointer">FDV-Dokumentasjon</span>
          </div>
        </div>
      </footer>
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
        path: "app/api/carpenter/calculator/route.ts",
        content: `import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { squareMeters = 45, woodType = 'impregnert', serviceKey = 'snekker' } = body || {};
    const rate = 850;
    const estHours = Math.round(Number(squareMeters) * 0.6 + 8);
    const laborCost = estHours * rate;
    const materialCost = Math.round(Number(squareMeters) * 380);
    return NextResponse.json({
      serviceKey,
      squareMeters,
      woodType,
      estimatedHours: estHours,
      laborCost,
      materialCost,
      totalEstimate: laborCost + materialCost,
      compliance: 'TEK17 Standard & Mestergaranti'
    });
  } catch {
    return NextResponse.json({ error: 'Ugyldig kalkulasjonsdata' }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'VikingMester Kalkulator API',
    baseRatePerHour: 850,
    supportedMaterials: ['impregnert', 'moreroyal', 'kebony', 'termofuru']
  });
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
        path: "app/api/crm/deals/route.ts",
        content: `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    pipelineValue: '610 000 kr',
    activeDealsCount: 4,
    deals: [
      { id: '1', title: 'Takomlegging Villa', customer: 'Lars Holm', val: '185 000 kr', stage: 'lead' },
      { id: '2', title: 'Totalrehabilitering Bad', customer: 'Kari Lie', val: '240 000 kr', stage: 'befaring' },
      { id: '3', title: 'El-kontroll Næringsbygg', customer: 'Nordic Eiendom', val: '65 000 kr', stage: 'tilbud' },
      { id: '4', title: 'Maling Fasadeprosjekt', customer: 'Sameiet Sentrum', val: '120 000 kr', stage: 'vunnet' }
    ]
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      id: 'deal-' + Date.now(),
      data: body,
      message: 'Nytt lead registrert i PostgreSQL CRM'
    });
  } catch {
    return NextResponse.json({ error: 'Ugyldig leaddata' }, { status: 400 });
  }
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

export const MOCK_PROJECTS = INITIAL_PROJECTS;

const STORAGE_KEY = "aiprogram_user_projects";

export function getStoredProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length > 0) return parsed;
      return [createNewProject("Nytt Prosjekt")];
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
    description: description || `Skreddersydd programvare bygget med AI Program`,
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
import { Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('oversikt');

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-12 font-sans selection:bg-[#7C3AED] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center font-bold text-white shadow-lg">
              ${name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">${name}</h1>
              <p className="text-xs text-slate-400">Autonomt generert av AI Program</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-xs text-emerald-400 font-medium">
            ● Aktiv Løsning
          </span>
        </header>

        <main className="bg-[#12161F] border border-[#1F2937] rounded-2xl p-8 shadow-2xl space-y-6">
          <h2 className="text-2xl font-bold text-white">Velkommen til ${name}</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Dette prosjektet er klart for tilpasning. Du kan be AI Program Agent om å legge til nye komponenter, datamodeller i Prisma, Vipps-betaling eller henvendelsesskjemaer.
          </p>
        </main>
      </div>
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

