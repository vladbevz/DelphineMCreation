import { colorKey, type Category, categories } from './catalog';

export const sortOptions = [
  { value: 'nouveautes', label: 'Nouveautés' },
  { value: 'prix-croissant', label: 'Prix croissant' },
  { value: 'prix-decroissant', label: 'Prix décroissant' },
] as const;

export type Sort = (typeof sortOptions)[number]['value'];

export type BoutiqueFilters = {
  category: Category | null;
  color: string | null;
  sort: Sort;
};

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Parses ?categorie=&couleur=&tri= and ignores unknown values. */
export function parseFilters(
  params: Record<string, string | string[] | undefined>,
): BoutiqueFilters {
  const category = first(params.categorie);
  const sort = first(params.tri);
  return {
    category: categories.some((c) => c.value === category) ? (category as Category) : null,
    color: first(params.couleur) || null,
    sort: sortOptions.some((s) => s.value === sort) ? (sort as Sort) : 'nouveautes',
  };
}

/** Builds a boutique URL, dropping defaults so URLs stay short and canonical. */
export function boutiqueHref(filters: BoutiqueFilters) {
  const params = new URLSearchParams();
  if (filters.category) params.set('categorie', filters.category);
  if (filters.color) params.set('couleur', filters.color);
  if (filters.sort !== 'nouveautes') params.set('tri', filters.sort);
  const query = params.toString();
  return query ? `/boutique?${query}` : '/boutique';
}

type Filterable = {
  price: number;
  status: string | null;
  category: string;
  leatherColor: string | null;
  publishedAt: string | null;
};

/** Filters and sorts the catalog. Sold pieces always come last. */
export function applyFilters<T extends Filterable>(products: T[], filters: BoutiqueFilters) {
  const filtered = products.filter(
    (p) =>
      (!filters.category || p.category === filters.category) &&
      (!filters.color || (p.leatherColor && colorKey(p.leatherColor) === filters.color)),
  );

  const byDate = (a: T, b: T) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '');
  const compare: Record<Sort, (a: T, b: T) => number> = {
    nouveautes: byDate,
    'prix-croissant': (a, b) => a.price - b.price,
    'prix-decroissant': (a, b) => b.price - a.price,
  };

  return filtered.sort((a, b) => {
    const soldDiff = Number(a.status === 'sold') - Number(b.status === 'sold');
    return soldDiff || compare[filters.sort](a, b);
  });
}

/** Distinct leather colors present in the catalog, for the color filter. */
export function availableColors(products: Filterable[]) {
  const map = new Map<string, string>();
  for (const p of products) {
    if (p.leatherColor) map.set(colorKey(p.leatherColor), p.leatherColor.trim());
  }
  return [...map]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label, 'fr'));
}
