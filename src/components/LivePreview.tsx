"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Loader2,
  Code,
  Terminal,
  Zap,
  Clock,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";

interface LivePreviewProps {
  files: ProjectFile[];
  projectName: string;
  isGenerating?: boolean;
  onSwitchToCode?: () => void;
}

type DeviceMode = "desktop" | "tablet" | "mobile";

// Pre-process code in pure TypeScript outside template literal so regexes are never corrupted
function prepareComponentCode(rawCode: string) {
  if (!rawCode || !rawCode.trim()) {
    return { code: "", compName: "App" };
  }

  // 1. Extract all icons imported from 'lucide-react'
  const importedIcons: string[] = [];
  const lucideRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];?/g;
  let match: RegExpExecArray | null;
  while ((match = lucideRegex.exec(rawCode)) !== null) {
    const names = match[1]
      .split(",")
      .map((s) => s.trim().replace(/^type\s+/, ""))
      .filter((s) => s && /^[A-Za-z0-9_]+$/.test(s));
    importedIcons.push(...names);
  }

  let code = rawCode.replace(/\r\n/g, "\n");

  // 1.4 Strip stray markdown fences
  code = code.replace(/^```[a-zA-Z0-9_-]*\s*$/gm, '');
  code = code.replace(/```\s*$/g, '');

  // 2. Strip "use client"
  code = code.replace(/['"]use client['"];?/g, "");

  // 3. Strip all React imports
  code = code.replace(/import[\s\S]*?from\s*['"]react['"];?/g, "");

  // 4. Strip lucide-react imports
  code = code.replace(/import[\s\S]*?from\s*['"]lucide-react['"];?/g, "");

  // 5. Strip next/link, next/image, and other next imports
  code = code.replace(/import[\s\S]*?from\s*['"]next\/[^'"]+['"];?/g, "");

  // 6. Strip any other external imports
  code = code.replace(/import\s+(?:type\s+)?[\s\S]*?from\s*['"][^'"]+['"];?/g, "");
  code = code.replace(/import\s*['"][^'"]+['"];?/g, "");

  // 7. Find component export name
  let compName = "App";
  const fnMatch = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (fnMatch) {
    compName = fnMatch[1];
    code = code.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/, "function $1");
  } else {
    const varMatch = code.match(/export\s+default\s+([A-Za-z0-9_]+)/);
    if (varMatch) {
      compName = varMatch[1];
      code = code.replace(/export\s+default\s+[A-Za-z0-9_]+;?/, "");
    } else if (/export\s+default\s+function/.test(code)) {
      compName = "__DynamicDefaultApp";
      code = code.replace(/export\s+default\s+function/, "function __DynamicDefaultApp");
    }
  }

  // 8. Strip any remaining export keywords
  code = code.replace(/export\s+(?:const|let|var|function|type|interface)\s+/g, "");

  // 9. Prepend icon declarations if icons were imported
  const uniqueIcons = Array.from(new Set(importedIcons));
  const iconDeclarations =
    uniqueIcons.length > 0
      ? `const { ${uniqueIcons.join(", ")} } = window.__lucideProxy;\n`
      : "";

  return {
    code: iconDeclarations + code,
    compName,
  };
}

const ICON_SVGS: Record<string, string> = {
  Scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/>',
  ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  ShoppingCart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  Utensils: '<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 11v11"/><path d="M5 2v20"/><path d="M2 2h6v5a3 3 0 0 1-6 0V2z"/>',
  Car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 12.8V16c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  Dumbbell: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  BadgeCheck: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
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
  Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
};

function AgentWorkingHUD({
  projectName,
  onSwitchToCode,
}: {
  projectName: string;
  onSwitchToCode?: () => void;
}) {
  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<"flow" | "terminal">("flow");

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.min(12 + seconds * 8, 95);

  const steps = [
    {
      id: 1,
      title: "Tolker arkitektur & krav",
      status: seconds >= 2 ? ("done" as const) : ("active" as const),
      detail: "Next.js 15 App Router struktur og datamodell definert",
    },
    {
      id: 2,
      title: "Responsivt UI & Tailwind-design",
      status: seconds >= 5 ? ("done" as const) : seconds >= 2 ? ("active" as const) : ("pending" as const),
      detail: "Mørkt tema, mobilvennlig navigasjon og kontrast-aksenter",
    },
    {
      id: 3,
      title: "React-komponenter & forretningslogikk",
      status: seconds >= 9 ? ("done" as const) : seconds >= 5 ? ("active" as const) : ("pending" as const),
      detail: "Tidsvelger, modal-dialoger og interaktive handlinger",
    },
    {
      id: 4,
      title: "Syntakskontroll & sanntids-sandkasse",
      status: seconds >= 9 ? ("active" as const) : ("pending" as const),
      detail: "Klargjør for umiddelbar interaktiv testing",
    },
  ];

  const terminalLogs = [
    `> Initialiserer AI Program Ultra autonom kodebygger...`,
    `> Målprosjekt: "${projectName || "Web-applikasjon"}"`,
    `> Analyserer krav og konstruerer komponenttre...`,
    `> Genererer Tailwind CSS styling og design tokens...`,
    `> Bygger app/page.tsx med fullstack state og Lucide-ikoner...`,
    `> Klargjør API-ruter og database-skjemaer...`,
    `> Utfører automatisk AST syntakskontroll...`,
    `> Klargjør sanntids React-sandkasse for interaktiv visning...`,
  ].slice(0, Math.max(2, Math.min(8, 2 + Math.floor(seconds / 1.5))));

  return (
    <div className="h-full w-full bg-[#0d0d12] flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Header Card */}
      <div className="space-y-6 max-w-2xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#22222e]">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-purple-500/25"></span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-950/60 z-10">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                  AI Program Ultra
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Bygger løsning
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {projectName || "Ny Applikasjon"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-[#171720] border border-[#2a2a38] text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </span>
            </div>
            {onSwitchToCode && (
              <button
                type="button"
                onClick={onSwitchToCode}
                className="px-3 py-1.5 rounded-xl bg-[#22222e] hover:bg-[#2c2c3c] border border-[#353548] text-xs font-medium text-slate-200 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Se koden som genereres"
              >
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>Se kode</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar with dynamic percentage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Autonom kodebygging pågår</span>
            </span>
            <span className="font-mono font-bold text-purple-300">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#181822] overflow-hidden border border-[#282836] p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] via-pink-500 to-emerald-400 transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* View Switcher: Steg vs Terminal */}
        <div className="flex items-center gap-2 bg-[#14141c] p-1 rounded-xl border border-[#232330] w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("flow")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "flow"
                ? "bg-[#252534] text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Arbeidsflyt</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === "terminal"
                ? "bg-[#252534] text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sanntids Terminal</span>
          </button>
        </div>

        {/* Tab 1: Stegvis prosess */}
        {activeTab === "flow" && (
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {steps.map((st) => (
              <div
                key={st.id}
                className={`p-3.5 rounded-xl border transition flex items-start gap-3.5 ${
                  st.status === "done"
                    ? "bg-[#14141c]/90 border-emerald-900/40 text-slate-200"
                    : st.status === "active"
                    ? "bg-[#1a1728] border-purple-600/50 text-white ring-1 ring-purple-500/30 shadow-lg shadow-purple-950/30"
                    : "bg-[#111116] border-[#1e1e28] text-slate-500 opacity-60"
                }`}
              >
                <div className="mt-0.5">
                  {st.status === "done" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : st.status === "active" ? (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-xs font-bold ${
                        st.status === "active"
                          ? "text-white"
                          : st.status === "done"
                          ? "text-slate-200"
                          : "text-slate-500"
                      }`}
                    >
                      {st.title}
                    </h3>
                    <span
                      className={`text-[10px] font-mono ${
                        st.status === "done"
                          ? "text-emerald-400"
                          : st.status === "active"
                          ? "text-purple-300 font-bold"
                          : "text-slate-600"
                      }`}
                    >
                      {st.status === "done"
                        ? "Fullført ✓"
                        : st.status === "active"
                        ? "Arbeider..."
                        : "Venter"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {st.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Sanntids Terminal Logg */}
        {activeTab === "terminal" && (
          <div className="bg-[#08080c] border border-[#22222e] rounded-xl p-4 font-mono text-xs shadow-2xl space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1c28]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 text-[10px] text-slate-400">
                  aiprogram-kernel --build --live
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 animate-pulse font-mono">
                ● ACTIVE
              </span>
            </div>
            <div className="space-y-1.5 py-1 text-slate-300">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-purple-400 select-none">&gt;</span>
                  <span className="text-slate-300">{log.replace(/^>\s*/, "")}</span>
                </div>
              ))}
              <div className="flex items-center gap-1 text-purple-400 font-bold">
                <span>&gt;</span>
                <span className="w-2 h-4 bg-purple-400 animate-pulse inline-block"></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="max-w-2xl mx-auto w-full pt-6 border-t border-[#1c1c26] text-center">
        <p className="text-[11px] text-slate-500">
          Forhåndsvisningen starter automatisk så snart koden er ferdig kompilert.
        </p>
      </div>
    </div>
  );
}

export function LivePreview({
  files,
  projectName,
  isGenerating = false,
  onSwitchToCode,
}: LivePreviewProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  // Finn kildekoden for app/page.tsx eller første fil
  const pageFile = files.find((f) => f.path.includes("page.tsx")) || files[0];
  const rawCode = pageFile ? pageFile.content : "";

  // Pre-process code safely
  const { code: cleanedCode, compName } = useMemo(
    () => prepareComponentCode(rawCode),
    [rawCode]
  );

  // Beregn hash for kildekoden for å garantere fresh remount av sandkassen ved enhver kodeendring
  const contentHash = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < rawCode.length; i++) {
      hash = (hash << 5) - hash + rawCode.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }, [rawCode]);

  // Bygg 100% dynamisk, interaktiv sandkasse-HTML basert på faktisk kildekode (Bolt.new style)
  const iframeHtml = useMemo(() => {
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.26.2/babel.min.js"></script>
    <style>
      body { background-color: #141414; color: #F9FAFB; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-thumb { background: #2e2e2e; border-radius: 9999px; }
    </style>
  </head>
  <body class="bg-[#141414] text-slate-100 min-h-screen">
    <div id="root">
      <div class="flex flex-col items-center justify-center min-h-[380px] p-6 text-slate-400 gap-3">
        <div class="w-8 h-8 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs font-mono text-slate-400">Kompilerer og starter React-sandkasse...</p>
      </div>
    </div>

    <script>
      const ICON_SVGS = ${JSON.stringify(ICON_SVGS)};

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

      window.__lucideProxy = new Proxy({}, {
        get: (target, prop) => createIcon(String(prop))
      });

      // Sandkasse Mock Fetch
      const origFetch = window.fetch;
      window.fetch = async (url, options) => {
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

      // Toast notification helper inside sandbox
      function showSandboxToast(msg) {
        var existing = document.getElementById('__sandbox_toast');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.id = '__sandbox_toast';
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1c1c24;color:#f3f4f6;border:1px solid #7C3AED;padding:8px 18px;border-radius:9999px;font-size:12px;font-weight:500;box-shadow:0 10px 25px rgba(0,0,0,0.6);z-index:99999;transition:opacity 0.25s, transform 0.25s;pointer-events:none;';
        document.body.appendChild(toast);
        setTimeout(function() {
          toast.style.opacity = '0';
          toast.style.transform = 'translateX(-50%) translateY(8px)';
          setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
        }, 2200);
      }

      // Universal click interceptor: Forhindrer at iframe navigerer til verts-applikasjonen
      document.addEventListener('click', function(e) {
        var el = e.target;
        while (el && el !== document.body) {
          if (el.tagName === 'A') {
            var href = el.getAttribute('href') || '';
            e.preventDefault();
            e.stopPropagation();
            if (href.startsWith('#')) {
              var target = document.querySelector(href);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            } else if (href.startsWith('http://') || href.startsWith('https://')) {
              window.open(href, '_blank', 'noopener,noreferrer');
            } else if (href) {
              showSandboxToast('Simulert side: ' + href);
            }
            return;
          }
          el = el.parentElement;
        }
      }, true);

      // Universal form submit interceptor: Hindrer at innsending av skjema laster siden på nytt
      document.addEventListener('submit', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSandboxToast('✓ Skjema innsendt (sandkasse-modus)');
      }, true);

      // Mock Next.js navigation & components
      const Link = (props) => {
        const { href, children, onClick, ...rest } = props;
        return React.createElement('a', {
          href: href || '#',
          onClick: (e) => {
            e.preventDefault();
            if (onClick) onClick(e);
            if (href && href.startsWith('#')) {
              const target = document.querySelector(href);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
              window.open(href, '_blank', 'noopener,noreferrer');
            } else if (href) {
              showSandboxToast('Simulert side: ' + href);
            }
          },
          ...rest
        }, children);
      };

      const Image = (props) => React.createElement('img', { ...props, alt: props.alt || '' });

      const useRouter = () => ({
        push: (url) => showSandboxToast('Navigasjon: ' + url),
        replace: (url) => showSandboxToast('Erstatter: ' + url),
        prefetch: () => {},
        back: () => showSandboxToast('Går tilbake'),
        pathname: '/',
        query: {}
      });
      const usePathname = () => '/';
      const useSearchParams = () => new URLSearchParams();
      const redirect = (url) => showSandboxToast('Omdirigert til: ' + url);

      const rawSource = ${JSON.stringify(cleanedCode)};
      const compName = ${JSON.stringify(compName)};

      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
          console.error('[React Sandbox Render Error]:', error, errorInfo);
        }
        render() {
          if (this.state.hasError) {
            return React.createElement('div', { className: 'p-6 max-w-xl mx-auto my-8 bg-[#1f1f1f] border border-amber-500/50 rounded-2xl text-slate-200' },
              React.createElement('h3', { className: 'text-sm font-bold text-amber-400 mb-2' }, '⚡ Kjøretidsfeil i forhåndsvisning'),
              React.createElement('p', { className: 'text-xs text-slate-400 mb-2' }, 'Komponenten støtte på en feil under rendering:'),
              React.createElement('pre', { className: 'p-3 bg-[#141414] text-amber-300 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap' }, String(this.state.error && (this.state.error.message || this.state.error)))
            );
          }
          return this.props.children;
        }
      }

      function runSandbox() {
        var rootEl = document.getElementById('root');
        if (!rawSource || !rawSource.trim()) {
          rootEl.innerHTML = '<div class="p-8 text-center text-slate-500 font-mono text-xs">Venter på kildekode...</div>';
          return;
        }

        try {
          if (typeof Babel === 'undefined') {
            throw new Error('Babel Standalone er ikke lastet inn.');
          }

          var transpiled = null;
          try {
            transpiled = Babel.transform(rawSource, {
              presets: ['react', 'typescript'],
              filename: 'preview.tsx'
            }).code;
          } catch (firstErr) {
            console.warn('[Babel Sandbox parse error]:', firstErr);
            var errLine = (firstErr && firstErr.loc && firstErr.loc.line) || 0;
            if (errLine > 0) {
              var lines = rawSource.split(String.fromCharCode(10));
              if (errLine <= lines.length) {
                var bad = lines[errLine - 1];
                if (bad.indexOf('<') !== -1 || bad.indexOf('>') !== -1) {
                  lines[errLine - 1] = '{/* ' + bad.replace(/[{}]/g, '') + ' */}';
                } else {
                  lines[errLine - 1] = '// ' + bad;
                }
                transpiled = Babel.transform(lines.join(String.fromCharCode(10)), {
                  presets: ['react', 'typescript'],
                  filename: 'preview.tsx'
                }).code;
              } else {
                throw firstErr;
              }
            } else {
              throw firstErr;
            }
          }

          var execFn = new Function(
            'React', 'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useId', 'Fragment', 'Link', 'Image', 'useRouter', 'usePathname', 'useSearchParams', 'redirect',
            transpiled + String.fromCharCode(10) + 'return typeof ' + compName + ' !== "undefined" ? ' + compName + ' : (typeof App !== "undefined" ? App : null);'
          );

          var Component = execFn(
            React,
            React.useState,
            React.useEffect,
            React.useMemo,
            React.useCallback,
            React.useRef,
            React.useId,
            React.Fragment,
            Link,
            Image,
            useRouter,
            usePathname,
            useSearchParams,
            redirect
          );

          if (!Component) {
            throw new Error('Fant ingen gyldig React-komponent å rendre i ' + compName);
          }

          rootEl.innerHTML = '';
          var root = ReactDOM.createRoot(rootEl);
          root.render(React.createElement(ErrorBoundary, null, React.createElement(Component)));
        } catch (err) {
          console.error('[Sandbox Compiler Error]:', err);
          var errMsg = err && err.message ? err.message : String(err);
          rootEl.innerHTML = '<div class="p-6 max-w-2xl mx-auto my-8 bg-[#1f1f1f] border border-amber-500/40 rounded-2xl shadow-2xl space-y-4">' +
            '<div class="flex items-center gap-3 text-amber-400">' +
              '<span class="text-xl">⚡</span>' +
              '<h3 class="font-bold text-sm">Sanntids React-sandkasse</h3>' +
            '</div>' +
            '<p class="text-xs text-slate-300 leading-relaxed">' +
              'Det oppsto en feil under kompilering av forhåndsvisningen:' +
              '<code class="block mt-2 p-3 bg-[#141414] text-amber-300 font-mono text-[11px] rounded-xl border border-amber-900/50 overflow-x-auto whitespace-pre-wrap">' + errMsg + '</code>' +
            '</p>' +
            '<div class="pt-2 border-t border-[#2e2e2e] flex items-center justify-between">' +
              '<span class="text-[11px] text-slate-400">Next.js 15 Sandkasse</span>' +
              '<button onclick="location.reload()" class="px-3.5 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl cursor-pointer">' +
                'Last inn på nytt' +
              '</button>' +
            '</div>' +
          '</div>';
        }
      }

      function initSandbox() {
        var attempts = 0;
        function checkAndRun() {
          if (typeof Babel !== 'undefined' && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
            runSandbox();
            return true;
          }
          return false;
        }

        if (!checkAndRun()) {
          var interval = setInterval(function() {
            attempts++;
            if (checkAndRun()) {
              clearInterval(interval);
            } else if (attempts >= 100) {
              clearInterval(interval);
              runSandbox();
            }
          }, 80);
        }
      }

      initSandbox();
    </script>
  </body>
</html>`;
  }, [cleanedCode, compName, projectName, rawCode]);

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
    <div className="flex-1 flex flex-col h-full bg-[#121215] relative overflow-hidden">
      {/* Frame Container */}
      <div className="flex-1 p-2 sm:p-3 flex items-start justify-center overflow-auto bg-[#121215]">
        <div
          className="h-full w-full border border-[#26262e] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 bg-[#16161c]"
          style={{ width: isGenerating ? "100%" : deviceWidths[device], maxWidth: "100%" }}
        >
          {isGenerating ? (
            <AgentWorkingHUD
              projectName={projectName}
              onSwitchToCode={onSwitchToCode}
            />
          ) : (
            <iframe
              key={`${reloadKey}-${contentHash}`}
              srcDoc={iframeHtml}
              title="AI Program Live Sandbox Preview"
              className="w-full h-full border-none min-h-[550px]"
              sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
            />
          )}
        </div>
      </div>

      {/* Floating Device Switcher at bottom left (Active only when preview is live) */}
      {!isGenerating && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 bg-[#1c1c22]/90 backdrop-blur-md p-1 rounded-xl border border-[#2e2e38] shadow-xl select-none">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded-lg transition cursor-pointer text-slate-400 hover:text-white hover:bg-[#2c2c36]"
            title="Last inn på nytt (Nullstill forhåndsvisning)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-[#2e2e38] mx-0.5" />
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              device === "desktop"
                ? "bg-[#2c2c36] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              device === "tablet"
                ? "bg-[#2c2c36] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Nettbrett (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              device === "mobile"
                ? "bg-[#2c2c36] text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Mobil (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
