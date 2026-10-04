'use client';

import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/tracking';
import { useCart } from './CartProvider';

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

  return (
    <Button
      className="w-full sm:w-auto sm:min-w-64"
      variant={inCart ? 'secondary' : 'primary'}
      onClick={() => {
        if (!inCart) {
          add(productId);
          trackEvent('AddToCart', {
            content_ids: [productId],
            content_name: title,
            content_type: 'product',
            value: price / 100,
            currency: 'EUR',
          });
        }
        open();
      }}
    >
      {inCart ? 'Dans votre panier — voir le panier' : 'Ajouter au panier'}
    </Button>
  );
}
