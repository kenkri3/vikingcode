"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  Brain,
  Sparkles,
  Atom,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Eye,
  Code2,
} from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { VikingLogo } from "./VikingLogo";

interface AgentChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  currentThought?: string;
  projectName?: string;
  isPreviewOpen?: boolean;
  onOpenFile?: (path: string) => void;
  onQuickReply?: (text: string) => void;
  onOpenPreview?: () => void;
  onOpenBackend?: () => void;
  onOpenDatabase?: () => void;
  onOpenCode?: () => void;
  onOpenTerminal?: () => void;
}

function renderInlineText(raw: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      const plain = raw.substring(lastIndex, match.index).replace(/\*\*/g, "").replace(/\*/g, "");
      if (plain) parts.push(plain);
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="text-white font-semibold">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="text-slate-200">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-[#1f1f1f] text-[#C4B5FD] font-mono text-[11px] border border-[#2e2e2e]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    const plain = raw.substring(lastIndex).replace(/\*\*/g, "").replace(/\*/g, "");
    if (plain) parts.push(plain);
  }

  return parts;
}

function formatChatMarkdown(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        if (trimmed.startsWith("---")) {
          return <hr key={lineIdx} className="border-[#2a2a2a] my-2" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lineIdx} className="text-xs font-bold text-white pt-1">
              {renderInlineText(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const content = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(2);
          return (
            <h3 key={lineIdx} className="text-sm font-bold text-white pt-1.5">
              {renderInlineText(content)}
            </h3>
          );
        }

        // Bullet list item (- or *)
        const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 leading-relaxed">
              <span className="text-[#A78BFA] font-bold text-xs select-none mt-0.5">•</span>
              <div className="flex-1">{renderInlineText(bulletMatch[1])}</div>
            </div>
          );
        }

        // Numbered list item (1. 2. etc)
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 leading-relaxed">
              <span className="text-[#C4B5FD] font-mono text-[11px] font-bold select-none mt-0.5">
                {numberMatch[1]}.
              </span>
              <div className="flex-1">{renderInlineText(numberMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInlineText(line)}
          </p>
        );
      })}
    </div>
  );
}

export function AgentChatView({
  messages,
  isLoading,
  currentThought,
  projectName,
  isPreviewOpen = false,
  onOpenFile,
  onQuickReply,
  onOpenPreview,
  onOpenBackend,
  onOpenDatabase,
  onOpenCode,
  onOpenTerminal,
}: AgentChatViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive or loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-sans select-text">
      <div className={`w-full ${isPreviewOpen ? "" : "max-w-3xl mx-auto"} space-y-6 transition-all duration-300`}>
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] bg-[#242424] border border-[#2e2e2e] text-slate-100 text-xs sm:text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className="mt-1 text-[10px] text-[#71717a] text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          }

          // Assistant / Agent Output
          const hasFiles = msg.filesCreated && msg.filesCreated.length > 0;

          return (
            <div key={msg.id} className="space-y-3 max-w-full">
              {/* Sleek Collapsible Agent Steps / Actions */}
              {msg.actions && msg.actions.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleThought(msg.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] text-[#9ca3af] hover:text-slate-200 bg-[#212121] hover:bg-[#282828] border border-[#2e2e2e] transition cursor-pointer"
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
                    <div className="mt-2 ml-1 pl-3 border-l border-[#2e2e2e] space-y-1.5 py-1 text-[11px] font-mono text-[#9ca3af]">
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

              {/* Clean Message Bubble / Qwen Flow */}
              <div className="bg-[#212121] border border-[#2e2e2e] rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-200 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2">
                  <div className="flex items-center gap-2">
                    <VikingLogo size={16} />
                    <span className="text-xs font-semibold text-white">AI Program</span>
                  </div>
                  {msg.tokensUsed && (
                    <span className="text-[10px] text-[#71717a] font-mono">
                      {msg.tokensUsed.toLocaleString("no-NO")} tokens
                    </span>
                  )}
                </div>

                <div className="leading-relaxed text-slate-300">
                  {formatChatMarkdown(msg.content)}
                </div>

                {/* Sleek Qwen-Style Artifact Card (Rendered when app/code is created) */}
                {hasFiles && (
                  <div
                    onClick={onOpenPreview}
                    className="mt-3 group cursor-pointer rounded-2xl bg-[#1b1b1b] hover:bg-[#242424] border border-[#333333] hover:border-[#4f4f4f] p-3.5 transition-all duration-150 flex items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Mini Window Frame Mockup Icon */}
                      <div className="w-12 h-12 rounded-xl bg-[#141414] border border-[#333333] flex flex-col justify-between shrink-0 p-1.5 shadow-inner group-hover:border-[#8B5CF6]/60 transition">
                        <div className="w-full flex items-center gap-1 opacity-70">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <div className="w-full h-2.5 bg-[#262626] rounded-xs flex items-center px-1">
                          <div className="w-3 h-0.5 bg-[#666] rounded-full" />
                        </div>
                        <div className="w-full flex gap-1">
                          <div className="w-1/2 h-2 bg-[#222] rounded-xs" />
                          <div className="w-1/2 h-2 bg-[#8B5CF6]/40 rounded-xs" />
                        </div>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-white truncate">
                            {projectName || "Interaktiv Applikasjon"}
                          </span>
                          <span className="px-1.5 py-0.2 text-[9px] font-medium uppercase rounded bg-[#2e2e2e] text-[#a1a1aa] border border-[#3a3a3a]">
                            React
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9ca3af] truncate mt-0.5">
                          Interaktiv forhåndsvisning • Klikk for å se app og kode
                        </p>
                        <span className="text-[10px] text-[#71717a] mt-0.5">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenPreview?.();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a2a2a] group-hover:bg-[#7C3AED] text-white text-xs font-medium border border-[#383838] group-hover:border-[#7C3AED] transition-all shadow-sm"
                      >
                        <span>Forhåndsvisning</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Actions Bar (Qwen style: Copy, Regenerate, Thumbs) */}
              <div className="flex items-center justify-between px-1 text-[11px] text-[#71717a]">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1.5 rounded-lg hover:bg-[#242424] hover:text-slate-200 transition cursor-pointer"
                    title="Kopier svar"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === "user");
                      if (lastUser && onQuickReply) {
                        onQuickReply(lastUser.content);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-[#242424] hover:text-slate-200 transition cursor-pointer"
                    title="Kjør på nytt"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {hasFiles && onOpenPreview && (
                  <button
                    type="button"
                    onClick={onOpenPreview}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-[#242424] text-[#a1a1aa] hover:text-white transition cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-[#A78BFA]" />
                    <span>Vis preview</span>
                  </button>
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
                      className="px-3 py-1 rounded-full text-[11px] font-medium bg-[#212121] hover:bg-[#7C3AED]/20 border border-[#2e2e2e] hover:border-[#7C3AED]/60 text-slate-300 hover:text-white transition cursor-pointer shadow-sm flex items-center gap-1.5"
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
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#212121] border border-[#2e2e2e] text-xs text-slate-300 w-fit animate-in fade-in duration-200 shadow-md">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A78BFA]" />
            <span>{currentThought || "Bygger og oppdaterer kildekode..."}</span>
            <span className="text-[10px] text-[#71717a] font-mono ml-1">{elapsedSeconds.toFixed(1)}s</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
