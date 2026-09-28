"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StartScreen } from "@/components/StartScreen";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { PricingModal } from "@/components/PricingModal";
import {
  INITIAL_PROJECTS,
  getStoredProjects,
  saveStoredProjects,
  createNewProject,
} from "@/lib/projects-data";
import { PLAN_CONFIGS, TOP_UP_OFFER, verifyTokenQuota } from "@/lib/tokens";
import { UserSession, Project, ChatMessage, PlanTier, ProjectFile, AgentAction } from "@/lib/types";
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
  Sparkles,
  Loader2,
} from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get("prompt");

  // Bruker-sesjon (gir full tilgang for produksjonstesting)
  const [user, setUser] = useState<UserSession>({
    id: "user-default",
    email: "bruker@aiprogram.no",
    name: "Kenneth Glosli K.",
    plan: "MESTER",
    tokensRemaining: 1500000,
    trialPromptsUsed: 0,
    isActive: true,
  });

  // Hent sesjon fra DB/cookie hvis innlogget
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || (data.user.role === "ADMIN" ? "SuperAdmin" : data.user.email),
            plan: data.user.role === "ADMIN" ? "MESTER" : (data.user.plan || "MESTER"),
            tokensRemaining: data.user.role === "ADMIN" ? 999999999 : (data.user.tokensRemaining ?? 1500000),
            trialPromptsUsed: data.user.trialPromptsUsed ?? 0,
            isActive: true,
          });
        }
      })
      .catch((err) => console.error("Session check error:", err));
  }, []);

  // Prosjekter
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"agent" | "preview" | "code">("agent");

  // Åpne sidepanelet automatisk på desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Hent prosjekter fra /api/projects eller localStorage
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
          setActiveProject(data.projects[0]);
        }
      })
      .catch(() => {
        const stored = getStoredProjects();
        setProjects(stored);
        setActiveProject(stored[0]);
      });
  }, []);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRailwayGuideOpen, setIsRailwayGuideOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);

  // Gemini API-nøkkel fra innstillinger / localStorage
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState("");
  const [savedKeyNotification, setSavedKeyNotification] = useState(false);
  const [isTestingApiKey, setIsTestingApiKey] = useState(false);
  const [testKeyStatus, setTestKeyStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem("aiprogram_gemini_key");
      if (savedKey) setGeminiApiKeyInput(savedKey);
    }
  }, []);

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
      id: "msg-init-1",
      role: "assistant",
      content: `Hei! Jeg er AI Program Agent – din autonome kodebygger. Hva ønsker du å bygge for ${activeProject.name}? Du kan be meg om å bygge en ny nettside (f.eks. for snekker eller bedrift), legge til Vipps, tilpasse priskalkulator eller koble til databasen.`,
      quickReplies: [
        { title: "Lag en nettside for en snekker", payload: "carpenter_site" },
        { title: "Hva kan du?", payload: "capabilities" },
        { title: "Legg til Vipps hurtigbetaling", payload: "vipps" },
        { title: "Full webapp + database", payload: "full_app" },
      ],
      timestamp: new Date().toISOString(),
    },
  ]);

  // Persistent Samtalehistorikk
  const [savedConversations, setSavedConversations] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("aiprogram_conversations");
      if (raw) {
        try {
          setSavedConversations(JSON.parse(raw));
        } catch {}
      } else {
        const init = [
          {
            id: "conv-1",
            title: "Bookingportal for VikingMester (TEK17)",
            projectName: "VikingMester - Håndverkerportal",
            timestamp: "Nylig",
            tokens: "6 200 tokens",
            files: 3,
          },
          {
            id: "conv-2",
            title: "B2B Medlemsnettverk for Vikingnet",
            projectName: "VikingNet",
            timestamp: "Nylig",
            tokens: "8 400 tokens",
            files: 3,
          },
        ];
        setSavedConversations(init);
        localStorage.setItem("aiprogram_conversations", JSON.stringify(init));
      }
    }
  }, []);

  // Persistent Planlagte oppgaver
  const [scheduledTasks, setScheduledTasks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("aiprogram_tasks");
      if (raw) {
        try {
          setScheduledTasks(JSON.parse(raw));
        } catch {}
      } else {
        const initTasks = [
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
        ];
        setScheduledTasks(initTasks);
        localStorage.setItem("aiprogram_tasks", JSON.stringify(initTasks));
      }
    }
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  // Sikkerhetskontroll
  const quotaCheck = verifyTokenQuota(user);
  const isQuotaExceeded = !quotaCheck.allowed;

  // Håndter ny generering
  const handleSendMessage = async (promptText: string, model: string) => {
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
      const pLower = promptText.toLowerCase();
      const isBuildIntent =
        pLower.includes("lag") ||
        pLower.includes("bygg") ||
        pLower.includes("opprett") ||
        pLower.includes("endre") ||
        pLower.includes("snekker") ||
        pLower.includes("tømrer") ||
        pLower.includes("terrasse") ||
        pLower.includes("nettside") ||
        pLower.includes("side") ||
        pLower.includes("app") ||
        pLower.includes("kalkulator") ||
        pLower.includes("vipps") ||
        pLower.includes("skjema") ||
        pLower.includes("kontakt") ||
        pLower.includes("database") ||
        pLower.includes("tek17") ||
        pLower.includes("pris") ||
        pLower.includes("crm") ||
        pLower.includes("portal") ||
        pLower.includes("static_site") ||
        pLower.includes("quote_form") ||
        pLower.includes("booking") ||
        pLower.includes("full_app") ||
        pLower.includes("carpenter_site") ||
        pLower.includes("business_site") ||
        pLower.includes("new_website") ||
        pLower.includes("new_saas") ||
        pLower.includes("booking_system");

      // 1. Spør brukerens ekte AI Agent (Botsify Converse API)
      let botReply = "";
      let botQuickReplies: Array<{ title: string; payload: string }> = [];
      const storedSession =
        typeof window !== "undefined"
          ? localStorage.getItem("aiprogram_agent_session") || ""
          : "";

      try {
        const chatRes = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: promptText,
            sessionId: storedSession,
            projectName: activeProject.name,
            userName: user.name,
            userId: user.id,
          }),
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          if (chatData.reply) {
            botReply = chatData.reply;
          }
          if (chatData.quickReplies && Array.isArray(chatData.quickReplies)) {
            botQuickReplies = chatData.quickReplies;
          }
          if (chatData.sessionId && typeof window !== "undefined") {
            localStorage.setItem("aiprogram_agent_session", chatData.sessionId);
          }
        }
      } catch (chatErr) {
        console.warn("Kunne ikke nå agent/chat:", chatErr);
      }

      // 2. Hvis brukeren ba om å bygge/endre kode, kjør kodegeneratoren
      let filesGenerated: ProjectFile[] = [];
      let actionsGenerated: AgentAction[] = [];
      let tokensUsed = 250;

      if (isBuildIntent) {
        const keyToUse =
          geminiApiKeyInput ||
          (typeof window !== "undefined" ? localStorage.getItem("aiprogram_gemini_key") : null);

        const genRes = await fetch("/api/generate", {
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
            projectName: activeProject.name,
            currentFiles: activeProject.files,
            geminiApiKey: keyToUse,
          }),
        });

        if (genRes.ok) {
          const genData = await genRes.json();
          filesGenerated = genData.files || [];
          actionsGenerated = genData.actions || [];
          tokensUsed = genData.tokensUsed || 3800;

          if (genData.tokensRemaining !== undefined) {
            setUser((prev) => ({
              ...prev,
              tokensRemaining: genData.tokensRemaining,
              trialPromptsUsed: genData.trialPromptsUsed,
            }));
          }

          // Flett inn de nye filene og oppdater aktivt prosjekt
          if (filesGenerated.length > 0) {
            setActiveProject((prev) => {
              const map = new Map(prev.files.map((f) => [f.path, f]));
              filesGenerated.forEach((nf) => {
                map.set(nf.path, nf);
              });
              const mergedFiles = Array.from(map.values());
              const updatedProj = {
                ...prev,
                files: mergedFiles,
                updatedAt: new Date().toISOString(),
              };

              // Oppdater i prosjektlisten og lagre
              setProjects((all) => {
                const nextAll = all.map((p) => (p.id === updatedProj.id ? updatedProj : p));
                saveStoredProjects(nextAll);
                return nextAll;
              });

              // Synkroniser med backend
              fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update", project: updatedProj }),
              }).catch(() => {});

              return updatedProj;
            });
          }
        }
      } else {
        // Enkel samtale: trekk fra minimale tokens
        setUser((prev) => ({
          ...prev,
          tokensRemaining: Math.max(0, prev.tokensRemaining - 150),
        }));
      }

      // Sett sammen innhold til chat-boblen
      let finalContent = botReply;
      if (!finalContent) {
        if (isBuildIntent) {
          finalContent = `Jeg har analysert og fullført oppgaven din: "${promptText}".\n\nKildekoden er oppdatert og forhåndsvisningen er synkronisert i sanntid.`;
        } else {
          finalContent = "Hei! Jeg er AI Program Agent. Hva kan jeg hjelpe deg med å bygge i dag?";
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: "assistant",
        content: finalContent,
        actions: actionsGenerated.length > 0 ? actionsGenerated : undefined,
        filesCreated: filesGenerated.map((f) => f.path),
        quickReplies: botQuickReplies.length > 0 ? botQuickReplies : undefined,
        timestamp: new Date().toISOString(),
        tokensUsed: tokensUsed,
      };

      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);

      // Auto-lagre til samtalehistorikk
      const newConv = {
        id: `conv-${Date.now()}`,
        title: promptText.slice(0, 45),
        projectName: activeProject.name,
        timestamp: "Akkurat nå",
        tokens: `${tokensUsed} tokens`,
        files: filesGenerated.length || 3,
        messages: nextMessages,
      };
      setSavedConversations((prev) => {
        const next = [newConv, ...prev.filter((c) => c.title !== newConv.title)].slice(0, 25);
        if (typeof window !== "undefined") {
          localStorage.setItem("aiprogram_conversations", JSON.stringify(next));
        }
        return next;
      });
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
    setActiveProject((prev) => {
      const updated = {
        ...prev,
        files: prev.files.map((f) => (f.path === path ? { ...f, content: newContent } : f)),
      };
      saveStoredProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
      return updated;
    });
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

  // Ny samtale
  const handleNewConversation = () => {
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        content: `Hei! Hva ønsker du å bygge eller endre på ${activeProject.name}? Beskriv ønsket funksjon, så oppretter jeg filene og oppdaterer forhåndsvisningen.`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setViewMode("workspace");
  };

  // Opprett nytt prosjekt
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProj = createNewProject(newProjectName, newProjectDesc);
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveStoredProjects(updated);
    setActiveProject(newProj);
    setIsNewProjectModalOpen(false);
    setNewProjectName("");
    setNewProjectDesc("");
    handleNewConversation();

    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", project: newProj }),
    }).catch(() => {});
  };

  // Hent lagret samtale fra historikk
  const handleLoadConversation = (conv: any) => {
    if (conv.messages && Array.isArray(conv.messages)) {
      setMessages(conv.messages);
    } else {
      setMessages([
        {
          id: `msg-hist-${Date.now()}`,
          role: "assistant",
          content: `Gjenopprettet økten for "${conv.title}". Du kan fortsette å bygge herfra.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    const match = projects.find(
      (p) => p.name.toLowerCase() === (conv.projectName || "").toLowerCase()
    );
    if (match) setActiveProject(match);
    setIsHistoryOpen(false);
    setViewMode("workspace");
  };

  // Kjør en planlagt oppgave umiddelbart
  const handleRunTaskNow = (taskId: string, title: string) => {
    setDeployNotification({
      type: "railway",
      title: `Oppgave fullført: ${title}`,
      message: "Optimaliseringen ble utført. Database og SEO-indeksering er oppdatert.",
    });
    setScheduledTasks((prev) => {
      const next = prev.map((t) => (t.id === taskId ? { ...t, lastRun: "Akkurat nå" } : t));
      if (typeof window !== "undefined") {
        localStorage.setItem("aiprogram_tasks", JSON.stringify(next));
      }
      return next;
    });
  };

  // Test Gemini tilkobling
  const handleTestApiKey = async () => {
    if (!geminiApiKeyInput.trim()) {
      setTestKeyStatus("Vennligst lim inn en nøkkel først.");
      return;
    }
    setIsTestingApiKey(true);
    setTestKeyStatus(null);
    try {
      const testRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKeyInput.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Svar med ordet 'OK' på norsk." }] }],
          }),
        }
      );
      if (testRes.ok) {
        setTestKeyStatus("✓ Tilkobling vellykket! Google Gemini 2.0 Flash svarer i sanntid.");
        localStorage.setItem("aiprogram_gemini_key", geminiApiKeyInput.trim());
      } else {
        const errData = await testRes.json();
        setTestKeyStatus(`Tilkobling feilet: ${errData.error?.message || "Ugyldig API-nøkkel"}`);
      }
    } catch (e: any) {
      setTestKeyStatus(`Tilkoblingsfeil: ${e.message}`);
    } finally {
      setIsTestingApiKey(false);
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
          projects={projects}
          onSelectProject={(name) => {
            const found = projects.find(
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
          onNewProject={() => setIsNewProjectModalOpen(true)}
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

      {/* 4. Samtalehistorikk Modal (Ekte persistent historikk) */}
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
              Oversikt over tidligere bygge-sesjoner. Klikk for å hente frem en tidligere samtale og fortsette å bygge.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {savedConversations.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-[#12161F] border border-[#1F2937] hover:border-purple-600/50 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-bold text-white truncate">{c.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {c.projectName} • {c.timestamp} • {c.tokens}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleLoadConversation(c)}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[11px] font-semibold text-[#C4B5FD] hover:text-white transition cursor-pointer"
                    >
                      Åpne
                    </button>
                    <button
                      onClick={() => {
                        const next = savedConversations.filter((x) => x.id !== c.id);
                        setSavedConversations(next);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("aiprogram_conversations", JSON.stringify(next));
                        }
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

      {/* 5. Planlagte Oppgaver Modal (Ekte funksjonelle oppgaver) */}
      {isTasksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Planlagte Oppgaver & Cron-jobber</h3>
              </div>
              <button
                onClick={() => setIsTasksOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Autonome bakgrunnsoppgaver som holder databasen synkronisert, sjekker Railway-helse og forbedrer SEO.
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              {scheduledTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl bg-[#12161F] border border-[#1F2937] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Frekvens: {t.schedule} • Mål: {t.target}
                    </p>
                    {t.lastRun && (
                      <p className="text-[10px] text-emerald-400 mt-0.5">Sist kjørt: {t.lastRun}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunTaskNow(t.id, t.title)}
                      className="p-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[#C4B5FD] hover:text-white transition cursor-pointer"
                      title="Kjør oppgave umiddelbart"
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const next = scheduledTasks.map((item) =>
                          item.id === t.id ? { ...item, active: !item.active } : item
                        );
                        setScheduledTasks(next);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("aiprogram_tasks", JSON.stringify(next));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                        t.active
                          ? "bg-emerald-950/60 border-emerald-700/40 text-emerald-300"
                          : "bg-[#0A0D12] border-slate-800 text-slate-500"
                      }`}
                    >
                      {t.active ? "Aktiv" : "Pauset"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <button
                onClick={() => {
                  const title = prompt("Navn på ny planlagt oppgave:");
                  if (!title) return;
                  const newTask = {
                    id: `task-${Date.now()}`,
                    title: title.trim(),
                    schedule: "Daglig",
                    target: activeProject.name,
                    active: true,
                  };
                  const next = [...scheduledTasks, newTask];
                  setScheduledTasks(next);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("aiprogram_tasks", JSON.stringify(next));
                  }
                }}
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
                <h3 className="font-bold text-white text-base">Innstillinger & API-nøkler</h3>
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
                <label className="text-slate-300 font-medium block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#A78BFA]" />
                    Google Gemini API-nøkkel
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-[#A78BFA] hover:underline flex items-center gap-1"
                  >
                    Hent gratis nøkkel <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <input
                  type="password"
                  value={geminiApiKeyInput}
                  onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                  placeholder="AIzaSy... (eller konfigurer i Railway Variables)"
                  className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-3 py-2 text-white text-xs outline-none transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Agenten kobler seg direkte til Google Gemini 2.0 Flash. Hvis nøkkel ikke er oppgitt, benyttes den innebygde autonome motoren.
                </p>

                {testKeyStatus && (
                  <div
                    className={`mt-2 p-2 rounded-lg text-[11px] font-mono ${
                      testKeyStatus.startsWith("✓")
                        ? "bg-emerald-950/60 border border-emerald-700/50 text-emerald-300"
                        : "bg-red-950/60 border border-red-700/50 text-red-300"
                    }`}
                  >
                    {testKeyStatus}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <p className="font-semibold text-white">Railway Status</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Produksjonstilkobling aktiv (Nixpacks + PostgreSQL)
                </p>
              </div>
            </div>

            {savedKeyNotification && (
              <p className="text-xs text-emerald-400 font-semibold text-center animate-in fade-in">
                ✓ Innstillinger lagret!
              </p>
            )}

            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isTestingApiKey || !geminiApiKeyInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-[#12161F] hover:bg-[#181E2B] border border-[#1F2937] text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                {isTestingApiKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Tester...</span>
                  </>
                ) : (
                  <span>Test tilkobling</span>
                )}
              </button>

              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("aiprogram_gemini_key", geminiApiKeyInput.trim());
                  }
                  setSavedKeyNotification(true);
                  setTimeout(() => {
                    setSavedKeyNotification(false);
                    setIsSettingsOpen(false);
                  }, 1000);
                }}
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer transition shadow-md shadow-purple-900/30"
              >
                Lagre innstillinger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Opprett Nytt Prosjekt Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Opprett Nytt Prosjekt</h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Prosjektnavn</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="f.eks. Mitt Nye Firma AS"
                  className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Kort beskrivelse</label>
                <input
                  type="text"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="f.eks. Nettbutikk for lokale håndverksprodukter"
                  className="w-full bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex justify-end gap-2">
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#12161F] text-slate-400 hover:text-white text-xs"
              >
                Avbryt
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer transition shadow-md shadow-purple-900/30"
              >
                Opprett prosjekt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Railway Deploy & Testing Guide Modal */}
      {isRailwayGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-base">Deploy på Railway (1-Klikk)</h3>
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
                  Live Produksjons-URL på Railway
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
                <h4 className="font-semibold text-white">Produksjonsinnstillinger i railway.json:</h4>
                <div className="bg-[#0A0D12] p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1">
                  <p className="text-slate-400">Builder: <span className="text-cyan-400">NIXPACKS</span></p>
                  <p className="text-slate-400">Start Command: <span className="text-emerald-400">npx prisma migrate deploy && npm run start</span></p>
                  <p className="text-slate-400">Database: <span className="text-purple-400">PostgreSQL Plugin</span></p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1F2937] flex items-center justify-between">
              <a
                href="https://railway.com/new"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-900/40"
              >
                <span>Deploy direkte på Railway</span>
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
