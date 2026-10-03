import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { serverEnv } from '@/lib/env.server';
import { handleCheckoutCompleted, handleCheckoutReleased } from '@/lib/orders';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  const secret = serverEnv.STRIPE_WEBHOOK_SECRET;
  if (!isStripeConfigured || !secret) {
    return NextResponse.json({ error: 'not-configured' }, { status: 503 });
  }

  // The signature is computed on the raw body: read it as text, never as JSON.
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature ?? '', secret);
  } catch {
    return NextResponse.json({ error: 'invalid-signature' }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded':
        await handleCheckoutCompleted(session.id);
        break;
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed':
        await handleCheckoutReleased(session);
        break;
      default:
        // Other events are not subscribed to; acknowledge them anyway.
        break;
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { stripeEvent: event.type },
      extra: { eventId: event.id, sessionId: session.id },
    });
    // 500 makes Stripe retry later; handlers are idempotent, so a retry is safe.
    return NextResponse.json({ error: 'processing-failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
