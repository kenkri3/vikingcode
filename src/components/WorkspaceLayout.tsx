"use client";

import React, { useState } from "react";
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
  const [chatMode, setChatMode] = useState<"agent" | "trace">("agent");

  const quickPrompts = [
    "Legg til Vipps hurtigbetaling og kvitteringsvisning",
    "Oppdater TEK17 priskalkulator med nye timepriser",
    "Lag et moderne kontaktskjema med SMS-varsling",
    "Koble appen til PostgreSQL med automatisk migrering",
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0A0D12]">
      {/* LEFT SIDE (40% width): Agent Chat & Floating Input */}
      <div className="w-full md:w-[40%] flex flex-col h-full border-r border-[#1F2937] bg-[#0A0D12] overflow-hidden">
        {/* Left Side Header */}
        <div className="h-10 bg-[#0E121A] border-b border-[#1F2937] px-3 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="truncate">AI Program Agent</span>
            </div>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center bg-[#0A0D12] p-0.5 rounded-lg border border-[#1F2937]">
              <button
                type="button"
                onClick={() => setChatMode("agent")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  chatMode === "agent"
                    ? "bg-purple-950/80 text-white border border-purple-800/40"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Vis interaktiv AI-agent"
              >
                <Bot className="w-3 h-3 text-[#A78BFA]" />
                <span>AI Agent</span>
              </button>
              <button
                type="button"
                onClick={() => setChatMode("trace")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                  chatMode === "trace"
                    ? "bg-purple-950/80 text-white border border-purple-800/40"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Vis detaljert tankestrøm og bygger"
              >
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>Kodebygger</span>
              </button>
            </div>

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
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
              title="Kjør siste oppgave på nytt"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="bg-[#0E121A]/50 border-b border-[#1F2937]/50 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto select-none">
          <span className="text-[10px] text-slate-500 font-semibold uppercase shrink-0">Forslag:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(q, "Gemini 3.8 Flash High")}
              className="px-2 py-0.5 rounded-full bg-[#12161F] hover:bg-purple-950/60 border border-[#1F2937] hover:border-purple-700/50 text-[10px] text-slate-300 hover:text-white whitespace-nowrap transition cursor-pointer shrink-0"
            >
              ✦ {q}
            </button>
          ))}
        </div>

        {/* Left Side Content: Interactive Live Agent & Builder Chat */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <AgentChatView messages={messages} isLoading={isLoading} />
          <FloatingInputBar
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            onStop={onStopGeneration}
            disabled={isQuotaExceeded}
          />
        </div>
      </div>

      {/* RIGHT SIDE (60% width): Live Sandbox Preview & Code Editor */}
      <div className="w-full md:w-[60%] flex flex-col h-full bg-[#0A0D12] overflow-hidden">
        {/* Workspace Tab Header */}
        <div className="h-10 bg-[#0E121A] border-b border-[#1F2937] px-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-1 bg-[#0A0D12] p-0.5 rounded-lg border border-[#1F2937]">
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
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
