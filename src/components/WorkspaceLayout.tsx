"use client";

import React, { useState } from "react";
import { Eye, Code2, Sparkles, Terminal, RotateCcw, Bot } from "lucide-react";
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
  const [chatMode, setChatMode] = useState<"botsify" | "trace">("botsify");

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0A0D12]">
      {/* LEFT SIDE (40% width): Agent Chat (Botsify / Trace) & Floating Input */}
      <div className="w-full md:w-[40%] flex flex-col h-full border-r border-[#1F2937] bg-[#0A0D12] overflow-hidden">
        {/* Left Side Header */}
        <div className="h-10 bg-[#0E121A] border-b border-[#1F2937] px-3 flex items-center justify-between select-none shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="truncate">VikingCode Agent</span>
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
                onClick={() => setChatMode("botsify")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  chatMode === "botsify"
                    ? "bg-purple-950/80 text-white border border-purple-800/40"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Vis original Botsify-agent i iframe"
              >
                Original Agent
              </button>
              <button
                type="button"
                onClick={() => setChatMode("trace")}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition cursor-pointer ${
                  chatMode === "trace"
                    ? "bg-purple-950/80 text-white border border-purple-800/40"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Vis Antigravity tankestrøm og bygger"
              >
                Kodebygger
              </button>
            </div>

            {chatMode === "botsify" && (
              <button
                type="button"
                onClick={() => {
                  const iframe = document.getElementById("botsify-frame") as HTMLIFrameElement;
                  if (iframe) iframe.src = "/api/bot-frame";
                }}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                title="Last agent på nytt"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Left Side Content */}
        {chatMode === "botsify" ? (
          <div className="flex-1 w-full h-full relative bg-[#0A0D12] overflow-hidden flex flex-col">
            <iframe
              id="botsify-frame"
              src="/api/bot-frame"
              title="VikingCode Autonom Agent"
              className="w-full flex-1 border-0 bg-[#0A0D12]"
              allow="microphone; camera; clipboard-read; clipboard-write"
            />
          </div>
        ) : (
          <>
            <AgentChatView messages={messages} isLoading={isLoading} />
            <FloatingInputBar
              onSendMessage={onSendMessage}
              isLoading={isLoading}
              onStop={onStopGeneration}
              disabled={isQuotaExceeded}
            />
          </>
        )}
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
