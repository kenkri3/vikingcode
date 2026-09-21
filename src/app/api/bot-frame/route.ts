import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const botKey =
    req.nextUrl.searchParams.get("bot_api") ||
    process.env.NEXT_PUBLIC_BOTSIFY_TOKEN ||
    "WrVETkxMW1es8yUXkdan1l9HEFuLPCVjvsemSKF1";

  const upstreamUrl = `https://agentic.botsify.com/web-bot/frame/${botKey}`;

  try {
    const res = await fetch(upstreamUrl, {
      headers: {
        "User-Agent":
          req.headers.get("user-agent") ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 VikingCode/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(`Kunne ikke laste agent-frame: ${res.statusText}`, {
        status: res.status,
      });
    }

    let html = await res.text();

    // Inject base href so all relative resources, scripts, stylesheets and API endpoints load cleanly
    if (html.includes("<head>")) {
      html = html.replace("<head>", `<head><base href="https://agentic.botsify.com/" />`);
    } else {
      html = `<base href="https://agentic.botsify.com/" />` + html;
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error: any) {
    console.error("Feil ved proxying av bot-frame:", error);
    return new NextResponse(`Feil ved kontakt med Botsify: ${error.message}`, { status: 502 });
  }
}
