import { ProjectFile } from "./types";

/**
 * 🛠️ Ekstraherer kodefiler og ryddet melding fra det AI-agenten spytter ut.
 * Støtter:
 * 1. JSON med "files": [{ path, content }]
 * 2. Markdown-kodeblokker med filbaner i kommentar eller overskrift
 * 3. Frittstående React/TSX/JSX-komponenter (rutes automatisk til app/page.tsx)
 * 4. Prisma-skjemaer (rutes automatisk til prisma/schema.prisma)
 */
export function extractFilesFromAgentReply(replyText: string): {
  files: ProjectFile[];
  cleanedReply: string;
} {
  if (!replyText || typeof replyText !== "string") {
    return { files: [], cleanedReply: replyText || "" };
  }

  const files: ProjectFile[] = [];
  let cleaned = replyText;

  // 1. Forsøk å finne JSON-blokker som inneholder { "files": [...] }
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?\{[\s\S]*?"files"[\s\S]*?\})\s*```/gi;
  let jsonMatch: RegExpExecArray | null;
  while ((jsonMatch = jsonBlockRegex.exec(replyText)) !== null) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.files && Array.isArray(parsed.files)) {
        for (const f of parsed.files) {
          if (f.path && typeof f.content === "string") {
            files.push({
              path: normalizePath(f.path),
              content: f.content.trim(),
            });
          }
        }
      }
    } catch {}
  }

  // 2. Søk etter markdown-kodeblokker: ```(tsx|jsx|ts|js|html|prisma|css)? ... ```
  const codeBlockRegex = /(?:(?:###|##|\*\*|Fil:|File:)?\s*[`*]?([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)[`*]?\s*\n+)?```([a-zA-Z0-9_-]*)\s*\n([\s\S]*?)```/g;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = codeBlockRegex.exec(replyText)) !== null) {
    const explicitHeaderPath = blockMatch[1];
    const lang = (blockMatch[2] || "").toLowerCase();
    const codeContent = blockMatch[3]?.trim();

    if (!codeContent) continue;

    // Sjekk om første linje inneholder filbane som kommentar, f.eks: // app/page.tsx eller /* prisma/schema.prisma */
    let detectedPath = explicitHeaderPath || "";
    const firstLine = codeContent.split("\n")[0].trim();
    const commentPathMatch = firstLine.match(/^(?:\/\/\s*|\/\*\s*|#\s*)([a-zA-Z0-9_\-./]+\.[a-zA-Z0-9]+)/);
    if (commentPathMatch && commentPathMatch[1]) {
      detectedPath = commentPathMatch[1];
    }

    // Heuristikker hvis filbane ikke var spesifisert
    if (!detectedPath) {
      if (
        lang === "prisma" ||
        codeContent.includes("datasource db") ||
        (codeContent.includes("model ") && codeContent.includes("@id"))
      ) {
        detectedPath = "prisma/schema.prisma";
      } else if (
        lang === "tsx" ||
        lang === "jsx" ||
        codeContent.includes("export default function") ||
        codeContent.includes("import React") ||
        (codeContent.includes("<") && codeContent.includes("className="))
      ) {
        detectedPath = "app/page.tsx";
      } else if (lang === "html" || codeContent.includes("<!DOCTYPE html>")) {
        detectedPath = "app/page.tsx";
      } else if (codeContent.includes("railway") || (lang === "json" && codeContent.includes("nixpacks"))) {
        detectedPath = "railway.json";
      }
    }

    if (detectedPath) {
      const norm = normalizePath(detectedPath);
      // Unngå duplikater (nyeste overskriver)
      const existingIdx = files.findIndex((f) => f.path === norm);
      if (existingIdx >= 0) {
        files[existingIdx].content = codeContent;
      } else {
        files.push({
          path: norm,
          content: codeContent,
        });
      }
    }
  }

  // 3. Hvis store kodeblokker ble ekstrahert, lag en ryddig og profesjonell chat-oppsummering
  if (files.length > 0) {
    const fileListStr = files.map((f) => `\`${f.path}\``).join(", ");
    
    // Fjern massive kodeblokker fra chatten så meldingen er ren og oversiktlig
    let simplified = replyText.replace(/```[a-zA-Z0-9_-]*\s*\n[\s\S]*?```/g, "").trim();
    if (!simplified || simplified.length < 10) {
      simplified = `Jeg har generert koden for prosjektet ditt og lagret følgende filer: ${fileListStr}.\n\nForhåndsvisningen er nå oppdatert!`;
    } else {
      simplified += `\n\n*(Oppdaterte filer: ${fileListStr} – se direkte i forhåndsvisningen)*`;
    }
    cleaned = simplified;
  }

  return { files, cleanedReply: cleaned };
}

function normalizePath(rawPath: string): string {
  let p = rawPath.replace(/\\/g, "/").trim();
  p = p.replace(/^src\//, "");
  p = p.replace(/^\.\//, "");
  if (!p.startsWith("app/") && (p.endsWith("page.tsx") || p.endsWith("page.jsx"))) {
    p = "app/" + p;
  }
  return p;
}
