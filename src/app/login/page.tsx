"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VikingLogo } from "@/components/VikingLogo";
import { Lock, Mail, ArrowRight, Shield, AlertCircle, Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vennligst fyll inn både e-post og passord.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Innlogging feilet.");
      }

      // Hvis administrator, gå til admin/dashboard
      if (data.user?.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/app");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-200 font-sans flex flex-col justify-center items-center p-4 selection:bg-[#7C3AED] selection:text-white">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 hover:opacity-90 transition mb-2">
            <VikingLogo size={36} />
            <span className="text-xl font-extrabold tracking-tight text-white">AIProgram<span className="text-[#A78BFA]">.no</span></span>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">Logg inn til systemet</h1>
          <p className="text-xs text-slate-400">
            Logg inn med din konto for å administrere prosjekter, tokens eller backend
          </p>
        </div>

        {/* Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#12161F] border border-[#1F2937] shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A78BFA]" />
                E-postadresse
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deg@bedrift.no eller admin e-post"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#A78BFA]" />
                  Passord
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] text-sm text-white placeholder-slate-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] hover:to-[#7C3AED] text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logger inn...</span>
                </>
              ) : (
                <>
                  <span>Logg inn</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Superadmin Note */}
          <div className="p-3 rounded-xl bg-[#0A0D12] border border-[#1F2937] text-[11px] text-slate-400 flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Administrator?</span> Logg inn med din <code className="text-[#C4B5FD]">ADMIN_EMAIL</code> og <code className="text-[#C4B5FD]">ADMIN_PASSWORD</code> fra Railway for direkte adgang til backend-panelet.
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-400">
            Har du ikke konto ennå?{" "}
            <Link href="/register" className="text-[#A78BFA] hover:text-purple-300 font-semibold underline">
              Registrer deg her (50 000 prøvetokens gratis)
            </Link>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition">
            ← Tilbake til AIProgram.no forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
