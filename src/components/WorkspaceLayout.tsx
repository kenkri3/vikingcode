"use client";

import React, { useState } from "react";
import { Eye, Code2, Sparkles, Terminal } from "lucide-react";
import { AgentChatView } from "./AgentChatView";
import { FloatingInputBar } from "./FloatingInputBar";
import { LivePreview } from "./LivePreview";
import { CodeEditor } from "./CodeEditor";
import { ChatMessage, Project, ProjectFile } from "@/lib/types";

interface WorkspaceLayoutProps {
  activeProject: Project;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, model: string) => void;
  onUpdateFile: (path: string, content: string) => void;
  onStopGeneration?: () => void;
  isQuotaExceeded?: boolean;
}

export function WorkspaceLayout({
  activeProject,
  messages,
  isLoading,
  onSendMessage,
  onUpdateFile,
  onStopGeneration,
  isQuotaExceeded = false,
}: WorkspaceLayoutProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview");

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0A0D12]">
      {/* LEFT SIDE (40% width): Agent Chat & Floating Input */}
      <div className="w-full md:w-[40%] flex flex-col h-full border-r border-[#1F2937] bg-[#0A0D12] overflow-hidden">
        {/* Agent Chat stream */}
        <AgentChatView messages={messages} isLoading={isLoading} />

        {/* Floating Gemini-style input bar */}
        <FloatingInputBar
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          onStop={onStopGeneration}
          disabled={isQuotaExceeded}
        />
      </div>

      {/* RIGHT SIDE (60% width): Live Sandbox Preview & Code Editor */}
      <div className="w-full md:w-[60%] flex flex-col h-full bg-[#0A0D12] overflow-hidden">
        {/* Workspace Tab Header */}
        <div className="h-10 bg-[#0E121A] border-b border-[#1F2937] px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1F2937]">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === "preview"
                  ? "bg-purple-950/80 text-white shadow-sm border border-purple-800/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Forhåndsvisning (Live)</span>
            </button>

            <button
              onClick={() => setActiveTab("editor")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition ${
                activeTab === "editor"
                  ? "bg-purple-950/80 text-white shadow-sm border border-purple-800/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Kodeeditor ({activeProject.files.length} filer)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            Railway Ready (Nixpacks + PostgreSQL)
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
            />
          )}
        </div>
      </div>
    </div>
  );
}
