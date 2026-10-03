'use server';

import * as Sentry from '@sentry/nextjs';
import { abandonCheckoutSession } from '@/lib/checkout';
import { getCartProducts } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { cartIdsSchema, stripeSessionIdSchema } from '@/lib/validation';

export type CartItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  availability: 'available' | 'reserved' | 'sold';
  imageUrl: string | null;
  imageAlt: string;
};

/**
 * Current data for the ids stored in the browser cart. Unknown ids are dropped.
 * Pieces reserved by this browser's own unfinished Stripe session count as available.
 */
export async function getCartItems(ids: unknown, pendingSessionId?: unknown): Promise<CartItem[]> {
  const parsed = cartIdsSchema.safeParse(ids);
  if (!parsed.success) return [];

  const [products, ownToken] = await Promise.all([
    getCartProducts(parsed.data),
    reservationTokenOf(pendingSessionId),
  ]);
  const now = new Date();

  return products.map((p) => {
    const reserved =
      p.status === 'reserved' &&
      (!p.reservedUntil || new Date(p.reservedUntil) > now) &&
      !(ownToken && p.reservationToken === ownToken);
    return {
      _id: p._id,
      title: p.title,
      slug: p.slug,
      price: p.price,
      availability: p.status === 'sold' ? 'sold' : reserved ? 'reserved' : 'available',
      imageUrl: p.image?.asset ? urlFor(p.image).width(160).height(200).url() : null,
      imageAlt: p.image?.alt ?? p.title,
    };
  });
}

/** Called when the customer comes back from Stripe without paying. */
export async function abandonCheckout(sessionId: unknown) {
  const parsed = stripeSessionIdSchema.safeParse(sessionId);
  if (!parsed.success || !isStripeConfigured) return;
  try {
    await abandonCheckoutSession(parsed.data);
  } catch (error) {
    Sentry.captureException(error, { extra: { sessionId: parsed.data } });
  }
}

async function reservationTokenOf(sessionId: unknown) {
  const parsed = stripeSessionIdSchema.safeParse(sessionId);
  if (!parsed.success || !isStripeConfigured) return null;
  try {
    const session = await getStripe().checkout.sessions.retrieve(parsed.data);
    return session.status === 'open' ? (session.metadata?.reservationToken ?? null) : null;
  } catch {
    return null;
  }
}
