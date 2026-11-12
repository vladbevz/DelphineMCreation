import 'server-only';
import * as Sentry from '@sentry/nextjs';
import type Stripe from 'stripe';
import { delphineEmail, isEmailConfigured, sendEmail } from './email/send';
import { NewOrderEmail } from './email/templates/NewOrderEmail';
import { OrderConfirmationEmail } from './email/templates/OrderConfirmationEmail';
import type { EmailOrder } from './email/templates/OrderSummary';
import type { SellerInfo } from './email/templates/WithdrawalInfo';
import { revalidateCatalog } from './revalidate';
import { extendReservation, isConflict, releaseReservation } from './reservations';
import { writeClient } from './sanity/writeClient';
import { getStripe } from './stripe';
import { absoluteUrl } from './url';

const MAX_COUNTER_RETRIES = 5;
/**
 * Order number counter (DMC-YYYY-0001). Its own document, not a field of `settings`: a
 * Studio draft of Réglages would otherwise copy the counter and roll it back on publish.
 * Path ID: hidden from the public API and from the Studio lists.
 */
const COUNTER_ID = 'counters.orders';
/** Delayed payment methods (e.g. SEPA) can take a few days to confirm. */
const DELAYED_PAYMENT_HOLD_DAYS = 7;

/**
 * The dataset is public (Sanity free plan): documents whose _id has a path ("orders.…") are only
 * readable with a token, like drafts. Orders hold customers' personal data, so they live there.
 */
export const orderIdFor = (sessionId: string) => `orders.${sessionId}`;

export function studioOrderUrl(orderId: string) {
  return absoluteUrl(`/studio/intent/edit/id=${orderId};type=order/`);
}

type OrderItem = EmailOrder['items'][number] & {
  _key: string;
  product?: { _type: 'reference'; _ref: string; _weak: true };
};

type OrderDoc = Omit<EmailOrder, 'items'> & {
  _id: string;
  _type: 'order';
  status: 'paid';
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  createdAt: string;
  items: OrderItem[];
};

/**
 * checkout.session.completed / async_payment_succeeded.
 * Idempotent: the order _id is derived from the session id and created with `create`
 * (not createOrReplace) in the same transaction as the counter and the stock update,
 * so a duplicate event fails as a whole and sends no second e-mail.
 */
export async function handleCheckoutCompleted(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product', 'shipping_cost.shipping_rate'],
  });
  const token = session.metadata?.reservationToken;

  if (session.payment_status === 'unpaid') {
    // Delayed payment: keep the pieces aside until async_payment_succeeded/failed arrives.
    if (token)
      await extendReservation(token, new Date(Date.now() + DELAYED_PAYMENT_HOLD_DAYS * 86_400_000));
    return { created: false, reason: 'awaiting-payment' as const };
  }

  const order = buildOrder(session);
  const existing = await writeClient.getDocument<{ number: string; emailsSent?: boolean }>(
    order._id,
  );
  if (existing) {
    // A retry after the order was saved but before its e-mails went out (send error,
    // timeout): send them now. Resend idempotency keys prevent doubles.
    if (!existing.emailsSent) await deliverOrderEmails({ ...order, number: existing.number });
    return { created: false, reason: 'duplicate' as const };
  }

  const productIds = (session.metadata?.productIds ?? '').split(',').filter(Boolean);
  const created = await commitOrder(order, productIds, token);
  if (!created) return { created: false, reason: 'duplicate' as const };

  revalidateCatalog();
  await deliverOrderEmails(order);
  return { created: true, number: order.number };
}

/**
 * The confirmation is the legal durable-medium copy (L221-13): if it fails, throw so the
 * webhook answers 500 and Stripe retries; the order is flagged once both e-mails are sent.
 */
async function deliverOrderEmails(order: OrderDoc) {
  if (!isEmailConfigured) return; // nothing to retry: sendEmail only logs
  if (!(await sendOrderEmails(order))) throw new Error(`Order e-mails failed for ${order._id}`);
  await writeClient.patch(order._id).set({ emailsSent: true }).commit();
}

/** checkout.session.expired / async_payment_failed: put the pieces back on sale. */
export async function handleCheckoutReleased(session: Stripe.Checkout.Session) {
  const token = session.metadata?.reservationToken;
  if (!token) return 0;
  const released = await releaseReservation(token);
  if (released > 0) revalidateCatalog();
  return released;
}

function buildOrder(
  session: Stripe.Checkout.Session,
): Omit<OrderDoc, 'number'> & { number: string } {
  const shippingRate = session.shipping_cost?.shipping_rate;
  const method =
    shippingRate && typeof shippingRate !== 'string' && shippingRate.metadata?.method === 'retrait'
      ? 'retrait'
      : 'colissimo';
  const shipping = session.collected_information?.shipping_details;
  const paymentIntent = session.payment_intent;

  return {
    _id: orderIdFor(session.id),
    _type: 'order',
    number: '', // assigned in commitOrder
    status: 'paid',
    createdAt: new Date((session.created ?? Date.now() / 1000) * 1000).toISOString(),
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof paymentIntent === 'string' ? paymentIntent : (paymentIntent?.id ?? null),
    items: (session.line_items?.data ?? []).map((line, i) => {
      const product = line.price?.product;
      const productId =
        product && typeof product !== 'string' && !product.deleted
          ? product.metadata?.productId
          : undefined;
      const imageUrl =
        product && typeof product !== 'string' && !product.deleted
          ? (product.images[0] ?? null)
          : null;
      return {
        _key: `item${i}`,
        title: line.description ?? 'Bijou',
        price: line.amount_total,
        imageUrl,
        product: productId ? { _type: 'reference', _ref: productId, _weak: true } : undefined,
      };
    }),
    customer: {
      name: session.customer_details?.name ?? null,
      email: session.customer_details?.email ?? null,
      phone: session.customer_details?.phone ?? null,
    },
    shippingMethod: method,
    shippingAddress:
      method === 'colissimo' && shipping
        ? {
            name: shipping.name,
            line1: shipping.address.line1,
            line2: shipping.address.line2,
            postalCode: shipping.address.postal_code,
            city: shipping.address.city,
          }
        : null,
    amounts: {
      subtotal: session.amount_subtotal ?? 0,
      shipping: session.shipping_cost?.amount_total ?? 0,
      total: session.amount_total ?? 0,
    },
  };
}

/** Order number + order + stock, all or nothing. Returns false if the order already existed. */
async function commitOrder(order: OrderDoc, productIds: string[], token: string | undefined) {
  const { existing, drafts, foreign } = await writeClient.fetch<{
    existing: string[];
    drafts: string[];
    foreign: string[];
  }>(
    `{
      "existing": *[_id in $ids]._id,
      "drafts": *[_id in $draftIds]._id,
      "foreign": *[_id in $ids && (
        status == "sold" || (status == "reserved" && reservationToken != $reservation)
      )]._id
    }`,
    { ids: productIds, draftIds: productIds.map((id) => `drafts.${id}`), reservation: token ?? '' },
  );
  if (foreign.length > 0) {
    // Paid for a piece already sold, or reserved by someone else, in between (e.g. a webhook
    // retried hours later): should never happen, but Delphine must know before shipping.
    Sentry.captureMessage('Paid order for a piece reserved or sold by another checkout', {
      level: 'error',
      extra: { orderId: order._id, foreign },
    });
  }

  const soldFields = { status: 'sold', stock: 0 };
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < MAX_COUNTER_RETRIES; attempt++) {
    const counter = await writeClient.getDocument<{
      _rev: string;
      year?: number;
      value?: number;
    }>(COUNTER_ID);
    const next = counter?.year === year ? (counter.value ?? 0) + 1 : 1;
    order.number = `DMC-${year}-${String(next).padStart(4, '0')}`;

    const tx = writeClient.transaction();
    if (counter) {
      tx.patch(COUNTER_ID, (p) => p.ifRevisionId(counter._rev).set({ year, value: next }));
    } else {
      // `create` fails if another order created it first: the loop then retries.
      tx.create({ _id: COUNTER_ID, _type: 'orderCounter', year, value: next });
    }
    // imageUrl is only for the e-mails; the Studio shows the product reference instead.
    tx.create({
      ...order,
      items: order.items.map(({ _key, title, price, product }) => ({
        _key,
        title,
        price,
        product,
      })),
    });
    for (const id of [...existing, ...drafts]) {
      tx.patch(id, (p) => p.set(soldFields).unset(['reservedUntil', 'reservationToken']));
    }

    try {
      await tx.commit({ visibility: 'sync' });
      return true;
    } catch (error) {
      if (!isConflict(error)) throw error;
      // Either the order already exists (duplicate event) or the counter moved: retry.
      if (await writeClient.getDocument(order._id)) return false;
    }
  }
  throw new Error(`Could not allocate an order number for ${order._id}`);
}

/** CGV PDF and seller details for the durable-medium confirmation (L221-13). */
async function getSellerInfo(): Promise<{ seller: SellerInfo; cgvPdfUrl: string | null }> {
  const legal = await writeClient
    .fetch<{
      email?: string | null;
      postalAddress?: string | null;
      cgvPdfUrl?: string | null;
    } | null>(`*[_id == "settings"][0]{ email, postalAddress, "cgvPdfUrl": cgvPdf.asset->url }`)
    .catch((error) => {
      // The confirmation still goes out, with the CGV link only.
      Sentry.captureException(error);
      return null;
    });
  const cgvPdfUrl = legal?.cgvPdfUrl ?? null;
  return {
    cgvPdfUrl,
    seller: {
      cgvUrl: absoluteUrl('/cgv'),
      cgvAttached: Boolean(cgvPdfUrl),
      email: legal?.email,
      postalAddress: legal?.postalAddress,
    },
  };
}

async function sendOrderEmails(order: OrderDoc) {
  const tasks: Promise<boolean>[] = [];
  if (order.customer.email) {
    const { seller, cgvPdfUrl } = await getSellerInfo();
    tasks.push(
      sendEmail({
        to: order.customer.email,
        subject: `Votre commande ${order.number} est confirmée`,
        react: <OrderConfirmationEmail order={order} seller={seller} />,
        idempotencyKey: `order-confirmation/${order._id}`,
        attachments: cgvPdfUrl
          ? [{ filename: 'CGV-Delphine-M-Creations.pdf', path: cgvPdfUrl }]
          : undefined,
      }),
    );
  }
  const delphine = delphineEmail();
  if (delphine) {
    tasks.push(
      sendEmail({
        to: delphine,
        subject: `Nouvelle commande ${order.number} — ${order.customer.name ?? ''}`,
        react: <NewOrderEmail order={order} studioUrl={studioOrderUrl(order._id)} />,
        replyTo: order.customer.email ?? undefined,
        idempotencyKey: `new-order/${order._id}`,
      }),
    );
  }
  return (await Promise.all(tasks)).every(Boolean);
}
