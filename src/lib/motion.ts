import type { Transition, Variants } from 'motion/react';

/** Shared easing for every reveal: fast start, long soft landing. */
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export const DURATION = { short: 0.6, base: 0.75, long: 0.9 } as const;

/** Delay between siblings in a staggered grid. */
export const STAGGER = 0.07;

export const transition: Transition = { duration: DURATION.base, ease: EASE_PREMIUM };

/** Reveal only once, a little before the element is fully in view. */
export const VIEWPORT = { once: true, margin: '0px 0px -10% 0px' } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

/** A line (or word) sliding up from behind an overflow:hidden mask. */
export const lineUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: DURATION.long, ease: EASE_PREMIUM } },
};

/** Photo uncovered from the bottom while it settles from a slight zoom. */
export const imageReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: DURATION.long + 0.2, ease: EASE_PREMIUM },
  },
};

export const staggerChildren = (stagger = STAGGER): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});
