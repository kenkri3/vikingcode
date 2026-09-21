import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "https://aiprogram.no";

    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({
        simulated: true,
        message: "Stripe er ikke konfigurert i miljøvariablene ennå.",
        url: `${appUrl}/app`,
      });
    }

    if (!userId) {
      return NextResponse.json({ error: "Mangler userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "Ingen aktiv Stripe-kundekonto funnet for denne brukeren." },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error("Feil ved oppretting av kundeportal:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
