import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { extractFilesFromAgentReply } from "@/lib/code-extractor";
import { prisma } from "@/lib/prisma";
import { callAiModel, generateAutonomousCode } from "@/app/api/generate/route";

/**
 * 🤖 AI Program Headless Agent Proxy
 * Kommuniserer med AI-agent via REST API.
 * Bevarer 100 % kontekst, samtalehistorikk og eksisterende kildekode
 * slik at agenten husker hva som er bygget og kan gjøre presise endringer.
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
    const {
      message,
      sessionId,
      projectName,
      userName,
      userId,
      history = [],
      currentFiles = [],
      apiKey,
      customApiKey,
    } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mangler melding" }, { status: 400 });
    }

    // 1. Beregn en stabil sesjons-id for samtalen og prosjektet
    const seed =
      sessionId ||
      (userId ? `user_${userId}_proj_${projectName || "main"}` : `proj_${projectName || "main"}`);
    const demoHash = crypto.createHash("sha256").update(seed).digest("hex").slice(0, 12);
    const fbId = `v${demoHash}`;

    // 🎯 SJEKK OM BRUKEREN BRUKER EGEN API-NØKKEL (BYOK)
    const userCustomKey = (customApiKey || apiKey)?.trim();
    if (userCustomKey && userCustomKey.length > 5) {
      try {
        const aiResult = await callAiModel(
          message,
          projectName || "Mitt Prosjekt",
          Array.isArray(currentFiles) ? currentFiles : [],
          userCustomKey,
          body.provider || body.aiProvider
        );

        if (aiResult) {
          // Auto-lagre til DB hvis prosjekt finnes
          if (aiResult.files && aiResult.files.length > 0 && projectName) {
            try {
              const query = userId
                ? { userId, name: projectName }
                : { name: projectName };

              const project = await prisma.project.findFirst({
                where: query,
                orderBy: { updatedAt: "desc" },
              });

              if (project) {
                const currentFilesFromDb: Array<{ path: string; content: string }> =
                  (project.filesJson as any) || [];
                const map = new Map(currentFilesFromDb.map((f) => [f.path, f]));
                aiResult.files.forEach((f) => map.set(f.path, f));

                await prisma.project.update({
                  where: { id: project.id },
                  data: {
                    filesJson: Array.from(map.values()) as any,
                    updatedAt: new Date(),
                  },
                });
              }
            } catch (dbErr) {
              console.warn("DB save error in agent chat with custom key:", dbErr);
            }
          }

          return NextResponse.json({
            success: true,
            sessionId: fbId,
            reply: aiResult.message,
            rawReply: aiResult.message,
            files: aiResult.files,
            actions: aiResult.actions,
            quickReplies: [
              { title: "Gjør designet mer moderne", payload: "modern_design" },
              { title: "Legg til en ny underside", payload: "new_page" },
              { title: "Tilpass for mobil", payload: "mobile_opt" },
            ],
            usedCustomKey: true,
            provider: userCustomKey.startsWith("AIza") ? "Google Gemini" : "AI Program Ultra",
          });
        }
      } catch (keyErr) {
        console.warn("Feil ved kjøring med egen API-nøkkel, faller tilbake til standard agent:", keyErr);
      }
    }

    // 2. Bygg samtalehistorikk
    let historyBlock = "";
    if (Array.isArray(history) && history.length > 0) {
      historyBlock = history
        .filter((h: any) => h && h.content)
        .map(
          (h: any) =>
            `${h.role === "user" ? "Bruker" : "AI Program Arkitekt"}: ${h.content.slice(0, 1000)}`
        )
        .join("\n\n");
    }

    // 3. Finn eksisterende kildekode for aktiv side
    let currentPageCode = "";
    if (Array.isArray(currentFiles) && currentFiles.length > 0) {
      const pageFile = currentFiles.find(
        (f: any) => f.path && (f.path.includes("page.tsx") || f.path.includes("page.jsx"))
      );
      if (pageFile && typeof pageFile.content === "string") {
        currentPageCode = pageFile.content.slice(0, 30000);
      }
    }

    // 4. Bygg full, kontekstrik prompt til agenten
    const contextSections: string[] = [
      `[AI Program Autonom Kodebygger | Bruker: ${userName || "Utvikler"} | Aktivt prosjekt: ${projectName || "Mitt Prosjekt"}]`,
      `VIKTIG: Du er en toppleder fullstack-arkitekt som bygger og vedlikeholder produksjonsklare applikasjoner for kunden.`,
    ];

    if (historyBlock) {
      contextSections.push(
        `--- 📜 SAMTALEHISTORIKK (Hva dere har snakket om tidligere) ---\n${historyBlock}`
      );
    }

    if (currentPageCode) {
      contextSections.push(
        `--- 💻 EKSISTERENDE KILDEKODE (app/page.tsx - det du allerede har bygget) ---\n\`\`\`tsx\n${currentPageCode}\n\`\`\`\n\n` +
          `VIKTIG INSTRUKS FOR KIRURGISK DETALJREDIGERING:\n` +
          `1. Brukeren ønsker å gjøre endringer, justeringer eller bygge videre på denne eksisterende siden (f.eks. legge til flervalg/checkboxer i skjemaet, justere tekst, endre farger, forminske ikoner, tilpasse knapper eller legge til en seksjon).\n` +
          `2. Ta direkte utgangspunkt i kildekoden over. Ikke start fra bunnen av med mindre kunden eksplisitt ber om et helt nytt prosjekt.\n` +
          `3. BEVAR 100% AV DET EKSISTERENDE DESIGNET, fargepaletten, seksjonene, bildene, merkenavnet og layouten som kunden allerede er fornøyd med!\n` +
          `4. ALDRI endre firmanavnet, logoen eller hero-tittelen til brukerens forespørselsetning! Gjør KUN den spesifikke detaljendringen brukeren ber om med kirurgisk nøyaktighet.\n` +
          `5. Hvis brukeren ber om å kunne velge flere alternativer/agenter i skjemaet: Legg til sjekkbokser (multi-select buttons/chips) i <form> med interaktiv state (f.eks. selectedAgents og toggleAgent) slik at man kan velge én eller flere.\n` +
          `6. IKONER: Alle ikoner fra 'lucide-react' MÅ ha eksplisitte Tailwind-størrelser som className="w-5 h-5 shrink-0" eller className="w-4 h-4 shrink-0". De må ALDRI være udefinerte eller blåses opp.\n` +
          `7. Lever den komplette, oppdaterte koden i en \`\`\`tsx (med // app/page.tsx på første linje) og i JSON-blokken.\n` +
          `8. SYNTAKS-KRAV: Alle strenger i JavaScript-objekter MÅ ha anførselstegn (f.eks. desc: "Tekst her", IKKE desc: Tekst her). All ren tekst i JSX må skrives direkte i JSX-tagger (<p>Tekst</p>), ALDRI pakket i nakne krøllparenteser som {Tekst}.`
      );
    }

    contextSections.push(
      `--- 🎯 BRUKERENS NYE FORESPØRSEL ---\n${message}\n\n` +
        `KRAV TIL KILDEKODEN:\n` +
        `- Skriv 100% syntaktisk gyldig TypeScript/React JSX med 'use client'.\n` +
        `- FULLSTACK-ARKITEKTUR (BÅDE NETTSIDER OG BACKEND): Skjemaer skal faktisk kalle backend med fetch('/api/data', { method: 'POST', body: JSON.stringify(...) }) for å lagre henvendelser og valgte agenter i databasen.\n` +
        `- AUTOMATISK GOOGLE #1 SEO: Inkluder ALLTID en <script type="application/ld+json"> med Schema.org strukturert data (LocalBusiness/Organization og FAQPage for Google Rich Snippets), nøyaktig én <h1> med relevante søkeord, logiske <h2> og <h3>, og beskrivende alt-tekster på alle bilder.\n` +
        `- Alle egenskaper i objekter/arrays med tekst må være gyldige strenger med hermetegn.\n` +
        `- IKON-STØRRELSE: Alle ikoner MÅ ha eksplisitte proporsjoner som className="w-5 h-5 shrink-0" eller className="w-4 h-4 shrink-0". ALDRI la ikoner stå uten størrelse eller ha w-full.\n` +
        `- KNAPPER & SKJEMAER: Alle knapper som ikke skal navigere til en ekstern URL må ha type="button" eller håndtere klikk med e.preventDefault() slik at de ikke forårsaker utilsiktet side-omlasting.\n` +
        `- NAVIGASJONSLENKER: Bruk hash-lenker som <a href="#tjenester">, <a href="#priser">, <a href="#kontakt"> eller state-basert fanebytte, ALDRI <a href="/">.\n` +
        `- AUTOMATISKE KVALITETSBILDER (Unsplash & AI): Bruk ALLTID virkelige, relevante og høyoppløselige Unsplash-bilder for hero-bakgrunn, tjenestekort, galleri og team. ALDRI bruk tomme grå firkanter eller tomme src-attributter!\n` +
        `- FLERSIDIG ARKITEKTUR (Next.js App Router): Du kan opprette og oppdatere flere sider etter brukerens ønske (f.eks. app/page.tsx for forsiden, app/booking/page.tsx for timebestilling, app/om-oss/page.tsx, app/kontakt/page.tsx, app/priser/page.tsx). Forhåndsvisningen støtter 100% full interaktiv navigasjon mellom sidene med <Link href="/booking"> eller <Link href="/">.\n` +
        `- Lever ferdig oppdatert Next.js-kode i en eller flere \`\`\`tsx kodeblokker (med // app/.../page.tsx på første linje), og avslutt alltid med JSON-formatet med alle opprettede/oppdaterte filer:\n` +
        `{\n  "action": "CODE_GENERATE",\n  "project_name": "${projectName || "prosjekt"}",\n  "files": [\n    { "path": "app/page.tsx", "content": "/* komplett oppdatert kode */" },\n    { "path": "app/api/data/route.ts", "content": "/* backend api route */" },\n    { "path": "prisma/schema.prisma", "content": "/* postgresql schema */" }\n  ]\n}`
    );

    const enrichedMessage = contextSections.join("\n\n");

    const payload = {
      type: "message",
      fbId: fbId,
      bot_key: BOT_API_KEY,
      text: enrichedMessage,
      message: enrichedMessage,
      current_messages: enrichedMessage,
      url: "https://aiprogram.no",
      user_name: userName || "AIProgram Utvikler",
      messages: (history || []).slice(-4).map((h: any) => ({
        sender: h.role === "user" ? "user" : "bot",
        text: (h.content || "").slice(0, 300),
      })),
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
    let { files: extractedFiles, cleanedReply } = extractFilesFromAgentReply(replyText);

    // Hvis agenten svarte med ren tekst uten kodeblokker, kjør autonom fullstack-bygger umiddelbart
    if (extractedFiles.length === 0) {
      try {
        const aiFallback = await callAiModel(
          message,
          projectName || "Mitt Prosjekt",
          Array.isArray(currentFiles) ? currentFiles : []
        );
        if (aiFallback && aiFallback.files && aiFallback.files.length > 0) {
          extractedFiles = aiFallback.files;
          if (aiFallback.message) {
            cleanedReply = aiFallback.message;
          }
        } else {
          const autoFallback = generateAutonomousCode(
            message,
            projectName || "Mitt Prosjekt",
            Array.isArray(currentFiles) ? currentFiles : []
          );
          if (autoFallback && autoFallback.files && autoFallback.files.length > 0) {
            extractedFiles = autoFallback.files;
            if (autoFallback.message) {
              cleanedReply = autoFallback.message;
            }
          }
        }
      } catch (genFallbackErr) {
        console.warn("Feil ved lokal generering i agent chat:", genFallbackErr);
      }
    }

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
          const currentFilesFromDb: Array<{ path: string; content: string }> =
            (project.filesJson as any) || [];
          const map = new Map(currentFilesFromDb.map((f) => [f.path, f]));
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
