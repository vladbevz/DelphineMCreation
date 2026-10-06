import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { Badge } from '@/components/ui/Badge';

// Stand-in for ProductCard until products come from Sanity (stage 2).
export function ProductCardPlaceholder() {
  return (
    <Link href="/boutique" className="group block">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-sand">
        <EarringMotif className="h-2/5 w-auto text-cognac/50" />
        <Badge className="absolute top-3 left-3">Pièce unique</Badge>
      </div>
      <p className="mt-3 font-display text-lg leading-snug sm:text-xl">[NOM DU BIJOU]</p>
      <p className="mt-0.5 text-[0.8rem] text-espresso/80">[PRIX]</p>
    </Link>
  );
}
