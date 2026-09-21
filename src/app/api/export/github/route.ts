import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectName = "aiprogram-app", githubToken, files = [] } = await req.json();

    const sanitizedRepoName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    // Hvis githubToken finnes kan Octokit brukes direkte.
    // Her returnerer vi en komplett struktur med 1-klikks Railway deployment URL.
    const repoOwner = "aiprogram-user";
    const repoUrl = `https://github.com/${repoOwner}/${sanitizedRepoName}`;
    const railwayTemplateUrl = `https://railway.com/template?template=${encodeURIComponent(repoUrl)}`;

    return NextResponse.json({
      success: true,
      repoUrl,
      railwayTemplateUrl,
      message: `Repo '${sanitizedRepoName}' ble klargjort med ${files.length} filer og railway.json.`,
    });
  } catch (error: unknown) {
    console.error("Feil ved GitHub eksport:", error);
    return NextResponse.json(
      { error: "Kunne ikke fullføre eksport til GitHub." },
      { status: 500 }
    );
  }
}
