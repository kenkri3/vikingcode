"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VikingLogo } from "@/components/VikingLogo";
import {
  Zap,
  Shield,
  CreditCard,
  Rocket,
  LogOut,
  FolderGit2,
  ExternalLink,
  Users,
  Activity,
  Server,
  RefreshCw,
  Plus,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { STRIPE_TIERS } from "@/lib/stripe";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserAndStats();
  }, []);

  const fetchUserAndStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.authenticated || !data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);

      if (data.user.role === "ADMIN") {
        const statsRes = await fetch("/api/admin/stats");
        if (statsRes.ok) {
          const stats = await statsRes.json();
          setAdminData(stats);
        }
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const handleOpenStripePortal = async () => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || data.error || "Kunne ikke åpne Stripe portal.");
      }
    } catch (err: any) {
      alert("Feil: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyPlan = async (planId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId: user?.id,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || data.error || "Feil ved start av Stripe.");
      }
    } catch (err: any) {
      alert("Feil: " + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D12] text-slate-300 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#A78BFA]" />
          <span>Laster backend kontrollpanel...</span>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-200 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 h-14 bg-[#0A0D12]/95 backdrop-blur-md border-b border-[#1F2937] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition">
            <VikingLogo size={28} />
            <span className="text-sm font-extrabold tracking-tight text-white">AIProgram<span className="text-[#A78BFA]">.no</span></span>
          </Link>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#12161F] border border-[#1F2937] text-slate-400">
            {isAdmin ? "SuperAdmin Backend" : "Konto & Abonnement"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-xs font-bold text-[#C4B5FD] hover:text-white transition"
          >
            <Rocket className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Åpne Byggeren</span>
          </Link>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#12161F] transition cursor-pointer"
            title="Logg ut"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#12161F] via-[#161C28] to-[#12161F] border border-[#1F2937] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Hei, {user?.name || user?.email}!
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAdmin
                ? "Du er logget inn med administratorrettigheter (ADMIN_EMAIL). Her administrerer du systemstatus, brukere og integrasjoner."
                : "Administrer ditt abonnement, overvåk token-kvoten og administrer prosjektene dine."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/app"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>Bygg Ny App</span>
            </Link>
            {!isAdmin && (
              <button
                onClick={handleOpenStripePortal}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#181E2B] border border-[#1F2937] text-slate-300 text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#A78BFA]" />
                <span>Stripe Fakturaportal</span>
              </button>
            )}
          </div>
        </div>

        {/* 🌟 IF ADMIN: SUPERADMIN DIAGNOSTICS & STATS */}
        {isAdmin && adminData && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#A78BFA]" />
              Systemstatus & Infrastruktur
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <span className="text-xs text-slate-400">Stripe Betalinger</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${adminData.systemHealth?.stripeConfigured ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
                  <span className="text-sm font-bold text-white">
                    {adminData.systemHealth?.stripeConfigured ? "Stripe Aktiv" : "Venter på nøkler"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <span className="text-xs text-slate-400">Botsify Agent</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${adminData.systemHealth?.botsifyAgentActive ? "bg-emerald-400" : "bg-rose-500"}`} />
                  <span className="text-sm font-bold text-white">
                    {adminData.systemHealth?.botsifyAgentActive ? "AGENT_API Tilkoblet" : "Ikke satt"}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <span className="text-xs text-slate-400">PostgreSQL (Prisma)</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-sm font-bold text-white">Tilkoblet</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-1">
                <span className="text-xs text-slate-400">Produksjonsdomene</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  <span className="text-sm font-bold text-white">{adminData.systemHealth?.domain}</span>
                </div>
              </div>
            </div>

            {/* Registered Users Table */}
            <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A78BFA]" />
                  Brukere & Token-saldo ({adminData.users?.length || 0})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#1F2937] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">E-post</th>
                      <th className="py-2.5 px-3">Rolle</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Tokens Igjen</th>
                      <th className="py-2.5 px-3">Opprettet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2937]/50">
                    {adminData.users?.map((u: any) => (
                      <tr key={u.id} className="hover:bg-[#161D2A] transition">
                        <td className="py-3 px-3 font-semibold text-white">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === "ADMIN" ? "bg-purple-950 text-purple-300 border border-purple-800" : "bg-slate-800 text-slate-300"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#A78BFA]">{u.plan}</td>
                        <td className="py-3 px-3 text-slate-300">{u.tokensRemaining?.toLocaleString("no-NO")}</td>
                        <td className="py-3 px-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString("no-NO")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🌟 CLIENT DASHBOARD VIEW: TOKENS & BILLING */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Plan Card */}
            <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Abonnement</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 text-xs font-bold">
                  {user?.plan}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{user?.plan} Pakke</p>
                <p className="text-xs text-slate-400 mt-1">Eksport til GitHub og drift på egen Railway-konto.</p>
              </div>
              <button
                onClick={handleOpenStripePortal}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-[#0A0D12] hover:bg-[#181E2B] border border-[#1F2937] text-xs font-semibold text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Administrer i Stripe</span>
              </button>
            </div>

            {/* Token Balance Card */}
            <div className="p-6 rounded-2xl bg-[#12161F] border border-[#1F2937] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Token Saldo</span>
                <Zap className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-2xl font-black text-white">{user?.tokensRemaining?.toLocaleString("no-NO")}</p>
                <p className="text-xs text-slate-400 mt-1">Gjenværende byggetokens på kontoen din.</p>
              </div>
              <button
                onClick={() => handleBuyPlan("TOPUP_250K")}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800/40 text-xs font-bold text-[#C4B5FD] hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Kjøp 250k Tokens (199 kr)</span>
              </button>
            </div>

            {/* Upgrade Action Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12161F] to-purple-950/20 border border-purple-800/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">Oppgrader</span>
                <Rocket className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="text-lg font-black text-white">Trenger du mer kapasitet?</p>
                <p className="text-xs text-slate-400 mt-1">Oppgrader til Pro (990 kr/mnd) for 1,5 millioner tokens.</p>
              </div>
              <button
                onClick={() => handleBuyPlan("PRO")}
                disabled={actionLoading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] hover:from-[#6D28D9] text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
              >
                <span>Velg Pro (990 kr)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
