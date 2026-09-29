import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let targetUrl = (body.url || "").trim();

    if (!targetUrl) {
      return NextResponse.json({ error: "Vennligst oppgi en gyldig URL" }, { status: 400 });
    }

    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return NextResponse.json({ error: "Ugyldig URL-format" }, { status: 400 });
    }

    let pageHtml = "";
    let extractedViaTavily = false;
    let tavilyContent = "";

    // 1. Prøv Tavily Extract API hvis TAVILY_API_KEY finnes i env
    const tavilyKey = process.env.TAVILY_API_KEY;
    if (tavilyKey) {
      try {
        const tavilyRes = await fetch("https://api.tavily.com/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            urls: [targetUrl],
          }),
        });
        if (tavilyRes.ok) {
          const tavilyData = await tavilyRes.json();
          if (tavilyData.results && tavilyData.results[0]?.raw_content) {
            tavilyContent = tavilyData.results[0].raw_content.slice(0, 5000);
            extractedViaTavily = true;
          }
        }
      } catch (e) {
        console.warn("Tavily extract warning:", e);
      }
    }

    // 2. Direkte nettleser-lignende HTTP Fetch for umiddelbar og pålitelig crawling
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "no,nb,nn,en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        pageHtml = await response.text();
      }
    } catch (fetchErr: any) {
      console.warn("Direct fetch warning:", fetchErr.message);
    }

    // 3. Ekstraher nøkkeldata fra HTML
    let title = "";
    let description = "";
    let ogImage = "";
    let themeColor = "";
    const headings: string[] = [];
    const contactInfo: { phone?: string; email?: string } = {};

    if (pageHtml) {
      // Title
      const titleMatch = pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch) title = titleMatch[1].trim();

      // Meta Description
      const descMatch =
        pageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
        pageHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
        pageHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
      if (descMatch) description = descMatch[1].trim();

      // OG Image
      const imgMatch =
        pageHtml.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
        pageHtml.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
      if (imgMatch) ogImage = imgMatch[1].trim();

      // Theme Color
      const colorMatch = pageHtml.match(/<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i);
      if (colorMatch) themeColor = colorMatch[1].trim();

      // H1, H2 Headings
      const h1Matches = pageHtml.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi);
      for (const m of h1Matches) {
        const text = m[1].replace(/<[^>]+>/g, "").trim();
        if (text && !headings.includes(text)) headings.push(text);
      }

      const h2Matches = pageHtml.matchAll(/<h2[^>]*>([^<]+)<\/h2>/gi);
      for (const m of h2Matches) {
        const text = m[1].replace(/<[^>]+>/g, "").trim();
        if (text && !headings.includes(text) && headings.length < 8) headings.push(text);
      }

      // E-post og telefon
      const emailMatch = pageHtml.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (emailMatch) contactInfo.email = emailMatch[1];

      const phoneMatch = pageHtml.match(/(?:tlf|telefon|phone|ring)?[:\s]*((?:\+47|0047)?\s?[2-9]\d{1}\s?\d{2}\s?\d{2}\s?\d{2}|\b[2-9]\d{7}\b)/i);
      if (phoneMatch) contactInfo.phone = phoneMatch[1].trim();
    }

    // Rens opp tittel
    const brandName = title.split(/[|\-–:]/)[0].trim() || parsedUrl.hostname.replace(/^www\./, "");

    // Lag en kraftfull prompt for AI-agenten
    const sectionsText = headings.length > 0 ? headings.slice(0, 5).join(", ") : "Hovedseksjoner, tjenester, priser og kontakt";
    const promptDraft = `Gjenskap og moderniser nettsiden for "${brandName}" (inspirert av ${targetUrl}).\n` +
      `- Bransje / Konsept: ${description || headings[0] || brandName}\n` +
      `- Tjenester og struktur: ${sectionsText}\n` +
      (contactInfo.phone || contactInfo.email ? `- Kontaktinformasjon: ${[contactInfo.phone, contactInfo.email].filter(Boolean).join(", ")}\n` : "") +
      `- Designkrav: Gjør designet hypermoderne, responsivt og luksuriøst med dype farger, høyoppløselige bilder, interaktivt kontaktskjema og bestillingsflyt.`;

    return NextResponse.json({
      success: true,
      url: targetUrl,
      brandName,
      title: title || brandName,
      description: description || tavilyContent.slice(0, 200) || `Nettside for ${brandName}`,
      ogImage,
      themeColor,
      headings: headings.slice(0, 6),
      contactInfo,
      extractedViaTavily,
      suggestedPrompt: promptDraft,
    });
  } catch (err: any) {
    console.error("Scrape URL route error:", err);
    return NextResponse.json(
      { error: "Kunne ikke hente nettsiden: " + (err.message || "Ukjent feil") },
      { status: 500 }
    );
  }
}
