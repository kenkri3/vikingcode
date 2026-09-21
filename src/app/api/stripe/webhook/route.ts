import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe er ikke konfigurert" }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // Fallback i utvikling dersom webhook secret ikke er lagt inn
      event = JSON.parse(rawBody) as Stripe.Event;
    }
  } catch (err: any) {
    console.error("⚠️ [Stripe Webhook] Ugyldig signatur:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId;
        const tokensToAdd = Number(session.metadata?.tokensToAdd || 0);

        if (userId && tokensToAdd > 0) {
          const isSubscription = session.mode === "subscription";

          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: session.customer as string || undefined,
              stripeSubscriptionId: session.subscription as string || undefined,
              plan: isSubscription && planId ? (planId as any) : undefined,
              tokensRemaining: { increment: tokensToAdd },
              trialPromptsUsed: 0, // Nullstill prøveperiode-begrensning ved betaling
            },
          });

          await prisma.tokenUsage.create({
            data: {
              userId,
              tokensUsed: -tokensToAdd, // Negativ = påfylling
              promptAction: `STRIPE_PURCHASE: ${planId || "TOPUP"} (+${tokensToAdd} tokens)`,
            },
          });

          console.log(`✅ [Stripe] Krediterte ${tokensToAdd} tokens til bruker ${userId} (${planId}).`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const subscriptionId = (invoice as any).subscription || (invoice as any).parent?.subscription_details?.subscription;

        if (customerId && subscriptionId) {
          // Finn bruker basert på stripeCustomerId
          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId },
          });

          if (user) {
            // Fastsett månedlige tokens basert på brukerens plan
            let monthlyTokens = 500000;
            if (user.plan === "PRO") monthlyTokens = 1500000;
            if (user.plan === "MESTER") monthlyTokens = 5000000;

            await prisma.user.update({
              where: { id: user.id },
              data: {
                tokensRemaining: { increment: monthlyTokens },
              },
            });

            console.log(`✅ [Stripe] Fornyet månedskvote for ${user.email} (${user.plan}): +${monthlyTokens} tokens.`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        if (customerId) {
          await prisma.user.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
              plan: "TRIAL",
              stripeSubscriptionId: null,
            },
          });
          console.log(`ℹ️ [Stripe] Abonnement avsluttet for kunde ${customerId}, nedgradert til TRIAL.`);
        }
        break;
      }

      default:
        // Andre hendelser logges stille
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Feil ved behandling av Stripe Webhook:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
