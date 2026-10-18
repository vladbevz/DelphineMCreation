'use client';

import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { cn } from '@/components/ui/cn';
import { fadeUp, imageReveal, lineUp, staggerChildren, VIEWPORT } from '@/lib/motion';

/**
 * Scroll reveals. Rules (CLAUDE.md §3): transform / opacity / clip-path only, once, and never on
 * the LCP element (hero photo, first product photo) — those render as plain markup.
 */

/** Fades and lifts a block when it enters the viewport. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      data-reveal
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </m.div>
  );
}

/** Children appear one after another (grids). Wrap each child in <StaggerItem>. */
export function Stagger({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  const Tag = as === 'ul' ? m.ul : as === 'ol' ? m.ol : m.div;
  return (
    <Tag
      data-reveal
      className={className}
      variants={staggerChildren()}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li';
}) {
  const Tag = as === 'li' ? m.li : m.div;
  return (
    <Tag data-reveal className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}

/** Photo uncovered with a clip-path inset. The box keeps its size from the start (no CLS). */
export function RevealImage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    // The wrapper is observed, not the clipped element: a fully clipped box (inset 100%) has no
    // visible area, so IntersectionObserver would never report it (and lazy images never load).
    <m.div
      className={cn('overflow-hidden', className)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <m.div data-reveal className="relative h-full w-full" variants={imageReveal}>
        {children}
      </m.div>
    </m.div>
  );
}

/**
 * Splits plain text into words that slide up from a mask, one after the other.
 * Screen readers get the whole sentence once (aria-label), not word by word.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <m.span
      data-reveal
      className={className}
      aria-label={text}
      role="text"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <m.span data-reveal className="inline-block" variants={lineUp}>
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </m.span>
        </span>
      ))}
    </m.span>
  );
}
