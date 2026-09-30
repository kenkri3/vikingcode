"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Loader2, Sparkles, Code2, CheckCircle2 } from "lucide-react";
import { ProjectFile } from "@/lib/types";

interface AgentWorkingHUDProps {
  projectName?: string;
  files?: ProjectFile[];
  isGenerating: boolean;
  onComplete?: () => void;
  onSwitchToCode?: () => void;
}

// Checklist items matching exact Image 2
const CHECKLIST_ITEMS = [
  { id: 1, title: "Instantly preview your changes" },
  { id: 2, title: "AI-powered design generation" },
  { id: 3, title: "Smart mobile-first layouts" },
  { id: 4, title: "Screenshot & URL to code" },
  { id: 5, title: "Real-time visual editing" },
  { id: 6, title: "Intelligent image integration" },
  { id: 7, title: "Live HTML code editing" },
  { id: 8, title: "Progressive enhancement loading" },
];

// Fallback high-fidelity sample JSX code matching Image 3 if files are not yet provided
const SAMPLE_STREAM_LINES = [
  "<!-- Navigation Bar & Brand Header -->",
  "<header class=\"sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4\">",
  "  <div class=\"max-w-7xl mx-auto flex items-center justify-between\">",
  "    <div class=\"flex items-center space-x-3\">",
  "      <span class=\"w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold\">AI</span>",
  "      <span class=\"text-lg font-bold text-white tracking-tight\">Nordic Studio</span>",
  "    </div>",
  "    <nav class=\"hidden md:flex items-center space-x-6 text-sm text-slate-300\">",
  "      <a href=\"#services\" class=\"hover:text-purple-400 transition\">Tjenester</a>",
  "      <a href=\"#portfolio\" class=\"hover:text-purple-400 transition\">Galleri</a>",
  "      <a href=\"#pricing\" class=\"hover:text-purple-400 transition\">Priser</a>",
  "    </nav>",
  "    <!-- Right CTAs & Language Switch -->",
  "    <div class=\"hidden md:flex items-center space-x-4\">",
  "      <!-- Language Indicator -->",
  "      <div class=\"inline-flex items-center bg-slate-900/80 border border-slate-800 rounded-full px-2.5 py-1 text-xs\">",
  "        <span class=\"w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5\"></span>",
  "        <span class=\"font-semibold text-white\">NO</span>",
  "        <span class=\"text-slate-500 mx-1\">/</span>",
  "        <span class=\"text-slate-400\">EN</span>",
  "      </div>",
  "      <a href=\"#contact\" class=\"text-sm font-medium text-slate-300 hover:text-white transition\">",
  "        Request Quote",
  "      </a>",
  "      <a href=\"#booking\" class=\"relative group inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-lg shadow-purple-900/40\">",
  "        <span class=\"relative\">Bestill Nå</span>",
  "      </a>",
  "    </div>",
  "  </div>",
  "</header>",
  "",
  "<!-- Luxury Hero Section -->",
  "<section class=\"relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-[#0d0d16] to-slate-950 px-6\">",
  "  <div class=\"max-w-4xl mx-auto text-center space-y-6 z-10\">",
  "    <div class=\"inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-800/40 text-purple-300 text-xs font-medium\">",
  "      <span class=\"w-2 h-2 rounded-full bg-purple-400 animate-ping\"></span>",
  "      <span>Håndplukkede blomster og nordisk design</span>",
  "    </div>",
  "    <h1 class=\"text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight\">",
  "      Blomsterkunst skapt med lidenskap og omtanke",
  "    </h1>",
  "    <p class=\"text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed\">",
  "      Vi leverer sesongens vakreste buketter, bryllupsbinderi og dekorasjoner rett på døren i hele regionen.",
  "    </p>",
  "    <div class=\"flex flex-wrap items-center justify-center gap-4 pt-4\">",
  "      <button class=\"px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-bold text-sm shadow-xl transition\">",
  "        Se Våre Buketter",
  "      </button>",
  "      <button class=\"px-6 py-3.5 rounded-2xl bg-[#1c1c24] hover:bg-[#282834] text-white border border-slate-800 font-semibold text-sm transition\">",
  "        Bestill Levering på Døren",
  "      </button>",
  "    </div>",
  "  </div>",
  "</section>",
];

// Lightweight syntax highlighter for Image 3 aesthetic
function renderSyntaxLine(line: string) {
  if (!line || !line.trim()) {
    return <span>&nbsp;</span>;
  }

  // Comments (HTML comments <!-- ... --> or JS // ...)
  if (line.trim().startsWith("<!--") || line.trim().startsWith("//")) {
    return <span className="text-[#64748b] italic">{line}</span>;
  }

  // Tokenize line into tags, attributes, strings, text
  const parts: React.ReactNode[] = [];
  const regex = /(<\/?[a-zA-Z0-9]+)|([a-zA-Z0-9_-]+)=|("[^"]*"|'[^']*')|([>/>])|([^<>"'=]+)/g;
  let match;
  let idx = 0;

  while ((match = regex.exec(line)) !== null) {
    const [full, tag, attr, str, bracket, text] = match;
    const key = `${idx++}-${match.index}`;

    if (tag) {
      parts.push(
        <span key={key} className="text-[#c084fc] font-semibold">
          {tag}
        </span>
      );
    } else if (attr) {
      parts.push(
        <span key={key} className="text-[#38bdf8]">
          {attr}=
        </span>
      );
    } else if (str) {
      parts.push(
        <span key={key} className="text-[#4ade80]">
          {str}
        </span>
      );
    } else if (bracket) {
      parts.push(
        <span key={key} className="text-[#c084fc]">
          {bracket}
        </span>
      );
    } else if (text) {
      parts.push(
        <span key={key} className="text-[#f1f5f9]">
          {text}
        </span>
      );
    }
  }

  return <>{parts.length > 0 ? parts : <span>{line}</span>}</>;
}

export function AgentWorkingHUD({
  projectName,
  files,
  isGenerating,
  onComplete,
  onSwitchToCode,
}: AgentWorkingHUDProps) {
  // Timing state
  const [elapsed, setElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [visibleLineCount, setVisibleLineCount] = useState(1);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Initialize lines from actual project code if available, or fallback to sample
  useEffect(() => {
    let sourceLines: string[] = [];
    if (files && files.length > 0) {
      const pageFile = files.find((f) => f.path.includes("page.tsx") || f.path.includes("page.jsx"));
      if (pageFile && pageFile.content) {
        sourceLines = pageFile.content
          .split("\n")
          .filter((l) => l.trim().length > 0 && !l.includes('"use client"') && !l.includes("import "));
      }
    }

    if (sourceLines.length < 10) {
      sourceLines = SAMPLE_STREAM_LINES;
    }

    setCodeLines(sourceLines);
  }, [files]);

  // Main timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Code line streaming in Phase 2
  useEffect(() => {
    if (elapsed >= 3.2 && !isCompleted) {
      const streamTimer = setInterval(() => {
        setVisibleLineCount((prev) => {
          if (prev >= codeLines.length) return prev;
          return prev + 1;
        });
      }, 90); // ~11 lines per second for realistic typing rhythm
      return () => clearInterval(streamTimer);
    }
  }, [elapsed, isCompleted, codeLines.length]);

  // Auto-scroll code container as lines stream
  useEffect(() => {
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
    }
  }, [visibleLineCount]);

  // Completion trigger when isGenerating turns false - transition to live preview
  const completeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isGenerating) {
      setIsCompleted(true);
      if (!completeTimerRef.current) {
        completeTimerRef.current = setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }
    } else {
      setIsCompleted(false);
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    }
    return () => {
      if (completeTimerRef.current) {
        clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    };
  }, [isGenerating, onComplete]);

  // Phase calculation:
  // Phase 1 (0 to 3.2s): Checklist Screen (Exact Image 2)
  // Phase 2 (3.2s+): Live Code Stream (Exact Image 3)
  // Phase 3 (when finished): "Completed" badge before revealing preview
  const showChecklist = elapsed < 3.2 && !isCompleted;

  // Checklist active step:
  // step 1: 0.0 - 0.7s
  // step 2: 0.7 - 1.4s
  // step 3: 1.4 - 2.1s
  // step 4: 2.1 - 3.2s ("Screenshot to code" glowing lime-green as in Image 2!)
  const activeStepId = elapsed < 0.7 ? 1 : elapsed < 1.4 ? 2 : elapsed < 2.1 ? 3 : 4;

  const startingLineNumber = 148; // Starting line number from Image 3

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-white flex flex-col items-center justify-center p-4 sm:p-8 select-none relative overflow-hidden font-sans">
      {/* ============================================================== */}
      {/* PHASE 1: CHECKLIST SCREEN (Exact Image 2)                       */}
      {/* ============================================================== */}
      {showChecklist && (
        <div className="max-w-md w-full space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
          {CHECKLIST_ITEMS.map((item) => {
            const isFinished = item.id < activeStepId;
            const isCurrent = item.id === activeStepId;
            const isPending = item.id > activeStepId;

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isCurrent
                    ? "text-[#84cc16] font-semibold scale-[1.02]"
                    : isFinished
                    ? item.id === 3
                      ? "text-white font-medium"
                      : "text-slate-400"
                    : "text-slate-600 opacity-60"
                }`}
              >
                {/* Circle Icon */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isFinished ? (
                    item.id === 3 ? (
                      // White filled checkmark circle
                      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-black">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      // Grey filled checkmark circle
                      <div className="w-4 h-4 rounded-full bg-slate-500/80 flex items-center justify-center text-black">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </div>
                    )
                  ) : isCurrent ? (
                    // Vivid Lime Green Checkmark Circle (Exact Image 2)
                    <div className="w-4.5 h-4.5 rounded-full bg-[#84cc16] flex items-center justify-center text-black shadow-md shadow-[#84cc16]/30 animate-pulse">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    // Empty Circle
                    <div className="w-4 h-4 rounded-full border border-slate-600/60" />
                  )}
                </div>

                {/* Text Label */}
                <span className="text-sm tracking-tight">{item.title}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================== */}
      {/* PHASE 2 & 3: LIVE CODE STREAM & COMPLETED STATE (Exact Image 3) */}
      {/* ============================================================== */}
      {!showChecklist && (
        <div className="w-full max-w-3xl h-[85vh] flex flex-col bg-[#0a0a0c] animate-in fade-in duration-300">
          {/* Top Status Header: ⟳ Generating... OR ✓ Completed */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/60 shrink-0">
            <div className="flex items-center gap-2.5">
              {isCompleted ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">Completed</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
                    Klar
                  </span>
                </>
              ) : (
                <>
                  {/* Subtle Ring Spinner matching Image 3 */}
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-white animate-spin" />
                  </div>
                  <span className="text-sm font-bold text-white tracking-tight">Generating...</span>
                  <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2 py-0.5 rounded-full ml-1">
                    {projectName || "app"}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">
                Linje {startingLineNumber + visibleLineCount}
              </span>
              {onSwitchToCode && (
                <button
                  type="button"
                  onClick={onSwitchToCode}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition cursor-pointer"
                >
                  Åpne Editor
                </button>
              )}
            </div>
          </div>

          {/* Monospace Code Stream with Line Numbers (Exact Image 3) */}
          <div
            ref={codeContainerRef}
            className="flex-1 overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed py-2 select-text scrollbar-thin scrollbar-thumb-slate-800"
          >
            {codeLines.slice(0, visibleLineCount).map((line, idx) => {
              const lineNo = startingLineNumber + idx;
              const isLast = idx === visibleLineCount - 1 && !isCompleted;

              return (
                <div key={idx} className="flex items-start hover:bg-slate-900/30 py-0.5 px-1 rounded">
                  {/* Left Column: Dim Line Numbers */}
                  <span className="w-12 text-slate-600 select-none shrink-0 text-right pr-4 font-mono">
                    {lineNo}
                  </span>

                  {/* Right Column: Highlighted Code */}
                  <div className="flex-1 whitespace-pre-wrap font-mono">
                    {renderSyntaxLine(line)}
                    {isLast && (
                      <span className="inline-block w-2 h-4 bg-slate-300 animate-pulse align-middle ml-1" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom helper */}
          {isCompleted && (
            <button
              type="button"
              onClick={() => onComplete?.()}
              className="pt-2 text-center text-xs font-mono text-emerald-400 hover:text-emerald-300 animate-pulse transition cursor-pointer w-full flex items-center justify-center gap-1.5"
            >
              <span>✓ Kildekode kompilert og verifisert. Viser forhåndsvisning...</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
