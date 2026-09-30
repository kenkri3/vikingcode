"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  X,
  Lock,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderGit2,
  Key,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Sparkles,
} from "lucide-react";
import { ProjectFile } from "@/lib/types";

interface GitHubUser {
  login: string;
  name?: string;
  avatar_url: string;
  html_url: string;
}

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  files: ProjectFile[];
  onExportSuccess?: (repoUrl: string) => void;
}

export function GitHubExportModal({
  isOpen,
  onClose,
  projectName,
  files,
  onExportSuccess,
}: GitHubExportModalProps) {
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [ghUser, setGhUser] = useState<GitHubUser | null>(null);

  const [repoName, setRepoName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [description, setDescription] = useState("");

  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<string>("");
  const [pushError, setPushError] = useState<string | null>(null);
  const [pushResult, setPushResult] = useState<{
    repoUrl: string;
    owner: string;
    repoName: string;
    filesCount: number;
  } | null>(null);

  // Initialiser repo-navn fra prosjektnavn
  useEffect(() => {
    if (projectName) {
      const clean = projectName
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setRepoName(clean || "mitt-prosjekt");
      setDescription(`Bygget med AI Program Builder (${projectName})`);
    }
  }, [projectName]);

  // Hent lagret GitHub-token fra localStorage ved åpning
  useEffect(() => {
    if (!isOpen) return;

    setPushResult(null);
    setPushError(null);
    setVerifyError(null);

    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("aiprogram_github_token");
      if (savedToken) {
        setToken(savedToken);
        verifyGitHubToken(savedToken);
      }
    }
  }, [isOpen]);

  // Verifiser token mot GitHub API
  const verifyGitHubToken = async (tokenToVerify: string) => {
    const cleanToken = tokenToVerify.trim();
    if (!cleanToken) return;

    setIsVerifying(true);
    setVerifyError(null);

    try {
      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          githubToken: cleanToken,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setGhUser(data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("aiprogram_github_token", cleanToken);
        }
      } else {
        setGhUser(null);
        setVerifyError(data.error || "Ugyldig GitHub-token. Vennligst sjekk at tokenet er gyldig.");
      }
    } catch (err: any) {
      setGhUser(null);
      setVerifyError("Nettverksfeil ved tilkobling til GitHub.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Koble fra / bytt konto
  const handleDisconnect = () => {
    setGhUser(null);
    setToken("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("aiprogram_github_token");
    }
  };

  // Utfør push til GitHub
  const handlePushToGithub = async () => {
    if (!token.trim()) {
      setVerifyError("Vennligst oppgi et GitHub-token først.");
      return;
    }

    if (!repoName.trim()) {
      setPushError("Vennligst oppgi et navn på repositoryet.");
      return;
    }

    setIsPushing(true);
    setPushError(null);
    setPushStatus("Kobler til din GitHub-konto...");

    try {
      setPushStatus("Oppretter repository og forbereder filer...");

      const res = await fetch("/api/export/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubToken: token.trim(),
          projectName,
          customRepoName: repoName.trim(),
          isPrivate,
          description: description.trim(),
          files,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.details || "Feil under oppretting på GitHub.");
      }

      setPushResult({
        repoUrl: data.repoUrl,
        owner: data.owner,
        repoName: data.repoName,
        filesCount: data.filesCount,
      });

      if (onExportSuccess) {
        onExportSuccess(data.repoUrl);
      }
    } catch (err: any) {
      setPushError(err.message || "Kunne ikke pushe til GitHub.");
    } finally {
      setIsPushing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#131317] border border-[#26262e] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-slate-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#24242e] flex items-center justify-between bg-[#18181f]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#24242e] text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Push til din GitHub
              </h3>
              <p className="text-[11px] text-slate-400">
                Opprett et ekte repository på din personlige konto og last opp kildekoden
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#25252e] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Suksessvisning */}
          {pushResult ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-in zoom-in-95 duration-200">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  Kildekoden er nå på GitHub!
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Repositoryet <span className="text-purple-300 font-mono">@{pushResult.owner}/{pushResult.repoName}</span> ble opprettet med {pushResult.filesCount} filer.
                </p>
              </div>

              <div className="p-3 bg-[#0d0d10] border border-[#24242e] rounded-xl font-mono text-xs text-purple-300 truncate">
                <a
                  href={pushResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline flex items-center justify-center gap-1.5"
                >
                  <span>{pushResult.repoUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={pushResult.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30"
                >
                  <Github className="w-4 h-4" />
                  <span>Åpne på GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#202028] hover:bg-[#2a2a34] text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
                >
                  Lukk
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Steg 1: GitHub Innlogging / Token */}
              {!ghUser ? (
                <div className="space-y-3.5 bg-[#17171e] p-4 rounded-xl border border-[#252530]">
                  <div className="flex items-start gap-2.5">
                    <Key className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-white">
                        Koble til din GitHub-konto
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                        For å opprette repositories på din egen GitHub-konto trenger du et Personal Access Token med <span className="text-purple-300 font-mono font-semibold">repo</span>-tilgang.
                      </p>
                    </div>
                  </div>

                  {/* 1-Klikk opprett token-lenke */}
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=AI+Program+Builder"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#20202c] hover:bg-[#282838] border border-purple-900/40 text-xs text-purple-300 hover:text-white transition group"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Generer token på GitHub (1 klikk, ferdig utfylt)</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  {/* Token Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-300 block">
                      Lim inn ditt GitHub Token (ghp_...):
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showToken ? "text" : "password"}
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#0e0e12] border border-[#2a2a36] focus:border-[#7C3AED] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowToken(!showToken)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                        >
                          {showToken ? "Skjul" : "Vis"}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => verifyGitHubToken(token)}
                        disabled={isVerifying || !token.trim()}
                        className="px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white rounded-lg text-xs font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sjekker...</span>
                          </>
                        ) : (
                          <span>Koble til</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {verifyError && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{verifyError}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Steg 1 fullført: Tilkoblet GitHub Bruker-kort */
                <div className="p-3 bg-[#17171e] border border-emerald-900/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={ghUser.avatar_url}
                      alt={ghUser.login}
                      className="w-9 h-9 rounded-full border border-purple-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">
                          {ghUser.name || ghUser.login}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-1.5 py-0.2 rounded-full font-medium">
                          ✓ Tilkoblet
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        @{ghUser.login}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="p-1.5 text-slate-400 hover:text-rose-300 hover:bg-[#252530] rounded-lg transition text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Bytt GitHub-konto eller token"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Bytt konto</span>
                  </button>
                </div>
              )}

              {/* Steg 2: Repository-innstillinger */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Repository-navn på GitHub
                  </label>
                  <div className="flex items-center bg-[#0e0e12] border border-[#2a2a36] focus-within:border-[#7C3AED] rounded-xl px-3 py-2 text-xs">
                    <span className="text-slate-500 font-mono select-none">
                      {ghUser ? `github.com/${ghUser.login}/` : "github.com/deg/"}
                    </span>
                    <input
                      type="text"
                      value={repoName}
                      onChange={(e) =>
                        setRepoName(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-_]/g, "-")
                        )
                      }
                      placeholder="mitt-nye-prosjekt"
                      className="bg-transparent text-white font-mono outline-none w-full ml-0.5"
                    />
                  </div>
                </div>

                {/* Synlighet Toggle (Privat vs Offentlig) */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                    Synlighet
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                        isPrivate
                          ? "bg-purple-950/40 border-purple-700/60 text-white"
                          : "bg-[#17171e] border-[#252530] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Lock className={`w-4 h-4 ${isPrivate ? "text-purple-400" : "text-slate-500"}`} />
                      <div>
                        <p className="text-xs font-semibold leading-none">Privat repo</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Kun du har tilgang</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                        !isPrivate
                          ? "bg-purple-950/40 border-purple-700/60 text-white"
                          : "bg-[#17171e] border-[#252530] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Globe className={`w-4 h-4 ${!isPrivate ? "text-purple-400" : "text-slate-500"}`} />
                      <div>
                        <p className="text-xs font-semibold leading-none">Offentlig repo</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Synlig for alle</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Filer som lastes opp */}
                <div className="p-2.5 bg-[#0e0e12] rounded-xl border border-[#22222a] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Innhold som pushes:</span>
                  </div>
                  <span className="font-semibold text-slate-200">
                    {files.length} filer ({files.map(f => f.path).filter(p => p.endsWith(".tsx") || p.endsWith(".ts") || p.endsWith(".json")).length} kodefiler)
                  </span>
                </div>

                {pushError && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{pushError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#24242e] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPushing}
                  className="px-4 py-2 rounded-xl bg-[#1c1c24] hover:bg-[#252530] text-slate-400 hover:text-white text-xs font-medium transition cursor-pointer"
                >
                  Avbryt
                </button>

                <button
                  type="button"
                  onClick={handlePushToGithub}
                  disabled={isPushing || !ghUser || !repoName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{pushStatus || "Laster opp..."}</span>
                    </>
                  ) : (
                    <>
                      <Github className="w-4 h-4" />
                      <span>Push til min GitHub</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
