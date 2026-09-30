"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Lightbulb,
  ChevronRight,
  ChevronDown,
  Search,
  Brain,
  Atom,
  Loader2,
  Copy,
  Check,
  RotateCcw,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Sparkles,
  Share2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { ChatMessage } from "@/lib/types";

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
          className="px-2 py-0.5 rounded-md bg-[#22222a] text-[#C4B5FD] font-mono text-sm border border-[#32323c]"
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
    <div className="space-y-2.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        if (trimmed.startsWith("---")) {
          return <hr key={lineIdx} className="border-[#2e2e34] my-3" />;
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={lineIdx} className="text-base sm:text-lg font-bold text-white pt-2">
              {renderInlineText(trimmed.slice(4))}
            </h4>
          );
        }

        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
          const content = trimmed.startsWith("## ") ? trimmed.slice(3) : trimmed.slice(2);
          return (
            <h3 key={lineIdx} className="text-lg sm:text-xl font-bold text-white pt-2.5">
              {renderInlineText(content)}
            </h3>
          );
        }

        // Bullet list item
        const bulletMatch = trimmed.match(/^[-*•]\s+(.*)/);
        if (bulletMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1.5 leading-relaxed text-[15px] sm:text-base">
              <span className="text-[#A78BFA] font-bold text-base select-none mt-0.5">•</span>
              <div className="flex-1 text-slate-100">{renderInlineText(bulletMatch[1])}</div>
            </div>
          );
        }

        // Numbered list item
        const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2.5 pl-1.5 leading-relaxed text-[15px] sm:text-base">
              <span className="text-[#C4B5FD] font-mono text-sm font-bold select-none mt-0.5">
                {numberMatch[1]}.
              </span>
              <div className="flex-1 font-normal text-slate-100">{renderInlineText(numberMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={lineIdx} className="leading-[1.7] text-[15px] sm:text-base text-slate-100">
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
}: AgentChatViewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedId, setLikedId] = useState<string | null>(null);
  const [dislikedId, setDislikedId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive or loading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Live timer
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 font-sans select-text">
      <div className={`w-full ${isPreviewOpen ? "" : "max-w-4xl lg:max-w-5xl mx-auto"} space-y-6 transition-all duration-300`}>
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#282a2e] border border-[#383a44] text-slate-100 text-[15px] sm:text-base rounded-3xl rounded-tr-md px-5 py-3.5 shadow-md">
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  <div className="mt-1.5 text-xs text-slate-400 text-right font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Message
          const hasFiles = msg.filesCreated && msg.filesCreated.length > 0;

          return (
            <div key={msg.id} className="space-y-3 max-w-full">
              {/* 1. Thinking completed collapsible pill (Exact Qwen style) */}
              {msg.actions && msg.actions.length > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => toggleThought(msg.id)}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition cursor-pointer font-sans py-1"
                  >
                    <Lightbulb className="w-4 h-4 text-amber-300" />
                    <span className="font-medium">Thinking completed</span>
                    {expandedThoughts[msg.id] ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {expandedThoughts[msg.id] && (
                    <div className="mt-2 ml-1 pl-3.5 border-l border-[#2e2e36] space-y-2 py-1.5 text-xs font-mono text-slate-400">
                      {msg.actions.map((act) => (
                        <div key={act.id} className="flex items-center gap-2.5">
                          {act.type === "analyze" && (
                            <>
                              <Atom className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span className="text-slate-500">Analysert</span>
                              <button
                                type="button"
                                onClick={() => act.fileName && onOpenFile?.(act.fileName)}
                                className="text-slate-300 hover:text-white underline cursor-pointer truncate"
                              >
                                {act.fileName || act.title}
                              </button>
                              {act.lineRange && (
                                <span className="text-slate-500 text-[11px]">{act.lineRange}</span>
                              )}
                            </>
                          )}
                          {act.type === "search" && (
                            <>
                              <Search className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="text-slate-500">Søk</span>
                              <span className="text-slate-300 truncate">{act.title}</span>
                            </>
                          )}
                          {act.type === "thought" && (
                            <>
                              <Brain className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />
                              <span className="text-slate-300">{act.title}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Assistant Response Text */}
              {msg.content && (
                <div className="text-slate-100 text-[15px] sm:text-base leading-[1.7] max-w-3xl">
                  {formatChatMarkdown(msg.content)}
                </div>
              )}

              {/* 3. Sleek Qwen-Style Web Dev Artifact Card (Image 1) */}
              {hasFiles && (
                <div className="pt-2 space-y-2.5">
                  <div
                    onClick={onOpenPreview}
                    className="w-full max-w-md rounded-2xl bg-[#1e1e24] hover:bg-[#25252d] border border-[#2d2d36] hover:border-[#4f4f60] p-3.5 transition-all duration-150 flex items-center justify-between gap-3.5 shadow-lg group cursor-pointer"
                    title="Klikk for å åpne forhåndsvisning"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Mini Window Frame Mockup Icon */}
                      <div className="w-14 h-14 rounded-xl bg-[#272730] border border-[#353542] flex flex-col justify-between shrink-0 p-2 shadow-inner">
                        <div className="w-full h-2.5 bg-[#333340] rounded-xs flex items-center px-1 gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        </div>
                        <div className="w-full h-5 bg-[#1a1a20] rounded-xs flex items-center justify-center">
                          <Eye className="w-3 h-3 text-slate-400 group-hover:text-white transition" />
                        </div>
                        <div className="w-full h-1.5 bg-[#333340] rounded-xs" />
                      </div>

                      <div className="flex flex-col min-w-0 justify-center">
                        <span className="text-base font-semibold text-white truncate group-hover:text-purple-300 transition">
                          {projectName || "Web Dev"}
                        </span>
                        <span className="text-xs text-slate-400 mt-1 font-mono">
                          {new Date(msg.timestamp).toLocaleDateString("no-NO", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}{" "}
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Eye icon on right side of card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenPreview?.();
                      }}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#30303c] transition cursor-pointer"
                      title="Åpne forhåndsvisning"
                    >
                      <Eye className="w-5 h-5 text-slate-300 group-hover:text-white" />
                    </button>
                  </div>

                  {/* 4. Action Bar under Artifact Card: [ 👁️ Preview ] + Copy + Thumbs + Regenerate */}
                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      type="button"
                      onClick={onOpenPreview}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e1e24] hover:bg-[#282832] text-slate-200 hover:text-white border border-[#2d2d36] text-sm font-medium transition cursor-pointer shadow-sm"
                      title="Åpne forhåndsvisning på høyre side"
                    >
                      <Eye className="w-4 h-4 text-[#A78BFA]" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-2 rounded-xl hover:bg-[#222228] hover:text-slate-200 transition cursor-pointer"
                      title="Kopier svar"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setLikedId((prev) => (prev === msg.id ? null : msg.id))}
                      className={`p-2 rounded-xl hover:bg-[#222228] transition cursor-pointer ${
                        likedId === msg.id ? "text-purple-400" : "hover:text-slate-200"
                      }`}
                      title="Bra svar"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDislikedId((prev) => (prev === msg.id ? null : msg.id))}
                      className={`p-2 rounded-xl hover:bg-[#222228] transition cursor-pointer ${
                        dislikedId === msg.id ? "text-rose-400" : "hover:text-slate-200"
                      }`}
                      title="Dårlig svar"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const lastUser = [...messages].reverse().find((m) => m.role === "user");
                        if (lastUser && onQuickReply) onQuickReply(lastUser.content);
                      }}
                      className="p-2 rounded-xl hover:bg-[#222228] hover:text-slate-200 transition cursor-pointer"
                      title="Kjør på nytt"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (typeof navigator !== "undefined" && navigator.share) {
                          navigator.share({ title: projectName || "AI Program", text: msg.content }).catch(() => {});
                        } else {
                          handleCopy(msg.id, msg.content);
                        }
                      }}
                      className="p-2 rounded-xl hover:bg-[#222228] hover:text-slate-200 transition cursor-pointer"
                      title="Del"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={onOpenPreview}
                      className="p-2 rounded-xl hover:bg-[#222228] hover:text-slate-200 transition cursor-pointer"
                      title="Flere valg"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Real-time Streaming Multi-Step Progress HUD (Punktvis fremdrift) */}
        {isLoading && (
          <div className="w-full max-w-lg rounded-2xl bg-[#1b1b22] border border-[#2e2e3a] p-4 text-sm shadow-2xl animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#292934]">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Sparkles className="w-4.5 h-4.5 text-purple-400 animate-pulse" />
                <span>{currentThought || "Bygger og designer løsning..."}</span>
              </div>
              <span className="text-xs font-mono text-purple-300 bg-purple-950/70 border border-purple-800/40 px-2.5 py-0.5 rounded-full shrink-0">
                {elapsedSeconds.toFixed(1)}s
              </span>
            </div>

            {/* Checklist of Real-Time Steps */}
            <div className="space-y-2.5 pt-1">
              {[
                { label: "Analyserer forretningskonsept og bransjekrav", doneAfter: 2.2 },
                { label: "Utformer designprofil, fargeharmoni og typografi", doneAfter: 4.8 },
                { label: "Henter høyoppløselige bransjefotografier og innhold", doneAfter: 7.8 },
                { label: "Konstruerer responsive seksjoner, skjemaer og interaktivitet", doneAfter: 11.2 },
                { label: "Kompilerer kildekode og oppdaterer sanntidsvisning", doneAfter: 999 },
              ].map((step, idx, arr) => {
                const isDone = elapsedSeconds >= step.doneAfter;
                const isCurrent = !isDone && (idx === 0 || elapsedSeconds >= arr[idx - 1].doneAfter);

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 transition-all duration-300 ${
                      isDone
                        ? "text-slate-300"
                        : isCurrent
                        ? "text-white font-medium"
                        : "text-slate-500 opacity-50"
                    }`}
                  >
                    <div className="w-4.5 h-4.5 flex items-center justify-center shrink-0">
                      {isDone ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-600" />
                      )}
                    </div>
                    <span className="text-sm leading-snug">{step.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Live Progress Bar */}
            <div className="w-full h-1.5 bg-[#252530] rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(95, Math.max(12, (elapsedSeconds / 13) * 100))}%`,
                }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
