import { NextRequest, NextResponse } from "next/server";
import {
  generate1MinAiImage,
  getCuratedImage,
  detectCategory,
  get1MinAiApiKey,
} from "@/lib/image-service";

export const dynamic = "force-dynamic";

/**
 * 🎨 AI Program Bilde-API
 * POST: Genererer bilde via 1min.AI (Flux Schnell) eller returnerer kuratert Unsplash bilde.
 * GET: Henter direkte bildelenke eller omdirigerer (302) for bruk direkte i <img src="..." />
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, category, aspectRatio = "16:9", quality = 80, forceAi = false } = body;

    if (!prompt && !category) {
      return NextResponse.json(
        { error: "Mangler prompt eller kategori for bildegenerering" },
        { status: 400 }
      );
    }

    const searchPrompt = prompt || `Bilde for ${category}`;
    const detectedCat = detectCategory(category || prompt);

    // 1. Sjekk om 1min.AI nøkkel er tilgjengelig
    const apiKey = get1MinAiApiKey();

    if (apiKey) {
      const aiResult = await generate1MinAiImage({
        prompt: searchPrompt,
        aspectRatio: aspectRatio as any,
        quality: Number(quality) || 80,
      });

      if (aiResult && aiResult.url) {
        return NextResponse.json({
          success: true,
          url: aiResult.url,
          source: "1min.ai",
          model: "Flux Schnell",
          prompt: searchPrompt,
          category: detectedCat,
        });
      }
    }

    // 2. Hvis forceAi ble krevd men nøkkel mangler/feilet
    if (forceAi && !apiKey) {
      return NextResponse.json(
        {
          error: "1min.AI API-nøkkel (1_MIN_AI) er ikke konfigurert i miljøvariabler på Railway.",
          needsKey: true,
        },
        { status: 503 }
      );
    }

    // 3. Fallback til kuratert Unsplash-bilde
    const fallbackImage = getCuratedImage(category || prompt, "hero", Math.floor(Math.random() * 3));

    return NextResponse.json({
      success: true,
      url: fallbackImage.url,
      source: "unsplash",
      prompt: searchPrompt,
      category: detectedCat,
      fallback: true,
      note: apiKey
        ? "1min.AI svarte ikke i tide, returnerte optimalisert Unsplash-bilde."
        : "1_MIN_AI er ikke satt; brukte lynraskt Unsplash CDN bilde.",
    });
  } catch (error: any) {
    console.error("Bilde-API feil:", error);
    return NextResponse.json(
      { error: "Intern feil ved bildebehandling", message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") || "";
  const category = searchParams.get("category") || prompt || "tech";
  const shouldRedirect = searchParams.get("redirect") !== "false";

  const img = getCuratedImage(category, "hero", 0);

  if (shouldRedirect) {
    return NextResponse.redirect(img.url, 302);
  }

  return NextResponse.json({
    success: true,
    url: img.url,
    source: "unsplash",
    category: img.category,
  });
}
