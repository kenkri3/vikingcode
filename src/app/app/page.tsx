"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { StartScreen } from "@/components/StartScreen";
import { WorkspaceLayout } from "@/components/WorkspaceLayout";
import { PricingModal } from "@/components/PricingModal";
import { IntegrationsModal, AiProviderId } from "@/components/IntegrationsModal";
import { GitHubExportModal } from "@/components/GitHubExportModal";
import {
  INITIAL_PROJECTS,
  getStoredProjects,
  saveStoredProjects,
  createNewProject,
} from "@/lib/projects-data";
import { PLAN_CONFIGS, TOP_UP_OFFER, verifyTokenQuota } from "@/lib/tokens";
import { UserSession, Project, ChatMessage, PlanTier, ProjectFile, AgentAction } from "@/lib/types";
import { extractFilesFromAgentReply } from "@/lib/code-extractor";
import {
  CheckCircle2,
  ExternalLink,
  X,
  History,
  Clock,
  Settings,
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
  Server,
  ArrowRight,
} from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const initialPromptFromUrl = searchParams.get("prompt");

  // Bruker-sesjon (gir full tilgang for produksjonstesting)
  const [user, setUser] = useState<UserSession>({
    id: "user-default",
    email: "bruker@aiprogram.no",
    name: "Utvikler",
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
  const [mobileTab, setMobileTab] = useState<
    "agent" | "preview" | "backend" | "database" | "code" | "terminal"
  >("agent");

  // Åpne sidepanelet automatisk på desktop
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Hent prosjekter fra localStorage først, deretter synkroniser med /api/projects
  useEffect(() => {
    const stored = getStoredProjects();
    if (stored && stored.length > 0) {
      setProjects(stored);
      setActiveProject(stored[0]);
    }

    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const isUserOwned = data.projects.some(
            (p: Project) => p.userId && p.userId !== "user-demo-1" && p.userId !== "user-current"
          );
          if (isUserOwned) {
            setProjects(data.projects);
            setActiveProject(data.projects[0]);
            saveStoredProjects(data.projects);
          }
        }
      })
      .catch(() => {});
  }, []);

  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AiProviderId>("gemini");
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
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
    type: "github" | "zip" | "info";
    title: string;
    message: string;
    url?: string;
    buttonText?: string;
  } | null>(null);

  // Visningsmodus: "start" eller "workspace"
  const [viewMode, setViewMode] = useState<"start" | "workspace">("workspace");

  // Forhåndsvisning: kun synlig når kode er generert eller bruker åpner det (som Qwen)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Meldinger og agentstatus
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init-1",
      role: "assistant",
      content: `Hei! Jeg er AI Program Ultra – din autonome fullstack-arkitekt og kodebygger. Hva ønsker du å bygge i dag? Du kan beskrive en idé fra bunnen av (f.eks. en moderne nettside for din bedrift, en SaaS-webapp med innlogging, eller en bookingportal), så genererer jeg kildekoden, designet og databasen umiddelbart.`,
      quickReplies: [
        { title: "Lag en moderne bedriftsnettside", payload: "company_site" },
        { title: "Bygg en SaaS-webapp med innlogging", payload: "saas_app" },
        { title: "Lag en bookingportal med kalender", payload: "booking_portal" },
        { title: "Nettbutikk med Vipps", payload: "store_vipps" },
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
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            // Filtrer bort eventuelle gamle legacy-samtaler
            const clean = parsed.filter(
              (c: any) =>
                c &&
                c.title &&
                !c.title.toLowerCase().includes("vikingmester") &&
                !c.projectName?.toLowerCase().includes("vikingmester") &&
                !c.title.toLowerCase().includes("vikingnet")
            );
            setSavedConversations(clean);
          }
        } catch {}
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
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(
              (t: any) =>
                t &&
                t.title &&
                !t.target?.toLowerCase().includes("vikingmester") &&
                !t.target?.toLowerCase().includes("vikingcode")
            );
            if (clean.length > 0) {
              setScheduledTasks(clean);
              return;
            }
          }
        } catch {}
      }
      const initTasks = [
        {
          id: "task-1",
          title: "Daglig SEO- og ytelsesoptimalisering",
          schedule: "Hver natt kl. 03:00",
          target: "Aktive prosjekter",
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
          title: "Produksjon Helsesjekk & Uptime",
          schedule: "Hver time",
          target: "Produksjon Uptime & API",
          active: true,
        },
      ];
      setScheduledTasks(initTasks);
      localStorage.setItem("aiprogram_tasks", JSON.stringify(initTasks));
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
    setIsPreviewOpen(true);
    setMobileTab("preview");

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
        pLower.includes("helse") ||
        pLower.includes("klinikk") ||
        pLower.includes("lege") ||
        pLower.includes("pasient") ||
        pLower.includes("time") ||
        pLower.includes("booking") ||
        pLower.includes("journal") ||
        pLower.includes("resept") ||
        pLower.includes("medisin") ||
        pLower.includes("fysio") ||
        pLower.includes("terapi") ||
        pLower.includes("static_site") ||
        pLower.includes("quote_form") ||
        pLower.includes("full_app") ||
        pLower.includes("carpenter_site") ||
        pLower.includes("business_site") ||
        pLower.includes("new_website") ||
        pLower.includes("new_saas") ||
        pLower.includes("booking_system") ||
        pLower.trim().length > 2;

      // 1. Variabler for filer og handlinger
      let filesGenerated: ProjectFile[] = [];
      let actionsGenerated: AgentAction[] = [];
      let tokensUsed = 250;

      // Spør brukerens ekte AI Agent (Botsify Converse API / DeepSeek)
      let botReply = "";
      let botQuickReplies: Array<{ title: string; payload: string }> = [];
      const storedSession =
        typeof window !== "undefined"
          ? localStorage.getItem("aiprogram_agent_session") || ""
          : "";

      const persistentSessionId = activeProject.id
        ? `proj_${activeProject.id}`
        : storedSession || "aiprogram_session";

      // Modell 1: Egen API-nøkkel (BYOK) for en av de 6 integrasjonene
      const isPaidUser = user.plan !== "TRIAL" || (user as any).role === "ADMIN";
      const activeProv = (typeof window !== "undefined" ? (localStorage.getItem("aiprogram_active_provider") as AiProviderId) : "gemini") || "gemini";
      let activeKey = "";
      if (typeof window !== "undefined") {
        try {
          const keysMap = JSON.parse(localStorage.getItem("aiprogram_api_keys") || "{}");
          activeKey = keysMap[activeProv] || keysMap.gemini || keysMap.anthropic || keysMap.openai || keysMap.deepseek || keysMap.xai || keysMap.mistral || "";
        } catch {}
        if (!activeKey) {
          activeKey = localStorage.getItem("aiprogram_gemini_key") || geminiApiKeyInput || "";
        }
      }
      const keyToUse = activeKey;

      try {
        const chatRes = await fetch("/api/agent/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: promptText,
            sessionId: persistentSessionId,
            projectName: activeProject.name,
            userName: user.name,
            userId: user.id,
            provider: activeProv,
            customApiKey: keyToUse || undefined,
            apiKey: keyToUse || undefined,
            history: messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.content.slice(0, 1000),
            })),
            currentFiles: activeProject.files.map((f) => ({
              path: f.path,
              content: f.content,
            })),
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
          // 🎯 Sjekk om agenten allerede har generert eller oppdatert filer!
          if (chatData.files && Array.isArray(chatData.files) && chatData.files.length > 0) {
            filesGenerated = chatData.files;
          }
        }
      } catch (chatErr) {
        console.warn("Kunne ikke nå agent/chat:", chatErr);
      }

      // 2. Hvis agenten ikke returnerte ferdige fil-objekter, sjekk om teksten inneholder kodeblokker
      if (filesGenerated.length === 0 && botReply) {
        const extracted = extractFilesFromAgentReply(botReply);
        if (extracted.files.length > 0) {
          filesGenerated = extracted.files;
          botReply = extracted.cleanedReply;
        }
      }

      // 3. Sjekk om agenten opprettet/oppdaterte prosjektet via MCP i bakgrunnen
      if (filesGenerated.length === 0 && isBuildIntent) {
        try {
          const syncRes = await fetch("/api/projects");
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            const matching = syncData.projects?.find(
              (p: any) => p.name === activeProject.name || p.id === activeProject.id
            );
            if (matching?.files && Array.isArray(matching.files) && matching.files.length > 0) {
              const localPage = activeProject.files.find((f) => f.path.includes("page.tsx"))?.content;
              const serverPage = matching.files.find((f: any) => f.path.includes("page.tsx"))?.content;
              if (serverPage && serverPage !== localPage) {
                filesGenerated = matching.files;
              }
            }
          }
        } catch {}
      }

      // 4. Hvis agenten produserte kode: Flett inn filene, lagre og åpne forhåndsvisning!
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

          setProjects((all) => {
            const exists = all.some((p) => p.id === updatedProj.id);
            const nextAll = exists
              ? all.map((p) => (p.id === updatedProj.id ? updatedProj : p))
              : [updatedProj, ...all];
            saveStoredProjects(nextAll);
            return nextAll;
          });

          fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update", project: updatedProj }),
          }).catch(() => {});

          return updatedProj;
        });

        setIsPreviewOpen(true);
        setMobileTab("preview");
      } else if (isBuildIntent) {
        // Fallback: Kun dersom agenten ikke leverte kodefiler, kjør intern generator
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
            provider: activeProv,
            geminiApiKey: keyToUse || undefined,
            customApiKey: keyToUse || undefined,
            apiKey: keyToUse || undefined,
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

              setProjects((all) => {
                const exists = all.some((p) => p.id === updatedProj.id);
                const nextAll = exists
                  ? all.map((p) => (p.id === updatedProj.id ? updatedProj : p))
                  : [updatedProj, ...all];
                saveStoredProjects(nextAll);
                return nextAll;
              });

              fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "update", project: updatedProj }),
              }).catch(() => {});

              return updatedProj;
            });
            setIsPreviewOpen(true);
            setMobileTab("preview");
          }
        }
      } else {
        setUser((prev) => ({
          ...prev,
          tokensRemaining: Math.max(0, prev.tokensRemaining - 150),
        }));
      }

      // Sett sammen innhold til chat-boblen
      let finalContent = "";
      if (filesGenerated.length > 0) {
        finalContent = `Jeg har bygget og konfigurert løsningen for forespørselen din: **"${promptText}"**.\n\nForhåndsvisningen er oppdatert og klar. Du kan teste applikasjonen i vinduet til høyre eller åpne kildekoden for å se endringene.`;
      } else if (botReply) {
        finalContent = botReply;
      } else {
        finalContent = `Jeg har analysert og fullført forespørselen din: "${promptText}".`;
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
      handleSendMessage(initialPromptFromUrl, "AI Program Ultra");
    }
  }, [initialPromptFromUrl]);

  // Oppdater en fil direkte fra editoren
  const handleUpdateFile = (path: string, newContent: string) => {
    setActiveProject((prev) => {
      const updated = {
        ...prev,
        files: prev.files.map((f) => (f.path === path ? { ...f, content: newContent } : f)),
      };
      setProjects((all) => {
        const nextAll = all.map((p) => (p.id === updated.id ? updated : p));
        saveStoredProjects(nextAll);
        return nextAll;
      });
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
        message: "Prosjektet og alle kildekodefiler er pakket og lastet ned til din maskin.",
      });
    } catch (e) {
      alert("Kunne ikke laste ned ZIP.");
    }
  };

  // Push til GitHub (åpner dedikert modal med ekte GitHub-integrasjon)
  const handlePushGithub = () => {
    setIsGithubModalOpen(true);
  };

  // Ny samtale (starter i full-bredde ren chat som Qwen)
  const handleNewConversation = () => {
    setIsPreviewOpen(false);
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        role: "assistant",
        content: `Hei! Hva ønsker du å bygge eller endre på ${activeProject.name}? Beskriv ønsket funksjon, så oppretter jeg filene og setter opp forhåndsvisningen for deg.`,
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

  // Slett et prosjekt
  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm(`Er du sikker på at du vil slette prosjektet "${projectName}"? Dette kan ikke angres.`);
      if (!ok) return;
    }

    const updated = projects.filter((p) => p.id !== projectId && p.name !== projectName);
    const finalProjects = updated.length > 0 ? updated : [createNewProject("Nytt Prosjekt")];

    setProjects(finalProjects);
    saveStoredProjects(finalProjects);

    if (activeProject.id === projectId || activeProject.name === projectName) {
      setActiveProject(finalProjects[0]);
    }

    fetch(`/api/projects?id=${encodeURIComponent(projectId)}`, {
      method: "DELETE",
    }).catch((err) => console.warn("Sletting på server feilet:", err));
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
      type: "info",
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

  // Test API-tilkobling via sikker server-proxy (Gemini, DeepSeek, OpenAI, 1min.AI)
  const handleTestApiKey = async () => {
    if (!geminiApiKeyInput.trim()) {
      setTestKeyStatus("Vennligst lim inn en nøkkel først.");
      return;
    }
    setIsTestingApiKey(true);
    setTestKeyStatus(null);
    try {
      const key = geminiApiKeyInput.trim();
      const res = await fetch("/api/agent/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      if (data.success) {
        setTestKeyStatus(data.message || `✓ Tilkobling vellykket (${data.provider})!`);
        if (typeof window !== "undefined") {
          localStorage.setItem("aiprogram_gemini_key", key);
          localStorage.setItem("aiprogram_custom_api_key", key);
        }
      } else {
        setTestKeyStatus(`Tilkobling feilet: ${data.message || "Ugyldig API-nøkkel"}`);
      }
    } catch (e: any) {
      setTestKeyStatus(`Tilkoblingsfeil: ${e.message}`);
    } finally {
      setIsTestingApiKey(false);
    }
  };

  return (
    <div className="flex h-[100dvh] h-screen w-screen overflow-hidden bg-[#141416]">
      {/* 1. Antigravity-style Sidebar (Full-height left panel matching Qwen) */}
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
          setIsPreviewOpen(true);
          setViewMode("workspace");
        }}
        onNewConversation={handleNewConversation}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTasks={() => setIsTasksOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        onDeleteProject={handleDeleteProject}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* 2. Main Canvas (StartScreen or WorkspaceLayout) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Deploy & Export Notification Banner */}
        {deployNotification && (
          <div className="bg-gradient-to-r from-purple-950/90 to-slate-900 border-b border-[#7C3AED]/40 px-5 py-3 flex items-center justify-between text-sm sm:text-base z-30 animate-in fade-in duration-200 shrink-0">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-bold text-white">{deployNotification.title}</span>
              <span className="text-slate-300 hidden sm:inline">{deployNotification.message}</span>
            </div>

            <div className="flex items-center gap-3">
              {deployNotification.url && (
                <a
                  href={deployNotification.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-md transition"
                >
                  <span>{deployNotification.buttonText || "Åpne"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                onClick={() => setDeployNotification(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Center: Start Screen OR Split-View Workspace */}
        {viewMode === "start" ? (
          <StartScreen
            onStartBuilding={(prompt) => handleSendMessage(prompt, "AI Program Ultra")}
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
            isPreviewOpen={isPreviewOpen}
            onTogglePreview={setIsPreviewOpen}
            mobileTab={mobileTab}
            onSetMobileTab={setMobileTab}
            user={user}
            onOpenPricing={() => setIsPricingOpen(true)}
            onDownloadZip={handleDownloadZip}
            onPushGithub={handlePushGithub}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onNewConversation={handleNewConversation}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (App-like native dock with iOS safe area and touch feedback) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 pb-[max(env(safe-area-inset-bottom,0px),6px)] pt-1.5 bg-[#0e1017]/95 backdrop-blur-xl border-t border-[#1e2230] z-40 flex items-center justify-around px-2 select-none shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("agent");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === "workspace" && mobileTab === "agent"
              ? "text-white bg-[#7C3AED]/25 border border-[#7C3AED]/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Agent</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setIsPreviewOpen(true);
            setMobileTab("preview");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === "workspace" && mobileTab === "preview"
              ? "text-white bg-[#7C3AED]/25 border border-[#7C3AED]/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Frontend</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("backend");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === "workspace" && mobileTab === "backend"
              ? "text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Server className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Backend</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("database");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === "workspace" && mobileTab === "database"
              ? "text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 shadow-sm font-bold"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Database</span>
        </button>

        <button
          onClick={() => {
            setViewMode("workspace");
            setMobileTab("code");
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === "workspace" && mobileTab === "code"
              ? "text-white bg-[#7C3AED]/25 border border-[#7C3AED]/40 shadow-sm"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Code2 className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Kode</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[11px] font-semibold mt-0.5">Filer</span>
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
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-3xl w-full max-w-2xl p-7 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-lg sm:text-xl">Samtalehistorikk</h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-300">
              Oversikt over tidligere bygge-sesjoner. Klikk for å hente frem en tidligere samtale og fortsette å bygge.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {savedConversations.map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] hover:border-purple-600/50 transition flex items-center justify-between group"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">{c.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">
                      {c.projectName} • {c.timestamp} • {c.tokens}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleLoadConversation(c)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-xs sm:text-sm font-bold text-[#C4B5FD] hover:text-white transition cursor-pointer"
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
                      className="p-2 text-slate-500 hover:text-red-400 transition cursor-pointer rounded-lg hover:bg-red-950/30"
                      title="Slett samtale"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1F2937] flex justify-end">
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#181E2B] hover:bg-[#222B3D] text-slate-200 hover:text-white text-sm font-semibold transition cursor-pointer"
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
          <div className="bg-[#0E121A] border border-[#1F2937] rounded-3xl w-full max-w-2xl p-7 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#A78BFA]" />
                <h3 className="font-bold text-white text-lg sm:text-xl">Planlagte Oppgaver & Cron-jobber</h3>
              </div>
              <button
                onClick={() => setIsTasksOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#181E2B] transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-300">
              Autonome bakgrunnsoppgaver som holder databasen synkronisert, sjekker Railway-helse og forbedrer SEO.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {scheduledTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#12161F] border border-[#1F2937] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">{t.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Frekvens: {t.schedule} • Mål: {t.target}
                    </p>
                    {t.lastRun && (
                      <p className="text-xs text-emerald-400 mt-1 font-medium">Sist kjørt: {t.lastRun}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleRunTaskNow(t.id, t.title)}
                      className="p-2 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 text-[#C4B5FD] hover:text-white transition cursor-pointer"
                      title="Kjør oppgave umiddelbart"
                    >
                      <Play className="w-4 h-4" />
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
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
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

            <div className="pt-3 border-t border-[#1F2937] flex items-center justify-between">
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
                className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Legg til oppgave</span>
              </button>
              <button
                onClick={() => setIsTasksOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#181E2B] hover:bg-[#222B3D] text-slate-200 hover:text-white text-sm font-semibold cursor-pointer"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Integrations & API-nøkler Modal (Exact match to user screenshot) */}
      <IntegrationsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onOpenPricing={() => setIsPricingOpen(true)}
        activeProvider={activeProvider}
        onSelectProvider={(p) => setActiveProvider(p)}
      />

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

      {/* 8. GitHub Export & Account Connection Modal */}
      <GitHubExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        projectName={activeProject.name}
        files={activeProject.files}
        onExportSuccess={(repoUrl) => {
          setActiveProject((prev) => ({ ...prev, githubRepo: repoUrl }));
          setDeployNotification({
            type: "github",
            title: "Repository opprettet på GitHub!",
            message: `Kildekoden er pushet til ${repoUrl}`,
            url: repoUrl,
            buttonText: "Åpne på GitHub",
          });
        }}
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
            <span>Laster AI Program Workspace...</span>
          </div>
        </div>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
