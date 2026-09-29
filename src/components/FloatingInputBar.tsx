"use client";

import React, { useState, useRef } from "react";
import { Plus, Mic, ArrowUp, Square, ChevronDown, Code2, X } from "lucide-react";

interface FloatingInputBarProps {
  onSendMessage: (text: string, model: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  disabled?: boolean;
  projectName?: string;
}

export function FloatingInputBar({
  onSendMessage,
  isLoading,
  onStop,
  disabled = false,
  projectName = "Web Dev",
}: FloatingInputBarProps) {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState("AI Program Ultra");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [hasContextPill, setHasContextPill] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    {
      name: "AI Program Ultra",
      desc: "Autonom kodebygger og avansert resonnering",
      badge: "Standard",
    },
  ];

  const handleSend = () => {
    if (!text.trim() || isLoading || disabled) return;
    const effectiveModel = selectedModel || "AI Program Ultra";
    onSendMessage(text, effectiveModel);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <div className="p-3 sm:p-4 bg-[#18181c]/95 border-t border-[#26262e] backdrop-blur-md">
      <div className="relative max-w-3xl mx-auto bg-[#212128] border border-[#2e2e38] focus-within:border-[#424250] rounded-2xl p-2.5 sm:p-3 transition-all shadow-xl">
        {/* Model dropdown overlay */}
        {modelDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setModelDropdownOpen(false)}
            />
            <div className="absolute bottom-full right-3 mb-2 w-64 bg-[#1f1f26] border border-[#2e2e38] rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <p className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400">
                Aktiv AI Modell
              </p>
              <div className="w-full flex flex-col items-start px-2.5 py-2 rounded-lg bg-[#2c2c36] text-white">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-xs text-white">AI Program Ultra</span>
                  <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 px-1.5 py-0.5 rounded-full">
                    Aktiv
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Autonom kodebygger og avansert resonnering
                </span>
              </div>
            </div>
          </>
        )}

        {/* Text input area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={adjustHeight}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask AI Program..."
          className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none resize-none px-2 py-1 max-h-36 font-sans leading-relaxed"
        />

        {/* Action bar inside input box (Exact Image 1 & 2) */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#2a2a34] text-xs">
          <div className="flex items-center gap-1.5">
            {/* Attachment Button */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2a2a34] transition cursor-pointer"
              title="Legg til kontekst"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Context Tag Pill: [ </> Web Dev  ✕ ] (Image 1 & 2) */}
            {hasContextPill && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1b2536] border border-[#2b3a54] text-purple-300 text-[11px] font-medium transition select-none">
                <Code2 className="w-3 h-3 text-[#A78BFA]" />
                <span className="max-w-[120px] truncate">{projectName || "Web Dev"}</span>
                <button
                  type="button"
                  onClick={() => setHasContextPill(false)}
                  className="p-0.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Fjern kontekst"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {!hasContextPill && (
              <button
                type="button"
                onClick={() => setHasContextPill(true)}
                className="text-[11px] text-slate-500 hover:text-slate-300 font-medium px-1.5 py-0.5"
              >
                + Legg til {projectName || "Web Dev"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Model Mode Pill: AI Program Ultra (Sleek single-line badge) */}
            <button
              type="button"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="h-7 px-2.5 rounded-full bg-[#2a2a34] hover:bg-[#343442] border border-[#383846] text-[11px] font-medium text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 select-none shadow-sm"
            >
              <span className="whitespace-nowrap font-medium text-[11px]">{selectedModel}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {/* Voice microphone */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2a2a34] transition cursor-pointer"
              title="Taleopptak"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send or Stop Button (Arrow in rounded circle) */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white transition flex items-center justify-center cursor-pointer shadow-md"
                title="Stopp generering"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim() || disabled}
                className={`w-7 h-7 rounded-full transition flex items-center justify-center ${
                  text.trim() && !disabled
                    ? "bg-white hover:bg-slate-200 text-slate-950 shadow-md cursor-pointer"
                    : "bg-[#2d2d38] text-slate-500 cursor-not-allowed"
                }`}
                title="Send melding"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Centered Disclaimer (Exact Qwen layout) */}
      <p className="text-center text-[10px] text-slate-500 mt-2 select-none">
        AI-generated content may not be accurate.
      </p>
    </div>
  );
}
