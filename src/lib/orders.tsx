import 'server-only';
import * as Sentry from '@sentry/nextjs';
import type Stripe from 'stripe';
import { shippingDaysFor, splitQuantity, type Delays } from './delivery';
import { delphineEmail, isEmailConfigured, sendEmail } from './email/send';
import { NewOrderEmail } from './email/templates/NewOrderEmail';
import { OrderConfirmationEmail } from './email/templates/OrderConfirmationEmail';
import type { EmailOrder } from './email/templates/OrderSummary';
import type { SellerInfo } from './email/templates/WithdrawalInfo';
import { revalidateCatalog } from './revalidate';
import { writeClient } from './sanity/writeClient';
import { getStripe } from './stripe';
import { absoluteUrl } from './url';

const MAX_COMMIT_RETRIES = 5;
/**
 * Order number counter (DMC-YYYY-0001). Its own document, not a field of `settings`: a
 * Studio draft of Réglages would otherwise copy the counter and roll it back on publish.
 * Path ID: hidden from the public API and from the Studio lists.
 */
const COUNTER_ID = 'counters.orders';

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

  // Delayed payment (e.g. SEPA): nothing to hold, the order is created on async_payment_succeeded.
  if (session.payment_status === 'unpaid') {
    return { created: false, reason: 'awaiting-payment' as const };
  }

  const order = buildOrder(session);
  const existing = await writeClient.getDocument<{
    number: string;
    emailsSent?: boolean;
    items?: { _key: string; fromStock?: number; toMake?: number }[];
  }>(order._id);
  if (existing) {
    // A retry after the order was saved but before its e-mails went out (send error,
    // timeout): send them now, with the stock split saved at the time. Resend idempotency
    // keys prevent doubles.
    if (!existing.emailsSent) {
      const saved = new Map(existing.items?.map((i) => [i._key, i]));
      await deliverOrderEmails({
        ...order,
        number: existing.number,
        items: order.items.map((i) => ({ ...i, ...pickSplit(saved.get(i._key)) })),
      });
    }
    return { created: false, reason: 'duplicate' as const };
  }

  const created = await commitOrder(order);
  if (!created) return { created: false, reason: 'duplicate' as const };

  revalidateCatalog(); // ready stock changed: product pages show the new delay
  await deliverOrderEmails(order);
  return { created: true, number: order.number };
}

const pickSplit = (i?: { fromStock?: number; toMake?: number }) =>
  i ? { fromStock: i.fromStock ?? 0, toMake: i.toMake ?? 0 } : {};

/**
 * The confirmation is the legal durable-medium copy (L221-13): if it fails, throw so the
 * webhook answers 500 and Stripe retries; the order is flagged once both e-mails are sent.
 */
async function deliverOrderEmails(order: OrderDoc) {
  if (!isEmailConfigured) return; // nothing to retry: sendEmail only logs
  if (!(await sendOrderEmails(order))) throw new Error(`Order e-mails failed for ${order._id}`);
  await writeClient.patch(order._id).set({ emailsSent: true }).commit();
}

function buildOrder(session: Stripe.Checkout.Session): OrderDoc {
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
      const live = product && typeof product !== 'string' && !product.deleted ? product : null;
      const productId = live?.metadata?.productId;
      const quantity = line.quantity ?? 1;
      return {
        _key: `item${i}`,
        title: line.description ?? 'Bijou',
        quantity,
        price: line.amount_total,
        // Until commitOrder knows the stock: everything to make.
        fromStock: 0,
        toMake: quantity,
        imageUrl: live?.images[0] ?? null,
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

type StockDoc = { _id: string; _rev: string; stock?: number | null };

/**
 * Order number + order + ready-stock update, all or nothing. Returns false if the order
 * already existed. Stock is taken from the published product (with ifRevisionId, so two
 * orders paid at the same moment cannot both take the last ready piece: the second one is
 * retried and becomes made to order) and mirrored on Delphine's open draft, if any.
 */
async function commitOrder(order: OrderDoc) {
  const productIds = [
    ...new Set(order.items.map((i) => i.product?._ref).filter((id): id is string => !!id)),
  ];
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < MAX_COMMIT_RETRIES; attempt++) {
    const [counter, docs] = await Promise.all([
      writeClient.getDocument<{ _rev: string; year?: number; value?: number }>(COUNTER_ID),
      writeClient.fetch<StockDoc[]>(`*[_id in $ids]{ _id, _rev, stock }`, {
        ids: [...productIds, ...productIds.map((id) => `drafts.${id}`)],
      }),
    ]);
    const byId = new Map(docs.map((d) => [d._id, d]));

    const next = counter?.year === year ? (counter.value ?? 0) + 1 : 1;
    order.number = `DMC-${year}-${String(next).padStart(4, '0')}`;

    const tx = writeClient.transaction();
    if (counter) {
      tx.patch(COUNTER_ID, (p) => p.ifRevisionId(counter._rev).set({ year, value: next }));
    } else {
      // `create` fails if another order created it first: the loop then retries.
      tx.create({ _id: COUNTER_ID, _type: 'orderCounter', year, value: next });
    }

    for (const item of order.items) {
      const published = item.product ? byId.get(item.product._ref) : undefined;
      const { fromStock, toMake } = splitQuantity(item.quantity, published?.stock);
      item.fromStock = fromStock;
      item.toMake = toMake;
      if (!published || fromStock === 0) continue;
      tx.patch(published._id, (p) =>
        p.ifRevisionId(published._rev).set({ stock: (published.stock ?? 0) - fromStock }),
      );
      const draft = byId.get(`drafts.${published._id}`);
      if (draft) {
        tx.patch(draft._id, (p) => p.set({ stock: Math.max(0, (draft.stock ?? 0) - fromStock) }));
      }
    }

    // imageUrl is only for the e-mails; the Studio shows the product reference instead.
    tx.create({
      ...order,
      items: order.items.map((item) => {
        const { imageUrl, ...stored } = item;
        void imageUrl;
        return stored;
      }),
    });

    try {
      await tx.commit({ visibility: 'sync' });
      return true;
    } catch (error) {
      if (!isConflict(error)) throw error;
      // The order already exists (duplicate event), or the counter or a product moved: retry.
      if (await writeClient.getDocument(order._id)) return false;
    }
  }
  throw new Error(`Could not commit order ${order._id}`);
}

/** Sanity answers 409 when ifRevisionId or create() conflicts. */
function isConflict(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    (error as { statusCode: number }).statusCode === 409
  );
}

/** CGV PDF, seller details (L221-13) and shipping delays for the confirmation. */
async function getSellerInfo(): Promise<{
  seller: SellerInfo;
  cgvPdfUrl: string | null;
  delays: Delays;
}> {
  const legal = await writeClient
    .fetch<{
      email?: string | null;
      postalAddress?: string | null;
      cgvPdfUrl?: string | null;
      shippingDays?: number | null;
      madeToOrderDays?: number | null;
    } | null>(
      `*[_id == "settings"][0]{
        email, postalAddress, "cgvPdfUrl": cgvPdf.asset->url, shippingDays, madeToOrderDays
      }`,
    )
    .catch((error) => {
      // The confirmation still goes out, with the CGV link only.
      Sentry.captureException(error);
      return null;
    });
  const cgvPdfUrl = legal?.cgvPdfUrl ?? null;
  return {
    cgvPdfUrl,
    delays: { shippingDays: legal?.shippingDays, madeToOrderDays: legal?.madeToOrderDays },
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
  const { seller, cgvPdfUrl, delays } = await getSellerInfo();
  const needsMaking = order.items.some((i) => i.toMake > 0);
  const shippingDays = shippingDaysFor(needsMaking, delays);

  if (order.customer.email) {
    tasks.push(
      sendEmail({
        to: order.customer.email,
        subject: `Votre commande ${order.number} est confirmée`,
        react: (
          <OrderConfirmationEmail
            order={order}
            seller={seller}
            needsMaking={needsMaking}
            shippingDays={shippingDays}
          />
        ),
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
        subject: `Nouvelle commande ${order.number} — ${order.customer.name ?? ''}${
          needsMaking ? ' (à fabriquer)' : ''
        }`,
        react: <NewOrderEmail order={order} studioUrl={studioOrderUrl(order._id)} />,
        replyTo: order.customer.email ?? undefined,
        idempotencyKey: `new-order/${order._id}`,
      }),
    );
  }
  return (await Promise.all(tasks)).every(Boolean);
}
