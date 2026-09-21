import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { ProjectFile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { files = [], projectName = "vikingcode-prosjekt" } = await req.json();

    const zip = new JSZip();

    // Legg til kildekodefiler
    files.forEach((file: ProjectFile) => {
      zip.file(file.path, file.content);
    });

    // Sikre at railway.json alltid er inkludert
    if (!files.some((f: ProjectFile) => f.path === "railway.json")) {
      zip.file(
        "railway.json",
        JSON.stringify(
          {
            $schema: "https://railway.com/railway.schema.json",
            build: {
              builder: "NIXPACKS",
            },
            deploy: {
              startCommand: "npx prisma migrate deploy && npm run start",
              restartPolicyType: "ON_FAILURE",
              restartPolicyMaxRetries: 3,
            },
          },
          null,
          2
        )
      );
    }

    // Generer README.md
    zip.file(
      "README.md",
      `# ${projectName}\n\nGenerert autonomt av **VikingCode** (vikingcode.no).\n\n## Kjøring lokalt\n\`\`\`bash\nnpm install\nnpx prisma generate\nnpm run dev\n\`\`\`\n\n## Distribusjon til Railway\nProsjektet inneholder en ferdig \`railway.json\` for 1-klikks distribusjon med Nixpacks og PostgreSQL.\n`
    );

    const zipBytes = await zip.generateAsync({ type: "uint8array" });

    return new Response(zipBytes as any, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${projectName}.zip"`,
      },
    });
  } catch (error: unknown) {
    console.error("Feil ved generering av ZIP:", error);
    return NextResponse.json(
      { error: "Kunne ikke generere ZIP-arkiv." },
      { status: 500 }
    );
  }
}
