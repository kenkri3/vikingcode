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
import { CheckCircle2, ExternalLink, X } from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get("prompt");

  // Bruker-sesjon
  const [user, setUser] = useState<UserSession>({
    id: "user-default",
    email: "bruker@aiprogram.no",
    name: "AIProgram Bruker",
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
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
          title: "Thought for 5.8s",
          content: "Analyserte krav til norsk håndverkerlovgivning, fastprisberegning basert på timepriser og kvadratmeter. Konstruerte modulært grensesnitt med ultra-mørkt tema og klargjorde railway.json.",
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
      tokensUsed: 7500,
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

  // 1-Klikks Railway Template Deploy (Kunden betaler egen hosting på Railway)
  const handleDeployRailway = async () => {
    if (user.plan === "TRIAL") {
      setIsPricingOpen(true);
      return;
    }

    setIsDeploying(true);
    try {
      const gitRes = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: activeProject.name,
          files: activeProject.files,
        }),
      });
      const gitData = await gitRes.json();
      const railwayDeployUrl = gitData.railwayTemplateUrl || "https://railway.com/new";

      setDeployNotification({
        type: "railway",
        title: "Klar for distribusjon på Railway!",
        message: "Kildekoden er synkronisert. Klikk under for å åpne din egen Railway-konto og starte appen med PostgreSQL.",
        url: railwayDeployUrl,
        buttonText: "Åpne i Railway (1-klikk Template)",
      });

      window.open(railwayDeployUrl, "_blank");
    } catch (e) {
      alert("Feil under klargjøring av Railway deploy.");
    } finally {
      setIsDeploying(false);
    }
  };

  // Last ned ZIP
  const handleDownloadZip = async () => {
    if (user.plan === "TRIAL") {
      setIsPricingOpen(true);
      return;
    }

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
    if (user.plan === "TRIAL") {
      setIsPricingOpen(true);
      return;
    }

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
        title: "Push til GitHub fullført!",
        message: `Kildekoden og railway.json er pushet til ${data.repoUrl}.`,
        url: data.repoUrl,
        buttonText: "Åpne GitHub Repository",
      });
    } catch (e) {
      alert("Kunne ikke pushe til GitHub.");
    }
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
              className="p-1 text-slate-400 hover:text-white"
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
            setActiveProject((prev) => ({ ...prev, name }));
            setViewMode("workspace");
          }}
          onNewConversation={() => setViewMode("start")}
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
          />
        )}
      </div>

      {/* 3. Pricing & Token Upgrade Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onSelectPlan={handleSelectPlan}
        onTopUp={handleTopUp}
      />
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
            <span>Laster AIProgram Workspace...</span>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
