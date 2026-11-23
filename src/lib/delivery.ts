// Ready stock vs made to order. Every piece is always for sale: what is not in `stock`
// (pieces already made) is crafted for the customer. Pure helpers, safe on the client.

/** Same piece, same order: a few pairs for gifts, not a wholesale order. */
export const MAX_QUANTITY = 5;
/** Different pieces in one cart. */
export const MAX_CART_LINES = 10;

export type Delays = {
  /** Business days to ship a piece already made (settings.shippingDays). */
  shippingDays?: number | null;
  /** Business days to ship a piece made to order (settings.madeToOrderDays). */
  madeToOrderDays?: number | null;
};

/** How many of `quantity` come from ready stock, and how many Delphine has to make. */
export function splitQuantity(quantity: number, stock: number | null | undefined) {
  const fromStock = Math.min(quantity, Math.max(0, stock ?? 0));
  return { fromStock, toMake: quantity - fromStock };
}

const days = (n: number | null | undefined) =>
  typeof n === 'number' && n > 0
    ? `${n} jour${n > 1 ? 's' : ''} ouvré${n > 1 ? 's' : ''}`
    : '[DÉLAI]';

/** Shipping delay for a set of lines: the slowest one wins. Null if not configured. */
export function shippingDaysFor(needsMaking: boolean, delays: Delays) {
  const n = needsMaking ? delays.madeToOrderDays : delays.shippingDays;
  return typeof n === 'number' && n > 0 ? n : null;
}

/** Product page, under the button (quantity 1). */
export function productAvailabilityNote(stock: number | null | undefined, delays: Delays) {
  return (stock ?? 0) > 0
    ? `Prêt à partir, expédié sous ${days(delays.shippingDays)}`
    : `Fabriqué à la main pour vous, expédié sous ${days(delays.madeToOrderDays)}`;
}

/** Cart line, for a given quantity. */
export function lineAvailabilityNote(
  quantity: number,
  stock: number | null | undefined,
  delays: Delays,
) {
  const { fromStock, toMake } = splitQuantity(quantity, stock);
  if (toMake === 0) return `Prêt à partir, expédié sous ${days(delays.shippingDays)}`;
  const made = `expédié sous ${days(delays.madeToOrderDays)}`;
  if (fromStock === 0) return `Fabriqué pour vous, ${made}`;
  return `${fromStock} prêt${fromStock > 1 ? 's' : ''}, ${toMake} à fabriquer pour vous, ${made}`;
}
