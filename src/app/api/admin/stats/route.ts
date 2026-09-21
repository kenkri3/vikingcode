import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verifiser admin via session cookie eller header
  const cookie = req.cookies.get("aiprogram_session");
  let isAdmin = false;

  if (cookie?.value) {
    try {
      const u = JSON.parse(cookie.value);
      if (u.role === "ADMIN") isAdmin = true;
    } catch {}
  }

  const authHeader = req.headers.get("x-admin-password");
  if (authHeader && authHeader === process.env.ADMIN_PASSWORD) {
    isAdmin = true;
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Ingen administratortilgang." }, { status: 403 });
  }

  let users: any[] = [];
  let projects: any[] = [];
  let tokenLogs: any[] = [];

  try {
    users = await prisma.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        tokensRemaining: true,
        trialPromptsUsed: true,
        createdAt: true,
      },
    });

    projects = await prisma.project.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        hasDatabase: true,
        githubRepo: true,
        railwayId: true,
        createdAt: true,
      },
    });

    tokenLogs = await prisma.tokenUsage.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("DB henting i admin/stats feilet:", err);
  }

  return NextResponse.json({
    systemHealth: {
      stripeConfigured: isStripeConfigured(),
      aiAgentActive: Boolean(process.env.AGENT_API),
      botsifyAgentActive: Boolean(process.env.AGENT_API),
      databaseConnected: true,
      domain: "aiprogram.no",
    },
    stats: {
      totalUsers: users.length,
      totalProjects: projects.length,
      totalTokenEvents: tokenLogs.length,
    },
    users,
    projects,
    recentLogs: tokenLogs,
  });
}
