import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * 🤖 VikingCode Headless Agent Proxy (samme arkitektur som i ksmester)
 * Kommuniserer med Botsify via REST API.
 */

const BOT_API_KEY =
  process.env.AGENT_API ||
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

    const contextHeader = `[VikingCode Autonom Kodebygger | Bruker: ${userName || "Utvikler"} | Aktivt prosjekt: ${projectName || "Mitt Prosjekt"}]`;
    const enrichedMessage = `${contextHeader}\n${message}`;

    const payload = {
      type: "message",
      fbId: fbId,
      bot_key: BOT_API_KEY,
      text: enrichedMessage,
      message: enrichedMessage,
      current_messages: enrichedMessage,
      url: "https://vikingcode.no",
      user_name: userName || "VikingCode Utvikler",
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
      replyText = "Jeg mottok henvendelsen din og har behandlet forespørselen.";
    }

    return NextResponse.json({
      success: true,
      sessionId: fbId,
      reply: replyText,
      quickReplies: quickReplies,
      raw: data,
    });
  } catch (error: any) {
    console.error("VikingCode agent chat proxy error:", error);
    return NextResponse.json(
      {
        error: "Intern serverfeil ved kommunikasjon med agenten",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
