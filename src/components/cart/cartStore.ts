// Browser cart: only product ids (prices and availability always come from the server).
// localStorage-backed external store, synced across tabs via the `storage` event.

const CART_KEY = 'dmc-cart';
const PENDING_KEY = 'dmc-checkout';
const MAX_ITEMS = 10;

export type CartState = {
  ids: string[];
  /** Stripe session opened by this browser and not finished yet. */
  pendingSessionId: string | null;
};

const EMPTY: CartState = { ids: [], pendingSessionId: null };

let state: CartState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function read(): CartState {
  try {
    const ids = JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
    return {
      ids: Array.isArray(ids) ? ids.filter((id) => typeof id === 'string').slice(0, MAX_ITEMS) : [],
      pendingSessionId: localStorage.getItem(PENDING_KEY),
    };
  } catch {
    return EMPTY;
  }
}

function write(next: CartState) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(next.ids));
    if (next.pendingSessionId) localStorage.setItem(PENDING_KEY, next.pendingSessionId);
    else localStorage.removeItem(PENDING_KEY);
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
      if (e.key === CART_KEY || e.key === PENDING_KEY) {
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
  /** Pièces uniques: adding an id already in the cart is a no-op. */
  add(id: string) {
    update((s) =>
      s.ids.includes(id) || s.ids.length >= MAX_ITEMS ? s : { ...s, ids: [...s.ids, id] },
    );
  },
  remove(ids: string[]) {
    update((s) => ({ ...s, ids: s.ids.filter((id) => !ids.includes(id)) }));
  },
  setPending(sessionId: string | null) {
    update((s) => ({ ...s, pendingSessionId: sessionId }));
  },
  clear() {
    update(() => EMPTY);
  },
};
