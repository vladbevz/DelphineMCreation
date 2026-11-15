import { Text } from '@react-email/components';
import { EmailLayout, heading, label, text } from './EmailLayout';
import { AddressBlock, OrderSummary, type EmailOrder } from './OrderSummary';
import { WithdrawalInfo, type SellerInfo } from './WithdrawalInfo';

/** To the customer, right after payment. */
export function OrderConfirmationEmail({
  order,
  seller,
  needsMaking,
  shippingDays,
}: {
  order: EmailOrder;
  seller: SellerInfo;
  /** At least one piece is made to order. */
  needsMaking: boolean;
  /** Business days before shipping (settings); null until Delphine fills it in. */
  shippingDays: number | null;
}) {
  const firstName = order.customer.name?.split(' ')[0];
  return (
    <EmailLayout preview={`Votre commande ${order.number} est confirmée`}>
      <Text style={label}>Commande {order.number}</Text>
      <Text style={heading}>Merci{firstName ? `, ${firstName}` : ''} !</Text>
      <Text style={text}>Votre paiement est bien reçu, merci pour votre confiance.</Text>
      <OrderSummary order={order} />
      <Text style={label}>{order.shippingMethod === 'retrait' ? 'Retrait' : 'Livraison'}</Text>
      <AddressBlock order={order} />
      <Text style={label}>Et maintenant ?</Text>
      {needsMaking && (
        <Text style={text}>
          Une partie de votre commande est fabriquée à la main, rien que pour vous : découpe,
          assemblage et finitions dans mon atelier de Clarensac. Le cuir étant une matière
          naturelle, votre bijou peut présenter de légères nuances avec la photo.
        </Text>
      )}
      <Text style={text}>
        {order.shippingMethod === 'retrait'
          ? `Je vous contacte ${needsMaking ? 'dès que votre bijou est prêt' : 'très vite'} pour convenir du retrait.`
          : `Votre colis part sous ${
              shippingDays
                ? `${shippingDays} jour${shippingDays > 1 ? 's' : ''} ouvré${shippingDays > 1 ? 's' : ''}`
                : '[DÉLAI]'
            }. Vous recevrez un e-mail avec le numéro de suivi dès son envoi.`}
      </Text>
      <Text style={text}>[TEXTE À FOURNIR : signature]</Text>
      <WithdrawalInfo orderNumber={order.number} seller={seller} />
    </EmailLayout>
  );
}
