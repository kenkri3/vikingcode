"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Search,
  Brain,
  Sparkles,
  CheckCircle2,
  Atom,
  Clock,
  Terminal,
} from "lucide-react";
import { ChatMessage, AgentAction } from "@/lib/types";

interface AgentChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  currentThought?: string;
}

export function AgentChatView({ messages, isLoading, currentThought }: AgentChatViewProps) {
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans select-text">
      {messages.map((msg) => {
        const isUser = msg.role === "user";

        if (isUser) {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] bg-[#12161F] border border-[#1F2937] text-white text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-3 shadow-md">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 text-[10px] text-slate-500 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        }

        // Assistant / Agent Stream (Antigravity style)
        return (
          <div key={msg.id} className="space-y-2.5 max-w-[95%]">
            {/* Agent Actions stream (Analyses, Searches, Thoughts) */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="space-y-1.5 pl-1 font-mono text-[11px]">
                {msg.actions.map((act) => {
                  if (act.type === "analyze") {
                    return (
                      <div
                        key={act.id}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition group cursor-pointer"
                      >
                        <span className="text-slate-500">Analyzed</span>
                        <Atom className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold text-slate-200 group-hover:underline">
                          {act.fileName || act.title}
                        </span>
                        {act.lineRange && (
                          <span className="text-slate-500 text-[10px]">{act.lineRange}</span>
                        )}
                      </div>
                    );
                  }

                  if (act.type === "thought") {
                    const isExpanded = expandedThoughts[act.id];
                    return (
                      <div key={act.id} className="my-1">
                        <button
                          onClick={() => toggleThought(act.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-[11px] font-mono py-0.5"
                        >
                          <Brain className="w-3.5 h-3.5 text-[#A78BFA]" />
                          <span>{act.title}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-slate-500" />
                          )}
                        </button>

                        {isExpanded && act.content && (
                          <div className="mt-1 pl-4 border-l-2 border-purple-800/60 text-[11px] text-slate-400 leading-relaxed font-sans bg-[#0E121A] p-2.5 rounded-r-lg">
                            {act.content}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (act.type === "search") {
                    return (
                      <div key={act.id} className="flex items-center gap-2 text-slate-400">
                        <span className="text-slate-500">Searched</span>
                        <Search className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-slate-300">{act.title}</span>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            )}

            {/* Agent Final Output Bubble */}
            <div className="bg-[#12161F]/60 border border-[#1F2937] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1F2937] pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>VikingCode Autonom Agent</span>
                </div>
                {msg.tokensUsed && (
                  <span className="text-[10px] text-purple-300/80 bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-800/40">
                    {msg.tokensUsed.toLocaleString("no-NO")} tokens
                  </span>
                )}
              </div>

              <div className="leading-relaxed text-slate-300 whitespace-pre-wrap">
                {msg.content}
              </div>

              {msg.filesCreated && msg.filesCreated.length > 0 && (
                <div className="pt-2 border-t border-[#1F2937]/60 flex flex-wrap gap-1.5">
                  {msg.filesCreated.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[10px] font-mono bg-[#0A0D12] text-slate-300 border border-slate-800 px-2 py-1 rounded-md"
                    >
                      <FileCode className="w-3 h-3 text-[#A78BFA]" />
                      {f}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Real-time Agent Thinking indicator */}
      {isLoading && (
        <div className="space-y-2 max-w-[95%] animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A78BFA] animate-pulse">
            <Brain className="w-4 h-4 animate-spin text-[#A78BFA]" />
            <span>Agenten tenker og bygger kode...</span>
          </div>

          <div className="pl-2 space-y-1 font-mono text-[11px] text-slate-400">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500">Analyzed</span>
              <Atom className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>MesterAIAgentFrame.tsx</span>
              <span className="text-slate-500 text-[10px]">#L300-450</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span>Thought for 3.4s &gt;</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-500">Writing</span>
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>app/page.tsx</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
