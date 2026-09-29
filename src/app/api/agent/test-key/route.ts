import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 🔑 Sikker server-side test av API-nøkler
 * Unngår nettleser-CORS problemer og verifiserer nøkkelen direkte mot leverandøren.
 * Støtter:
 * - Google Gemini (AIzaSy...)
 * - DeepSeek (sk-...)
 * - OpenAI (sk-...)
 * - 1min.AI
 */
export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Vennligst oppgi en gyldig API-nøkkel." },
        { status: 400 }
      );
    }

    const key = apiKey.trim();

    // 1. Google Gemini (Starter med AIza)
    if (key.startsWith("AIza")) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: "ping" }] }],
            }),
          }
        );

        if (res.ok) {
          return NextResponse.json({
            success: true,
            provider: "Google Gemini 2.0 Flash",
            type: "gemini",
            message: "✓ Google Gemini tilkoblet! Egen direkte kvote er aktiv.",
          });
        } else {
          const err = await res.json().catch(() => ({}));
          return NextResponse.json({
            success: false,
            message: `Gemini-feil (${res.status}): ${err.error?.message || "Ugyldig nøkkel eller manglende tilgang"}`,
          });
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          message: `Nettverksfeil mot Google Gemini: ${err.message}`,
        });
      }
    }

    // 2. sk- nøkler: Test DeepSeek først, deretter OpenAI
    if (key.startsWith("sk-")) {
      // Test DeepSeek (AI Program Ultra motor)
      try {
        const dsRes = await fetch("https://api.deepseek.com/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: "ping" }],
            max_tokens: 2,
          }),
        });

        if (dsRes.ok) {
          return NextResponse.json({
            success: true,
            provider: "DeepSeek (AI Program Ultra)",
            type: "deepseek",
            message: "✓ DeepSeek tilkoblet! AI Program Ultra kjører på din egen kvote.",
          });
        }
      } catch {}

      // Test OpenAI
      try {
        const oaiRes = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });

        if (oaiRes.ok) {
          return NextResponse.json({
            success: true,
            provider: "OpenAI GPT-4o",
            type: "openai",
            message: "✓ OpenAI tilkoblet! Modellene kjører på din egen kvote.",
          });
        }
      } catch {}

      return NextResponse.json({
        success: false,
        message: "Kunne ikke verifisere 'sk-'-nøkkelen mot verken DeepSeek eller OpenAI. Sjekk at nøkkelen er aktiv og har gyldig saldo.",
      });
    }

    // 3. Test 1min.AI
    try {
      const minRes = await fetch("https://api.1min.ai/api/features", {
        headers: { "API-KEY": key },
      });
      if (minRes.ok) {
        return NextResponse.json({
          success: true,
          provider: "1min.AI",
          type: "1minai",
          message: "✓ 1min.AI tilkoblet! AI-bilde- og kodemodeller kjører på din egen kvote.",
        });
      }
    } catch {}

    return NextResponse.json({
      success: false,
      message: "Ukjent API-nøkkelformat. Støtter Google Gemini (AIza...), DeepSeek (sk-...), OpenAI (sk-...) eller 1min.AI.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Intern feil ved testing: ${error.message}` },
      { status: 500 }
    );
  }
}
