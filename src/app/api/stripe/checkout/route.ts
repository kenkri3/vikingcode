import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_TIERS, isStripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, userId, userEmail } = body;

    const tier = STRIPE_TIERS[planId];
    if (!tier) {
      return NextResponse.json(
        { error: `Ugyldig pakke: '${planId}'` },
        { status: 400 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.nextUrl.origin ||
      "https://aiprogram.no";

    // Hvis Stripe ikke er satt opp ennå, returner en trygg simulering
    if (!isStripeConfigured() || !stripe) {
      console.warn("⚠️ [Stripe] STRIPE_SECRET_KEY mangler i Railway. Kjører i demo/simulert modus.");

      // Oppgrader lokalt i databasen hvis mulig for testing
      if (userId) {
        try {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: tier.interval === "month" ? (planId as any) : undefined,
              tokensRemaining: { increment: tier.tokens },
            },
          });
        } catch {}
      }

      return NextResponse.json({
        simulated: true,
        message: `Stripe-nøkler er ikke lagt inn i Railway ennå. Testbruker ble simulert oppgradert med ${tier.tokens.toLocaleString("no-NO")} tokens.`,
        url: `${appUrl}/app?checkout_success=${planId}&simulated=true`,
      });
    }

    // Finn eksisterende Stripe-kunde eller opprett
    let customerId: string | undefined = undefined;
    if (userId) {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.stripeCustomerId) {
          customerId = user.stripeCustomerId;
        }
      } catch {}
    }

    const isSubscription = tier.interval === "month";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      customer_email: customerId ? undefined : (userEmail || undefined),
      billing_address_collection: "auto",
      tax_id_collection: { enabled: true }, // Norsk MVA-håndtering (organisasjonsnummer)
      line_items: [
        {
          price_data: {
            currency: "nok",
            product_data: {
              name: `AIProgram.no — ${tier.name}`,
              description: tier.description,
            },
            unit_amount: tier.priceOre,
            ...(isSubscription
              ? { recurring: { interval: "month" } }
              : {}),
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? "subscription" : "payment",
      success_url: `${appUrl}/app?checkout_success=${planId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#priser`,
      metadata: {
        userId: userId || "",
        userEmail: userEmail || "",
        planId: planId,
        tokensToAdd: String(tier.tokens),
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Feil ved oppretting av Stripe Checkout session:", error);
    return NextResponse.json(
      { error: "Kunne ikke starte betalingsprosess: " + error.message },
      { status: 500 }
    );
  }
}
