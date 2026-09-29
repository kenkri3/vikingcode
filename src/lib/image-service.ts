/**
 * 🎨 AI Program Bildegenerator & Bildeintegrasjon
 * Støtter:
 * 1. 1min.AI API med modellen Flux Schnell (black-forest-labs/flux-schnell) via process.env["1_MIN_AI"]
 * 2. Kuraterte høyoppløselige Unsplash-bilder for lynrask, kostnadsfri lasting i sanntid
 */

export interface ImageGenerationOptions {
  prompt: string;
  aspectRatio?: "1:1" | "16:9" | "9:16" | "3:2" | "2:3" | "4:5" | "5:4";
  quality?: number;
}

export interface ImageResult {
  url: string;
  source: "1min.ai" | "unsplash";
  model?: string;
  prompt: string;
  category?: string;
}

// Hent 1min.AI API-nøkkel fra miljøvariabler (Railway setter ofte 1_MIN_AI)
export function get1MinAiApiKey(): string | null {
  return (
    process.env["1_MIN_AI"] ||
    process.env.ONE_MIN_AI ||
    process.env["1MIN_AI"] ||
    process.env.NEXT_PUBLIC_1_MIN_AI ||
    null
  );
}

/**
 * 1. Generer et bilde ved hjelp av 1min.AI (Flux Schnell)
 * Bruker endpoint: POST https://api.1min.ai/api/features
 */
export async function generate1MinAiImage(
  options: ImageGenerationOptions
): Promise<ImageResult | null> {
  const apiKey = get1MinAiApiKey();
  if (!apiKey) {
    console.warn("1min.AI API-nøkkel mangler (1_MIN_AI er ikke konfigurert)");
    return null;
  }

  try {
    const cleanPrompt = options.prompt || "Nordic modern aesthetic";
    const enhancedPrompt = cleanPrompt.includes("photography") || cleanPrompt.includes("8k")
      ? cleanPrompt
      : `Award-winning commercial editorial photography, hyper-realistic, 8k resolution, authentic natural lighting, minimalist Scandinavian aesthetic, magazine quality: ${cleanPrompt}`;

    const payload = {
      type: "IMAGE_GENERATOR",
      model: "black-forest-labs/flux-schnell",
      promptObject: {
        prompt: enhancedPrompt,
        aspect_ratio: options.aspectRatio || "16:9",
        num_inference_steps: 4,
        go_fast: true,
        megapixels: "1",
        output_quality: options.quality || 85,
      },
    };

    const res = await fetch("https://api.1min.ai/api/features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "API-KEY": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("1min.AI image generation failed:", res.status, errText);
      return null;
    }

    const data = await res.json();
    const tempUrl = data?.aiRecord?.temporaryUrl;

    if (tempUrl && typeof tempUrl === "string") {
      return {
        url: tempUrl,
        source: "1min.ai",
        model: "Flux Schnell",
        prompt: options.prompt,
      };
    }

    return null;
  } catch (error) {
    console.error("Feil ved kall til 1min.AI:", error);
    return null;
  }
}

/**
 * 2. Kuratert bibliotek av høyoppløselige Unsplash-bilder tilpasset vanlige norske bransjer.
 * Gir 100 % pålitelighet og umiddelbar rendering uten forsinkelse eller token-forbruk.
 */
export const CURATED_UNSPLASH_GALLERY: Record<
  string,
  {
    hero: string[];
    services: string[];
    portfolio: string[];
    avatars: string[];
  }
> = {
  frisor: {
    hero: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80", // Moderne lys salong
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=80", // Salonginteriør med speil
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80", // Barbershop
    ],
    services: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80", // Klipping
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80", // Farging & balayage
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80", // Styling & vask
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80", // Skjegg & barbering
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    ],
  },
  handverker: {
    hero: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80", // Moderne nordisk trebyggeri
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80", // Lyst skandinavisk treverk
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80", // Eksklusiv moderne villa
    ],
    services: [
      "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?auto=format&fit=crop&w=800&q=80", // Terrasse & uterom
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", // Finsnekring & spiler
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", // Tilbygg & rom
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80", // Verktøy & utførelse
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    ],
  },
  restaurant: {
    hero: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
    ],
    services: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80",
    ],
  },
  helse: {
    hero: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
    ],
    services: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    ],
  },
  tech: {
    hero: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    ],
    services: [
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    ],
  },
  bil: {
    hero: [
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
    ],
    services: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    ],
  },
  trening: {
    hero: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    ],
    services: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    ],
  },
  sjomat: {
    hero: [
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1600&q=80", // Luksuriøst sjømatfat med østers, hummer og kyststemning
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1600&q=80", // Grillet villaks med urter og sitron
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80", // Eksklusiv kystrestaurant med varm belysning
    ],
    services: [
      "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=800&q=80", // Fersk villfangst fra havet
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80", // Kongekrabbe og skalldyr
      "https://images.unsplash.com/photo-1559737558-245ff2011b0e?auto=format&fit=crop&w=800&q=80", // Kamskjell og gourmet-tilberedning
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80", // Vinparring og middagsopplevelse
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80", // Norsk kyst og fjord
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80", // Rustikk nordisk sjømatrestaurant
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", // Kjøkkensjef i full sving
    ],
    avatars: [
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80", // Kjøkkensjef
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=400&q=80", // Hovmester
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80", // Daglig leder
    ],
  },
  kafe: {
    hero: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80", // Lys skandinavisk kaffebar
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80", // Koselig kafé med ferske bakverk
    ],
    services: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80", // Espresso og kaffekunst
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80", // Ferske surdeigsbrød og croissanter
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", // Lunsjretter
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    ],
  },
  bad: {
    hero: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80", // Eksklusivt minimalistisk bad
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80", // Moderne flisarbeid og servant
    ],
    services: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", // Dusjløsninger og armatur
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80", // Flislegging og baderomsmøbler
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", // Rørleggerarbeid
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    ],
  },
  eiendom: {
    hero: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80", // Moderne arkitektonisk villa
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80", // Luksuriøst hjem
    ],
    services: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    ],
  },
  okonomi: {
    hero: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80", // Skandinavisk finans- og forretningsbygg
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80", // Møterom og rådgivning
    ],
    services: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80", // Regnskap og tall
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80", // Juridisk rådgivning
    ],
    portfolio: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    ],
    avatars: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    ],
  },
};

/**
 * Finn matchende kategori basert på tekst/stikkord
 */
export function detectCategory(text: string): keyof typeof CURATED_UNSPLASH_GALLERY {
  const lower = (text || "").toLowerCase();
  if (
    lower.includes("sjømat") ||
    lower.includes("sjomat") ||
    lower.includes("fisk") ||
    lower.includes("hav") ||
    lower.includes("kyst") ||
    lower.includes("skalldyr") ||
    lower.includes("laks") ||
    lower.includes("sushi") ||
    lower.includes("seafood")
  ) {
    return "sjomat";
  }
  if (lower.includes("frisør") || lower.includes("hår") || lower.includes("barber") || lower.includes("salong")) {
    return "frisor";
  }
  if (lower.includes("snekker") || lower.includes("håndverk") || lower.includes("bygg") || lower.includes("terrasse") || lower.includes("maling") || lower.includes("tømrer")) {
    return "handverker";
  }
  if (lower.includes("bad") || lower.includes("rørlegger") || lower.includes("rorlegger") || lower.includes("flis") || lower.includes("våtrom")) {
    return "bad";
  }
  if (lower.includes("kafe") || lower.includes("kafé") || lower.includes("bakeri") || lower.includes("kaffe") || lower.includes("croissant") || lower.includes("konditori")) {
    return "kafe";
  }
  if (lower.includes("restaurant") || lower.includes("mat") || lower.includes("pizza") || lower.includes("meny") || lower.includes("gourmet") || lower.includes("bordbestilling") || lower.includes("catering")) {
    return "restaurant";
  }
  if (lower.includes("eiendom") || lower.includes("bolig") || lower.includes("arkitekt") || lower.includes("hytte") || lower.includes("megler")) {
    return "eiendom";
  }
  if (lower.includes("tannlege") || lower.includes("lege") || lower.includes("klinikk") || lower.includes("helse") || lower.includes("terapi") || lower.includes("fysio") || lower.includes("spa")) {
    return "helse";
  }
  if (lower.includes("regnskap") || lower.includes("økonomi") || lower.includes("advokat") || lower.includes("juridisk") || lower.includes("finans") || lower.includes("revisjon")) {
    return "okonomi";
  }
  if (lower.includes("bil") || lower.includes("verksted") || lower.includes("dekk") || lower.includes("lakk")) {
    return "bil";
  }
  if (lower.includes("trening") || lower.includes("gym") || lower.includes("fitness") || lower.includes("crossfit")) {
    return "trening";
  }
  return "tech";
}

/**
 * Hent et kuratert bilde for gitt kategori eller søkeord
 */
export function getCuratedImage(
  categoryOrKeyword: string,
  section: "hero" | "services" | "portfolio" | "avatars" = "hero",
  index = 0
): ImageResult {
  const cat = detectCategory(categoryOrKeyword);
  const pool = CURATED_UNSPLASH_GALLERY[cat]?.[section] || CURATED_UNSPLASH_GALLERY.tech[section];
  const url = pool[index % pool.length];

  return {
    url,
    source: "unsplash",
    prompt: `${cat} ${section}`,
    category: cat,
  };
}

/**
 * Hent bilde via 1min.AI hvis konfigurert, ellers kuratert Unsplash
 */
export async function getSmartImage(
  prompt: string,
  category?: string,
  aspectRatio: "1:1" | "16:9" | "9:16" = "16:9"
): Promise<ImageResult> {
  // Forsøk 1min.AI først hvis nøkkel er til stede
  const aiResult = await generate1MinAiImage({ prompt, aspectRatio });
  if (aiResult && aiResult.url) {
    return aiResult;
  }

  // Fallback til Unsplash
  return getCuratedImage(category || prompt, "hero", 0);
}
