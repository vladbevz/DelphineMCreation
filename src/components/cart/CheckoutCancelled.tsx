'use client';

import { useEffect } from 'react';
import { abandonCheckout } from '@/app/actions/cart';
import { cartStore } from './cartStore';
import { useCart } from './CartProvider';

/** Back from Stripe via "cancel": release the reservation now and reopen the cart. */
export function CheckoutCancelled() {
  const { open } = useCart();
  useEffect(() => {
    const { pendingSessionId } = cartStore.getSnapshot();
    if (pendingSessionId) {
      cartStore.setPending(null);
      void abandonCheckout(pendingSessionId);
    }
  }, []);

  return (
    <div
      role="status"
      className="mb-8 flex flex-col gap-3 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>Le paiement a été annulé. Vos créations sont toujours dans votre panier.</p>
      <button
        type="button"
        onClick={open}
        className="self-start text-cognac underline underline-offset-4 sm:self-auto"
      >
        Voir le panier
      </button>
    </div>
  );
}
