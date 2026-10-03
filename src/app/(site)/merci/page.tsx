import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type Stripe from 'stripe';
import { ClearCart } from '@/components/cart/ClearCart';
import { TrackPurchase } from '@/components/cart/TrackPurchase';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { formatPrice } from '@/lib/format';
import { client } from '@/lib/sanity/client';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { stripeSessionIdSchema } from '@/lib/validation';

export const metadata: Metadata = {
  title: 'Merci pour votre commande',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

/** Reads the session straight from Stripe: it does not wait for the webhook. */
export default async function MerciPage({ searchParams }: Props) {
  const parsed = stripeSessionIdSchema.safeParse((await searchParams).session_id);
  if (!parsed.success || !isStripeConfigured) redirect('/');

  let session: Stripe.Checkout.Session;
  try {
    session = await getStripe().checkout.sessions.retrieve(parsed.data, {
      expand: ['line_items', 'shipping_cost.shipping_rate'],
    });
  } catch {
    redirect('/');
  }
  if (session.status !== 'complete') redirect('/');

  // The order number exists once the webhook has run (usually before the customer lands here).
  const orderNumber = await client
    .withConfig({ useCdn: false })
    .fetch<string | null>(
      `*[_id == $id][0].number`,
      { id: `order-${session.id}` },
      { cache: 'no-store' },
    )
    .catch(() => null);

  const paid = session.payment_status === 'paid';
  const pickup =
    session.shipping_cost?.shipping_rate && typeof session.shipping_cost.shipping_rate !== 'string'
      ? session.shipping_cost.shipping_rate.metadata?.method === 'retrait'
      : false;
  const items = session.line_items?.data ?? [];
  const productIds = session.metadata?.productIds?.split(',') ?? [];

  return (
    <Container className="py-16 sm:py-24">
      <ClearCart />
      {paid && (
        <TrackPurchase
          sessionId={session.id}
          value={session.amount_total ?? 0}
          productIds={productIds}
        />
      )}

      <SectionHeading
        as="h1"
        label={orderNumber ? `Commande ${orderNumber}` : 'Commande confirmée'}
        title={
          <>
            Merci <em>infiniment</em>
          </>
        }
        intro={
          <p>
            {paid
              ? 'Votre paiement est confirmé.'
              : 'Votre commande est enregistrée : elle sera confirmée dès réception du paiement.'}{' '}
            Un e-mail de confirmation vous a été envoyé
            {session.customer_details?.email ? ` à ${session.customer_details.email}` : ''}.
          </p>
        }
      />

      <div className="mt-12 max-w-xl rounded-3xl bg-cream p-6 sm:p-8">
        <ul className="divide-y divide-sand-border">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3">
              <span>{item.description}</span>
              <span className="shrink-0">{formatPrice(item.amount_total)}</span>
            </li>
          ))}
          <li className="flex justify-between gap-4 py-3 text-muted">
            <span>Livraison</span>
            <span>{formatPrice(session.shipping_cost?.amount_total ?? 0)}</span>
          </li>
          <li className="flex justify-between gap-4 pt-4 text-lg">
            <span>Total</span>
            <span className="text-cognac">{formatPrice(session.amount_total ?? 0)}</span>
          </li>
        </ul>
      </div>

      <div className="mt-12 max-w-xl space-y-3 text-muted">
        <h2 className="text-2xl text-espresso">Et maintenant ?</h2>
        <p>
          {pickup
            ? 'Je vous contacte très vite pour convenir du retrait dans la Vaunage.'
            : 'Je prépare votre colis avec soin. Vous recevrez un e-mail avec le numéro de suivi dès son envoi.'}
        </p>
        <p>[TEXTE À FOURNIR : délais de préparation]</p>
      </div>

      <ButtonLink href="/boutique" variant="secondary" className="mt-12">
        Retour à la boutique
      </ButtonLink>
    </Container>
  );
}
