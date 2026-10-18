'use client';

import * as m from 'motion/react-m';
import { useState } from 'react';
import { useCart } from './CartProvider';

export function CartButton() {
  const { ids, open } = useCart();
  const count = ids.length;
  // Bounce the counter when it grows, not on first render or when items are removed.
  const [previous, setPrevious] = useState(count);
  const [bumps, setBumps] = useState(0);
  if (count !== previous) {
    setPrevious(count);
    if (count > previous) setBumps((b) => b + 1);
  }
  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 items-center gap-2 px-1 text-[0.7rem] font-medium tracking-[0.15em] whitespace-nowrap uppercase transition-colors hover:text-cognac"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
        aria-hidden
      >
        <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </svg>
      {/* Visible "Panier (N)"; the accessible name reads "Panier (N) articles". */}
      <span>
        <span className="hidden sm:inline">Panier </span>
        <m.span
          key={bumps}
          className="inline-block"
          initial={bumps > 0 ? { scale: 1.6, y: -3 } : false}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        >
          ({count})
        </m.span>
        <span className="sr-only"> article{count > 1 ? 's' : ''}</span>
      </span>
    </button>
  );
}
