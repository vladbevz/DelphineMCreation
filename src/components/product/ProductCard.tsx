import Image from 'next/image';
import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { Badge } from '@/components/ui/Badge';
import { categoryLabel } from '@/lib/catalog';
import { formatPrice } from '@/lib/format';
import { urlFor } from '@/lib/sanity/image';
import type { LATEST_PRODUCTS_QUERY_RESULT } from '@/sanity/types';

export type ProductCardData = LATEST_PRODUCTS_QUERY_RESULT[number];

type CardImage = NonNullable<ProductCardData['image']>;

function CardPhoto({
  image,
  sizes,
  priority,
  className,
}: {
  image: Pick<CardImage, 'asset' | 'alt' | 'hotspot' | 'crop'> & { lqip?: string | null };
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={urlFor(image).width(800).height(1000).url()}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip ?? undefined}
      className={className}
    />
  );
}

/**
 * Catalog card. On hover (pointer devices) or keyboard focus: the second photo fades in and
 * a panel with the details and "Voir la création" slides up. Touch devices skip the effect.
 */
export function ProductCard({
  product,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority = false,
}: {
  product: ProductCardData;
  sizes?: string;
  priority?: boolean;
}) {
  const { image, hoverImage } = product;
  const sold = product.status === 'sold';
  const category = categoryLabel(product.category);
  const details = [product.leatherColor && `Cuir ${product.leatherColor.toLowerCase()}`, category]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link href={`/boutique/${product.slug}`} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand group-focus-visible:ring-2 group-focus-visible:ring-cognac group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-linen">
        {image?.asset ? (
          <>
            <CardPhoto
              image={image}
              sizes={sizes}
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {hoverImage?.asset && (
              <CardPhoto
                image={hoverImage}
                sizes={sizes}
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <EarringMotif className="h-1/2 w-auto text-cognac/60 transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          {sold ? (
            <Badge tone="espresso">Vendu</Badge>
          ) : (
            product.stock <= 1 && <Badge>Pièce unique</Badge>
          )}
        </div>

        {/* Hover details: a visual duplicate of the link, hidden from screen readers. */}
        <div
          aria-hidden
          className="absolute inset-x-3 bottom-3 translate-y-3 rounded-xl bg-linen/95 px-4 py-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          {details && <p className="truncate text-xs text-muted">{details}</p>}
          <p className="mt-1 flex items-center justify-between text-sm font-medium text-espresso">
            {sold ? 'Voir la pièce' : 'Voir la création'}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </p>
        </div>
      </div>

      {category && <p className="mt-3 label-caps text-[0.6rem] text-muted">{category}</p>}
      <p className="mt-1 font-display text-lg leading-tight group-hover:text-cognac">
        {product.title}
      </p>
      <p className="mt-1 text-sm text-cognac">{formatPrice(product.price)}</p>
    </Link>
  );
}
