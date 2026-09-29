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
  Rocket,
  FolderGit2,
  Download,
  Settings,
  Plus,
  Loader2,
} from "lucide-react";
import { AgentChatView } from "./AgentChatView";
import { FloatingInputBar } from "./FloatingInputBar";
import { LivePreview } from "./LivePreview";
import { CodeEditor } from "./CodeEditor";
import { BackendExplorer } from "./BackendExplorer";
import { DatabaseStudio } from "./DatabaseStudio";
import { TerminalView } from "./TerminalView";
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
  onDeployRailway?: () => void;
  onDownloadZip?: () => void;
  onPushGithub?: () => void;
  onOpenSettings?: () => void;
  onNewConversation?: () => void;
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
  onDeployRailway,
  onDownloadZip,
  onPushGithub,
  onOpenSettings,
  onNewConversation,
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

  // Model Selection
  const [selectedModel, setSelectedModel] = useState("Gemini 3.8 Flash High");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const models = [
    { name: "Gemini 3.8 Flash High", desc: "Superrask resonnering og live koding" },
    { name: "Claude 3.7 Sonnet", desc: "Avansert logikk og arkitektur" },
    { name: "AI Program Ultra", desc: "Optimalisert norsk forretningsmodell" },
  ];

  // Corner Three-Dots Menu state
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);
  const [isPreviewMoreOpen, setIsPreviewMoreOpen] = useState(false);

  // Deploy Popover State (Image 3)
  const [isDeployPopoverOpen, setIsDeployPopoverOpen] = useState(false);
  const defaultSubdomain = (activeProject.name || "webdev")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const [deploySubdomain, setDeploySubdomain] = useState(defaultSubdomain);
  const [deployVisibility, setDeployVisibility] = useState<"Public" | "Private">("Public");
  const [deployState, setDeployState] = useState<"idle" | "deploying" | "deployed">("idle");
  const [copiedDeployLink, setCopiedDeployLink] = useState(false);

  useEffect(() => {
    setDeploySubdomain(
      (activeProject.name || "webdev")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }, [activeProject.name]);

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

  const handleTriggerDeploy = () => {
    setDeployState("deploying");
    setTimeout(() => {
      setDeployState("deployed");
    }, 1800);
  };

  const deployedUrl = `https://${deploySubdomain || "app"}.aiprogram.site`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopiedDeployLink(true);
    setTimeout(() => setCopiedDeployLink(false), 2000);
  };

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
        <div className="h-11 bg-[#1a1a20]/90 border-b border-[#26262e] px-4 flex items-center justify-between select-none shrink-0 relative z-20">
          {/* Left: Model Selector Dropdown (e.g. Qwen3.8-Max v in Image 1) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-white hover:bg-[#25252e] transition cursor-pointer"
            >
              <span>{selectedModel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isModelDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsModelDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-1.5 z-40 text-xs animate-in fade-in duration-100">
                  <p className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400">
                    Velg AI Modell
                  </p>
                  {models.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m.name);
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full flex flex-col items-start px-2.5 py-1.5 rounded-lg text-left transition cursor-pointer ${
                        selectedModel === m.name
                          ? "bg-[#2c2c36] text-white font-medium"
                          : "text-slate-300 hover:bg-[#25252e] hover:text-white"
                      }`}
                    >
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-[10px] text-slate-400">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Three Dots Menu Corner ("tre prikker oppe i et hjørne for og få ned meny") */}
          <div className="relative flex items-center gap-1.5">
            {/* If preview is closed, show a subtle eye button */}
            {!isPreviewOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsPreviewOpen(true);
                  setActiveTab("preview");
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#22222a] hover:bg-[#2c2c36] text-slate-300 hover:text-white border border-[#2f2f3a] text-xs font-medium transition cursor-pointer"
                title="Åpne forhåndsvisning"
              >
                <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}

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
                      onDeployRailway?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                  >
                    <Rocket className="w-3.5 h-3.5 text-amber-400" />
                    <span>Deploy på Railway</span>
                  </button>

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
                    <span>Innstillinger & Gemini-nøkkel</span>
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
        {/* Right Pane Header: Box Icon + "Web Dev" on Left, Deploy Button + Close "X" on Right (Image 2) */}
        <div className="h-11 bg-[#1a1a20] border-b border-[#26262e] px-4 flex items-center justify-between select-none shrink-0 relative">
          {/* Left: Box Icon + Web Dev */}
          <div className="flex items-center gap-2 min-w-0">
            <Box className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-sm font-semibold text-white truncate">
              {activeProject.name || "Web Dev"}
            </span>
          </div>

          {/* Right: Deploy Button (White Pill) + Close Button "X" (Image 2) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Deploy Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDeployPopoverOpen(!isDeployPopoverOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-900 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Rull ut applikasjonen"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Deploy</span>
              </button>

              {/* Exact Deploy Popover (Image 3) */}
              {isDeployPopoverOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={() => setIsDeployPopoverOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-[#1f1f26] border border-[#2e2e38] rounded-2xl shadow-2xl p-5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">Deploy</h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          deployState === "deployed"
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800/50"
                            : "bg-[#18181e] text-slate-400 border-[#2a2a34]"
                        }`}
                      >
                        {deployState === "deployed" ? "● Live" : "Undeployed"}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-normal">
                      Anyone with the link can access. Your chat messages will not be shared.
                    </p>

                    {/* Domain Input Field with Globe Icon */}
                    <div className="flex items-center gap-2 bg-[#16161c] border border-[#2c2c36] focus-within:border-slate-400 rounded-xl px-3 py-2 text-slate-200">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={deploySubdomain}
                        onChange={(e) => setDeploySubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="my-app"
                        className="bg-transparent text-xs text-white outline-none w-full font-mono"
                      />
                      <span className="text-[11px] text-slate-500 font-mono">.aiprogram.site</span>
                    </div>

                    {/* Visibility Dropdown with Users Icon */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setDeployVisibility(deployVisibility === "Public" ? "Private" : "Public")}
                        className="w-full flex items-center justify-between bg-[#16161c] border border-[#2c2c36] hover:border-slate-500 rounded-xl px-3 py-2 text-xs text-slate-200 transition cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>{deployVisibility}</span>
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>

                    {/* Legal / Policy Notice */}
                    <p className="text-[10px] text-slate-500 leading-tight">
                      By clicking "Deploy", you acknowledge and agree to use this feature in compliance with the{" "}
                      <span className="text-slate-400 underline cursor-pointer">Usage Policy</span> and applicable laws and regulations.
                    </p>

                    {/* Action Button: Deploy or Live Options */}
                    {deployState === "idle" && (
                      <button
                        type="button"
                        onClick={handleTriggerDeploy}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-semibold text-xs transition cursor-pointer shadow-md"
                      >
                        Deploy
                      </button>
                    )}

                    {deployState === "deploying" && (
                      <div className="w-full py-2.5 rounded-xl bg-[#2a2a34] text-slate-300 font-medium text-xs flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#A78BFA]" />
                        <span>Klargjør og ruller ut applikasjon...</span>
                      </div>
                    )}

                    {deployState === "deployed" && (
                      <div className="space-y-2 pt-1">
                        <div className="p-2.5 bg-[#14141a] rounded-xl border border-emerald-900/40 text-[11px] font-mono text-emerald-400 truncate">
                          {deployedUrl}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={deployedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-3 rounded-xl bg-white hover:bg-slate-200 text-slate-900 font-semibold text-center text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <span>Åpne side</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="py-2 px-3 rounded-xl bg-[#262630] hover:bg-[#30303c] text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {copiedDeployLink ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Kopiert!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Kopier lenke</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Close Preview Button "X" (Returns chat to centered/full width) */}
            <button
              type="button"
              onClick={() => {
                setIsPreviewOpen(false);
                setIsFullscreen(false);
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-lg transition cursor-pointer"
              title="Lukk forhåndsvisning"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-toolbar: Segmented Switcher [ Preview ] [ Code ] + Refresh + Fullscreen + Three Dots Menu */}
        <div className="h-9 bg-[#16161c] border-b border-[#24242c] px-3.5 flex items-center justify-between select-none shrink-0">
          {/* Left: Segmented Switcher [ Preview ] [ Code ] (Exact Image 2) */}
          <div className="flex items-center gap-1 bg-[#121215] p-0.5 rounded-lg border border-[#24242c]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("preview");
                if (onSetMobileTab) onSetMobileTab("preview");
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#25252e] text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Preview
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("editor");
                if (onSetMobileTab) onSetMobileTab("code");
              }}
              className={`px-3 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "editor"
                  ? "bg-[#25252e] text-white shadow-sm font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Code
            </button>
          </div>

          {/* Right: Refresh + Fullscreen + Three Dots menu for extra tools */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                // Trigger reload in iframe by touching key
                setActiveTab((prev) => prev);
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-md transition cursor-pointer"
              title="Last inn på nytt"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-md transition cursor-pointer"
              title={isFullscreen ? "Avslutt fullskjerm" : "Fullskjerm"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Three Dots dropdown for extra tabs (Backend, Database, Terminal) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPreviewMoreOpen(!isPreviewMoreOpen)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-[#25252e] rounded-md transition cursor-pointer"
                title="Flere utviklerverktøy"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isPreviewMoreOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsPreviewMoreOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-1.5 z-40 text-xs animate-in fade-in duration-100">
                    <p className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400">
                      Utviklerverktøy
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("backend");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                    >
                      <Server className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Backend API Explorer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("database");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                    >
                      <Database className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Database Studio</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("terminal");
                        setIsPreviewMoreOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#25252e] hover:text-white transition cursor-pointer text-left"
                    >
                      <Terminal className="w-3.5 h-3.5 text-amber-400" />
                      <span>Terminal</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" && (
            <LivePreview
              files={activeProject.files}
              projectName={activeProject.name}
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
            />
          )}

          {activeTab === "terminal" && (
            <TerminalView projectName={activeProject.name} />
          )}
        </div>
      </div>
    </div>
  );
}
