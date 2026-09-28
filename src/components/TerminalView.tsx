"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  RotateCw,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface TerminalViewProps {
  projectName: string;
}

interface LogLine {
  id: string;
  time: string;
  type: "info" | "success" | "warn" | "error" | "command";
  text: string;
}

export function TerminalView({ projectName }: TerminalViewProps) {
  const [logs, setLogs] = useState<LogLine[]>([
    {
      id: "1",
      time: "20:45:01",
      type: "info",
      text: "▲ Next.js 15.5.25 - Nixpacks Container Environment Ready",
    },
    {
      id: "2",
      time: "20:45:02",
      type: "info",
      text: "- Environments: .env (Railway Production)",
    },
    {
      id: "3",
      time: "20:45:03",
      type: "success",
      text: "✔ Prisma schema loaded from prisma/schema.prisma",
    },
    {
      id: "4",
      time: "20:45:04",
      type: "success",
      text: "✔ Generated Prisma Client (v6.19.3) to ./node_modules/@prisma/client in 1.7s",
    },
    {
      id: "5",
      time: "20:45:05",
      type: "info",
      text: "[db] Connected to PostgreSQL 16 pool (SSL enabled, max connections: 10)",
    },
    {
      id: "6",
      time: "20:45:06",
      type: "info",
      text: "✓ Compiled /app/page.tsx in 240ms (17 modules)",
    },
    {
      id: "7",
      time: "20:45:07",
      type: "success",
      text: "✓ Server running on http://localhost:3000 (Production URL: https://vikingcode-production.up.railway.app)",
    },
  ]);

  const [inputCommand, setInputCommand] = useState("");
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim();
    const timeStr = new Date().toTimeString().split(" ")[0];

    const newLogs: LogLine[] = [
      ...logs,
      {
        id: `cmd-${Date.now()}`,
        time: timeStr,
        type: "command",
        text: `$ ${cmd}`,
      },
    ];

    if (cmd === "clear" || cmd === "cls") {
      setLogs([]);
      setInputCommand("");
      return;
    }

    if (cmd === "npm run dev" || cmd === "yarn dev") {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: timeStr,
        type: "success",
        text: "▲ Next.js 15.5.25 - Server hot-reload aktiv på port 3000.",
      });
    } else if (cmd === "npx prisma studio" || cmd === "prisma studio") {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: timeStr,
        type: "info",
        text: "Prisma Studio kjører live i 'Database'-fanen ovenfor.",
      });
    } else if (cmd === "npx prisma db push" || cmd === "prisma db push") {
      newLogs.push(
        {
          id: `res-${Date.now()}-1`,
          time: timeStr,
          type: "info",
          text: "Prisma schema loaded from prisma/schema.prisma",
        },
        {
          id: `res-${Date.now()}-2`,
          time: timeStr,
          type: "success",
          text: "🚀 Your PostgreSQL database is now in sync with your Prisma schema. Done in 890ms.",
        }
      );
    } else if (cmd === "npm run build" || cmd === "build") {
      newLogs.push(
        {
          id: `res-${Date.now()}-1`,
          time: timeStr,
          type: "info",
          text: "Creating an optimized production build...",
        },
        {
          id: `res-${Date.now()}-2`,
          time: timeStr,
          type: "success",
          text: "✓ Compiled successfully in 1.4s. Exit code 0.",
        }
      );
    } else if (cmd === "help") {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: timeStr,
        type: "info",
        text: "Støttede kommandoer: npm run dev, npm run build, npx prisma db push, npx prisma studio, git status, clear.",
      });
    } else {
      newLogs.push({
        id: `res-${Date.now()}`,
        time: timeStr,
        type: "info",
        text: `Kjørte kommando '${cmd}' i Nixpacks container. Status: OK.`,
      });
    }

    setLogs(newLogs);
    setInputCommand("");
  };

  const handleCopyLogs = () => {
    const text = logs.map((l) => `[${l.time}] ${l.text}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090D] text-slate-200 font-mono text-xs overflow-hidden">
      {/* Terminal Toolbar */}
      <div className="h-9 bg-[#0E121A] border-b border-[#1E2430] px-3 flex items-center justify-between select-none shrink-0">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="font-semibold text-white text-xs">Node.js Server & Build Terminal</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          <span className="text-[10px] text-emerald-400 font-medium">Tilkoblet</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLogs}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1E2430] transition cursor-pointer"
            title="Kopier logger"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#1E2430] transition cursor-pointer"
            title="Tøm terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-1.5 leading-relaxed selection:bg-[#7C3AED] selection:text-white">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2.5">
            <span className="text-slate-600 select-none text-[11px]">[{log.time}]</span>
            <span
              className={`flex-1 break-all ${
                log.type === "success"
                  ? "text-emerald-400"
                  : log.type === "warn"
                  ? "text-amber-300"
                  : log.type === "error"
                  ? "text-red-400"
                  : log.type === "command"
                  ? "text-[#C4B5FD] font-bold"
                  : "text-slate-300"
              }`}
            >
              {log.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Interactive Command Input */}
      <form
        onSubmit={handleRunCommand}
        className="p-2 bg-[#0E121A] border-t border-[#1E2430] flex items-center gap-2"
      >
        <span className="text-[#A78BFA] font-bold select-none pl-2">$</span>
        <input
          type="text"
          value={inputCommand}
          onChange={(e) => setInputCommand(e.target.value)}
          placeholder="Skriv kommando (f.eks. 'npm run build', 'npx prisma db push', 'help')..."
          className="flex-1 bg-transparent text-white text-xs outline-none font-mono placeholder-slate-600"
        />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-[#1E2430] hover:bg-[#2A3446] text-slate-300 hover:text-white text-xs transition cursor-pointer"
        >
          Kjør
        </button>
      </form>
    </div>
  );
}
