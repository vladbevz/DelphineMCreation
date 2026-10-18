'use client';

import * as m from 'motion/react-m';
import type { ReactNode } from 'react';
import { lineUp, VIEWPORT } from '@/lib/motion';

/**
 * Heading text sliding up from behind a mask when it enters the viewport.
 * The mask keeps the final size from the first paint, so nothing shifts (CLS 0).
 * The mask is observed, not the moving text: hidden under the mask, the text has no visible area
 * and IntersectionObserver would never report it.
 */
export function MaskReveal({ children }: { children: ReactNode }) {
  return (
    <m.span
      className="block overflow-hidden pb-[0.12em]"
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <m.span data-reveal className="block" variants={lineUp}>
        {children}
      </m.span>
    </m.span>
  );
}
