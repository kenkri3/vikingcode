"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  Search,
  Brain,
  Sparkles,
  Atom,
  Loader2,
} from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { VikingLogo } from "./VikingLogo";

interface AgentChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  currentThought?: string;
  onOpenFile?: (path: string) => void;
  onQuickReply?: (text: string) => void;
}

export function AgentChatView({
  messages,
  isLoading,
  currentThought,
  onOpenFile,
  onQuickReply,
}: AgentChatViewProps) {
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Live timer for real-time streaming feedback
  useEffect(() => {
    let interval: any;
    if (isLoading) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 0.2);
      }, 200);
    } else {
      setElapsedSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

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
              <div className="max-w-[85%] bg-[#12161F] border border-[#1E2430] text-slate-200 text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-1 text-[10px] text-slate-500 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        }

        // Assistant / Agent Output
        return (
          <div key={msg.id} className="space-y-2 max-w-[95%]">
            {/* Sleek Collapsible Agent Steps / Actions */}
            {msg.actions && msg.actions.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => toggleThought(msg.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-slate-400 hover:text-slate-200 bg-[#12161F]/80 hover:bg-[#181E2B] border border-[#1E2430] transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                  <span className="font-medium">
                    {msg.actions.length} {msg.actions.length === 1 ? "steg fullført" : "steg fullført"}
                  </span>
                  {expandedThoughts[msg.id] ? (
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-slate-500" />
                  )}
                </button>

                {expandedThoughts[msg.id] && (
                  <div className="mt-2 ml-1 pl-3 border-l border-[#1E2430] space-y-1.5 py-1 text-[11px] font-mono text-slate-400">
                    {msg.actions.map((act) => (
                      <div key={act.id} className="flex items-center gap-2">
                        {act.type === "analyze" && (
                          <>
                            <Atom className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="text-slate-500">Analysert</span>
                            <button
                              type="button"
                              onClick={() => act.fileName && onOpenFile?.(act.fileName)}
                              className="text-slate-300 hover:text-white underline cursor-pointer truncate"
                            >
                              {act.fileName || act.title}
                            </button>
                            {act.lineRange && (
                              <span className="text-slate-500 text-[10px]">{act.lineRange}</span>
                            )}
                          </>
                        )}
                        {act.type === "search" && (
                          <>
                            <Search className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="text-slate-500">Søk</span>
                            <span className="text-slate-300 truncate">{act.title}</span>
                          </>
                        )}
                        {act.type === "thought" && (
                          <>
                            <Brain className="w-3 h-3 text-[#A78BFA] shrink-0" />
                            <span className="text-slate-300">{act.title}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Clean Message Bubble */}
            <div className="bg-[#12161F] border border-[#1E2430] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-[#1E2430] pb-2">
                <div className="flex items-center gap-2">
                  <VikingLogo size={16} />
                  <span className="text-xs font-semibold text-white">AI Program</span>
                </div>
                {msg.tokensUsed && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    {msg.tokensUsed.toLocaleString("no-NO")} tokens
                  </span>
                )}
              </div>

              <div className="leading-relaxed text-slate-300 whitespace-pre-wrap">
                {msg.content}
              </div>

              {msg.filesCreated && msg.filesCreated.length > 0 && (
                <div className="pt-2 border-t border-[#1E2430] flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-1">
                    Filer:
                  </span>
                  {msg.filesCreated.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onOpenFile?.(f)}
                      className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#0A0D12] border border-[#1E2430] text-slate-300 hover:text-white hover:border-[#7C3AED] transition cursor-pointer"
                      title={`Klikk for å åpne ${f}`}
                    >
                      <FileCode className="w-3 h-3 text-[#A78BFA]" />
                      <span>{f}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Quick Replies */}
            {msg.quickReplies && msg.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onQuickReply?.(qr.title)}
                    className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#12161F] hover:bg-[#7C3AED]/20 border border-[#1E2430] hover:border-[#7C3AED]/60 text-slate-300 hover:text-white transition cursor-pointer shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#A78BFA]" />
                    <span>{qr.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Real-time Streaming Loading Indicator */}
      {isLoading && (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#12161F] border border-[#1E2430] text-xs text-slate-300 w-fit animate-in fade-in duration-200 shadow-md">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A78BFA]" />
          <span>{currentThought || "Bygger og oppdaterer kildekode..."}</span>
          <span className="text-[10px] text-slate-500 font-mono ml-1">{elapsedSeconds.toFixed(1)}s</span>
        </div>
      )}
    </div>
  );
}
