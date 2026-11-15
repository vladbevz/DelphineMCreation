'use client';

import { createContext, use, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cartStore, type CartState } from './cartStore';

type CartContextValue = CartState & {
  /** Total number of pieces (sum of quantities). */
  count: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string) => boolean;
  setQty: (id: string, qty: number) => void;
  remove: (ids: string[]) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [isOpen, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(
    () => ({
      ...state,
      count: state.lines.reduce((sum, l) => sum + l.qty, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: cartStore.add,
      setQty: cartStore.setQty,
      remove: cartStore.remove,
    }),
    [state, isOpen],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
