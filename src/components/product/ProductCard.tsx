import Image from 'next/image';
import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/format';
import { urlFor } from '@/lib/sanity/image';
import type { LATEST_PRODUCTS_QUERY_RESULT } from '@/sanity/types';

export type ProductCardData = LATEST_PRODUCTS_QUERY_RESULT[number];

export function ProductCard({
  product,
  sizes = '(min-width: 1024px) 25vw, 50vw',
  priority = false,
}: {
  product: ProductCardData;
  sizes?: string;
  priority?: boolean;
}) {
  const { image } = product;
  const sold = product.status === 'sold';

  return (
    <Link href={`/boutique/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        {image?.asset ? (
          <Image
            src={urlFor(image).width(800).height(1000).url()}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={image.lqip ? 'blur' : 'empty'}
            blurDataURL={image.lqip ?? undefined}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <EarringMotif className="h-1/2 w-auto text-cognac/60" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {sold ? (
            <Badge tone="espresso">Vendu</Badge>
          ) : (
            product.stock <= 1 && <Badge>Pièce unique</Badge>
          )}
        </div>
      </div>
      <p className="mt-3 font-display text-lg leading-tight group-hover:text-cognac">
        {product.title}
      </p>
      <p className="mt-1 text-sm text-cognac">{formatPrice(product.price)}</p>
    </Link>
  );
}
