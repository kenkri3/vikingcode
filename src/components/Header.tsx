"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VikingLogo } from "./VikingLogo";
import { UserSession, Project } from "@/lib/types";
import { PLAN_CONFIGS } from "@/lib/tokens";
import {
  Zap,
  Lock,
  Download,
  Github,
  ChevronDown,
  ExternalLink,
  FolderGit2,
  Rocket,
  LayoutDashboard,
} from "lucide-react";

interface HeaderProps {
  user: UserSession;
  activeProject: Project;
  onOpenPricing: () => void;
  onDeployRailway: () => void;
  onDownloadZip: () => void;
  onPushGithub: () => void;
  isDeploying?: boolean;
  onResetToStart?: () => void;
}

export function Header({
  user,
  activeProject,
  onOpenPricing,
  onDeployRailway,
  onDownloadZip,
  onPushGithub,
  isDeploying = false,
  onResetToStart,
}: HeaderProps) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const planConfig = PLAN_CONFIGS[user.plan];
  const isTrial = user.plan === "TRIAL";
  const maxTokens = planConfig.tokensPerMonth;
  const tokenPercent = Math.min(100, Math.max(0, (user.tokensRemaining / maxTokens) * 100));

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0A0D12]/95 backdrop-blur-md border-b border-[#1F2937] px-4 flex items-center justify-between select-none">
      {/* Left: AI Program Logo & Project breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetToStart}
          className="flex items-center gap-2.5 hover:opacity-90 transition group text-left"
          title="Gå til startskjerm"
        >
          <VikingLogo size={28} />
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-white font-sans">
                AI Program
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40">
                .no
              </span>
            </div>
            <span className="text-[9px] text-slate-400 -mt-0.5">aiprogram.no • Autonom Kodebygger</span>
          </div>
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-[1px] bg-[#1F2937] hidden md:block"></div>

        {/* Active Project Breadcrumb (Antigravity style) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300">
          <span className="text-slate-500 font-medium">Prosjekt /</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12161F] border border-[#1F2937] text-slate-200">
            <FolderGit2 className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="font-semibold text-white max-w-[200px] truncate">
              {activeProject.name}
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right: Token Meter */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#12161F] border border-[#1F2937]">
          {isTrial ? (
            /* TRIAL METER */
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-amber-300 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Prøveperiode:
              </span>
              <span className="text-white font-semibold">
                {user.trialPromptsUsed}/3 tester brukt
              </span>
              <span className="text-slate-400">
                ({user.tokensRemaining.toLocaleString("no-NO")} tokens igjen)
              </span>
            </div>
          ) : (
            /* BETALENDE METER */
            <div className="flex items-center gap-2.5 text-xs">
              <span className="text-[#C4B5FD] font-semibold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
                Saldo:
              </span>
              <span className="text-white font-bold">
                {user.tokensRemaining.toLocaleString("no-NO")}
              </span>
              <span className="text-slate-400">/ {maxTokens.toLocaleString("no-NO")}</span>

              {/* Progress bar */}
              <div className="w-24 h-1.5 rounded-full bg-[#0A0D12] overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] transition-all duration-500"
                  style={{ width: `${tokenPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Oppgrader / Fyll på knapp */}
          <button
            onClick={onOpenPricing}
            className="ml-2 px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[11px] font-bold text-[#C4B5FD] hover:text-white transition"
          >
            Oppgrader / Fyll på
          </button>
        </div>

        {/* Small Screen Token Button */}
        <button
          onClick={onOpenPricing}
          className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#12161F] border border-[#1F2937] text-xs font-semibold text-[#A78BFA]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{user.tokensRemaining.toLocaleString("no-NO")}</span>
        </button>

        {/* Action Button 1: Deploy til egen Railway-konto via GitHub */}
        <button
          onClick={isTrial ? onOpenPricing : onDeployRailway}
          className={`h-8 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${
            isTrial
              ? "bg-[#181E2B] text-slate-400 border border-[#1F2937] hover:border-slate-600"
              : "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white shadow-purple-900/30"
          }`}
          title={isTrial ? "Låst i prøveperiode - oppgrader for 1-klikks Railway Template deploy" : "Pushe til GitHub og deploy direkte på din egen Railway-konto"}
        >
          {isTrial ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Deploy på Railway</span>
            </>
          ) : (
            <>
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy på Railway (1-klikk)</span>
            </>
          )}
        </button>

        {/* Action Button 2: Eksporter kode (For utviklere) */}
        <div className="relative">
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="h-8 px-3 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
          >
            {isTrial && <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">Eksporter kode</span>
            <span className="sm:hidden">Eksport</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#12161F] border border-[#1F2937] rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#1F2937] mb-1">
                <p className="font-semibold text-white">Eksporter & Distribuer</p>
                <p className="text-[11px] text-slate-400">Pushe til eget GitHub-repo eller last ned lokalt</p>
              </div>

              {/* Push til GitHub */}
              <button
                onClick={() => {
                  setExportDropdownOpen(false);
                  if (isTrial) {
                    onOpenPricing();
                  } else {
                    onPushGithub();
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
              >
                <span className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-slate-300" />
                  Push til GitHub-repo
                </span>
                {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
              </button>

              {/* Last ned ZIP */}
              <button
                onClick={() => {
                  setExportDropdownOpen(false);
                  if (isTrial) {
                    onOpenPricing();
                  } else {
                    onDownloadZip();
                  }
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-[#A78BFA]" />
                  Last ned ZIP-arkiv
                </span>
                {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Action Button 3: Dashboard / SuperAdmin */}
        <Link
          href="/dashboard"
          className="h-8 px-2.5 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
          title="Gå til Dashboard / SuperAdmin"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>
      </div>
    </header>
  );
}
