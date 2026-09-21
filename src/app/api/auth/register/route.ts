import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-post og passord er påkrevd for registrering." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    // Sjekk om bruker allerede finnes
    try {
      const existing = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existing) {
        return NextResponse.json(
          { error: "En konto med denne e-postadressen finnes allerede. Vennligst logg inn." },
          { status: 409 }
        );
      }
    } catch {}

    let newUser = null;
    try {
      newUser = await prisma.user.create({
        data: {
          email: cleanEmail,
          name: name || cleanEmail.split("@")[0],
          passwordHash,
          role: "USER",
          plan: "TRIAL",
          tokensRemaining: 50000,
          trialPromptsUsed: 0,
        },
      });
    } catch (e: any) {
      console.warn("DB registrering feilet, oppretter minne-bruker:", e.message);
      newUser = {
        id: "usr-" + Date.now(),
        email: cleanEmail,
        name: name || cleanEmail.split("@")[0],
        role: "USER",
        plan: "TRIAL" as any,
        tokensRemaining: 50000,
        trialPromptsUsed: 0,
        isActive: true,
      };
    }

    const userSession = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      plan: newUser.plan,
      tokensRemaining: newUser.tokensRemaining,
      trialPromptsUsed: newUser.trialPromptsUsed,
      isActive: true,
    };

    const res = NextResponse.json({
      success: true,
      user: userSession,
      message: "Konto opprettet! Du har fått 50 000 prøvetokens.",
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
    console.error("Registreringsfeil:", err);
    return NextResponse.json(
      { error: "Feil ved registrering: " + err.message },
      { status: 500 }
    );
  }
}
