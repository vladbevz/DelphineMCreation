import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';
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
 * Catalog card. On hover (pointer devices) or keyboard focus the second photo fades in and a
 * thin pink line draws in under the photo. Name in the display serif, price below.
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
  const category = categoryLabel(product.category);

  return (
    <Link href={`/boutique/${product.slug}`} className="group block focus-visible:outline-none">
      {/* Shared name with the first gallery photo: the image flies into the product page. */}
      <ViewTransition name={`product-image-${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-nuage group-focus-visible:ring-2 group-focus-visible:ring-rose-texte group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-blanc">
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
              <BrandLogo
                variant="mark"
                mono
                className="h-2/5 w-auto text-graphite/15 transition-transform duration-1000 group-hover:scale-[1.04]"
              />
            </div>
          )}
        </div>
      </ViewTransition>
      {/* A thin pink line draws in under the photo on hover (pointer devices only). */}
      <span
        aria-hidden
        className="block h-0.5 origin-left scale-x-0 bg-rose transition-transform duration-500 ease-premium group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      <p className="mt-3 product-title text-xl sm:text-2xl">{product.title}</p>
      <p className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="price">{formatPrice(product.price)}</span>
        {category && <span className="text-gris">{category}</span>}
      </p>
    </Link>
  );
}
