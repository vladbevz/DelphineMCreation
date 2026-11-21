// Shared by the Sanity schema and the storefront. No React / Sanity imports here.
export const categories = [
  { title: "Boucles d'oreilles", value: 'boucles-d-oreilles' },
  { title: 'Collier', value: 'collier' },
  { title: 'Bracelet', value: 'bracelet' },
  { title: 'Bague', value: 'bague' },
  { title: 'Autre', value: 'autre' },
] as const;

export type Category = (typeof categories)[number]['value'];

/** Plural labels for the boutique filter. */
export const categoryFilterLabels: Record<Category, string> = {
  'boucles-d-oreilles': "Boucles d'oreilles",
  collier: 'Colliers',
  bracelet: 'Bracelets',
  bague: 'Bagues',
  autre: 'Autres',
};

export function categoryLabel(value: string | null | undefined) {
  return categories.find((c) => c.value === value)?.title;
}

/** URL-safe key for a leather color ("Cognac clair" -> "cognac-clair"). */
export function colorKey(color: string) {
  return color
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Legal pages served by app/(site)/[legal], content from Sanity `page` documents. */
export const legalPages = {
  cgv: 'Conditions générales de vente',
  'mentions-legales': 'Mentions légales',
  'livraison-retours': 'Livraison et retours',
  confidentialite: 'Politique de confidentialité',
} as const;

export type LegalSlug = keyof typeof legalPages;
