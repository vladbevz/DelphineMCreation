import { EarringMotif } from '@/components/brand/EarringMotif';
import { cn } from './cn';

/** Sand block with the earring motif, standing in for a photo still to be shot. */
export function PhotoPlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 bg-sand', className)}
      role="img"
      aria-label={label}
    >
      <EarringMotif className="h-1/3 max-h-40 w-auto text-cognac/60" />
      <span className="label-caps text-muted" aria-hidden>
        {label}
      </span>
    </div>
  );
}
