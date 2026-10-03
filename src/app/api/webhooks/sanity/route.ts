import * as Sentry from '@sentry/nextjs';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { serverEnv } from '@/lib/env.server';
import { notifyOrderShipped } from '@/lib/shipping';

type WebhookBody = { _id: string; _type: string };

// Cache tags used by src/lib/sanity/data.ts. Products appear inside collection queries too.
const tagsByType: Record<string, string[]> = {
  product: ['product', 'collection'],
  collection: ['collection'],
  page: ['page'],
  settings: ['settings'],
};

/**
 * One GROQ-powered webhook in Sanity (see README): publishes of storefront content
 * revalidate the cache; an order switching to "shipped" triggers the shipping e-mail.
 */
export async function POST(request: NextRequest) {
  const secret = serverEnv.SANITY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'not-configured' }, { status: 503 });

  const { isValidSignature, body } = await parseBody<WebhookBody>(request, secret, true);
  if (!isValidSignature || !body?._type) {
    return NextResponse.json({ error: 'invalid-signature' }, { status: 401 });
  }

  try {
    if (body._type === 'order') {
      const result = await notifyOrderShipped(body._id);
      return NextResponse.json({ order: result });
    }

    const tags = tagsByType[body._type] ?? [];
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
    return NextResponse.json({ revalidated: tags });
  } catch (error) {
    Sentry.captureException(error, { extra: { documentId: body._id, type: body._type } });
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
