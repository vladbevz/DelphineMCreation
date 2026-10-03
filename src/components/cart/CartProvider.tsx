'use client';

import { createContext, use, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cartStore, type CartState } from './cartStore';

type CartContextValue = CartState & {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string) => void;
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
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: cartStore.add,
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
