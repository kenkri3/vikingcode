"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Code2,
  Server,
  Database,
  Terminal,
  RotateCcw,
  RotateCw,
  Sparkles,
  Layers,
  X,
  ExternalLink,
  Maximize2,
  Minimize2,
  Menu,
  PanelLeft,
  Box,
  Upload,
  Globe,
  Users,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Zap,
  LayoutDashboard,
  FolderGit2,
  Download,
  Settings,
  Plus,
  Loader2,
  Github,
} from "lucide-react";
import { AgentChatView } from "./AgentChatView";
import { FloatingInputBar } from "./FloatingInputBar";
import { LivePreview } from "./LivePreview";
import { CodeEditor } from "./CodeEditor";
import { BackendExplorer } from "./BackendExplorer";
import { DatabaseStudio } from "./DatabaseStudio";
import { TerminalView } from "./TerminalView";
import { ImageGeneratorModal } from "./ImageGeneratorModal";
import { ChatMessage, Project, UserSession } from "@/lib/types";

export type WorkspaceTab = "preview" | "backend" | "database" | "editor" | "terminal";

interface WorkspaceLayoutProps {
  activeProject: Project;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, model: string) => void;
  onUpdateFile: (path: string, content: string) => void;
  onStopGeneration?: () => void;
  isQuotaExceeded?: boolean;
  isPreviewOpen?: boolean;
  onTogglePreview?: (open: boolean) => void;
  mobileTab?: "agent" | "preview" | "backend" | "database" | "code" | "terminal";
  onSetMobileTab?: (tab: "agent" | "preview" | "backend" | "database" | "code" | "terminal") => void;
  user?: UserSession;
  onOpenPricing?: () => void;
  onDownloadZip?: () => void;
  onPushGithub?: () => void;
  onOpenSettings?: () => void;
  onNewConversation?: () => void;
  onToggleSidebar?: () => void;
}

export function WorkspaceLayout({
  activeProject,
  messages,
  isLoading,
  onSendMessage,
  onUpdateFile,
  onStopGeneration,
  isQuotaExceeded = false,
  isPreviewOpen: externalPreviewOpen,
  onTogglePreview,
  mobileTab = "agent",
  onSetMobileTab,
  user,
  onOpenPricing,
  onDownloadZip,
  onPushGithub,
  onOpenSettings,
  onNewConversation,
  onToggleSidebar,
}: WorkspaceLayoutProps) {
  const [internalPreviewOpen, setInternalPreviewOpen] = useState(false);
  const isPreviewOpen = externalPreviewOpen !== undefined ? externalPreviewOpen : internalPreviewOpen;

  const setIsPreviewOpen = (open: boolean) => {
    if (onTogglePreview) {
      onTogglePreview(open);
    }
    setInternalPreviewOpen(open);
  };

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("preview");
  const [selectedFileForEditor, setSelectedFileForEditor] = useState<string>("app/page.tsx");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-switch to preview ONLY when generation initially transitions from false to true
  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (!prevLoadingRef.current && isLoading) {
      setIsPreviewOpen(true);
      setActiveTab("preview");
    }
    // Respect the user's tab choice when generation finishes (never force back if user clicked "Code")
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  // Model Selection
  const [selectedModel, setSelectedModel] = useState("AI Program Ultra");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const models = [
    {
      name: "AI Program Ultra",
      desc: "Autonom kodebygger og avansert resonnering",
      badge: "Standard",
    },
  ];

  // Corner Three-Dots Menu state
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isPreviewMoreOpen, setIsPreviewMoreOpen] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleInsertImageIntoProject = (imageUrl: string) => {
    const pageFile = activeProject.files.find((f) => f.path.includes("page.tsx"));
    if (pageFile) {
      let updatedContent = pageFile.content;
      if (updatedContent.includes("https://images.unsplash.com/")) {
        updatedContent = updatedContent.replace(/https:\/\/images\.unsplash\.com\/[^\s"']+/i, imageUrl);
      }
      onUpdateFile("app/page.tsx", updatedContent);
    }
  };

  const handleOpenFile = (path: string) => {
    setSelectedFileForEditor(path);
    setActiveTab("editor");
    setIsPreviewOpen(true);
    if (onSetMobileTab) onSetMobileTab("code");
  };

  // Sync internal activeTab with mobileTab if user taps mobile dock
  useEffect(() => {
    if (mobileTab === "preview") setActiveTab("preview");
    if (mobileTab === "backend") setActiveTab("backend");
    if (mobileTab === "database") setActiveTab("database");
    if (mobileTab === "code") setActiveTab("editor");
    if (mobileTab === "terminal") setActiveTab("terminal");
  }, [mobileTab]);


  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#141416]">
      {/* 1. CHAT PANE (Expands to 100% full width when preview is closed, splits when preview is open) */}
      <div
        className={`flex-col h-full bg-[#18181c] overflow-hidden transition-all duration-300 ${
          isPreviewOpen
            ? "w-full md:w-[45%] lg:w-[42%] md:border-r border-[#26262c]"
            : "w-full md:w-full"
        } ${mobileTab === "agent" ? "flex" : "hidden md:flex"}`}
      >
        {/* Top Chat Header: Model Selector on Left, Three Dots Menu on Right (Exact Qwen layout) */}
        <div className="h-12 bg-[#1a1a20]/90 border-b border-[#26262e] px-4 flex items-center justify-between select-none shrink-0 relative z-20">
          {/* Left: Sidebar toggle + Model Selector Dropdown */}
          <div className="flex items-center gap-2">
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#25252e] transition cursor-pointer"
                title="Vis eller skjul sidepanel"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-[#25252e] transition cursor-pointer"
              >
                <span>{selectedModel}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isModelDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsModelDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-2 z-40 text-xs animate-in fade-in duration-100">
                    <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                      Aktiv AI Modell
                    </p>
                    <div className="w-full flex flex-col items-start px-2.5 py-2 rounded-lg bg-[#2c2c36] text-white">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-semibold text-xs text-white">AI Program Ultra</span>
                        <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
                          Aktiv
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        Autonom kodebygger og avansert resonnering
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: Three Dots Menu Corner ("tre prikker oppe i et hjørne for og få ned meny") */}
          <div className="relative flex items-center">
            {/* Three Dots Button */}
            <button
              type="button"
              onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#25252e] transition cursor-pointer"
              title="Valg & Verktøy"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Corner Dropdown Menu */}
            {isChatMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsChatMenuOpen(false)}
                />
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-1.5 z-40 text-xs animate-in fade-in duration-100">
                  {/* Token Status Pill */}
                  {user && (
                    <div
                      onClick={() => {
                        setIsChatMenuOpen(false);
                        onOpenPricing?.();
                      }}
                      className="px-3 py-2 rounded-lg bg-[#16161c] hover:bg-[#24242e] border border-[#2b2b36] mb-1.5 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
                        <span className="font-semibold text-white">
                          {user.tokensRemaining.toLocaleString("no-NO")} tokens
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-300 uppercase font-bold">Fyll på</span>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setIsChatMenuOpen(false);
                      onOpenPricing?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#A78BFA]" />
                    <span>Oppgrader abonnement</span>
                  </button>

                  <a
                    href="/dashboard"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dashboard / SuperAdmin</span>
                  </a>


                  <button
                    onClick={() => {
                      setIsChatMenuOpen(false);
                      onPushGithub?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Push til GitHub</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsChatMenuOpen(false);
                      onDownloadZip?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Last ned kildekode (ZIP)</span>
                  </button>

                  <div className="border-t border-[#2a2a34] my-1" />

                  <button
                    onClick={() => {
                      setIsChatMenuOpen(false);
                      onOpenSettings?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>Innstillinger & API-nøkkel</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsChatMenuOpen(false);
                      onNewConversation?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition cursor-pointer text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ny samtale / Tøm chat</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chat Content & Floating Input */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AgentChatView
            messages={messages}
            isLoading={isLoading}
            projectName={activeProject.name}
            isPreviewOpen={isPreviewOpen}
            onOpenFile={handleOpenFile}
            onQuickReply={(text) => onSendMessage(text, selectedModel)}
            onOpenPreview={() => {
              setIsPreviewOpen(true);
              setActiveTab("preview");
              if (onSetMobileTab) onSetMobileTab("preview");
            }}
          />
          <FloatingInputBar
            projectName={activeProject.name}
            onSendMessage={(text, model) => onSendMessage(text, model || selectedModel)}
            isLoading={isLoading}
            onStop={onStopGeneration}
            disabled={isQuotaExceeded}
          />
        </div>
      </div>

      {/* 2. RIGHT PREVIEW PANE (Image 2 & 3) */}
      <div
        className={`flex-col h-full bg-[#121215] overflow-hidden transition-all duration-300 ${
          isPreviewOpen
            ? isFullscreen
              ? "!w-full fixed inset-0 z-50 flex bg-[#121215]"
              : "w-full md:w-[55%] lg:w-[58%] flex"
            : "hidden"
        } ${mobileTab !== "agent" ? "flex !w-full" : ""}`}
      >
        {/* Unified Right Pane Header: Project + [ Preview | Code ] on Left, [ AI-Bilder | Reload | Fullscreen | Tools | Deploy | X ] on Right */}
        <div className="h-13 bg-[#181820] border-b border-[#26262e] px-4 flex items-center justify-between select-none shrink-0 relative">
          {/* Left: Box Icon + Project Name + [ Preview | Code ] Segmented Switcher */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Box className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <span className="text-sm sm:text-base font-semibold text-white truncate max-w-[130px] sm:max-w-[220px]">
                {activeProject.name || "Web Dev"}
              </span>
            </div>

            <div className="h-5 w-[1px] bg-[#2a2a36] shrink-0 hidden sm:block" />

            {/* Segmented Switcher [ Preview ] [ Code ] */}
            <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-xl border border-[#24242c] shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("preview");
                  if (onSetMobileTab) onSetMobileTab("preview");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "preview"
                    ? "bg-[#25252e] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("editor");
                  if (onSetMobileTab) onSetMobileTab("code");
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer flex items-center gap-2 ${
                  activeTab === "editor"
                    ? "bg-[#25252e] text-white shadow-sm font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Code</span>
              </button>
            </div>
          </div>

          {/* Right: AI-Bilder + Reload + Fullscreen + More + Deploy + Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              className="px-3 py-1.5 text-slate-300 hover:text-white bg-[#20202a] hover:bg-[#2a2a36] border border-[#2e2e3e] rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-medium shadow-xs"
              title="Generer AI-bilder med 1min.AI eller Unsplash"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">AI-Bilder</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab((prev) => prev)}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-xl transition cursor-pointer"
              title="Last inn på nytt"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-xl transition cursor-pointer hidden sm:block"
              title={isFullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Three Dots dropdown for extra tabs (Backend, Database, Terminal) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPreviewMoreOpen(!isPreviewMoreOpen)}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-xl transition cursor-pointer"
                title="Flere utviklerverktøy"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {isPreviewMoreOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsPreviewMoreOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-2 z-40 text-sm animate-in fade-in duration-100">
                    <p className="px-2.5 py-1 text-xs uppercase font-bold text-slate-400">
                      Utviklerverktøy
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("backend");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left text-sm"
                    >
                      <Server className="w-4 h-4 text-purple-400" />
                      <span>Backend & API Explorer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("database");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left text-sm"
                    >
                      <Database className="w-4 h-4 text-emerald-400" />
                      <span>Database Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("terminal");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left text-sm"
                    >
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span>Terminal & Logger</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="h-5 w-[1px] bg-[#2a2a36] shrink-0" />

            {/* Push til GitHub Button */}
            <button
              type="button"
              onClick={onPushGithub}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md shadow-purple-950/40"
              title="Push kildekoden direkte til din personlige GitHub-konto"
            >
              <Github className="w-4 h-4" />
              <span>Push til GitHub</span>
            </button>

            {/* Close Preview Button "X" (Returns chat to centered/full width) */}
            <button
              type="button"
              onClick={() => {
                setIsPreviewOpen(false);
                setIsFullscreen(false);
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-xl transition cursor-pointer"
              title="Lukk forhåndsvisning"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" && (
            <LivePreview
              files={activeProject.files}
              projectName={activeProject.name}
              isGenerating={isLoading}
              onSwitchToCode={() => {
                setActiveTab("editor");
                if (onSetMobileTab) onSetMobileTab("code");
              }}
              onCreateNewPage={(path, content) => {
                onUpdateFile(path, content);
                setSelectedFileForEditor(path);
              }}
              onSelectFile={(path) => {
                setSelectedFileForEditor(path);
                setActiveTab("editor");
              }}
            />
          )}

          {activeTab === "backend" && (
            <BackendExplorer
              files={activeProject.files}
              projectName={activeProject.name}
            />
          )}

          {activeTab === "database" && (
            <DatabaseStudio
              files={activeProject.files}
              projectName={activeProject.name}
            />
          )}

          {activeTab === "editor" && (
            <CodeEditor
              files={activeProject.files}
              onUpdateFile={onUpdateFile}
              selectedFile={selectedFileForEditor}
              onSelectFile={setSelectedFileForEditor}
              onSwitchToPreview={() => setActiveTab("preview")}
            />
          )}

          {activeTab === "terminal" && (
            <TerminalView projectName={activeProject.name} />
          )}
        </div>
      </div>

      <ImageGeneratorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsertImage={handleInsertImageIntoProject}
      />
    </div>
  );
}
