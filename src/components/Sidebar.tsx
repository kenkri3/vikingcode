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
  MoreVertical,
  Layers,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { UserSession, Project } from "@/lib/types";

interface SidebarProps {
  user: UserSession;
  activeProject: Project;
  onSelectProject: (name: string) => void;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  activeProject,
  onSelectProject,
  onNewConversation,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true);

  const projectsList = [
    { name: "Vikingmester", desc: "Håndverkerportal & SEO" },
    { name: "Vikingnet", desc: "Hovedportal & Nettverk" },
    { name: "VikingCRM", desc: "Kunderelasjoner & Pipeline" },
    { name: "Helge", desc: "Kundeadministrasjon" },
    { name: "Opplev Horten", desc: "Lokalguide Horten" },
    { name: "Eidsfossmarked", desc: "Markedsportal" },
    { name: "Opplev Tønsberg", desc: "Byportal Tønsberg" },
  ];

  if (!isOpen) {
    return (
      <div className="w-12 bg-[#0A0D12] border-r border-[#1F2937] flex flex-col items-center py-3 justify-between shrink-0 select-none">
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#12161F] transition"
          title="Åpne sidepanel"
        >
          <PanelLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNewConversation}
          className="p-2 rounded-xl text-purple-400 hover:text-white hover:bg-purple-950/50 transition"
          title="Ny samtale"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-xs font-bold text-white">
          K
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-[#0A0D12] border-r border-[#1F2937] flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top action list */}
      <div className="p-3 space-y-2 overflow-y-auto">
        <div className="flex items-center justify-between mb-1 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Arbeidsflate
          </span>
          <button
            onClick={onToggle}
            className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-[#12161F] transition"
            title="Lukk sidepanel"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* New Conversation Button */}
        <button
          onClick={onNewConversation}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-semibold text-white transition shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#A78BFA]" />
          <span>+ Ny Samtale</span>
        </button>

        {/* Navigation Items */}
        <div className="space-y-0.5 pt-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#12161F] transition">
            <History className="w-4 h-4 text-slate-400" />
            <span>Samtalehistorikk</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-[#12161F] transition">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Planlagte Oppgaver</span>
          </button>
        </div>

        {/* Collapsible Projects Tree (Antigravity inspiration) */}
        <div className="pt-3">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition"
          >
            <span className="uppercase tracking-wider">Prosjekter</span>
            {projectsExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {projectsExpanded && (
            <div className="mt-1 space-y-0.5">
              {projectsList.map((p) => {
                const isActive = activeProject.name.toLowerCase().includes(p.name.toLowerCase());
                return (
                  <button
                    key={p.name}
                    onClick={() => onSelectProject(p.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition ${
                      isActive
                        ? "bg-purple-950/40 text-white border border-purple-800/50 font-medium"
                        : "text-slate-400 hover:text-slate-200 hover:bg-[#12161F]"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isActive ? (
                        <FolderOpen className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{p.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"></div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Profile & Settings (ChatGPT & Antigravity style) */}
      <div className="p-3 border-t border-[#1F2937] bg-[#0E121A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md shadow-purple-900/30">
              K
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Kenneth Glosli K.</p>
              <div className="flex items-center gap-1 text-[10px] text-[#A78BFA]">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{user.plan === "TRIAL" ? "Prøveperiode" : `Viking ${user.plan}`}</span>
              </div>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
