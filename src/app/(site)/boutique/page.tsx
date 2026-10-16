import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckoutCancelled } from '@/components/cart/CheckoutCancelled';
import { FilterOption } from '@/components/catalog/FilterOption';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { SortSelect } from '@/components/catalog/SortSelect';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  applyFilters,
  availableColors,
  boutiqueHref,
  parseFilters,
  sortOptions,
  type BoutiqueFilters,
} from '@/lib/boutique';
import { categories, categoryFilterLabels, colorKey } from '@/lib/catalog';
import { getProducts } from '@/lib/sanity/data';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = {
  title: 'La boutique',
  description:
    'Tous les bijoux en cuir faits main de Delphine M. Créations : boucles d’oreilles, colliers, bracelets, bagues, broches et barrettes. Colorés et ultra légers.',
  alternates: { canonical: '/boutique' },
};

type Product = Awaited<ReturnType<typeof getProducts>>[number];

function Filters({
  all,
  filters,
  className,
}: {
  all: Product[];
  filters: BoutiqueFilters;
  className: string;
}) {
  const presentCategories = categories.filter((c) => all.some((p) => p.category === c.value));
  const colors = availableColors(all);
  const count = (fn: (p: Product) => boolean) => all.filter(fn).length;

  return (
    <div className={className}>
      <nav aria-label="Filtrer par catégorie">
        <h2 className="mb-3 label-caps text-espresso">Catégories</h2>
        <ul>
          <li>
            <FilterOption
              href={boutiqueHref({ ...filters, category: null })}
              active={!filters.category}
              count={all.length}
            >
              Toutes
            </FilterOption>
          </li>
          {presentCategories.map((c) => (
            <li key={c.value}>
              <FilterOption
                href={boutiqueHref({ ...filters, category: c.value })}
                active={filters.category === c.value}
                count={count((p) => p.category === c.value)}
              >
                {categoryFilterLabels[c.value]}
              </FilterOption>
            </li>
          ))}
        </ul>
      </nav>

      {colors.length > 1 && (
        <nav aria-label="Filtrer par couleur de cuir">
          <h2 className="mb-3 label-caps text-espresso">Couleur du cuir</h2>
          <ul>
            {colors.map((c) => (
              <li key={c.key}>
                <FilterOption
                  href={boutiqueHref({
                    ...filters,
                    color: filters.color === c.key ? null : c.key,
                  })}
                  active={filters.color === c.key}
                  count={count((p) =>
                    Boolean(p.leatherColor && colorKey(p.leatherColor) === c.key),
                  )}
                >
                  {c.label}
                </FilterOption>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default async function BoutiquePage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const cancelled = params.annule === '1';
  const all = await getProducts();
  const products = applyFilters(all, filters);
  const activeCount = Number(Boolean(filters.category)) + Number(Boolean(filters.color));

  const sort = sortOptions.map((s) => ({
    ...s,
    href: boutiqueHref({ ...filters, sort: s.value }),
  }));

  return (
    <Container className="pt-8 pb-4 sm:pt-10">
      {cancelled && <CheckoutCancelled />}

      <SectionHeading
        as="h1"
        align="center"
        title={
          <>
            Toutes les <em>créations</em>
          </>
        }
        className="mb-8 lg:mb-12"
      />

      <div className="grid gap-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        {/* Desktop: sidebar. Mobile: collapsible panel. Both work without JavaScript. */}
        <aside className="hidden border-r border-sand-border pr-8 lg:block">
          <div className="sticky top-24">
            <Filters all={all} filters={filters} className="space-y-8" />
          </div>
        </aside>

        <div>
          <details className="group mb-4 border border-sand-border bg-white/50 lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
              <span>
                Filtrer
                {activeCount > 0 && <span className="ml-2 text-cognac">({activeCount})</span>}
              </span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="size-5 transition-transform group-open:rotate-45"
                aria-hidden
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <div className="px-4 pt-2 pb-4">
              <Filters all={all} filters={filters} className="grid grid-cols-2 gap-x-6 gap-y-4" />
            </div>
          </details>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-sand-border pb-4">
            <p className="text-sm text-muted" aria-live="polite">
              {products.length} création{products.length > 1 ? 's' : ''}
              {activeCount > 0 && (
                <>
                  {' · '}
                  <Link
                    href="/boutique"
                    scroll={false}
                    className="text-cognac underline underline-offset-4"
                  >
                    Effacer les filtres
                  </Link>
                </>
              )}
            </p>
            <SortSelect options={sort} current={filters.sort} />
          </div>

          {products.length > 0 ? (
            <ProductGrid products={products} variant="sidebar" />
          ) : (
            <div className="bg-cream px-6 py-14 text-center">
              <p className="font-display text-2xl">Aucune création ne correspond</p>
              <p className="mt-2 text-sm text-muted">Essayez une autre catégorie ou couleur.</p>
              <ButtonLink href="/boutique" variant="secondary" className="mt-6">
                Voir toute la boutique
              </ButtonLink>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
