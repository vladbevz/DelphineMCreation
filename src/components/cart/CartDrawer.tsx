'use client';

import * as m from 'motion/react-m';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, useTransition } from 'react';
import { getCartItems, type CartItem } from '@/app/actions/cart';
import { Button } from '@/components/ui/Button';
import { lineAvailabilityNote, MAX_QUANTITY, type Delays } from '@/lib/delivery';
import { formatPrice } from '@/lib/format';
import { fadeUp, staggerChildren } from '@/lib/motion';
import { trackEvent } from '@/lib/tracking';
import { useCart } from './CartProvider';

type CheckoutError =
  | { error: 'unavailable'; unavailable: string[] }
  | { error: 'vacation'; message: string }
  | { error: string };

export function CartDrawer({
  freeShippingThreshold,
  delays,
}: {
  freeShippingThreshold: number | null;
  delays: Delays;
}) {
  const { lines, isOpen, close, remove, setQty } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [notices, setNotices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, startLoading] = useTransition();
  const [isRedirecting, startRedirect] = useTransition();

  // Open/close the native modal (focus trap, Esc, inert background for free).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Each time the drawer opens or pieces are added/removed: fresh prices and ready stock
  // (quantity changes reuse them). A piece taken offline by Delphine leaves the cart.
  const idsKey = lines.map((l) => l.id).join(',');
  useEffect(() => {
    if (!isOpen) return;
    startLoading(async () => {
      const ids = idsKey ? idsKey.split(',') : [];
      const fresh = await getCartItems(ids);
      const freshIds = new Set(fresh.map((i) => i._id));
      const gone = ids.filter((id) => !freshIds.has(id));
      if (gone.length) {
        remove(gone);
        setNotices((n) => [
          ...n,
          gone.length > 1
            ? 'Des créations ne sont plus en vente et ont été retirées de votre panier.'
            : 'Une création n’est plus en vente et a été retirée de votre panier.',
        ]);
      }
      setItems(fresh);
    });
  }, [isOpen, idsKey, remove]);

  const qtyOf = (id: string) => lines.find((l) => l.id === id)?.qty ?? 0;
  const buyable = (items ?? [])
    .filter((i) => qtyOf(i._id) > 0)
    .map((i) => ({ ...i, qty: qtyOf(i._id) }));
  const subtotal = buyable.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = buyable.reduce((sum, i) => sum + i.qty, 0);

  const checkout = () => {
    setError(null);
    startRedirect(async () => {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: buyable.map((i) => ({ productId: i._id, quantity: i.qty })),
        }),
      }).catch(() => null);

      if (response?.ok) {
        const { url } = (await response.json()) as { url: string };
        trackEvent('InitiateCheckout', {
          content_ids: buyable.map((i) => i._id),
          value: subtotal / 100,
          currency: 'EUR',
          num_items: count,
        });
        window.location.assign(url);
        return;
      }

      const body = (await response?.json().catch(() => null)) as CheckoutError | null;
      if (body?.error === 'unavailable' && 'unavailable' in body) {
        setError('Une création n’est plus en vente. Votre panier a été mis à jour.');
        remove(body.unavailable);
      } else if (body?.error === 'vacation' && 'message' in body) {
        setError(body.message);
      } else if (response?.status === 503) {
        setError('Le paiement en ligne n’est pas encore disponible. Revenez très bientôt !');
      } else {
        setError('Une erreur est survenue. Merci de réessayer dans un instant.');
      }
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-labelledby="cart-title"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md bg-transparent p-0 text-espresso backdrop:bg-espresso/40"
    >
      {/* Panel slides in on a soft spring each time the drawer opens. */}
      <m.div
        key={isOpen ? 'open' : 'closed'}
        className="flex h-full flex-col bg-linen"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }}
      >
        <div className="flex items-center justify-between border-b border-sand-border px-5 py-4">
          <h2 id="cart-title" className="text-2xl">
            Votre panier
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fermer le panier"
            className="inline-flex size-11 items-center justify-center rounded-full hover:bg-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="size-6"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6" aria-busy={isLoading}>
          {notices.length > 0 && (
            <div role="status" className="mb-6 space-y-2 bg-cream p-4 text-sm">
              {notices.map((n) => (
                <p key={n}>{n}</p>
              ))}
              <button
                type="button"
                onClick={() => setNotices([])}
                className="text-cognac underline underline-offset-4"
              >
                J’ai compris
              </button>
            </div>
          )}

          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="heading text-2xl">Votre panier est vide</p>
              <Link
                href="/boutique"
                onClick={close}
                className="mt-4 inline-block text-cognac underline underline-offset-4"
              >
                Découvrir les créations
              </Link>
            </div>
          ) : items === null ? (
            <p className="py-16 text-center text-muted">Chargement…</p>
          ) : (
            <m.ul
              className="space-y-5"
              variants={staggerChildren(0.06)}
              initial="hidden"
              animate="visible"
            >
              {buyable.map((item) => (
                <m.li key={item._id} className="flex gap-4" variants={fadeUp}>
                  <Link
                    href={`/boutique/${item.slug}`}
                    onClick={close}
                    className="relative aspect-square w-20 shrink-0 overflow-hidden bg-sand"
                  >
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      href={`/boutique/${item.slug}`}
                      onClick={close}
                      className="product-title text-lg hover:text-cognac"
                    >
                      {item.title}
                    </Link>
                    <p className="price text-sm text-cognac">
                      {formatPrice(item.price * item.qty)}
                      {item.qty > 1 && (
                        <span className="text-muted"> · {formatPrice(item.price)} l’unité</span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {lineAvailabilityNote(item.qty, item.stock, delays)}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <QuantityStepper
                        title={item.title}
                        qty={item.qty}
                        onChange={(qty) => setQty(item._id, qty)}
                      />
                      <button
                        type="button"
                        onClick={() => remove([item._id])}
                        className="py-1 text-xs text-muted underline underline-offset-4 hover:text-espresso"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </m.li>
              ))}
            </m.ul>
          )}
        </div>

        {buyable.length > 0 && (
          <div className="border-t border-sand-border px-5 py-5">
            <div className="flex items-baseline justify-between">
              <span>Sous-total</span>
              <span className="price text-xl text-cognac">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-muted">Livraison calculée à l’étape suivante.</p>
            {freeShippingThreshold !== null && (
              <FreeShippingBar subtotal={subtotal} threshold={freeShippingThreshold} />
            )}
            {error && (
              <p role="alert" className="mt-4 bg-cream p-3 text-sm">
                {error}
              </p>
            )}
            <Button
              onClick={checkout}
              disabled={isRedirecting || isLoading}
              className="mt-4 w-full"
            >
              {isRedirecting ? 'Redirection vers le paiement…' : 'Passer commande'}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">Paiement sécurisé par Stripe</p>
          </div>
        )}
      </m.div>
    </dialog>
  );
}

/** − 2 + : 44px touch targets, the value announced to screen readers. */
function QuantityStepper({
  title,
  qty,
  onChange,
}: {
  title: string;
  qty: number;
  onChange: (qty: number) => void;
}) {
  const button =
    'inline-flex size-11 items-center justify-center text-lg disabled:cursor-not-allowed disabled:opacity-30 hover:text-cognac';
  return (
    <div
      role="group"
      aria-label={`Quantité : ${title}`}
      className="inline-flex items-center border border-sand-border"
    >
      <button
        type="button"
        className={button}
        onClick={() => onChange(qty - 1)}
        disabled={qty <= 1}
        aria-label="Retirer un exemplaire"
      >
        −
      </button>
      <span className="w-6 text-center price text-sm" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        className={button}
        onClick={() => onChange(qty + 1)}
        disabled={qty >= MAX_QUANTITY}
        aria-label="Ajouter un exemplaire"
      >
        +
      </button>
    </div>
  );
}

/** "Plus que 12,00 € pour la livraison offerte", with a bar filling up (as on manali.fr). */
function FreeShippingBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const remaining = Math.max(0, threshold - subtotal);
  const progress = threshold > 0 ? Math.min(1, subtotal / threshold) : 1;
  return (
    <div className="mt-4">
      <p className="text-xs">
        {remaining > 0 ? (
          <>
            Plus que <strong className="font-medium">{formatPrice(remaining)}</strong> pour la
            livraison offerte
          </>
        ) : (
          <strong className="font-medium">La livraison vous est offerte !</strong>
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progression vers la livraison offerte"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand"
      >
        <m.div
          className="h-full origin-left rounded-full bg-fuchsia"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}
