"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StartScreen } from "@/components/StartScreen";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { PricingModal } from "@/components/PricingModal";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { PLAN_CONFIGS, TOP_UP_OFFER, verifyTokenQuota } from "@/lib/tokens";
import { UserSession, Project, ChatMessage, PlanTier } from "@/lib/types";
import {
  CheckCircle2,
  ExternalLink,
  X,
  History,
  Clock,
  Settings,
  Rocket,
  Shield,
  Key,
  Database,
  Trash2,
  Plus,
  Play,
  MessageSquare,
  Eye,
  Code2,
  FolderGit2,
} from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get("prompt");

  // Bruker-sesjon
  const [user, setUser] = useState<UserSession>({
    id: "user-default",
    email: "bruker@aiprogram.no",
    name: "Kenneth Glosli K.",
    plan: "TRIAL",
    tokensRemaining: 50000,
    trialPromptsUsed: 0,
    isActive: true,
  });

  // Hent innlogget sesjon hvis tilgjengelig
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || (data.user.role === "ADMIN" ? "SuperAdmin" : data.user.email),
            plan: data.user.role === "ADMIN" ? "MESTER" : (data.user.plan || "TRIAL"),
            tokensRemaining: data.user.role === "ADMIN" ? 999999999 : (data.user.tokensRemaining ?? 50000),
            trialPromptsUsed: data.user.trialPromptsUsed ?? 0,
            isActive: true,
          });
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, []);

  // Prosjekter og aktivt prosjekt
  const [activeProject, setActiveProject] = useState<Project>(MOCK_PROJECTS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"agent" | "preview" | "code">("agent");

  // Åpne sidepanelet automatisk på desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRailwayGuideOpen, setIsRailwayGuideOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);

  const [deployNotification, setDeployNotification] = useState<{
    type: "railway" | "github" | "zip";
    title: string;
    message: string;
    url?: string;
    buttonText?: string;
  } | null>(null);

  // Visningsmodus: "start" eller "workspace"
  const [viewMode, setViewMode] = useState<"start" | "workspace">("workspace");

  // Meldinger og agentstatus
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init-user",
      role: "user",
      content: "Bygg en komplett bookingportal for håndverkere med priskalkulator, befaring-kalender, og kontaktskjema for VikingMester.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "msg-init-assistant",
      role: "assistant",
      content: "Jeg har generert en skreddersydd bookingportal for VikingMester med sanntids priskalkulator, TEK17 garantimodul, kalender og PostgreSQL-skjema for oppdrag.",
      actions: [
        {
          id: "act-init-1",
          type: "analyze",
          title: "Analyzed MesterAIAgentFrame.tsx #L300-450",
          fileName: "MesterAIAgentFrame.tsx",
          lineRange: "#L300-450",
          timestamp: new Date().toISOString(),
        },
        {
          id: "act-init-2",
          type: "thought",
          title: "Thought for 4.8s",
          content: "Analyserte krav til norsk håndverkerlovgivning, fastprisberegning basert på timepriser og kvadratmeter. Konstruerte modulært grensesnitt med ultra-mørkt tema og klargjorde railway.json for 1-klikks drift.",
          timestamp: new Date().toISOString(),
        },
        {
          id: "act-init-3",
          type: "search",
          title: "Searched mester_ai_agent_history 1 result",
          timestamp: new Date().toISOString(),
        },
      ],
      filesCreated: ["app/page.tsx", "prisma/schema.prisma", "railway.json"],
      timestamp: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
      tokensUsed: 6200,
    },
  ]);

  // Samtalehistorikk-liste
  const [savedConversations, setSavedConversations] = useState([
    {
      id: "conv-1",
      title: "Bookingportal for VikingMester (TEK17)",
      timestamp: "I dag, kl. 18:42",
      tokens: "6 200 tokens",
      files: 3,
    },
    {
      id: "conv-2",
      title: "B2B Medlemsnettverk for Vikingnet",
      timestamp: "I går, kl. 14:15",
      tokens: "8 400 tokens",
      files: 3,
    },
    {
      id: "conv-3",
      title: "VikingCRM Salgspipeline & Kanban",
      timestamp: "19. sep 2026",
      tokens: "5 100 tokens",
      files: 3,
    },
  ]);

  // Planlagte oppgaver
  const [scheduledTasks, setScheduledTasks] = useState([
    {
      id: "task-1",
      title: "Daglig SEO- og ytelsesoptimalisering",
      schedule: "Hver natt kl. 03:00",
      target: "VikingMester & Opplev Horten",
      active: true,
    },
    {
      id: "task-2",
      title: "PostgreSQL Database-migrering & Backup",
      schedule: "Hver 12. time",
      target: "Railway Production DB",
      active: true,
    },
    {
      id: "task-3",
      title: "Railway Nixpacks Helsesjekk & Uptime",
      schedule: "Hver time",
      target: "vikingcode-production.up.railway.app",
      active: true,
    },
    {
      id: "task-4",
      title: "Automatisk token-avstemming & kvotevarsling",
      schedule: "Kontinuerlig",
      target: "AI Program Backend",
      active: true,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Sikkerhetskontroll
  const quotaCheck = verifyTokenQuota(user);
  const isQuotaExceeded = !quotaCheck.allowed;

  // Håndter ny generering
  const handleSendMessage = async (promptText: string, model: string) => {
    const check = verifyTokenQuota(user);
    if (!check.allowed) {
      setIsPricingOpen(true);
      return;
    }

    setViewMode("workspace");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          userId: user.id,
          userEmail: user.email,
          currentPlan: user.plan,
          tokensRemaining: user.tokensRemaining,
          trialPromptsUsed: user.trialPromptsUsed,
          model,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "TRIAL_LIMIT_EXCEEDED" || data.code === "INSUFFICIENT_TOKENS") {
          setIsPricingOpen(true);
        }
        alert(data.error || "Kunne ikke generere kode.");
        setIsLoading(false);
        return;
      }

      setUser((prev) => ({
        ...prev,
        tokensRemaining: data.tokensRemaining,
        trialPromptsUsed: data.trialPromptsUsed,
      }));

      if (data.files && data.files.length > 0) {
        setActiveProject((prev) => ({
          ...prev,
          files: data.files,
        }));
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: "assistant",
        content: data.message,
        actions: data.actions,
        filesCreated: data.files?.map((f: any) => f.path) || [],
        timestamp: new Date().toISOString(),
        tokensUsed: data.tokensUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Hvis prompt sendes fra landingssiden via query param
  useEffect(() => {
    if (initialPromptFromUrl && initialPromptFromUrl.trim().length > 0) {
      handleSendMessage(initialPromptFromUrl, "Gemini 3.8 Flash High");
    }
  }, [initialPromptFromUrl]);

  // Oppdater en fil direkte fra editoren
  const handleUpdateFile = (path: string, newContent: string) => {
    setActiveProject((prev) => ({
      ...prev,
      files: prev.files.map((f) => (f.path === path ? { ...f, content: newContent } : f)),
    }));
  };

  // Plan-oppgradering
  const handleSelectPlan = (tier: PlanTier) => {
    const config = PLAN_CONFIGS[tier];
    setUser((prev) => ({
      ...prev,
      plan: tier,
      tokensRemaining: config.tokensPerMonth,
      trialPromptsUsed: 0,
    }));
  };

  // Hurtig-påfyll
  const handleTopUp = () => {
    setUser((prev) => ({
      ...prev,
      tokensRemaining: prev.tokensRemaining + TOP_UP_OFFER.tokens,
    }));
  };

  // 1-Klikks Railway Template Deploy
  const handleDeployRailway = async () => {
    setIsRailwayGuideOpen(true);
  };

  // Last ned ZIP
  const handleDownloadZip = async () => {
    try {
      const res = await fetch("/api/export/zip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: activeProject.name,
          files: activeProject.files,
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${activeProject.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setDeployNotification({
        type: "zip",
        title: "ZIP-arkiv lastet ned",
        message: "Prosjektet og railway.json er pakket og lastet ned til din maskin.",
      });
    } catch (e) {
      alert("Kunne ikke laste ned ZIP.");
    }
  };

  // Push til GitHub
  const handlePushGithub = async () => {
    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: activeProject.name,
          files: activeProject.files,
        }),
      });
      const data = await res.json();
      setDeployNotification({
        type: "github",
        title: "Kildekode forberedt for GitHub!",
        message: `Kildekoden og railway.json er synkronisert for ${data.repoUrl}.`,
        url: data.repoUrl,
        buttonText: "Åpne GitHub Repository",
      });
    } catch (e) {
      alert("Kunne ikke eksportere til GitHub.");
    }
  };

  // Nullstill og start ny samtale
  const handleNewConversation = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        content: `Hei! Jeg er AI Program Agent – din autonome kodebygger. Hva ønsker du å bygge for ${activeProject.name}? Du kan be meg legge til nye funksjoner, integrere Vipps, justere priser eller koble til databasen.`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setViewMode("workspace");
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0D12]">
      {/* 1. Header (alltid synlig med sanntids token-måler) */}
      <Header
        user={user}
        activeProject={activeProject}
        onOpenPricing={() => setIsPricingOpen(true)}
        onDeployRailway={handleDeployRailway}
        onDownloadZip={handleDownloadZip}
        onPushGithub={handlePushGithub}
        isDeploying={isDeploying}
        onResetToStart={() => setViewMode("start")}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Deploy & Export Notification Banner */}
      {deployNotification && (
        <div className="bg-gradient-to-r from-purple-950/90 to-slate-900 border-b border-[#7C3AED]/40 px-4 py-2.5 flex items-center justify-between text-xs z-30 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">{deployNotification.title}</span>
            <span className="text-slate-300 hidden sm:inline">{deployNotification.message}</span>
          </div>

          <div className="flex items-center gap-3">
            {deployNotification.url && (
              <a
                href={deployNotification.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md transition"
              >
                <span>{deployNotification.buttonText || "Åpne"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setDeployNotification(null)}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Body with Sidebar and Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Antigravity-style Sidebar */}
        <Sidebar
          user={user}
          activeProject={activeProject}
          onSelectProject={(name) => {
            const found = MOCK_PROJECTS.find(
              (p) =>
                p.name.toLowerCase().includes(name.toLowerCase()) ||
                name.toLowerCase().includes(p.name.toLowerCase())
            );
            if (found) {
              setActiveProject(found);
            } else {
              setActiveProject((prev) => ({ ...prev, name }));
            }
            setViewMode("workspace");
          }}
          onNewConversation={handleNewConversation}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenTasks={() => setIsTasksOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Center: Start Screen OR Split-View Workspace */}
        {viewMode === "start" ? (
          <StartScreen
            onStartBuilding={(prompt) => handleSendMessage(prompt, "Gemini 3.8 Flash High")}
            isLoading={isLoading}
          />
        ) : (
          <WorkspaceLayout
            activeProject={activeProject}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onUpdateFile={handleUpdateFile}
            isQuotaExceeded={isQuotaExceeded}
            mobileTab={mobileTab}
            onSetMobileTab={setMobileTab}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (App-like native dock) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0E121A]/95 backdrop-blur-lg border-t border-[#1F2937] z-40 flex items-center justify-around px-2 select-none">
        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("agent");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
            viewMode === "workspace" && mobileTab === "agent"
              ? "text-[#A78BFA]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Agent</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("preview");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
            viewMode === "workspace" && mobileTab === "preview"
              ? "text-[#A78BFA]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Preview</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("code");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition cursor-pointer ${
            viewMode === "workspace" && mobileTab === "code"
              ? "text-[#A78BFA]"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Kode</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 transition text-slate-400 hover:text-white cursor-pointer"
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Prosjekter</span>
        </button>
      </nav>

      {/* 3. Pricing & Token Upgrade Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onSelectPlan={handleSelectPlan}
        onTopUp={handleTopUp}
      />

      {/* 4. Samtalehistorikk Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Samtalehistorikk</h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Oversikt over tidligere bygge-sesjoner og genereringer. Klikk for å hente frem en tidligere samtale.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {savedConversations.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#12161F] border border-[#1F2937] hover:border-purple-600/50 transition flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {c.timestamp} • {c.tokens} • {c.files} filer
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setIsHistoryOpen(false);
                        handleSendMessage(`Fortsett arbeid på ${c.title}`, "Gemini 3.8 Flash High");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[11px] font-semibold text-[#C4B5FD] hover:text-white transition cursor-pointer"
                    >
                      Åpne
                    </button>
                    <button
                      onClick={() => {
                        setSavedConversations(savedConversations.filter((x) => x.id !== c.id));
                      }}
                      className="p-1 text-slate-500 hover:text-red-400 transition cursor-pointer"
                      title="Slett samtale"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex justify-end">
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#181E2B] text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Planlagte Oppgaver Modal */}
      {isTasksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Planlagte Oppgaver & Automatisering</h3>
              </div>
              <button
                onClick={() => setIsTasksOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Autonome bakgrunnsoppgaver som kjøres av AI Program for dine prosjekter og Railway-infrastruktur.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {scheduledTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-[#12161F] border border-[#1F2937] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {t.schedule} • Mål: {t.target}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setScheduledTasks(
                        scheduledTasks.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x))
                      );
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                      t.active
                        ? "bg-emerald-950/60 border-emerald-700/50 text-emerald-400"
                        : "bg-[#0A0D12] border-slate-800 text-slate-500"
                    }`}
                  >
                    {t.active ? "Aktiv" : "Pauset"}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <button
                onClick={() => alert("Ny automatisert oppgave lagt til i køen!")}
                className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Legg til oppgave</span>
              </button>
              <button
                onClick={() => setIsTasksOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#181E2B] text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Innstillinger & API-nøkler Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Innstillinger & Konfigurasjon</h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Bruker / Organisasjon</label>
                <input
                  type="text"
                  disabled
                  value={user.name}
                  className="w-full bg-[#12161F] border border-[#1F2937] rounded-xl px-3 py-2 text-white text-xs opacity-80"
                />
              </div>

              <div>
                <label className="text-slate-400 font-medium block mb-1">E-postadresse</label>
                <input
                  type="text"
                  disabled
                  value={user.email}
                  className="w-full bg-[#12161F] border border-[#1F2937] rounded-xl px-3 py-2 text-white text-xs opacity-80"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#A78BFA]" />
                    Google Gemini API-nøkkel
                  </span>
                  <span className="text-[10px] text-slate-500">Valgfritt</span>
                </label>
                <input
                  type="password"
                  value={geminiApiKeyInput}
                  onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                  placeholder="AIzaSy... (eller sett GEMINI_API_KEY i Railway)"
                  className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-3 py-2 text-white text-xs outline-none transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Hvis ingen nøkkel er oppgitt, benytter plattformen automatisk den innebygde autonome motoren.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <p className="font-semibold text-white">Railway Status</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Klar for produksjon (Nixpacks + PostgreSQL)
                </p>
              </div>
            </div>

            {savedKeyNotification && (
              <p className="text-xs text-emerald-400 font-semibold text-center">
                ✓ Innstillinger lagret!
              </p>
            )}

            <div className="pt-2 border-t border-[#1F2937] flex justify-end gap-2">
              <button
                onClick={() => {
                  setSavedKeyNotification(true);
                  setTimeout(() => {
                    setSavedKeyNotification(false);
                    setIsSettingsOpen(false);
                  }, 1200);
                }}
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer transition"
              >
                Lagre innstillinger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Railway Deploy & Testing Guide Modal */}
      {isRailwayGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Test & Deploy på Railway</h3>
              </div>
              <button
                onClick={() => setIsRailwayGuideOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 bg-purple-950/40 border border-purple-800/50 rounded-xl space-y-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Midlertidig Railway URL
                </p>
                <a
                  href="https://vikingcode-production.up.railway.app/app"
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-300 hover:text-white underline font-mono text-[11px] block truncate"
                >
                  https://vikingcode-production.up.railway.app/app
                </a>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white">Slik tester du systemet i full produksjon:</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  <li>Når endringer pushes til GitHub, oppdager Railway det og bygger automatisk en ny versjon på under 2 minutter.</li>
                  <li>Agenten er nå innbygget og svarer umiddelbart i venstre panel uten noen avhengighet til eksterne iframes.</li>
                  <li>Du kan konfigurere <code className="text-purple-300">GEMINI_API_KEY</code> under <strong>Variables</strong> på Railway Dashboard dersom du vil bruke en personlig Gemini-kvote.</li>
                  <li>Forhåndsvisningen til høyre oppdateres i sanntid når agenten modifiserer kildekoden.</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <a
                href="https://railway.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <span>Åpne Railway Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setIsRailwayGuideOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#181E2B] text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen w-screen bg-[#0A0D12] text-white text-sm">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
            <span>Laster AI Program Workspace...</span>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
