"use client";

import React, { useState } from "react";
import {
  Plus,
  History,
  Clock,
  Folder,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { UserSession, Project } from "@/lib/types";

interface SidebarProps {
  user: UserSession;
  activeProject: Project;
  onSelectProject: (name: string) => void;
  onNewConversation: () => void;
  onOpenHistory?: () => void;
  onOpenTasks?: () => void;
  onOpenSettings?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  activeProject,
  onSelectProject,
  onNewConversation,
  onOpenHistory,
  onOpenTasks,
  onOpenSettings,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const projectsList = [
    { name: "Vikingmester", desc: "Håndverkerportal & Priskalkulator" },
    { name: "Vikingnet", desc: "Bedriftsportal & Ressursbase" },
    { name: "VikingCRM", desc: "Kunderelasjoner & Salgspipeline" },
    { name: "Helge", desc: "Kundeadministrasjon & Timeføring" },
    { name: "Opplev Horten", desc: "Lokalguide & Opplevelser" },
    { name: "Eidsfossmarked", desc: "Markedsplass & Bod-booking" },
    { name: "Opplev Tønsberg", desc: "Byguide & Kulturportal" },
  ];

  const handleAction = (cb?: () => void) => {
    if (cb) cb();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onToggle();
    }
  };

  const renderContent = (isMobile: boolean = false) => (
    <>
      {/* Top action list */}
      <div className="p-3 space-y-2 overflow-y-auto flex-1">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Arbeidsflate
          </span>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#12161F] transition cursor-pointer"
            title="Lukk sidepanel"
            aria-label="Lukk sidepanel"
          >
            {isMobile ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* New Conversation Button */}
        <button
          onClick={() => handleAction(onNewConversation)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-semibold text-white transition shadow-sm cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#A78BFA]" />
          <span>+ Ny Samtale</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-0.5 pt-1">
          <button
            onClick={() => handleAction(onOpenHistory)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#12161F] transition cursor-pointer text-left"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>Samtalehistorikk</span>
          </button>
          <button
            onClick={() => handleAction(onOpenTasks)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#12161F] transition cursor-pointer text-left"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Planlagte Oppgaver</span>
          </button>
        </div>

        {/* Collapsible Projects Tree */}
        <div className="pt-3">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="w-full flex items-center justify-between px-2 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition cursor-pointer"
          >
            <span className="uppercase tracking-wider">Prosjekter ({projectsList.length})</span>
            {projectsExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {projectsExpanded && (
            <div className="mt-1 space-y-1">
              {projectsList.map((p) => {
                const isActive = activeProject.name.toLowerCase().includes(p.name.toLowerCase());
                return (
                  <button
                    key={p.name}
                    onClick={() => handleAction(() => onSelectProject(p.name))}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition cursor-pointer text-left ${
                      isActive
                        ? "bg-purple-950/40 text-white border border-purple-800/50 font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#12161F]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isActive ? (
                        <FolderOpen className="w-4 h-4 text-[#A78BFA] shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{p.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] shrink-0"></div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Profile & Settings */}
      <div className="p-3 border-t border-[#1F2937] bg-[#0E121A] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-purple-900/30">
              K
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Kenneth Glosli K.</p>
              <div className="flex items-center gap-1 text-[10px] text-[#A78BFA]">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{user.plan === "TRIAL" ? "Prøveperiode" : `AI ${user.plan}`}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => handleAction(onOpenSettings)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
            title="Innstillinger & API-nøkler"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE: Off-canvas slide-over drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onToggle}
          />

          {/* Drawer panel */}
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0A0D12] border-r border-[#1F2937] flex flex-col justify-between shadow-2xl z-10 select-none animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}

      {/* DESKTOP: Collapsed mode */}
      {!isOpen && (
        <div className="hidden md:flex w-12 bg-[#0A0D12] border-r border-[#1F2937] flex-col items-center py-3 justify-between shrink-0 select-none h-[calc(100vh-3.5rem)]">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#12161F] transition cursor-pointer"
            title="Åpne sidepanel"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNewConversation}
            className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-950/50 transition cursor-pointer"
            title="Ny samtale"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:opacity-90 transition"
            title="Innstillinger"
          >
            K
          </button>
        </div>
      )}

      {/* DESKTOP: Expanded mode */}
      {isOpen && (
        <aside className="hidden md:flex w-64 bg-[#0A0D12] border-r border-[#1F2937] flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
          {renderContent(false)}
        </aside>
      )}
    </>
  );
}

