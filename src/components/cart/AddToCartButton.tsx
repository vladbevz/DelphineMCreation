'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/tracking';
import { useCart } from './CartProvider';

const CONFIRM_MS = 1200;
/** Leave time to see the tick and the header counter bounce before the drawer covers them. */
const OPEN_DRAWER_AFTER_MS = 800;

export function AddToCartButton({
  productId,
  title,
  price,
}: {
  productId: string;
  title: string;
  price: number;
}) {
  const { ids, add, open } = useCart();
  const inCart = ids.includes(productId);
  const [justAdded, setJustAdded] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const label = justAdded
    ? 'Ajouté'
    : inCart
      ? 'Dans votre panier — voir le panier'
      : 'Ajouter au panier';

  return (
    <Button
      className="w-full overflow-hidden sm:w-auto sm:min-w-64"
      variant={inCart && !justAdded ? 'secondary' : 'primary'}
      aria-live="polite"
      onClick={() => {
        if (inCart) {
          open();
          return;
        }
        add(productId);
        trackEvent('AddToCart', {
          content_ids: [productId],
          content_name: title,
          content_type: 'product',
          value: price / 100,
          currency: 'EUR',
        });
        setJustAdded(true);
        timers.current.push(
          window.setTimeout(open, OPEN_DRAWER_AFTER_MS),
          window.setTimeout(() => setJustAdded(false), CONFIRM_MS),
        );
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={label}
          className="inline-flex items-center gap-2"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {justAdded && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
              aria-hidden
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          )}
          {label}
        </m.span>
      </AnimatePresence>
    </Button>
  );
}
