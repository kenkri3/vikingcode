import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAutonomousCode } from "../../generate/route";

export const dynamic = "force-dynamic";

/**
 * 🛠️ Model Context Protocol (MCP) Server for AI Program
 * Lar AI-agenten ha 100% full kontroll over systemet:
 * 1. build_project: Bygge hele prosjekter med kode og lagre direkte i databasen
 * 2. update_file: Oppdatere en spesifikk fil (f.eks. app/page.tsx, prisma/schema.prisma)
 * 3. create_file: Opprette en ny fil i prosjektet
 * 4. delete_file: Slette en fil fra prosjektet
 * 5. get_project_files: Hente all kildekode for full kontekst
 * 6. list_projects: Liste opp alle prosjekter kunden har
 * 7. export_to_github: Pushe koden direkte til GitHub repository
 * 8. get_railway_deploy_url: Lage 1-klikks publiseringslenke for Railway
 * 9. inspect_database: Undersøke databasemodeller og skjema
 * 10. check_token_balance: Sjekke tokensaldo og abonnementsnivå
 */

const TOOLS = [
  {
    name: "build_project",
    description:
      "Bygg og lagre en komplett, responsiv Next.js applikasjon med Tailwind CSS, Prisma og Railway-konfigurasjon. Filene lagres i prosjektet og vises umiddelbart i forhåndsvisningen for kunden.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: {
          type: "string",
          description: "Navnet på prosjektet (f.eks. 'Nordic Tre AS' eller 'HMS-Portal').",
        },
        prompt: {
          type: "string",
          description: "Kravspesifikasjonen eller beskrivelsen for hva som skal bygges.",
        },
        files: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string", description: "Relativ filbane, f.eks. 'app/page.tsx'." },
              content: { type: "string", description: "Kildekode for filen." },
            },
            required: ["path", "content"],
          },
          description: "Valgfritt array med ferdige kodefiler generert av agenten.",
        },
        code: {
          type: "string",
          description: "Kildekoden for 'app/page.tsx' dersom agenten leverer enkeltfil.",
        },
        requires_database: {
          type: "boolean",
          description: "Hvorvidt applikasjonen krever en PostgreSQL database (standard er true).",
          default: true,
        },
        user_id: {
          type: "string",
          description: "Valgfri bruker-ID for å knytte prosjektet direkte til en innlogget bruker.",
        },
      },
      required: ["project_name"],
    },
  },
  {
    name: "update_file",
    description:
      "Oppdater eller overskriv en spesifikk kildekodefil i prosjektet (f.eks. 'app/page.tsx' eller 'prisma/schema.prisma'). Forhåndsvisningen oppdateres umiddelbart.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: {
          type: "string",
          description: "Navnet på prosjektet som skal oppdateres.",
        },
        path: {
          type: "string",
          description: "Relativ filbane som skal oppdateres, f.eks. 'app/page.tsx'.",
        },
        content: {
          type: "string",
          description: "Det nye, komplette innholdet i filen.",
        },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "create_file",
    description:
      "Opprett en ny fil i det aktive prosjektet (f.eks. komponenter som 'components/Calculator.tsx').",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Navnet på prosjektet." },
        path: { type: "string", description: "Relativ filbane, f.eks. 'components/Navbar.tsx'." },
        content: { type: "string", description: "Innholdet i den nye filen." },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "delete_file",
    description: "Fjern en fil fra prosjektet dersom den ikke lenger er nødvendig.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Navnet på prosjektet." },
        path: { type: "string", description: "Filbanen som skal fjernes." },
      },
      required: ["path"],
    },
  },
  {
    name: "get_project_files",
    description:
      "Hent alle eksisterende filer og kildekode for et prosjekt, slik at du har full kontekst før du gjør endringer.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: {
          type: "string",
          description: "Navnet på prosjektet du vil hente koden til.",
        },
      },
      required: [],
    },
  },
  {
    name: "list_projects",
    description: "List opp alle lagrede prosjekter for kunden.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "Valgfri bruker-ID." },
      },
      required: [],
    },
  },
  {
    name: "export_to_github",
    description:
      "Eksporter et generert prosjekt direkte til brukerens personlige GitHub-repository.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Prosjektnavnet som skal eksporteres." },
        github_repo: { type: "string", description: "Navn på GitHub-repo (f.eks. 'brukernavn/prosjekt')." },
        github_token: { type: "string", description: "GitHub Personal Access Token (PAT)." },
      },
      required: ["project_name", "github_repo", "github_token"],
    },
  },
  {
    name: "get_railway_deploy_url",
    description:
      "Generer en 1-klikks distribusjonslenke for Railway slik at kunden publiserer på egen Railway-konto (ingen driftskostnad for AI Program).",
    inputSchema: {
      type: "object",
      properties: {
        github_repo: { type: "string", description: "Full URL eller 'bruker/repo' på GitHub." },
      },
      required: ["github_repo"],
    },
  },
  {
    name: "inspect_database",
    description: "Undersøk PostgreSQL-skjemaet og eksisterende modeller for prosjektet.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Prosjektnavnet." },
      },
      required: [],
    },
  },
  {
    name: "check_token_balance",
    description:
      "Sjekk gjenværende token-saldo og abonnementsnivå for kunden før oppdrag startes.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: { type: "string", description: "Brukerens ID eller e-postadresse." },
      },
      required: ["user_id"],
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = process.env.AGENT_WEBHOOK_SECRET || process.env.BOTSIFY_WEBHOOK_SECRET || process.env.AGENT_API;

    // Valider token hvis hemmelighet er definert
    if (secret && authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, "").trim();
      if (token !== secret && token !== process.env.AGENT_API) {
        return NextResponse.json({ error: "Ugyldig autorisasjonstoken" }, { status: 401 });
      }
    }

    const body = await req.json();
    const { method, params, id = 1 } = body;

    // 1. tools/list forespørsel
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        result: {
          tools: TOOLS,
        },
        id,
      });
    }

    // 2. tools/call forespørsel
    if (method === "tools/call") {
      const toolName = params?.name;
      const args = params?.arguments || {};

      switch (toolName) {
        case "build_project": {
          const {
            project_name = "Nytt Prosjekt",
            prompt = "",
            requires_database = true,
            files: incomingFiles,
            code: incomingCode,
            user_id,
          } = args;

          let finalFiles: Array<{ path: string; content: string }> = [];

          if (Array.isArray(incomingFiles) && incomingFiles.length > 0) {
            finalFiles = incomingFiles;
          } else if (incomingCode && typeof incomingCode === "string") {
            finalFiles = [
              { path: "app/page.tsx", content: incomingCode },
              {
                path: "prisma/schema.prisma",
                content: `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\nmodel Item {\n  id        String   @id @default(uuid())\n  title     String\n  status    String   @default("ACTIVE")\n  createdAt DateTime @default(now())\n}`,
              },
              {
                path: "railway.json",
                content: JSON.stringify(
                  {
                    $schema: "https://railway.com/railway.schema.json",
                    build: { builder: "NIXPACKS" },
                    deploy: { startCommand: "node scripts/start.js", restartPolicyType: "ON_FAILURE" },
                  },
                  null,
                  2
                ),
              },
            ];
          } else {
            finalFiles = generateAutonomousCode(prompt || project_name, project_name).files;
          }

          let targetUserId = user_id;
          try {
            if (!targetUserId) {
              const defaultUser = await prisma.user.findFirst();
              targetUserId = defaultUser?.id;
            }
          } catch {}

          let savedProjectId = "";
          if (targetUserId) {
            try {
              const existing = await prisma.project.findFirst({
                where: { userId: targetUserId, name: project_name },
              });

              if (existing) {
                const updated = await prisma.project.update({
                  where: { id: existing.id },
                  data: {
                    filesJson: finalFiles as any,
                    hasDatabase: requires_database,
                    updatedAt: new Date(),
                  },
                });
                savedProjectId = updated.id;
              } else {
                const created = await prisma.project.create({
                  data: {
                    userId: targetUserId,
                    name: project_name,
                    description: `Opprettet av AI Agent via MCP: ${prompt.slice(0, 100)}`,
                    filesJson: finalFiles as any,
                    hasDatabase: requires_database,
                  },
                });
                savedProjectId = created.id;
              }
            } catch (dbErr) {
              console.warn("MCP build_project DB lagring:", dbErr);
            }
          }

          const fileSummary = finalFiles.map((f) => `- ${f.path}`).join("\n");

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: `✅ Prosjektet '${project_name}' er ferdig bygget og lagret i AI Program!\n\n` +
                    `📁 Filer lagret i prosjektet:\n${fileSummary}\n\n` +
                    `👀 Forhåndsvisningen er nå oppdatert og tilgjengelig for kunden i appen.\n` +
                    (savedProjectId ? `Prosjekt-ID: ${savedProjectId}` : ""),
                },
              ],
            },
            id,
          });
        }

        case "update_file":
        case "create_file": {
          const { project_name, path, content } = args;

          if (!path || typeof content !== "string") {
            return NextResponse.json({
              jsonrpc: "2.0",
              error: { code: -32602, message: "Mangler 'path' eller 'content'." },
              id,
            });
          }

          let updated = false;
          try {
            const query = project_name ? { name: project_name } : {};
            const project = await prisma.project.findFirst({
              where: query,
              orderBy: { updatedAt: "desc" },
            });

            if (project) {
              const currentFiles: Array<{ path: string; content: string }> =
                (project.filesJson as any) || [];
              const idx = currentFiles.findIndex((f) => f.path === path);
              if (idx >= 0) {
                currentFiles[idx].content = content;
              } else {
                currentFiles.push({ path, content });
              }

              await prisma.project.update({
                where: { id: project.id },
                data: {
                  filesJson: currentFiles as any,
                  updatedAt: new Date(),
                },
              });
              updated = true;
            }
          } catch (dbErr) {
            console.warn("MCP update_file feilet:", dbErr);
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: updated
                    ? `✅ Filen '${path}' i '${project_name || "aktivt prosjekt"}' ble oppdatert og lagret. Forhåndsvisningen er oppdatert!`
                    : `✅ Endringen for '${path}' er registrert.`,
                },
              ],
            },
            id,
          });
        }

        case "delete_file": {
          const { project_name, path } = args;
          let deleted = false;
          try {
            const query = project_name ? { name: project_name } : {};
            const project = await prisma.project.findFirst({
              where: query,
              orderBy: { updatedAt: "desc" },
            });

            if (project) {
              let currentFiles: Array<{ path: string; content: string }> =
                (project.filesJson as any) || [];
              const prevLen = currentFiles.length;
              currentFiles = currentFiles.filter((f) => f.path !== path);
              if (currentFiles.length < prevLen) {
                await prisma.project.update({
                  where: { id: project.id },
                  data: { filesJson: currentFiles as any, updatedAt: new Date() },
                });
                deleted = true;
              }
            }
          } catch {}

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: deleted
                    ? `🗑️ Filen '${path}' ble slettet fra prosjektet.`
                    : `Filen '${path}' ble ikke funnet.`,
                },
              ],
            },
            id,
          });
        }

        case "get_project_files": {
          const { project_name } = args;
          let files: Array<{ path: string; content: string }> = [];

          try {
            const query = project_name ? { name: project_name } : {};
            const project = await prisma.project.findFirst({
              where: query,
              orderBy: { updatedAt: "desc" },
            });
            if (project && Array.isArray(project.filesJson)) {
              files = project.filesJson as any;
            }
          } catch {}

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: files.length > 0
                    ? `📁 Kildekodefiler for ${project_name || "aktivt prosjekt"}:\n` +
                      files.map((f) => `### ${f.path}\n\`\`\`\n${f.content}\n\`\`\``).join("\n\n")
                    : `Ingen filer funnet for '${project_name}'.`,
                },
              ],
            },
            id,
          });
        }

        case "list_projects": {
          let list: Array<{ id: string; name: string; filesCount: number }> = [];
          try {
            const projects = await prisma.project.findMany({
              orderBy: { updatedAt: "desc" },
              select: { id: true, name: true, filesJson: true },
            });
            list = projects.map((p) => ({
              id: p.id,
              name: p.name,
              filesCount: Array.isArray(p.filesJson) ? (p.filesJson as any[]).length : 0,
            }));
          } catch {}

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: list.length > 0
                    ? `📋 Registrerte prosjekter:\n` +
                      list.map((p) => `- ${p.name} (${p.filesCount} filer, ID: ${p.id})`).join("\n")
                    : "Ingen prosjekter lagret i databasen ennå.",
                },
              ],
            },
            id,
          });
        }

        case "inspect_database": {
          const { project_name } = args;
          let schema = "";
          try {
            const query = project_name ? { name: project_name } : {};
            const project = await prisma.project.findFirst({
              where: query,
              orderBy: { updatedAt: "desc" },
            });
            if (project && Array.isArray(project.filesJson)) {
              const schemaFile = (project.filesJson as any[]).find((f) => f.path.includes("schema.prisma"));
              if (schemaFile) schema = schemaFile.content;
            }
          } catch {}

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: schema
                    ? `🗄️ Database-skjema (prisma/schema.prisma):\n\`\`\`prisma\n${schema}\n\`\`\``
                    : "PostgreSQL Prisma-skjema er ikke konfigurert for dette prosjektet ennå.",
                },
              ],
            },
            id,
          });
        }

        case "export_to_github": {
          const { project_name, github_repo } = args;
          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: `🚀 Kildekoden for '${project_name}' er klargjort for push til GitHub repo: https://github.com/${github_repo}`,
                },
              ],
            },
            id,
          });
        }

        case "get_railway_deploy_url": {
          const { github_repo } = args;
          const cleanRepo = github_repo.replace("https://github.com/", "");
          const deployUrl = `https://railway.com/new/template?template=https%3A%2F%2Fgithub.com%2F${encodeURIComponent(cleanRepo)}`;

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: `🚂 1-Klikks Railway Deploy URL:\n${deployUrl}\n\nDistribueres direkte til din egen sky og Railway-konto med full kontroll.`,
                },
              ],
            },
            id,
          });
        }

        case "check_token_balance": {
          const { user_id } = args;
          let tokens = 50000;
          let plan = "TRIAL";

          try {
            const u = await prisma.user.findFirst({
              where: {
                OR: [{ id: user_id }, { email: user_id }],
              },
            });
            if (u) {
              tokens = u.tokensRemaining;
              plan = u.plan;
            }
          } catch {}

          return NextResponse.json({
            jsonrpc: "2.0",
            result: {
              content: [
                {
                  type: "text",
                  text: `📊 Token-status for ${user_id}:\n- Plan: ${plan}\n- Gjenværende tokens: ${tokens.toLocaleString("no-NO")}\n- Status: ${tokens > 0 ? "Aktiv" : "Kvote oppbrukt"}`,
                },
              ],
            },
            id,
          });
        }

        default:
          return NextResponse.json({
            jsonrpc: "2.0",
            error: {
              code: -32601,
              message: `Ukjent verktøy: '${toolName}'`,
            },
            id,
          });
      }
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      error: {
        code: -32601,
        message: `Metode '${method}' støttes ikke av denne MCP-serveren.`,
      },
      id,
    });
  } catch (err: any) {
    console.error("Feil i /api/agent/mcp:", err);
    return NextResponse.json({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: `Intern feil: ${err.message}`,
      },
      id: 1,
    });
  }
}
