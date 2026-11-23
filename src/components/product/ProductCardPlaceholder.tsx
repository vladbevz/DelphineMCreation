import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';

// Stand-in for ProductCard until products come from Sanity (stage 2).
export function ProductCardPlaceholder() {
  return (
    <Link href="/boutique" className="group block">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-nuage">
        <BrandLogo variant="mark" mono className="h-2/5 w-auto text-graphite/15" />
      </div>
      <p className="mt-3 product-title text-xl sm:text-2xl">[NOM DU BIJOU]</p>
      <p className="mt-0.5 text-[0.8rem] text-graphite/80">[PRIX]</p>
    </Link>
  );
}
