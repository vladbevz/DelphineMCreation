import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/checkout';
import { isStripeConfigured } from '@/lib/stripe';
import { checkoutSchema } from '@/lib/validation';
import { isSanityConfigured } from '@/sanity/env';

export async function POST(request: Request) {
  if (!isSanityConfigured || !isStripeConfigured) {
    return NextResponse.json({ error: 'not-configured' }, { status: 503 });
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid-request' }, { status: 400 });
  }

  try {
    const result = await createCheckout(parsed.data);
    if (result.ok) return NextResponse.json({ url: result.url, sessionId: result.sessionId });
    const { status, ...body } = result;
    return NextResponse.json(body, { status });
  } catch (error) {
    Sentry.captureException(error, { extra: { productIds: parsed.data.productIds } });
    return NextResponse.json({ error: 'server-error' }, { status: 500 });
  }
}
