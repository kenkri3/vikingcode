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
  Menu,
  MoreVertical,
  X,
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
  onToggleSidebar?: () => void;
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
  onToggleSidebar,
}: HeaderProps) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const planConfig = PLAN_CONFIGS[user.plan];
  const isTrial = user.plan === "TRIAL";
  const maxTokens = planConfig.tokensPerMonth;
  const tokenPercent = Math.min(100, Math.max(0, (user.tokensRemaining / maxTokens) * 100));

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0A0D12]/95 backdrop-blur-md border-b border-[#1F2937] px-3 sm:px-4 flex items-center justify-between select-none">
      {/* Left: Hamburger (Mobile) + AI Program Logo & Project breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hamburger on mobile */}
        <button
          onClick={onToggleSidebar}
          aria-label="Åpne prosjektmeny"
          className="md:hidden p-2 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-[#181E2B] transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onResetToStart}
          className="flex items-center gap-2 hover:opacity-90 transition group text-left"
          title="Gå til startskjerm"
        >
          <VikingLogo size={26} />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold tracking-tight text-white font-sans">
                AI Program
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40">
                .no
              </span>
            </div>
            <span className="text-[9px] text-slate-400 -mt-0.5 hidden sm:block">aiprogram.no • Autonom Kodebygger</span>
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


      {/* Center/Right: Clean, Minimalist Token Indicator & Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Sleek Token Pill */}
        <button
          onClick={onOpenPricing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs transition cursor-pointer group"
          title="Klikk for å fylle på tokens eller se plan"
        >
          <Zap className="w-3.5 h-3.5 text-[#A78BFA] group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-slate-200">
            {user.tokensRemaining.toLocaleString("no-NO")}{" "}
            <span className="text-slate-400 font-normal hidden sm:inline">tokens</span>
          </span>
          <span className="text-[10px] font-medium text-[#C4B5FD] bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/40">
            {isTrial ? "Prøve" : user.plan}
          </span>
        </button>

        {/* Action Button 1: Deploy til egen Railway-konto via GitHub (Desktop) */}
        <button
          onClick={isTrial ? onOpenPricing : onDeployRailway}
          className={`hidden md:flex h-8 px-3 rounded-lg text-xs font-semibold items-center gap-1.5 transition cursor-pointer ${
            isTrial
              ? "bg-[#141822] text-slate-400 border border-[#1F2937] hover:border-slate-600"
              : "bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white shadow-sm shadow-purple-950/50"
          }`}
          title={isTrial ? "Oppgrader for 1-klikks Railway Template deploy" : "Deploy direkte på din egen Railway-konto"}
        >
          {isTrial ? (
            <>
              <Lock className="w-3.5 h-3.5 text-amber-400/80" />
              <span>Deploy</span>
            </>
          ) : (
            <>
              <Rocket className="w-3.5 h-3.5" />
              <span>Deploy</span>
            </>
          )}
        </button>

        {/* Action Button 2: Eksporter kode (Desktop) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            className="h-8 px-2.5 rounded-lg bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            {isTrial && <Lock className="w-3 h-3 text-amber-400/80" />}
            <span>Eksport</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {exportDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 bg-[#12161F] border border-[#1F2937] rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
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
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-200 hover:bg-[#181E2B] hover:text-white transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  Push til GitHub
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
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-200 hover:bg-[#181E2B] hover:text-white transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-[#A78BFA]" />
                  Last ned ZIP
                </span>
                {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
              </button>
            </div>
          )}
        </div>

        {/* Action Button 3: Dashboard / SuperAdmin (Desktop) */}
        <Link
          href="/dashboard"
          className="hidden md:flex h-8 px-2.5 rounded-lg bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-medium text-slate-300 hover:text-white items-center gap-1.5 transition"
          title="Gå til Dashboard / SuperAdmin"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="hidden lg:inline">Dashboard</span>
        </Link>

        {/* Mobile 3-Dots Action Menu */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Åpne handlingsmeny"
            className="p-2 rounded-xl bg-[#12161F] border border-[#1F2937] text-slate-300 hover:text-white hover:bg-[#181E2B] transition"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
          </button>

          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/50"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-60 bg-[#12161F] border border-[#1F2937] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-[#1F2937] mb-1">
                  <p className="font-semibold text-white truncate">{activeProject.name}</p>
                  <p className="text-[11px] text-slate-400">Handlinger & Eksport</p>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isTrial) onOpenPricing();
                    else onDeployRailway();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-[#A78BFA]" />
                    Deploy på Railway
                  </span>
                  {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isTrial) onOpenPricing();
                    else onPushGithub();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-slate-300" />
                    Push til GitHub
                  </span>
                  {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (isTrial) onOpenPricing();
                    else onDownloadZip();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#A78BFA]" />
                    Last ned ZIP-arkiv
                  </span>
                  {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <div className="my-1 border-t border-[#1F2937]" />

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#1A212E] hover:text-white transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#A78BFA]" />
                  Dashboard / SuperAdmin
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPricing();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-amber-300 hover:bg-[#1A212E] transition font-medium"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Oppgrader / Fyll på tokens
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
