import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { projectName = "vikingcode-app", files = [] } = await req.json();

    const deploymentId = "rw_dep_" + Math.random().toString(36).substring(2, 9);
    const domainName = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-prod.up.railway.app`;
    const deploymentUrl = `https://${domainName}`;

    // Simulert Railway GraphQL provisjonering med PostgreSQL database og Nixpacks
    return NextResponse.json({
      success: true,
      deploymentId,
      deploymentUrl,
      databaseProvisioned: true,
      databaseType: "PostgreSQL 16",
      status: "BUILDING_NIXPACKS",
      message: `Prosjektet '${projectName}' distribueres nå til Railway med automatiske databasemigreringer.`,
    });
  } catch (error: unknown) {
    console.error("Feil ved Railway deploy:", error);
    return NextResponse.json(
      { error: "Kunne ikke starte distribusjon til Railway." },
      { status: 500 }
    );
  }
}
