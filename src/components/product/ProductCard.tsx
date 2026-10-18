import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { Badge } from '@/components/ui/Badge';
import { categoryColor, categoryLabel } from '@/lib/catalog';
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
      src={urlFor(image).width(800).height(800).url()}
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
      {/* Shared name with the first gallery photo: the image flies into the product page. */}
      <ViewTransition name={`product-image-${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-sand group-focus-visible:ring-2 group-focus-visible:ring-cognac group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-linen">
          {image?.asset ? (
            <>
              <CardPhoto
                image={image}
                sizes={sizes}
                priority={priority}
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
              />
              {hoverImage?.asset && (
                <CardPhoto
                  image={hoverImage}
                  sizes={sizes}
                  className="scale-105 object-cover opacity-0 transition-[opacity,scale] duration-700 ease-premium group-hover:scale-100 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <EarringMotif className="h-2/5 w-auto text-cognac/50 transition-transform duration-1000 group-hover:scale-[1.04]" />
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
            className="absolute inset-x-0 bottom-0 translate-y-full bg-linen/95 px-4 py-3 transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
          >
            {details && <p className="truncate text-[0.7rem] text-muted">{details}</p>}
            <p className="mt-0.5 flex items-center justify-between text-[0.65rem] font-medium tracking-[0.2em] text-espresso uppercase">
              {sold ? 'Voir la pièce' : 'Voir la création'}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </p>
          </div>
        </div>
      </ViewTransition>
      {/* Category colour line drawing in under the photo on hover (pointer devices only). */}
      <span
        aria-hidden
        className={`block h-1 origin-left scale-x-0 transition-transform duration-500 ease-premium group-hover:scale-x-100 group-focus-visible:scale-x-100 ${categoryColor(product.category).bg}`}
      />

      <p className="mt-3 font-display text-lg leading-snug sm:text-xl">{product.title}</p>
      <p className="mt-0.5 text-[0.8rem] text-espresso/80">
        {category && <span className="text-muted">{category} · </span>}
        {formatPrice(product.price)}
      </p>
    </Link>
  );
}
