'use client';

import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef } from 'react';
import { cn } from '@/components/ui/cn';
import { EarringMotif } from './EarringMotif';

type Motif = { className: string; color: string; speed: number };

/**
 * Two or three coloured earring outlines drifting at different speeds while the section scrolls.
 * Place inside a `relative` section; they sit in the margins, behind the text (aria-hidden).
 */
export function FloatingMotifs({ motifs, className }: { motifs: Motif[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {motifs.map((motif, i) => (
        <Drift key={i} motif={motif} progress={scrollYProgress} />
      ))}
    </div>
  );
}

function Drift({
  motif,
  progress,
}: {
  motif: Motif;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  // Scroll-bound values are not covered by MotionConfig reducedMotion: switch them off here.
  const still = useReducedMotion() ? 0 : 1;
  const y = useTransform(progress, [0, 1], [motif.speed * 60 * still, motif.speed * -60 * still]);
  const rotate = useTransform(
    progress,
    [0, 1],
    [-8 * motif.speed * still, 8 * motif.speed * still],
  );
  return (
    <m.div className={cn('absolute', motif.className)} style={{ y, rotate }}>
      <EarringMotif
        className={cn(
          'h-full w-auto motion-safe:animate-[float_7s_ease-in-out_infinite]',
          motif.color,
        )}
      />
    </m.div>
  );
}
