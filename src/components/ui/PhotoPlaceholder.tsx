import { BrandLogo } from '@/components/brand/BrandLogo';
import { cn } from './cn';

/** Light block with the D/M monogram, standing in for a photo still to be shot. */
export function PhotoPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 bg-nuage', className)}
      role="img"
      aria-label={label}
    >
      <BrandLogo variant="mark" mono className="h-1/3 max-h-40 w-auto text-graphite/15" />
      <span className="label-caps text-gris" aria-hidden>
        {label}
      </span>
    </div>
  );
}
