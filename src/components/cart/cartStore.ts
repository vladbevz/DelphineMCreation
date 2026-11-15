// Browser cart: product ids and quantities only (prices and stock always come from the server).
// localStorage-backed external store, synced across tabs via the `storage` event.

import { MAX_CART_LINES, MAX_QUANTITY } from '@/lib/delivery';

const CART_KEY = 'dmc-cart';
/** Left over by the old pièce-unique checkout (pending Stripe session): removed on read. */
const LEGACY_PENDING_KEY = 'dmc-checkout';

export type CartLine = { id: string; qty: number };
export type CartState = { lines: CartLine[] };

const EMPTY: CartState = { lines: [] };

let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

const clampQty = (qty: number) => Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(qty) || 1));

function parseLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  const lines: CartLine[] = [];
  for (const entry of raw) {
    // Old format: a plain array of ids (one piece each).
    const line =
      typeof entry === 'string'
        ? { id: entry, qty: 1 }
        : entry && typeof entry === 'object' && typeof entry.id === 'string'
          ? { id: entry.id as string, qty: clampQty(Number(entry.qty)) }
          : null;
    if (line && !lines.some((l) => l.id === line.id)) lines.push(line);
  }
  return lines.slice(0, MAX_CART_LINES);
}

function read(): CartState {
  try {
    localStorage.removeItem(LEGACY_PENDING_KEY);
    return { lines: parseLines(JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')) };
  } catch {
    return EMPTY;
  }
}

function write(next: CartState) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next.lines));
  } catch {
    // Private mode or storage full: the cart still works for this page view.
  }
}

function update(fn: (s: CartState) => CartState) {
  state = fn(cartStore.getSnapshot());
  write(state);
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        state = read();
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot() {
    if (!loaded) {
      state = read();
      loaded = true;
    }
    return state;
  },
  getServerSnapshot() {
    return EMPTY;
  },
  /** One more of this piece (up to MAX_QUANTITY). Returns false if nothing could be added. */
  add(id: string) {
    const s = cartStore.getSnapshot();
    const line = s.lines.find((l) => l.id === id);
    if (line ? line.qty >= MAX_QUANTITY : s.lines.length >= MAX_CART_LINES) return false;
    update((s) => ({
      lines: line
        ? s.lines.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [...s.lines, { id, qty: 1 }],
    }));
    return true;
  },
  setQty(id: string, qty: number) {
    update((s) => ({
      lines: s.lines.map((l) => (l.id === id ? { ...l, qty: clampQty(qty) } : l)),
    }));
  },
  remove(ids: string[]) {
    update((s) => ({ lines: s.lines.filter((l) => !ids.includes(l.id)) }));
  },
  clear() {
    update(() => EMPTY);
  },
};
