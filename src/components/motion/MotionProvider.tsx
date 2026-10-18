'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Animation features load in a separate chunk, once the browser is idle after hydration: they
 * never compete with the first paint or the LCP image (Lighthouse mobile ≥ 90).
 */
const loadFeatures = () =>
  new Promise<void>((resolve) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => resolve(), { timeout: 1500 });
    } else {
      setTimeout(resolve, 200);
    }
  }).then(() => import('./features').then((mod) => mod.default));

/**
 * Wraps the public site. `reducedMotion="user"` turns every transform animation into an instant
 * change when the visitor prefers reduced motion (opacity is handled by [data-reveal] in CSS).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
