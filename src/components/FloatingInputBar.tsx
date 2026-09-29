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
    { name: "AI Program Ultra", tag: "Kraftig" },
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
    <div className="p-3 sm:p-4 bg-[#181818]/95 border-t border-[#262626] backdrop-blur-md">
      <div className="relative max-w-3xl mx-auto bg-[#212121] border border-[#2e2e2e] focus-within:border-[#444444] rounded-2xl p-2.5 sm:p-3 transition-all shadow-xl">
        {/* Model dropdown overlay */}
        {modelDropdownOpen && (
          <div className="absolute bottom-full left-3 mb-2 w-60 bg-[#212121] border border-[#2e2e2e] rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
            <p className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400">
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
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition ${
                  selectedModel === m.name
                    ? "bg-[#2c2c2c] text-white font-medium"
                    : "text-slate-300 hover:bg-[#282828] hover:text-white"
                }`}
              >
                <span>{m.name}</span>
                <span className="text-[10px] text-purple-300 bg-[#181818] px-1.5 py-0.5 rounded border border-[#333]">
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
          placeholder="Spør AI Program om å bygge en nettside, app eller funksjon..."
          className="w-full bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none resize-none px-2 py-1 max-h-36 font-sans leading-relaxed"
        />

        {/* Action bar inside input box */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#2a2a2a] text-xs">
          <div className="flex items-center gap-1.5">
            {/* Attachment */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2a2a2a] transition cursor-pointer"
              title="Legg til kontekst"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Model Selector Pill */}
            <button
              type="button"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a2a2a] border border-[#363636] hover:border-slate-500 text-[11px] font-medium text-slate-300 hover:text-white transition cursor-pointer"
            >
              <span>{selectedModel}</span>
              <ChevronUp className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice microphone */}
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#2a2a2a] transition cursor-pointer"
              title="Taleopptak"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send or Stop Button */}
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
                    ? "bg-white text-black hover:bg-slate-200 cursor-pointer shadow-md"
                    : "bg-[#2c2c2c] text-slate-500 cursor-not-allowed"
                }`}
                title="Send"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subtle footnote matching Qwen */}
      <p className="text-center text-[10px] text-slate-400 mt-2 select-none">
        AI Program kan gjøre feil. Verifiser viktig kildekode og oppsett.
      </p>
    </div>
  );
}
