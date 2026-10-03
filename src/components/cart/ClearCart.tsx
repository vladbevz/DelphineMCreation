'use client';

import { useEffect } from 'react';
import { cartStore } from './cartStore';

/** Empties the cart once the order is paid (Merci page). */
export function ClearCart() {
  useEffect(() => {
    cartStore.clear();
  }, []);
  return null;
}
