import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { extractFilesFromAgentReply } from "@/lib/code-extractor";
import { prisma } from "@/lib/prisma";

/**
 * 🤖 AI Program Headless Agent Proxy
 * Kommuniserer med AI-agent via REST API.
 * Fanger opp all kode som agenten spytter ut og ruter det direkte til prosjektfiler.
 */

const BOT_API_KEY =
  process.env.AGENT_API ||
  process.env.AGENT_TOKEN ||
  process.env.NEXT_PUBLIC_BOTSIFY_TOKEN ||
  "WrVETkxMW1es8yUXkdan1l9HEFuLPCVjvsemSKF1";

const CONVERSE_ENDPOINT = "https://agentic.botsify.com/api/v1/converse";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sessionId, projectName, userName, userId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mangler melding" }, { status: 400 });
    }

    // Beregn stabil og isolert sesjons-id (13 tegn)
    const seed = sessionId || userId || crypto.randomBytes(8).toString("hex");
    const demoHash = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 12);
    const fbId = `v${demoHash}`;

    const contextHeader = `[AI Program Autonom Kodebygger | Bruker: ${userName || "Utvikler"} | Aktivt prosjekt: ${projectName || "Mitt Prosjekt"}]
VIKTIG: Du er en toppleder fullstack-arkitekt som bygger produksjonsklare applikasjoner for kunden.
Når brukeren ber deg lage, designe eller oppdatere koden:
1. Skriv ferdig, komplett Next.js (React + Tailwind CSS + Lucide ikoner) kildekode i en kodeblokk merket \`\`\`tsx (med // app/page.tsx på første linje).
2. Eller kall MCP-verktøyet 'build_project' eller 'update_file'.
Systemet fanger automatisk opp koden du spytter ut, lagrer den i de riktige prosjektfilene, og viser den umiddelbart i forhåndsvisningen (live preview) for kunden!`;

    const enrichedMessage = `${contextHeader}\n\nBrukerens instruks: ${message}`;

    const payload = {
      type: "message",
      fbId: fbId,
      bot_key: BOT_API_KEY,
      text: enrichedMessage,
      message: enrichedMessage,
      current_messages: enrichedMessage,
      url: "https://aiprogram.no",
      user_name: userName || "AIProgram Utvikler",
      messages: [],
    };

    const response = await fetch(CONVERSE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Agent converse API error:", response.status, errText);
      return NextResponse.json(
        {
          error: `Agent-API svarte med status ${response.status}`,
          details: errText,
        },
        { status: 502 }
      );
    }

    const data = await response.json();

    let replyText = "";
    const quickReplies: Array<{ title: string; payload: string }> = [];

    if (data.messages && Array.isArray(data.messages)) {
      for (const m of data.messages) {
        if (m.message) {
          if (m.message.text) {
            replyText += (replyText ? "\n\n" : "") + m.message.text;
          }
          if (Array.isArray(m.message.quick_replies)) {
            for (const qr of m.message.quick_replies) {
              if (qr.title) {
                quickReplies.push({
                  title: qr.title,
                  payload: qr.payload || qr.title,
                });
              }
            }
          }
        }
      }
    }

    if (!replyText) {
      replyText = "Jeg har behandlet forespørselen din og oppdatert prosjektet.";
    } else {
      replyText = replyText
        .replace(/VikingCode\s*Architect/gi, "AI Program Arkitekt")
        .replace(/VikingCode/gi, "AI Program")
        .replace(/Viking/gi, "Nordic");
    }

    // 🎯 Ekstraher automatisk alle kodefiler som agenten spyttet ut
    const { files: extractedFiles, cleanedReply } = extractFilesFromAgentReply(replyText);

    // Hvis koden inneholdt filer, lagre til database hvis prosjekt finnes
    if (extractedFiles.length > 0 && projectName) {
      try {
        const query = userId
          ? { userId, name: projectName }
          : { name: projectName };

        const project = await prisma.project.findFirst({
          where: query,
          orderBy: { updatedAt: "desc" },
        });

        if (project) {
          const currentFiles: Array<{ path: string; content: string }> =
            (project.filesJson as any) || [];
          const map = new Map(currentFiles.map((f) => [f.path, f]));
          extractedFiles.forEach((f) => map.set(f.path, f));

          await prisma.project.update({
            where: { id: project.id },
            data: {
              filesJson: Array.from(map.values()) as any,
              updatedAt: new Date(),
            },
          });
        }
      } catch (dbErr) {
        console.warn("Automatisk lagring av agent-filer i DB fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: fbId,
      reply: cleanedReply,
      rawReply: replyText,
      files: extractedFiles,
      quickReplies: quickReplies,
      raw: data,
    });
  } catch (error: any) {
    console.error("AI Program agent chat proxy error:", error);
    return NextResponse.json(
      {
        error: "Intern serverfeil ved kommunikasjon med agenten",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
