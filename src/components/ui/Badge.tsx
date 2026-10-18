import type { ReactNode } from 'react';
import { cn } from './cn';

type Tone = 'outline' | 'espresso' | 'olive' | 'nouveau';

const tones: Record<Tone, string> = {
  outline: 'border border-espresso/60 bg-linen/80 text-espresso',
  espresso: 'border border-espresso bg-espresso text-linen',
  olive: 'border border-olive bg-olive text-white',
  nouveau: 'border border-fuchsia-deep bg-fuchsia-deep text-linen',
};

export function Badge({
  tone = 'outline',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.6rem] font-medium tracking-[0.15em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
