import Link from 'next/link';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { Button } from '@/components/ui/Button';

type Props = {
  productId: string;
  title: string;
  price: number;
  status: 'available' | 'reserved' | 'sold' | null;
  vacationMessage: string | null;
};

/** Purchase area: add to cart, or why the piece cannot be bought right now. */
export function ProductActions({ productId, title, price, status, vacationMessage }: Props) {
  if (status === 'sold') {
    return (
      <div>
        <Button disabled className="w-full sm:w-auto sm:min-w-64">
          Vendu
        </Button>
        <p className="mt-3 text-sm text-muted">
          Cette pièce unique a déjà trouvé preneur. Une création similaire vous plairait ? Pensez au{' '}
          <Link href="/sur-mesure" className="text-cognac underline underline-offset-4">
            sur-mesure
          </Link>
          .
        </p>
      </div>
    );
  }

  if (vacationMessage) {
    return (
      <div>
        <Button disabled className="w-full sm:w-auto sm:min-w-64">
          Boutique en pause
        </Button>
        <p className="mt-3 text-sm text-muted">{vacationMessage}</p>
      </div>
    );
  }

  if (status === 'reserved') {
    return (
      <div>
        <Button disabled className="w-full sm:w-auto sm:min-w-64">
          Réservé
        </Button>
        <p className="mt-3 text-sm text-muted">
          Un paiement est en cours pour cette pièce. S’il n’aboutit pas, elle sera de nouveau
          disponible d’ici 30 minutes.
        </p>
      </div>
    );
  }

  return <AddToCartButton productId={productId} title={title} price={price} />;
}
