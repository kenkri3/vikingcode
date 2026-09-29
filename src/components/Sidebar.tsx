"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Folder,
  Settings,
  PanelLeftClose,
  PanelLeft,
  X,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { UserSession, Project } from "@/lib/types";
import { VikingLogo } from "./VikingLogo";

interface SidebarProps {
  user: UserSession;
  activeProject: Project;
  projects?: Project[];
  onSelectProject: (name: string) => void;
  onNewConversation: () => void;
  onOpenHistory?: () => void;
  onOpenTasks?: () => void;
  onOpenSettings?: () => void;
  onNewProject?: () => void;
  onDeleteProject?: (id: string, name: string) => void;
  onOpenPricing?: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({
  user,
  activeProject,
  projects,
  onSelectProject,
  onNewConversation,
  onOpenHistory,
  onOpenSettings,
  onNewProject,
  onDeleteProject,
  onOpenPricing,
  isOpen,
  onToggle,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const defaultProjects = [
    { name: "Helsegaarden Landingsside", desc: "Legekontor & Direktebooking", date: "I går" },
    { name: "Website Upgrade Vikingnet", desc: "Bedriftsportal & Ressursbase", date: "Siste 7 dager" },
    { name: "Hent GitHub-repo", desc: "Integrasjon & Synk", date: "Siste 30 dager" },
    { name: "Interaktiv 3D Hero-seksjon", desc: "Landing page elementer", date: "Siste 30 dager" },
  ];

  const projectsList =
    projects && projects.length > 0
      ? projects.map((p) => ({
          id: p.id,
          name: p.name,
          desc: p.description || "",
          date: "Nylig",
        }))
      : defaultProjects.map((p, i) => ({
          id: `default-${i}`,
          name: p.name,
          desc: p.desc,
          date: p.date,
        }));

  const filteredProjects = projectsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (cb?: () => void) => {
    if (cb) cb();
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onToggle();
    }
  };

  const renderContent = (isMobile: boolean = false) => (
    <div className="flex flex-col h-full bg-[#18181c] text-slate-200 text-xs select-none">
      {/* 1. Header with VikingCode Logo, Name & Collapse Icon */}
      <div className="p-3.5 flex items-center justify-between border-b border-[#26262e] shrink-0">
        <div className="flex items-center gap-2">
          <VikingLogo size={22} />
          <span className="font-bold text-white text-sm tracking-tight font-sans">VikingCode</span>
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#25252e] transition cursor-pointer"
          title="Lukk sidepanel"
        >
          {isMobile ? <X className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Top Action Controls */}
      <div className="p-3 space-y-2 shrink-0">
        {/* + Ny samtale Button */}
        <button
          onClick={() => handleAction(onNewConversation)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-[#22222a] hover:bg-[#2c2c36] border border-[#2e2e38] text-xs font-semibold text-white transition shadow-sm cursor-pointer group"
        >
          <Plus className="w-4 h-4 text-[#A78BFA] group-hover:scale-110 transition-transform" />
          <span>Ny samtale</span>
        </button>

        {/* Search Chats Input */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#141418] border border-[#26262e] text-slate-400 focus-within:border-purple-500/50 focus-within:text-slate-200 transition">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Søk i prosjekter..."
            className="bg-transparent text-xs text-white placeholder-slate-500 outline-none w-full"
          />
        </div>
      </div>

      {/* 3. Middle Scrollable Area: Clean Projects List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 font-sans scrollbar-thin">
        {/* Section Header */}
        <div className="flex items-center justify-between px-2 py-1 text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Prosjekter
          </span>
          {onNewProject && (
            <button
              type="button"
              onClick={() => handleAction(onNewProject)}
              className="flex items-center gap-1 text-[11px] font-medium text-purple-300 hover:text-white transition cursor-pointer"
              title="Opprett nytt prosjekt"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nytt</span>
            </button>
          )}
        </div>

        {/* Projects List */}
        <div className="space-y-0.5 pt-0.5">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              Ingen prosjekter funnet
            </div>
          ) : (
            filteredProjects.map((p) => {
              const isActive = activeProject.name.toLowerCase().includes(p.name.toLowerCase());
              const isMenuOpen = activeMenuId === p.id;

              return (
                <div
                  key={p.id || p.name}
                  className={`group relative flex items-center justify-between w-full px-2.5 py-2 rounded-xl text-xs transition cursor-pointer ${
                    isActive
                      ? "bg-[#25252e] text-white font-medium shadow-sm border border-purple-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#202026]"
                  }`}
                  onClick={() => handleAction(() => onSelectProject(p.name))}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-purple-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                    <span className="truncate">{p.name}</span>
                  </div>

                  {/* Three-dots menu on hover */}
                  <div className="relative shrink-0 ml-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : p.id);
                      }}
                      className={`p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#2e2e38] transition cursor-pointer ${
                        isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      title="Prosjektvalg"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>

                    {isMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(null);
                          }}
                        />
                        <div
                          className="absolute right-0 top-full mt-1 w-32 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-1 z-40 text-xs animate-in fade-in duration-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {onDeleteProject && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(null);
                                onDeleteProject(p.id, p.name);
                              }}
                              className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition cursor-pointer text-left"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Slett prosjekt</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Bottom User Profile Card with Upgrade Button */}
      <div className="p-3 border-t border-[#26262e] bg-[#141418] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "KG"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate max-w-[90px]">
                {user.name || "Kenneth Glo"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user.plan === "TRIAL" ? "Gratis" : user.plan}
              </p>
            </div>
          </div>

          {/* Upgrade & Settings */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAction(onOpenPricing)}
              className="px-2.5 py-1 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] border border-[#2e2e38] text-[11px] font-semibold text-purple-300 hover:text-white transition cursor-pointer shadow-sm"
              title="Se abonnementer og priser"
            >
              Oppgrader
            </button>

            <button
              onClick={() => handleAction(onOpenSettings)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#22222a] transition cursor-pointer"
              title="Innstillinger"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* MOBILE: Off-canvas slide-over drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onToggle}
          />
          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#18181c] border-r border-[#26262e] flex flex-col justify-between shadow-2xl z-10 select-none animate-in slide-in-from-left duration-200">
            {renderContent(true)}
          </aside>
        </div>
      )}

      {/* DESKTOP: Collapsed mode */}
      {!isOpen && (
        <div className="hidden md:flex w-12 bg-[#18181c] border-r border-[#26262e] flex-col items-center py-3 justify-between shrink-0 select-none h-full">
          <button
            onClick={onToggle}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#25252e] transition cursor-pointer"
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
            onClick={onOpenPricing}
            className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:opacity-90 transition"
            title="Profil & Oppgradering"
          >
            {user.name ? user.name.slice(0, 2).toUpperCase() : "KG"}
          </button>
        </div>
      )}

      {/* DESKTOP: Expanded mode */}
      {isOpen && (
        <aside className="hidden md:flex w-64 bg-[#18181c] border-r border-[#26262e] flex-col justify-between shrink-0 h-full select-none">
          {renderContent(false)}
        </aside>
      )}
    </>
  );
}
