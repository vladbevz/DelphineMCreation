'use client';

import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { fadeUp, lineUp, VIEWPORT } from '@/lib/motion';

/**
 * Scroll reveals. Rules (CLAUDE.md §3): transform / opacity only, once, and never on
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

/**
 * Grid wrappers, kept as plain markup: only the hero words animate (one orchestrated moment,
 * CLAUDE.md §3). Same API so pages do not change.
 */
export function Stagger({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'ul' | 'ol';
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
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
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
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
