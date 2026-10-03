const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** Formats an integer amount in cents as a French euro price. */
export function formatPrice(cents: number) {
  return euro.format(cents / 100);
}
