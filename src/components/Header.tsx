"use client";

import React, { useState } from "react";
import Link from "next/link";
import { VikingLogo } from "./VikingLogo";
import { UserSession, Project } from "@/lib/types";
import {
  Menu,
  FolderGit2,
  Eye,
  MoreHorizontal,
  Zap,
  LayoutDashboard,
  Github,
  Download,
  Lock,
  Settings,
  RotateCcw,
} from "lucide-react";

interface HeaderProps {
  user: UserSession;
  activeProject: Project;
  onOpenPricing: () => void;
  onDownloadZip: () => void;
  onPushGithub: () => void;
  isDeploying?: boolean;
  isPreviewOpen?: boolean;
  onTogglePreview?: () => void;
  onResetToStart?: () => void;
  onToggleSidebar?: () => void;
  onOpenSettings?: () => void;
}

export function Header({
  user,
  activeProject,
  onOpenPricing,
  onDownloadZip,
  onPushGithub,
  isPreviewOpen = false,
  onTogglePreview,
  onResetToStart,
  onToggleSidebar,
  onOpenSettings,
}: HeaderProps) {
  const [cornerMenuOpen, setCornerMenuOpen] = useState(false);
  const isTrial = user.plan === "TRIAL";

  return (
    <header className="sticky top-0 z-40 h-11 bg-[#18181c]/95 backdrop-blur-md border-b border-[#26262e] px-3 sm:px-4 flex items-center justify-between select-none">
      {/* Left: Hamburger (Mobile) + AI Program Logo + Active Project Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Åpne prosjektmeny"
          className="md:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-[#24242e] transition cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <button
          onClick={onResetToStart}
          className="flex items-center gap-2 hover:opacity-90 transition group text-left cursor-pointer shrink-0"
          title="Gå til startskjerm"
        >
          <VikingLogo size={22} />
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white font-sans">
              AI Program
            </span>
            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-950/80 text-[#C4B5FD] border border-purple-800/40">
              .no
            </span>
          </div>
        </button>

        <div className="h-4 w-[1px] bg-[#2a2a34] hidden sm:block shrink-0" />

        {/* Active Project Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 min-w-0 truncate">
          <FolderGit2 className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
          <span className="font-medium text-slate-200 truncate max-w-[180px] lg:max-w-[260px]">
            {activeProject.name}
          </span>
        </div>
      </div>

      {/* Right: Corner Controls (Clean and Minimalist with Three Dots) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* If preview is closed, show a quiet preview toggle pill */}
        {!isPreviewOpen && onTogglePreview && (
          <button
            type="button"
            onClick={onTogglePreview}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 hover:text-white border border-[#2f2f3a] text-xs font-medium transition cursor-pointer"
            title="Åpne forhåndsvisning"
          >
            <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        )}

        {/* Corner Three-Dots Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCornerMenuOpen(!cornerMenuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#25252e] border border-transparent hover:border-[#2e2e38] transition cursor-pointer"
            title="Hovedmeny og innstillinger"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Corner Dropdown Popover */}
          {cornerMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setCornerMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-100 space-y-1">
                {/* User Tokens & Plan Info Card */}
                <div
                  onClick={() => {
                    setCornerMenuOpen(false);
                    onOpenPricing();
                  }}
                  className="p-2.5 rounded-lg bg-[#16161c] hover:bg-[#24242e] border border-[#2b2b36] transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#A78BFA]" />
                    <div>
                      <p className="font-semibold text-white">
                        {user.tokensRemaining.toLocaleString("no-NO")} tokens
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {isTrial ? "Prøveperiode" : user.plan}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-purple-300 font-bold bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                    Fyll på
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setCornerMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dashboard / SuperAdmin</span>
                </Link>


                <button
                  onClick={() => {
                    setCornerMenuOpen(false);
                    if (isTrial) onOpenPricing();
                    else onPushGithub();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    Push til GitHub
                  </span>
                  {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <button
                  onClick={() => {
                    setCornerMenuOpen(false);
                    if (isTrial) onOpenPricing();
                    else onDownloadZip();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-3.5 h-3.5 text-[#A78BFA]" />
                    Last ned kildekode (ZIP)
                  </span>
                  {isTrial && <Lock className="w-3 h-3 text-amber-400" />}
                </button>

                <div className="border-t border-[#2a2a34] my-1" />

                <button
                  onClick={() => {
                    setCornerMenuOpen(false);
                    onOpenSettings?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Innstillinger & API-nøkkel</span>
                </button>

                <button
                  onClick={() => {
                    setCornerMenuOpen(false);
                    onResetToStart?.();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition cursor-pointer text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Start på nytt</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
