import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INITIAL_PROJECTS, createNewProject } from "@/lib/projects-data";
import { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get("aiprogram_session");
    let userId: string | null = null;
    if (cookie?.value) {
      try {
        const u = JSON.parse(cookie.value);
        userId = u.id;
      } catch {}
    }

    if (userId) {
      try {
        const dbProjects = await prisma.project.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        });

        if (dbProjects && dbProjects.length > 0) {
          const formatted: Project[] = dbProjects.map((p) => ({
            id: p.id,
            userId: p.userId,
            name: p.name,
            description: p.description || "",
            files: (p.filesJson as any) || [],
            hasDatabase: p.hasDatabase,
            githubRepo: p.githubRepo || undefined,
            railwayId: p.railwayId || undefined,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }));
          return NextResponse.json({ success: true, projects: formatted });
        }
      } catch (dbErr) {
        console.warn("DB projects lookup fallback:", dbErr);
      }
    }

    // Default return initial production templates
    return NextResponse.json({ success: true, projects: INITIAL_PROJECTS });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { success: false, error: "Kunne ikke hente prosjekter.", projects: INITIAL_PROJECTS },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, project, name, description } = body;

    // 1. Opprett nytt prosjekt
    if (action === "create" || (name && !project)) {
      const newProj = createNewProject(name || "Nytt Prosjekt", description);

      const cookie = req.cookies.get("aiprogram_session");
      if (cookie?.value) {
        try {
          const u = JSON.parse(cookie.value);
          await prisma.project.create({
            data: {
              id: newProj.id,
              userId: u.id,
              name: newProj.name,
              description: newProj.description,
              filesJson: newProj.files as any,
              hasDatabase: newProj.hasDatabase,
              githubRepo: newProj.githubRepo,
              railwayId: newProj.railwayId,
            },
          });
        } catch (dbErr) {
          console.warn("Could not save new project to DB:", dbErr);
        }
      }

      return NextResponse.json({ success: true, project: newProj });
    }

    // 2. Oppdater eksisterende prosjekt
    if (project && project.id) {
      const cookie = req.cookies.get("aiprogram_session");
      if (cookie?.value) {
        try {
          const u = JSON.parse(cookie.value);
          await prisma.project.upsert({
            where: { id: project.id },
            update: {
              name: project.name,
              description: project.description,
              filesJson: project.files as any,
              updatedAt: new Date(),
            },
            create: {
              id: project.id,
              userId: u.id,
              name: project.name,
              description: project.description,
              filesJson: project.files as any,
              hasDatabase: project.hasDatabase ?? true,
              githubRepo: project.githubRepo,
              railwayId: project.railwayId,
            },
          });
        } catch (dbErr) {
          console.warn("Could not upsert project in DB:", dbErr);
        }
      }

      return NextResponse.json({ success: true, project });
    }

    return NextResponse.json({ success: false, error: "Ugyldig handling." }, { status: 400 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Mangler prosjekt-id." }, { status: 400 });
    }

    try {
      await prisma.project.delete({ where: { id } });
    } catch {}

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
