import type { ReactNode } from 'react';
import { cn } from './cn';

type Tone = 'olive' | 'sand' | 'espresso';

const tones: Record<Tone, string> = {
  olive: 'bg-olive text-white',
  sand: 'bg-sand text-espresso',
  espresso: 'bg-espresso text-linen',
};

export function Badge({
  tone = 'olive',
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
        'inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-medium tracking-[0.2em] uppercase',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
