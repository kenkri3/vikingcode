"use client";

import React, { useState, useEffect } from "react";
import { Eye, Code2, Sparkles, Terminal, RotateCcw, Bot, Zap, MessageSquare } from "lucide-react";
import { AgentChatView } from "./AgentChatView";
import { FloatingInputBar } from "./FloatingInputBar";
import { LivePreview } from "./LivePreview";
import { CodeEditor } from "./CodeEditor";
import { ChatMessage, Project } from "@/lib/types";

interface WorkspaceLayoutProps {
  activeProject: Project;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, model: string) => void;
  onUpdateFile: (path: string, content: string) => void;
  onStopGeneration?: () => void;
  isQuotaExceeded?: boolean;
  mobileTab?: "agent" | "preview" | "code";
  onSetMobileTab?: (tab: "agent" | "preview" | "code") => void;
}

export function WorkspaceLayout({
  activeProject,
  messages,
  isLoading,
  onSendMessage,
  onUpdateFile,
  onStopGeneration,
  isQuotaExceeded = false,
  mobileTab = "agent",
  onSetMobileTab,
}: WorkspaceLayoutProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");
  const [chatMode, setChatMode] = useState<"agent" | "trace">("agent");
  const [selectedFileForEditor, setSelectedFileForEditor] = useState<string>("app/page.tsx");

  const handleOpenFile = (path: string) => {
    setSelectedFileForEditor(path);
    setActiveTab("editor");
    if (onSetMobileTab) onSetMobileTab("code");
  };

  // Keep internal activeTab synced with mobileTab if user selects preview or code
  useEffect(() => {
    if (mobileTab === "preview") setActiveTab("preview");
    if (mobileTab === "code") setActiveTab("editor");
  }, [mobileTab]);

  const quickPrompts = [
    "Legg til Vipps hurtigbetaling og kvitteringsvisning",
    "Oppdater TEK17 priskalkulator med nye timepriser",
    "Lag et moderne kontaktskjema med SMS-varsling",
    "Koble appen til PostgreSQL med automatisk migrering",
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem-3.5rem)] md:h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0A0D12]">
      {/* LEFT SIDE (Agent Chat & Floating Input) */}
      <div
        className={`w-full md:w-[40%] flex-col h-full border-r border-[#1F2937] bg-[#0A0D12] overflow-hidden ${
          mobileTab === "agent" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Left Side Header */}
        <div className="h-9 bg-[#12161F]/40 border-b border-[#1E2430] px-3.5 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">Samtale</span>
          </div>

          <div className="flex items-center gap-1">
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
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-[#1E2430] transition cursor-pointer"
              title="Kjør siste melding på nytt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Left Side Content: Interactive Live Agent & Builder Chat */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AgentChatView
            messages={messages}
            isLoading={isLoading}
            onOpenFile={handleOpenFile}
            onQuickReply={(text) => onSendMessage(text, "Gemini 3.8 Flash High")}
          />
          <FloatingInputBar
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onStop={onStopGeneration}
            disabled={isQuotaExceeded}
          />
        </div>
      </div>

      {/* RIGHT SIDE: Live Sandbox Preview & Code Editor */}
      <div
        className={`w-full md:w-[60%] flex-col h-full bg-[#0A0D12] overflow-hidden ${
          mobileTab !== "agent" ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Workspace Tab Header */}
        <div className="h-9 bg-[#12161F]/40 border-b border-[#1E2430] px-3 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1E2430]">
            <button
              onClick={() => {
                setActiveTab("preview");
                if (onSetMobileTab) onSetMobileTab("preview");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "preview"
                  ? "bg-[#1E2430] text-slate-100 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Forhåndsvisning</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("editor");
                if (onSetMobileTab) onSetMobileTab("code");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                activeTab === "editor"
                  ? "bg-[#1E2430] text-slate-100 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Kode ({activeProject.files.length})</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            {activeProject.name}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "preview" ? (
            <LivePreview
              files={activeProject.files}
              projectName={activeProject.name}
            />
          ) : (
            <CodeEditor
              files={activeProject.files}
              onUpdateFile={onUpdateFile}
              selectedFile={selectedFileForEditor}
              onSelectFile={setSelectedFileForEditor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

