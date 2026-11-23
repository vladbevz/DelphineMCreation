import type { ReactNode } from 'react';
import { cn } from './cn';

type Tone = 'outline' | 'nouveau';

const tones: Record<Tone, string> = {
  outline: 'border border-graphite/60 bg-blanc/80 text-graphite',
  nouveau: 'border border-rose-texte bg-rose-texte text-blanc',
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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
