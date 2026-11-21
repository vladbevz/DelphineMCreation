import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Button } from '@/components/ui/Button';
import { productAvailabilityNote, type Delays } from '@/lib/delivery';

type Props = {
  productId: string;
  title: string;
  price: number;
  /** Pieces ready to ship; at 0 the piece is made to order. */
  stock: number;
  delays: Delays;
  vacationMessage: string | null;
};

/** Purchase area: add to cart and the shipping delay, or why the shop is paused. */
export function ProductActions({ productId, title, price, stock, delays, vacationMessage }: Props) {
  if (vacationMessage) {
    return (
      <div>
        <Button disabled className="w-full sm:w-auto sm:min-w-64">
          Boutique en pause
        </Button>
        <p className="mt-3 text-sm text-gris">{vacationMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <AddToCartButton productId={productId} title={title} price={price} />
      {/* The delay is shown before purchase (L216-1), as in the cart and on Stripe. */}
      <p className="mt-3 text-sm text-gris">{productAvailabilityNote(stock, delays)}</p>
    </div>
  );
}
