import type { Metadata } from 'next';
import { CheckoutCancelled } from '@/components/cart/CheckoutCancelled';
import { FilterChip } from '@/components/catalog/FilterChip';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  applyFilters,
  availableColors,
  boutiqueHref,
  parseFilters,
  sortOptions,
} from '@/lib/boutique';
import { categories, categoryFilterLabels } from '@/lib/catalog';
import { getProducts } from '@/lib/sanity/data';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = {
  title: 'La boutique',
  description:
    'Tous les bijoux en cuir faits main de Delphine M. Créations : boucles d’oreilles, colliers, bracelets. Pièces uniques.',
  alternates: { canonical: '/boutique' },
};

export default async function BoutiquePage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const cancelled = params.annule === '1';
  const all = await getProducts();
  const products = applyFilters(all, filters);
  const colors = availableColors(all);
  const presentCategories = categories.filter((c) => all.some((p) => p.category === c.value));
  const isFiltered = Boolean(filters.category || filters.color);

  return (
    <>
      <PageHeader
        label="La boutique"
        title={
          <>
            Toutes les <em>créations</em>
          </>
        }
      />

      <Container>
        {cancelled && <CheckoutCancelled />}
        <div className="space-y-3 border-y border-sand-border py-4">
          <nav aria-label="Filtrer par catégorie">
            <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              <li>
                <FilterChip
                  href={boutiqueHref({ ...filters, category: null })}
                  active={!filters.category}
                >
                  Tout
                </FilterChip>
              </li>
              {presentCategories.map((c) => (
                <li key={c.value}>
                  <FilterChip
                    href={boutiqueHref({ ...filters, category: c.value })}
                    active={filters.category === c.value}
                  >
                    {categoryFilterLabels[c.value]}
                  </FilterChip>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {colors.length > 1 && (
              <nav aria-label="Filtrer par couleur de cuir" className="flex items-center gap-3">
                <span className="shrink-0 label-caps text-muted">Cuir</span>
                <ul className="-mr-5 flex gap-2 overflow-x-auto pr-5 pb-1 sm:mr-0 sm:flex-wrap sm:pr-0">
                  {colors.map((c) => (
                    <li key={c.key}>
                      <FilterChip
                        href={boutiqueHref({
                          ...filters,
                          color: filters.color === c.key ? null : c.key,
                        })}
                        active={filters.color === c.key}
                      >
                        {c.label}
                      </FilterChip>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            <nav aria-label="Trier" className="flex items-center gap-3">
              <span className="shrink-0 label-caps text-muted">Trier</span>
              <ul className="-mr-5 flex gap-2 overflow-x-auto pr-5 pb-1 sm:mr-0 sm:pr-0">
                {sortOptions.map((s) => (
                  <li key={s.value}>
                    <FilterChip
                      href={boutiqueHref({ ...filters, sort: s.value })}
                      active={filters.sort === s.value}
                    >
                      {s.label}
                    </FilterChip>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <p className="mt-4 mb-6 text-sm text-muted" aria-live="polite">
          {products.length} création{products.length > 1 ? 's' : ''}
        </p>

        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="rounded-3xl bg-cream px-6 py-16 text-center">
            <p className="font-display text-3xl">Aucune création ne correspond</p>
            <p className="mt-3 text-muted">Essayez une autre catégorie ou couleur.</p>
            {isFiltered && (
              <ButtonLink href="/boutique" variant="secondary" className="mt-8">
                Voir toute la boutique
              </ButtonLink>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
