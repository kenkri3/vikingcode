import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Vennligst oppgi både e-post og passord." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Sjekk for ADMIN_EMAIL og ADMIN_PASSWORD fra Railway miljøvariabler
    const adminEmail = (process.env.ADMIN_EMAIL || "admin@aiprogram.no").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "vikingAdmin2026!";

    if (cleanEmail === adminEmail && password === adminPassword) {
      console.log(`🔐 [Auth] Administrator logget inn: ${adminEmail}`);

      const adminUser = {
        id: "superadmin-master-id",
        email: adminEmail,
        name: "Administrator (VikingCode / AIProgram)",
        role: "ADMIN",
        plan: "MESTER",
        tokensRemaining: 99999999,
        trialPromptsUsed: 0,
        isActive: true,
      };

      const res = NextResponse.json({
        success: true,
        user: adminUser,
        message: "Logget inn som administrator med fulle rettigheter.",
      });

      // Sett sikker sesjons-cookie
      res.cookies.set("aiprogram_session", JSON.stringify(adminUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 dager
      });

      return res;
    }

    // 2. Sjekk ordinær bruker i PostgreSQL via Prisma
    let dbUser = null;
    try {
      dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbErr) {
      console.warn("DB feil ved innlogging:", dbErr);
    }

    if (!dbUser) {
      return NextResponse.json(
        { error: "Ingen bruker funnet med denne e-postadressen." },
        { status: 401 }
      );
    }

    // Passordsjekk dersom passord er lagret
    if (dbUser.passwordHash) {
      const hash = crypto.createHash("sha256").update(password).digest("hex");
      if (hash !== dbUser.passwordHash) {
        return NextResponse.json(
          { error: "Ugyldig passord." },
          { status: 401 }
        );
      }
    }

    const userSession = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || "Kunde",
      role: dbUser.role || "USER",
      plan: dbUser.plan,
      tokensRemaining: dbUser.tokensRemaining,
      trialPromptsUsed: dbUser.trialPromptsUsed,
      isActive: dbUser.isActive,
    };

    const res = NextResponse.json({
      success: true,
      user: userSession,
    });

    res.cookies.set("aiprogram_session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err: any) {
    console.error("Innloggingsfeil:", err);
    return NextResponse.json(
      { error: "Intern innloggingsfeil: " + err.message },
      { status: 500 }
    );
  }
}
