import 'server-only';
import { randomUUID } from 'node:crypto';
import type Stripe from 'stripe';
import {
  isAvailable,
  loadCheckoutProducts,
  releaseReservation,
  reserveProducts,
  ReservationConflictError,
  RESERVATION_MINUTES,
} from './reservations';
import { urlFor } from './sanity/image';
import { writeClient } from './sanity/writeClient';
import { CHECKOUT_SESSION_MINUTES, getStripe } from './stripe';
import { absoluteUrl } from './url';
import type { CheckoutInput } from './validation';

export type CheckoutResult =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; status: 409; error: 'unavailable'; unavailable: string[] }
  | { ok: false; status: 409; error: 'vacation'; message: string }
  | { ok: false; status: 503; error: 'shipping-not-configured' };

type CheckoutSettings = {
  vacationMode?: { enabled?: boolean; message?: string };
  colissimoPrice?: number;
  freeShippingThreshold?: number;
  pickupEnabled?: boolean;
};

/**
 * Reserves the pieces and opens a Stripe Checkout Session. Prices and availability come
 * only from Sanity: the client sends nothing but product ids.
 */
export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  if (input.previousSessionId) await abandonCheckoutSession(input.previousSessionId);

  const [settings, { products, draftIds }] = await Promise.all([
    writeClient.fetch<CheckoutSettings | null>(`*[_id == "settings"][0]`),
    loadCheckoutProducts(input.productIds),
  ]);

  if (settings?.vacationMode?.enabled) {
    return {
      ok: false,
      status: 409,
      error: 'vacation',
      message: settings.vacationMode.message || 'La boutique est en pause.',
    };
  }

  const now = new Date();
  const found = new Set(products.map((p) => p._id));
  const unavailable = [
    ...input.productIds.filter((id) => !found.has(id)),
    ...products.filter((p) => !isAvailable(p, now)).map((p) => p._id),
  ];
  if (unavailable.length > 0) return { ok: false, status: 409, error: 'unavailable', unavailable };

  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  const shippingOptions = buildShippingOptions(settings, subtotal);
  if (shippingOptions.length === 0)
    return { ok: false, status: 503, error: 'shipping-not-configured' };

  const token = randomUUID();
  try {
    await reserveProducts(
      products,
      draftIds,
      token,
      new Date(now.getTime() + RESERVATION_MINUTES * 60_000),
    );
  } catch (error) {
    if (error instanceof ReservationConflictError) {
      // Someone else reserved in the meantime: report what is no longer available.
      const fresh = await loadCheckoutProducts(input.productIds);
      return {
        ok: false,
        status: 409,
        error: 'unavailable',
        unavailable: fresh.products.filter((p) => !isAvailable(p)).map((p) => p._id),
      };
    }
    throw error;
  }

  try {
    const metadata = { productIds: products.map((p) => p._id).join(','), reservationToken: token };
    const session = await getStripe().checkout.sessions.create(
      {
        mode: 'payment',
        locale: 'fr',
        line_items: products.map((p) => ({
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: p.price,
            product_data: {
              name: p.title,
              images: p.image?.asset ? [urlFor(p.image).width(800).height(800).url()] : undefined,
              metadata: { productId: p._id },
            },
          },
        })),
        shipping_address_collection: { allowed_countries: ['FR'] },
        shipping_options: shippingOptions,
        phone_number_collection: { enabled: true },
        consent_collection: { terms_of_service: 'required' },
        custom_text: {
          terms_of_service_acceptance: {
            message: `J’accepte les [conditions générales de vente](${absoluteUrl('/cgv')}).`,
          },
        },
        expires_at: Math.floor(now.getTime() / 1000) + CHECKOUT_SESSION_MINUTES * 60,
        metadata,
        payment_intent_data: { metadata },
        success_url: `${absoluteUrl('/merci')}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: absoluteUrl('/boutique?annule=1'),
      },
      // Same token => Stripe returns the same session if this request is retried.
      { idempotencyKey: `checkout-${token}` },
    );
    if (!session.url) throw new Error('Stripe returned a session without url');
    return { ok: true, url: session.url, sessionId: session.id };
  } catch (error) {
    await releaseReservation(token);
    throw error;
  }
}

function buildShippingOptions(
  settings: CheckoutSettings | null,
  subtotal: number,
): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  const options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [];

  if (typeof settings?.colissimoPrice === 'number') {
    const free =
      typeof settings.freeShippingThreshold === 'number' &&
      subtotal >= settings.freeShippingThreshold;
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: free ? 'Colissimo — offert' : 'Colissimo',
        fixed_amount: { amount: free ? 0 : settings.colissimoPrice, currency: 'eur' },
        metadata: { method: 'colissimo' },
        // TODO(client): add delivery_estimate once Delphine confirms her shipping times.
      },
    });
  }

  if (settings?.pickupEnabled) {
    options.push({
      shipping_rate_data: {
        type: 'fixed_amount',
        display_name: 'Retrait dans la Vaunage',
        fixed_amount: { amount: 0, currency: 'eur' },
        metadata: { method: 'retrait' },
      },
    });
  }

  return options;
}

/**
 * The customer left Stripe (cancel link, back button, new attempt): close that session
 * and put its pieces back on sale right away instead of waiting 30 minutes.
 * The session id is a bearer secret only this browser knows.
 */
export async function abandonCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return; // unknown or foreign session id
  }
  if (session.status !== 'open') return; // already paid or expired: nothing to release
  await stripe.checkout.sessions.expire(sessionId);
  const token = session.metadata?.reservationToken;
  if (token) await releaseReservation(token);
}
