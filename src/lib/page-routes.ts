import { ProjectFile } from "./types";

export interface PageRouteInfo {
  route: string;       // f.eks. "/", "/booking", "/om-oss", "/kontakt"
  path: string;        // f.eks. "app/page.tsx", "app/booking/page.tsx"
  title: string;       // f.eks. "Forside", "Booking", "Om oss", "Kontakt"
  rawCode: string;
}

/**
 * Konverterer filbane til en web-rute
 * F.eks:
 * "app/page.tsx" -> "/"
 * "app/booking/page.tsx" -> "/booking"
 * "app/kontakt/page.jsx" -> "/kontakt"
 * "app/om-oss/side/page.tsx" -> "/om-oss/side"
 * "pages/priser.tsx" -> "/priser"
 */
export function pathToRoute(path: string): string | null {
  const normalized = path.replace(/\\/g, "/").replace(/^\/+/, "");

  // App router mønstre
  if (normalized === "app/page.tsx" || normalized === "app/page.jsx" || normalized === "src/app/page.tsx") {
    return "/";
  }

  const appMatch = normalized.match(/^(?:src\/)?app\/(.+)\/page\.(?:tsx|jsx|js|ts)$/);
  if (appMatch) {
    const routeSegment = appMatch[1]
      .split("/")
      .filter((s) => !s.startsWith("(") && !s.endsWith(")")) // Fjern route groups som (auth)
      .join("/");
    return "/" + routeSegment;
  }

  // Pages router mønstre (hvis brukt)
  if (normalized === "pages/index.tsx" || normalized === "pages/index.jsx") {
    return "/";
  }
  const pagesMatch = normalized.match(/^(?:src\/)?pages\/(.+)\.(?:tsx|jsx|js|ts)$/);
  if (pagesMatch && !pagesMatch[1].startsWith("_") && !pagesMatch[1].startsWith("api/")) {
    return "/" + pagesMatch[1];
  }

  return null;
}

/**
 * Gjør om rutenavn til en pen lesbar tittel
 */
export function routeToTitle(route: string): string {
  if (route === "/" || !route) return "Forside";
  const lastSegment = route.split("/").filter(Boolean).pop() || "";
  const nameMap: Record<string, string> = {
    booking: "Timebestilling",
    kontakt: "Kontakt oss",
    "om-oss": "Om oss",
    tjenester: "Tjenester",
    priser: "Priser",
    admin: "Adminpanel",
    dashboard: "Kontrollpanel",
    login: "Logg inn",
    galleri: "Bildegalleri",
    faq: "Ofte stilte spørsmål",
    blogg: "Artikler & Nyheter",
  };

  if (nameMap[lastSegment.toLowerCase()]) {
    return nameMap[lastSegment.toLowerCase()];
  }

  // Kapitaliser første bokstav
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
}

/**
 * Finn alle ruter og tilhørende sider fra en filliste
 */
export function getProjectPageRoutes(files: ProjectFile[]): PageRouteInfo[] {
  const routes: PageRouteInfo[] = [];

  for (const file of files) {
    const route = pathToRoute(file.path);
    if (route) {
      routes.push({
        route,
        path: file.path,
        title: routeToTitle(route),
        rawCode: file.content,
      });
    }
  }

  // Sorter slik at forside "/" alltid er først, deretter alfabetisk
  routes.sort((a, b) => {
    if (a.route === "/") return -1;
    if (b.route === "/") return 1;
    return a.route.localeCompare(b.route);
  });

  // Hvis ingen sider ble funnet (f.eks. ved tomt prosjekt), opprett fallback forside
  if (routes.length === 0) {
    const defaultPage = files.find((f) => f.path.includes("page.tsx")) || files[0];
    routes.push({
      route: "/",
      path: defaultPage ? defaultPage.path : "app/page.tsx",
      title: "Forside",
      rawCode: defaultPage ? defaultPage.content : "",
    });
  }

  return routes;
}

/**
 * Generer kildekode for en ny underside
 */
export function generatePageTemplate(
  route: string,
  projectName: string
): { path: string; content: string } {
  const cleanRoute = route.replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  const filePath = cleanRoute ? `app/${cleanRoute}/page.tsx` : "app/page.tsx";
  const title = routeToTitle("/" + cleanRoute);

  const content = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Sparkles, Send, Calendar, Clock, MapPin } from 'lucide-react';

export default function ${cleanRoute.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('') || 'App'}Page() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0e0e12] text-slate-100 flex flex-col font-sans">
      {/* Toppnavigasjon */}
      <header className="border-b border-[#22222e] bg-[#14141c]/90 backdrop-blur-md px-6 py-4 sticky top-0 z-40 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tilbake til forsiden</span>
        </Link>
        <span className="text-xs font-mono text-purple-400 bg-purple-950/70 border border-purple-800/40 px-2.5 py-1 rounded-full">
          /${cleanRoute}
        </span>
      </header>

      {/* Hovedinnhold */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-800/40 text-xs font-medium text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>${projectName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ${title}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Dette er en dedikert underside for ${title.toLowerCase()} i ${projectName}. Siden kan tilpasses fritt eller utvides via AI Program Agent.
          </p>
        </div>

        {/* Skjema- eller handlingsmodul */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#14141c] border border-[#22222e] shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white">Send henvendelse eller bestill</h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Tusen takk for henvendelsen!</h3>
              <p className="text-xs text-slate-300">Vi har mottatt meldingen din og svarer så snart som mulig.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Fullt navn</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Kari Nordmann"
                    className="w-full px-3.5 py-2.5 bg-[#0e0e13] border border-[#2a2a38] rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">Telefonnummer</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+47 900 00 000"
                    className="w-full px-3.5 py-2.5 bg-[#0e0e13] border border-[#2a2a38] rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1 block">Beskjed eller ønske</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Fortell oss hva du ønsker hjelp med..."
                  className="w-full px-3.5 py-2.5 bg-[#0e0e13] border border-[#2a2a38] rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50"
              >
                <Send className="w-4 h-4" />
                <span>Bekreft innsending</span>
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
`;

  return { path: filePath, content };
}
