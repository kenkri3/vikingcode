"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  Code2,
  Server,
  Database,
  Terminal,
  RotateCcw,
  Sparkles,
  Layers,
  X,
  ExternalLink,
} from "lucide-react";
import { AgentChatView } from "./AgentChatView";
import { FloatingInputBar } from "./FloatingInputBar";
import { LivePreview } from "./LivePreview";
import { CodeEditor } from "./CodeEditor";
import { BackendExplorer } from "./BackendExplorer";
import { DatabaseStudio } from "./DatabaseStudio";
import { TerminalView } from "./TerminalView";
import { ChatMessage, Project } from "@/lib/types";

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
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem-3.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-[#181818]">
      {/* CHAT PANE (Expands to 100% full width when preview is closed, splits to ~42% when preview is open) */}
      <div
        className={`flex-col h-full bg-[#181818] overflow-hidden transition-all duration-300 ${
          isPreviewOpen
            ? "w-full md:w-[42%] lg:w-[40%] md:border-r border-[#262626]"
            : "w-full md:w-full"
        } ${mobileTab === "agent" ? "flex" : "hidden md:flex"}`}
      >
        {/* Left Side Header */}
        <div className="h-10 bg-[#1f1f1f]/80 border-b border-[#2a2a2a] px-4 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-xs font-semibold text-white">AI Autonom Utvikler</span>
          </div>

          <div className="flex items-center gap-2">
            {/* If preview is closed, show a subtle button to open preview */}
            {!isPreviewOpen && (
              <button
                type="button"
                onClick={() => {
                  setIsPreviewOpen(true);
                  setActiveTab("preview");
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#242424] hover:bg-[#2b2b2b] text-[#d4d4d4] hover:text-white border border-[#333] text-xs font-medium transition cursor-pointer"
                title="Åpne forhåndsvisning"
              >
                <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Åpne forhåndsvisning</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (messages.length > 0) {
                  const lastMsg = messages[messages.length - 1];
                  if (lastMsg.role === "user") {
                    onSendMessage(lastMsg.content, "Gemini 3.8 Flash High");
                  }
                }
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#282828] transition cursor-pointer"
              title="Kjør siste melding på nytt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Chat Content & Input */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AgentChatView
            messages={messages}
            isLoading={isLoading}
            projectName={activeProject.name}
            isPreviewOpen={isPreviewOpen}
            onOpenFile={handleOpenFile}
            onQuickReply={(text) => onSendMessage(text, "Gemini 3.8 Flash High")}
            onOpenPreview={() => {
              setIsPreviewOpen(true);
              setActiveTab("preview");
              if (onSetMobileTab) onSetMobileTab("preview");
            }}
            onOpenBackend={() => {
              setIsPreviewOpen(true);
              setActiveTab("backend");
              if (onSetMobileTab) onSetMobileTab("backend");
            }}
            onOpenDatabase={() => {
              setIsPreviewOpen(true);
              setActiveTab("database");
              if (onSetMobileTab) onSetMobileTab("database");
            }}
            onOpenCode={() => {
              setIsPreviewOpen(true);
              setActiveTab("editor");
              if (onSetMobileTab) onSetMobileTab("code");
            }}
            onOpenTerminal={() => {
              setIsPreviewOpen(true);
              setActiveTab("terminal");
              if (onSetMobileTab) onSetMobileTab("terminal");
            }}
          />
          <FloatingInputBar
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onStop={onStopGeneration}
            disabled={isQuotaExceeded}
          />
        </div>
      </div>

      {/* RIGHT SIDE: Multi-Tab Preview & Code Canvas (Only visible when isPreviewOpen is true or mobileTab !== 'agent') */}
      <div
        className={`flex-col h-full bg-[#141414] overflow-hidden transition-all duration-300 ${
          isPreviewOpen
            ? "w-full md:w-[58%] lg:w-[60%] flex"
            : "hidden"
        } ${mobileTab !== "agent" ? "flex !w-full" : ""}`}
      >
        {/* Workspace Tab Header with Sleek Segmented Switcher & Close Button */}
        <div className="h-11 bg-[#1e1e1e] border-b border-[#2a2a2a] px-3.5 flex items-center justify-between select-none shrink-0 overflow-x-auto">
          {/* Left: App Title and Live Badge */}
          <div className="flex items-center gap-2.5 min-w-0 mr-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-white truncate max-w-[140px] sm:max-w-[200px]">
              {activeProject.name}
            </span>
            <span className="hidden lg:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#a1a1aa] border border-[#383838]">
              Live Sandkasse
            </span>
          </div>

          {/* Center: Sleek Segmented Switcher */}
          <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#2a2a2a] shrink-0">
            {/* 1. Frontend Preview */}
            <button
              onClick={() => {
                setActiveTab("preview");
                if (onSetMobileTab) onSetMobileTab("preview");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#282828] text-white font-medium shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Forhåndsvisning</span>
            </button>

            {/* 2. Code Editor */}
            <button
              onClick={() => {
                setActiveTab("editor");
                if (onSetMobileTab) onSetMobileTab("code");
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === "editor"
                  ? "bg-[#282828] text-white font-medium shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Kode ({activeProject.files.length})</span>
            </button>

            {/* 3. Backend API Explorer */}
            <button
              onClick={() => {
                setActiveTab("backend");
                if (onSetMobileTab) onSetMobileTab("backend");
              }}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === "backend"
                  ? "bg-[#282828] text-cyan-300 font-medium shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Backend</span>
            </button>

            {/* 4. Database Studio */}
            <button
              onClick={() => {
                setActiveTab("database");
                if (onSetMobileTab) onSetMobileTab("database");
              }}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === "database"
                  ? "bg-[#282828] text-emerald-300 font-medium shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database</span>
            </button>

            {/* 5. Terminal */}
            <button
              onClick={() => {
                setActiveTab("terminal");
                if (onSetMobileTab) onSetMobileTab("terminal");
              }}
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === "terminal"
                  ? "bg-[#282828] text-amber-300 font-medium shadow-sm"
                  : "text-[#9ca3af] hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Terminal</span>
            </button>
          </div>

          {/* Right: Close Preview Button (Collapses to full-width chat like Qwen) */}
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="p-1.5 text-[#9ca3af] hover:text-white hover:bg-[#282828] rounded-lg transition cursor-pointer"
              title="Lukk forhåndsvisning (vis full bredde chat)"
            >
              <X className="w-4 h-4" />
            </button>
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
