import { cn } from '@/components/ui/cn';

const segments = ['bg-fuchsia', 'bg-mandarine', 'bg-soleil', 'bg-turquoise', 'bg-lavande'];

/**
 * Short rule made of the five joyful colours, as solid segments (no gradient). Signature under
 * inner page titles; decorative only.
 */
export function ColorRule({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('flex h-1 w-20', className)}>
      {segments.map((bg) => (
        <span key={bg} className={cn('flex-1', bg)} />
      ))}
    </span>
  );
}
