import Link from 'next/link';
import { Button } from '@/components/ui/Button';

type Props = {
  productId: string;
  status: 'available' | 'reserved' | 'sold' | null;
  vacationMessage: string | null;
};

/** Purchase area. The real add-to-cart behaviour arrives with the cart in stage 3. */
export function ProductActions({ productId, status, vacationMessage }: Props) {
  if (status === 'sold') {
    return (
      <div>
        <Button disabled className="w-full">
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
        <Button disabled className="w-full">
          Boutique en pause
        </Button>
        <p className="mt-3 text-sm text-muted">{vacationMessage}</p>
      </div>
    );
  }

  if (status === 'reserved') {
    return (
      <div>
        <Button disabled className="w-full">
          Réservé
        </Button>
        <p className="mt-3 text-sm text-muted">
          Un paiement est en cours pour cette pièce. S’il n’aboutit pas, elle sera de nouveau
          disponible d’ici 30 minutes.
        </p>
      </div>
    );
  }

  // TODO(stage 3): replace with <AddToCartButton> wired to CartProvider.
  return (
    <Button className="w-full" data-product-id={productId}>
      Ajouter au panier
    </Button>
  );
}
