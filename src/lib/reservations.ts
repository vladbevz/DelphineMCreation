import 'server-only';
import { writeClient } from './sanity/writeClient';

// Pièce unique stock logic. Every status change is applied to the published document AND
// to its draft (if Delphine has one open), otherwise publishing the draft would revert it.

export const RESERVATION_MINUTES = 32; // a bit longer than the Stripe session (31 min)

export type CheckoutProduct = {
  _id: string;
  _rev: string;
  title: string;
  slug: string | null;
  price: number;
  status: 'available' | 'reserved' | 'sold' | null;
  reservedUntil: string | null;
  reservationToken: string | null;
  image: { asset?: { _ref: string } } | null;
};

const draftId = (id: string) => `drafts.${id}`;

/** Fresh read (no CDN) of the products being bought, plus which of them have drafts. */
export async function loadCheckoutProducts(ids: string[]) {
  const { products, drafts } = await writeClient.fetch<{
    products: CheckoutProduct[];
    drafts: string[];
  }>(
    `{
      "products": *[_type == "product" && _id in $ids]{
        _id, _rev, title, "slug": slug.current, price, status, reservedUntil, reservationToken,
        "image": images[0]
      },
      "drafts": *[_id in $draftIds]._id
    }`,
    { ids, draftIds: ids.map(draftId) },
  );
  return { products, draftIds: new Set(drafts) };
}

export function isAvailable(
  product: Pick<CheckoutProduct, 'status' | 'reservedUntil'>,
  now = new Date(),
) {
  if (!product.status || product.status === 'available') return true;
  return (
    product.status === 'reserved' &&
    product.reservedUntil !== null &&
    new Date(product.reservedUntil) < now
  );
}

export class ReservationConflictError extends Error {
  constructor() {
    super('A product changed while it was being reserved');
  }
}

/**
 * Reserves all products atomically. `ifRevisionId` makes the transaction fail if another
 * checkout touched any of them since we read it (optimistic locking): two tabs buying the
 * same piece cannot both succeed.
 */
export async function reserveProducts(
  products: CheckoutProduct[],
  draftIds: Set<string>,
  token: string,
  until: Date,
) {
  const fields = {
    status: 'reserved',
    reservedUntil: until.toISOString(),
    reservationToken: token,
  };
  const tx = writeClient.transaction();
  for (const product of products) {
    tx.patch(product._id, (p) => p.ifRevisionId(product._rev).set(fields));
    if (draftIds.has(draftId(product._id))) tx.patch(draftId(product._id), (p) => p.set(fields));
  }
  try {
    await tx.commit({ visibility: 'sync' });
  } catch (error) {
    if (isConflict(error)) throw new ReservationConflictError();
    throw error;
  }
}

/** Puts back on sale every product still reserved with this token. Safe to call twice. */
export async function releaseReservation(token: string) {
  const ids = await writeClient.fetch<string[]>(
    `*[_type == "product" && reservationToken == $reservation && status == "reserved"]._id`,
    { reservation: token },
  );
  if (ids.length === 0) return 0;
  const tx = writeClient.transaction();
  for (const id of ids) {
    tx.patch(id, (p) =>
      p.set({ status: 'available' }).unset(['reservedUntil', 'reservationToken']),
    );
  }
  await tx.commit({ visibility: 'sync' });
  return ids.filter((id) => !id.startsWith('drafts.')).length;
}

/** Extends a reservation, e.g. while a delayed payment method (SEPA) is being confirmed. */
export async function extendReservation(token: string, until: Date) {
  const ids = await writeClient.fetch<string[]>(
    `*[_type == "product" && reservationToken == $reservation && status == "reserved"]._id`,
    { reservation: token },
  );
  if (ids.length === 0) return;
  const tx = writeClient.transaction();
  for (const id of ids) tx.patch(id, (p) => p.set({ reservedUntil: until.toISOString() }));
  await tx.commit();
}

/** Safety net for the cron: releases reservations whose time is over. */
export async function releaseExpiredReservations(now = new Date()) {
  const ids = await writeClient.fetch<string[]>(
    `*[_type == "product" && status == "reserved" && reservedUntil < $now]._id`,
    { now: now.toISOString() },
  );
  if (ids.length === 0) return 0;
  const tx = writeClient.transaction();
  for (const id of ids) {
    tx.patch(id, (p) =>
      p.set({ status: 'available' }).unset(['reservedUntil', 'reservationToken']),
    );
  }
  await tx.commit({ visibility: 'sync' });
  return ids.filter((id) => !id.startsWith('drafts.')).length;
}

function isConflict(error: unknown) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    (error as { statusCode: number }).statusCode === 409
  );
}
