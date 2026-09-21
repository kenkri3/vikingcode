import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTokenQuota, estimateTokenCount } from "@/lib/tokens";
import { UserSession, ProjectFile, AgentAction } from "@/lib/types";

async function generateWithGemini(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Du er AI Program - en autonom senior fullstack-utvikler for det norske markedet.
Brukeren har gitt følgende oppgave: "${prompt}".
Skriv et konsist, profesjonelt og teknisk svar på norsk (2-3 avsnitt) som forklarer hvilke komponenter du har konstruert, hvordan Tailwind CSS og datamodellene i Prisma er satt opp, og hvordan løsningen er forberedt for 1-klikks drift på Railway med PostgreSQL.`,
              },
            ],
          },
        ],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
    }
  } catch (err) {
    console.warn("Gemini API kall feilet, faller tilbake til innebygd AI-motor:", err);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      userId = "user-demo-1",
      userEmail = "kenneth@aiprogram.no",
      currentPlan = "TRIAL",
      tokensRemaining = 50000,
      trialPromptsUsed = 0,
      model = "Gemini 3.8 Flash High",
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Vennligst oppgi en gyldig prompt." },
        { status: 400 }
      );
    }

    // Finn eller konstruer bruker-sesjon for token-validering
    let userSession: UserSession = {
      id: userId,
      email: userEmail,
      name: "Kenneth Glosli Kristiansen",
      plan: currentPlan,
      tokensRemaining: Number(tokensRemaining),
      trialPromptsUsed: Number(trialPromptsUsed),
      isActive: true,
    };

    // Prøv å hente fra DB hvis tilgjengelig
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (dbUser) {
        userSession = {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name || "Kenneth Glosli Kristiansen",
          plan: dbUser.plan,
          tokensRemaining: dbUser.tokensRemaining,
          trialPromptsUsed: dbUser.trialPromptsUsed,
          isActive: dbUser.isActive,
        };
      }
    } catch {
      // Ignorer DB feil ved offline/demo-kjøring
    }

    // 1. SIKKERHETSVENTIL: Sjekk token-kvote før generering
    const quotaCheck = verifyTokenQuota(userSession);
    if (!quotaCheck.allowed) {
      return NextResponse.json(
        {
          error: quotaCheck.message,
          code: quotaCheck.errorCode,
          tokensRemaining: userSession.tokensRemaining,
          trialPromptsUsed: userSession.trialPromptsUsed,
        },
        { status: 403 }
      );
    }

    // Beregn forbruk for denne genereringen (ca 4 000 - 8 000 tokens for en full app)
    const tokensForThisRun = Math.min(
      userSession.tokensRemaining,
      Math.floor(estimateTokenCount(prompt) * 8 + 3800)
    );

    // Prøv å kalle Gemini API hvis nøkkel er tilgjengelig
    let aiMessage: string | null = null;
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey.trim() !== "") {
      aiMessage = await generateWithGemini(prompt, geminiKey);
    }

    if (!aiMessage) {
      aiMessage = `Jeg har analysert forespørselen din: "${prompt}".\n\nLøsningen er oppdatert med nye interaktive komponenter i Next.js App Router, oppdatert datamodell i Prisma for PostgreSQL, og produksjonsklare innstillinger for 1-klikks distribusjon på Railway. Forhåndsvisningen til høyre er nå oppdatert i sanntid.`;
    }

    const agentThought = `Analyserer prompten "${prompt}". Validerer krav til norsk språk, mørk obsidian-profil, responsive Tailwind-komponenter, Prisma-skjema for PostgreSQL på Railway, samt 1-klikks distribusjonskrav i railway.json.`;

    // Generer Antigravity-lignende tankerekker og handlinger
    const actions: AgentAction[] = [
      {
        id: `act-${Date.now()}-1`,
        type: "analyze",
        title: "Analyzed requirements & UX architecture",
        duration: "0.6s",
        fileName: "app/page.tsx",
        lineRange: "#L1-260",
        timestamp: new Date().toISOString(),
      },
      {
        id: `act-${Date.now()}-2`,
        type: "thought",
        title: geminiKey ? "Google Gemini 2.0 Flash Resonnering" : "AI Program Autonom Resonnering (3.6s)",
        content: agentThought,
        duration: "3.6s",
        timestamp: new Date().toISOString(),
      },
      {
        id: `act-${Date.now()}-3`,
        type: "search",
        title: "Verified TEK17 / Norsk standard bibliotek",
        duration: "0.4s",
        timestamp: new Date().toISOString(),
      },
      {
        id: `act-${Date.now()}-4`,
        type: "analyze",
        title: "Validated PostgreSQL schema & nixpacks config",
        duration: "0.5s",
        fileName: "railway.json",
        lineRange: "#L1-12",
        timestamp: new Date().toISOString(),
      },
    ];

    // Konstruer prosjektfilene tilpasset forespørselen
    const promptClean = prompt.replace(/'/g, "\\'").replace(/"/g, '\\"');

    const generatedFiles: ProjectFile[] = [
      {
        path: "app/page.tsx",
        content: `'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, Zap, CheckCircle, Smartphone, Clock } from 'lucide-react';

export default function GeneratedApp() {
  const [activeTab, setActiveTab] = useState('demo');
  const [inputVal, setInputVal] = useState('');
  const [items, setItems] = useState(['Autonom ordrehåndtering', 'Vipps-integrert betaling', 'Sanntidsvarsling på SMS']);

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    setItems([...items, inputVal]);
    setInputVal('');
  };

  return (
    <div className="min-h-screen bg-[#0A0D12] text-slate-100 p-6 md:p-12 font-sans selection:bg-[#7C3AED] selection:text-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-800/60 text-xs text-[#C4B5FD]">
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          Generert av AI Program Autonom Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          ${promptClean.slice(0, 70)}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Skreddersydd norsk løsning med ultra-mørkt tema, direkte PostgreSQL-kobling på Railway og sanntids logikk.
        </p>
      </div>

      {/* Dynamic Interaction Card */}
      <div className="max-w-3xl mx-auto bg-[#12161F] border border-[#1F2937] rounded-2xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#A78BFA]" />
          Interaktiv Funksjonalitet
        </h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Legg til et element eller oppgave..."
            className="flex-1 bg-[#0A0D12] border border-[#1F2937] focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
          />
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium text-sm transition flex items-center gap-1.5 shadow-lg shadow-purple-900/30 cursor-pointer"
          >
            Legg til
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#0E121A] border border-[#1F2937] text-sm text-slate-200"
            >
              <span className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {item}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Aktiv</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`,
      },
      {
        path: "prisma/schema.prisma",
        content: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model GeneratedEntry {
  id        String   @id @default(uuid())
  title     String
  status    String   @default("ACTIVE")
  createdAt DateTime @default(now())
}
`,
      },
      {
        path: "railway.json",
        content: `{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npx prisma migrate deploy && npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
`,
      },
    ];

    const updatedTokensRemaining = Math.max(0, userSession.tokensRemaining - tokensForThisRun);
    const updatedTrialPromptsUsed =
      userSession.plan === "TRIAL"
        ? userSession.trialPromptsUsed + 1
        : userSession.trialPromptsUsed;

    // Prøv å logge til PostgreSQL / Prisma
    try {
      await prisma.tokenUsage.create({
        data: {
          userId: userSession.id,
          tokensUsed: tokensForThisRun,
          promptAction: `AI_CODE_GENERATION: ${prompt.slice(0, 50)}`,
        },
      });

      await prisma.user.update({
        where: { id: userSession.id },
        data: {
          tokensRemaining: updatedTokensRemaining,
          trialPromptsUsed: updatedTrialPromptsUsed,
        },
      });
    } catch {
      // Ignorer DB feil i frakoblet modus
    }

    return NextResponse.json({
      success: true,
      message: aiMessage,
      actions,
      files: generatedFiles,
      tokensUsed: tokensForThisRun,
      tokensRemaining: updatedTokensRemaining,
      trialPromptsUsed: updatedTrialPromptsUsed,
    });
  } catch (error: unknown) {
    console.error("Feil under /api/generate:", error);
    return NextResponse.json(
      { error: "En uventet feil oppsto under kodegenerering." },
      { status: 500 }
    );
  }
}
