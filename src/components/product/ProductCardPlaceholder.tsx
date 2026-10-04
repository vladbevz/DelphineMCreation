import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { Badge } from '@/components/ui/Badge';

// Stand-in for ProductCard until products come from Sanity (stage 2).
export function ProductCardPlaceholder() {
  return (
    <Link href="/boutique" className="group block">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-sand">
        <EarringMotif className="h-1/2 w-auto text-cognac/60 transition-transform duration-700 group-hover:scale-105" />
        <Badge className="absolute top-3 left-3">Pièce unique</Badge>
      </div>
      <p className="mt-3 font-display text-lg leading-tight group-hover:text-cognac">
        [NOM DU BIJOU]
      </p>
      <p className="mt-1 text-sm text-cognac">[PRIX]</p>
    </Link>
  );
}
