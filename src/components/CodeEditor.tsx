"use client";

import React, { useState } from "react";
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  Database,
  Server,
  FileJson,
  Edit3,
  Plus,
  X,
  FilePlus,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";
import { generatePageTemplate } from "@/lib/page-routes";

interface CodeEditorProps {
  files: ProjectFile[];
  onUpdateFile: (path: string, newContent: string) => void;
  selectedFile?: string;
  onSelectFile?: (path: string) => void;
}

export function CodeEditor({ files, onUpdateFile, selectedFile, onSelectFile }: CodeEditorProps) {
  const [activeFilePath, setActiveFilePath] = useState<string>(selectedFile || files[0]?.path || "app/page.tsx");
  const [copied, setCopied] = useState(false);
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [newFilePath, setNewFilePath] = useState("");

  React.useEffect(() => {
    if (selectedFile && files.some((f) => f.path === selectedFile)) {
      setActiveFilePath(selectedFile);
    }
  }, [selectedFile, files]);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateFile = (targetPath?: string) => {
    const raw = (targetPath || newFilePath).trim();
    if (!raw) return;

    let finalPath = raw.replace(/\\/g, "/");
    if (!finalPath.includes("/")) {
      finalPath = `app/${finalPath}/page.tsx`;
    }

    let initialContent = "";
    if (finalPath.includes("page.tsx") || finalPath.includes("page.jsx")) {
      const routeSegment = finalPath.replace(/^app\//, "").replace(/\/page\.(?:tsx|jsx)$/, "");
      initialContent = generatePageTemplate(routeSegment, "Ny Side").content;
    } else if (finalPath.endsWith(".json")) {
      initialContent = "{\n  \n}\n";
    } else {
      initialContent = `// ${finalPath}\n\nexport default function File() {\n  return null;\n}\n`;
    }

    onUpdateFile(finalPath, initialContent);
    setActiveFilePath(finalPath);
    if (onSelectFile) onSelectFile(finalPath);
    setIsAddingFile(false);
    setNewFilePath("");
  };

  const getFileIcon = (path: string) => {
    if (path.includes("prisma")) return <Database className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (path.includes("railway.json")) return <Server className="w-3.5 h-3.5 text-[#A78BFA] shrink-0" />;
    if (path.endsWith(".json")) return <FileJson className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    return <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  };

  // Lag linjenumre
  const lines = activeFile ? activeFile.content.split("\n") : [];

  return (
    <div className="flex-1 flex h-full bg-[#0A0D12] select-none">
      {/* Left: File Tree Explorer */}
      <div className="w-60 bg-[#0E121A] border-r border-[#1F2937] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1F2937] flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-[#A78BFA]" />
            <span>Filer & Sider</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddingFile(!isAddingFile)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1f2738] transition cursor-pointer"
            title="Opprett ny fil eller underside"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick add inline form */}
        {isAddingFile && (
          <div className="p-2.5 border-b border-[#1F2937] bg-[#141924] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Ny underside / fil:</span>
              <button
                type="button"
                onClick={() => setIsAddingFile(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-1 bg-[#0A0D12] border border-[#2a3548] rounded-md px-2 py-1">
              <input
                type="text"
                value={newFilePath}
                onChange={(e) => setNewFilePath(e.target.value)}
                placeholder="app/booking/page.tsx"
                className="bg-transparent text-xs text-white font-mono outline-none w-full placeholder-slate-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFile();
                  if (e.key === "Escape") setIsAddingFile(false);
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {["booking", "kontakt", "om-oss", "priser"].map((suggest) => (
                <button
                  key={suggest}
                  type="button"
                  onClick={() => handleCreateFile(`app/${suggest}/page.tsx`)}
                  className="px-1.5 py-0.5 rounded bg-[#1e2638] hover:bg-[#28334a] text-[10px] font-mono text-purple-300 hover:text-white transition"
                >
                  +{suggest}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!newFilePath.trim()}
              onClick={() => handleCreateFile()}
              className="w-full py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-semibold text-white transition cursor-pointer"
            >
              Opprett fil
            </button>
          </div>
        )}

        <div className="p-2 space-y-1 overflow-y-auto flex-1 font-mono text-xs">
          {files.map((file) => {
            const isActive = file.path === activeFilePath;
            return (
              <button
                key={file.path}
                onClick={() => setActiveFilePath(file.path)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition ${
                  isActive
                    ? "bg-[#181E2B] text-white font-medium border border-purple-800/40"
                    : "text-slate-400 hover:bg-[#12161F] hover:text-slate-200"
                }`}
              >
                {getFileIcon(file.path)}
                <span className="truncate">{file.path}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Code Viewer / Editor */}
      <div className="flex-1 flex flex-col h-full bg-[#0A0D12] overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-10 bg-[#12161F] border-b border-[#1F2937] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs text-white">
            {activeFile && getFileIcon(activeFile.path)}
            <span className="font-semibold">{activeFile?.path}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0A0D12] hover:bg-[#181E2B] border border-[#1F2937] text-xs text-slate-300 hover:text-white transition"
              title="Kopier kildekode"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Kopiert</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kopier</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Content & Line Numbers */}
        <div className="flex-1 flex overflow-auto font-mono text-xs">
          {/* Line Numbers Column */}
          <div className="py-3 px-3 bg-[#080B0F] border-r border-[#1F2937] text-slate-600 text-right select-none font-mono min-w-[40px]">
            {lines.map((_, i) => (
              <div key={i} className="leading-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Editable Code Area */}
          <textarea
            value={activeFile?.content || ""}
            onChange={(e) => {
              if (activeFile) {
                onUpdateFile(activeFile.path, e.target.value);
              }
            }}
            spellCheck={false}
            className="flex-1 p-3 bg-transparent text-slate-200 outline-none resize-none leading-5 font-mono whitespace-pre selection:bg-[#7C3AED] selection:text-white border-none"
          />
        </div>
      </div>
    </div>
  );
}
