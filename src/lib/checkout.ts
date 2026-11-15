import 'server-only';
import type Stripe from 'stripe';
import { shippingDaysFor, splitQuantity } from './delivery';
import { urlFor } from './sanity/image';
import { writeClient } from './sanity/writeClient';
import { getStripe } from './stripe';
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
  shippingDays?: number;
  madeToOrderDays?: number;
};

type CheckoutProduct = {
  _id: string;
  title: string;
  price: number;
  stock: number;
  image: { asset?: { _ref: string } } | null;
};

/**
 * Opens a Stripe Checkout Session. Prices come only from Sanity: the client sends nothing
 * but product ids and quantities. Every piece is always for sale (what is not in stock is
 * made to order), so nothing is reserved: the stock is decremented by the webhook, once paid.
 */
export async function createCheckout(input: CheckoutInput): Promise<CheckoutResult> {
  const ids = input.items.map((i) => i.productId);
  const { settings, products } = await writeClient.fetch<{
    settings: CheckoutSettings | null;
    products: CheckoutProduct[];
  }>(
    `{
      "settings": *[_id == "settings"][0],
      // Published, complete products only (same rule as the storefront).
      "products": *[_type == "product" && _id in $ids && defined(slug.current) && count(images) > 0]{
        _id, title, price, "stock": coalesce(stock, 0), "image": images[0]
      }
    }`,
    { ids },
  );

  if (settings?.vacationMode?.enabled) {
    return {
      ok: false,
      status: 409,
      error: 'vacation',
      message: settings.vacationMode.message || 'La boutique est en pause.',
    };
  }

  const byId = new Map(products.map((p) => [p._id, p]));
  const unavailable = ids.filter((id) => !byId.get(id) || typeof byId.get(id)?.price !== 'number');
  if (unavailable.length > 0) return { ok: false, status: 409, error: 'unavailable', unavailable };

  const lines = input.items.map((item) => ({ product: byId.get(item.productId)!, ...item }));
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  const shippingOptions = buildShippingOptions(settings, subtotal);
  if (shippingOptions.length === 0) {
    return { ok: false, status: 503, error: 'shipping-not-configured' };
  }

  // Shown above the pay button: the delivery delay must be stated before payment (L216-1).
  const needsMaking = lines.some((l) => splitQuantity(l.quantity, l.product.stock).toMake > 0);
  const days = shippingDaysFor(needsMaking, settings ?? {});
  const delayMessage = days
    ? `Expédition sous ${days} jour${days > 1 ? 's' : ''} ouvré${days > 1 ? 's' : ''}${
        needsMaking ? ' : une partie de votre commande est fabriquée à la main pour vous.' : '.'
      }`
    : null;

  // "id:qty,id:qty" (Stripe metadata values are limited to 500 characters: 10 lines fit).
  const metadata = { items: lines.map((l) => `${l.productId}:${l.quantity}`).join(',') };
  const session = await getStripe().checkout.sessions.create(
    {
      mode: 'payment',
      locale: 'fr',
      line_items: lines.map(({ product, quantity }) => ({
        quantity,
        price_data: {
          currency: 'eur',
          unit_amount: product.price,
          product_data: {
            name: product.title,
            images: product.image?.asset
              ? [urlFor(product.image).width(800).height(800).url()]
              : undefined,
            metadata: { productId: product._id },
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
        ...(delayMessage ? { submit: { message: delayMessage } } : {}),
      },
      metadata,
      payment_intent_data: { metadata },
      success_url: `${absoluteUrl('/merci')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl('/boutique?annule=1'),
    },
    // No idempotency key needed: the Stripe SDK adds one to its own network retries.
  );
  if (!session.url) throw new Error('Stripe returned a session without url');
  return { ok: true, url: session.url, sessionId: session.id };
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
