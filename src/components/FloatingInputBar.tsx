"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Mic, ArrowUp, Square, ChevronUp, Sparkles, Paperclip } from "lucide-react";

interface FloatingInputBarProps {
  onSendMessage: (text: string, model: string) => void;
  isLoading: boolean;
  onStop?: () => void;
  disabled?: boolean;
}

export function FloatingInputBar({
  onSendMessage,
  isLoading,
  onStop,
  disabled = false,
}: FloatingInputBarProps) {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState("Gemini 3.8 Flash High");
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const models = [
    { name: "Gemini 3.8 Flash High", tag: "Anbefalt" },
    { name: "Claude 3.7 Sonnet", tag: "Avansert" },
    { name: "Viking Ultra Engine", tag: "Økosystem" },
  ];

  const handleSend = () => {
    if (!text.trim() || isLoading || disabled) return;
    onSendMessage(text, selectedModel);
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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-3 bg-[#0A0D12]/90 border-t border-[#1F2937] backdrop-blur-md">
      <div className="relative max-w-3xl mx-auto bg-[#12161F] border border-[#1F2937] focus-within:border-[#7C3AED] focus-within:shadow-[0_0_25px_-5px_rgba(124,58,237,0.35)] rounded-2xl p-2.5 transition-all">
        {/* Model dropdown overlay */}
        {modelDropdownOpen && (
          <div className="absolute bottom-full left-4 mb-2 w-56 bg-[#12161F] border border-[#1F2937] rounded-xl shadow-2xl p-1.5 z-50 text-xs">
            <p className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-500">
              Velg AI-modell
            </p>
            {models.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={() => {
                  setSelectedModel(m.name);
                  setModelDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition ${
                  selectedModel === m.name
                    ? "bg-purple-950/60 text-white font-medium"
                    : "text-slate-300 hover:bg-[#181E2B] hover:text-white"
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] text-[#A78BFA] bg-[#0A0D12] px-1.5 py-0.5 rounded">
                  {m.tag}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Text input area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={adjustHeight}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything, @ to mention, / for actions"
          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 outline-none resize-none px-2 py-1 max-h-32"
        />

        {/* Action bar inside input box */}
        <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#1F2937]/50 text-xs">
          <div className="flex items-center gap-1.5">
            {/* Attachment */}
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A212E] transition"
              title="Legg til fil eller skjermbilde"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Model Selector Pill */}
            <button
              type="button"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-[#0A0D12] border border-[#1F2937] hover:border-slate-600 text-[11px] font-medium text-slate-300 hover:text-white transition"
            >
              <span className="hidden sm:inline">{selectedModel}</span>
              <span className="sm:hidden">{selectedModel.replace(" Flash High", "").replace(" Engine", "")}</span>
              <ChevronUp className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Voice microphone */}
            <button
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A212E] transition"
              title="Dikter med tale"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send or Stop */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="p-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition shadow-md"
                title="Stopp generering"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!text.trim() || disabled}
                className={`p-1.5 rounded-xl transition flex items-center justify-center ${
                  text.trim() && !disabled
                    ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-900/40 cursor-pointer"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
                title="Send melding"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
