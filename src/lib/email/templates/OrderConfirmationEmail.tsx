import { Text } from '@react-email/components';
import { EmailLayout, heading, label, text } from './EmailLayout';
import { AddressBlock, OrderSummary, type EmailOrder } from './OrderSummary';
import { WithdrawalInfo, type SellerInfo } from './WithdrawalInfo';

/** To the customer, right after payment. */
export function OrderConfirmationEmail({
  order,
  seller,
}: {
  order: EmailOrder;
  seller: SellerInfo;
}) {
  const firstName = order.customer.name?.split(' ')[0];
  return (
    <EmailLayout preview={`Votre commande ${order.number} est confirmée`}>
      <Text style={label}>Commande {order.number}</Text>
      <Text style={heading}>Merci{firstName ? `, ${firstName}` : ''} !</Text>
      <Text style={text}>
        Votre paiement est bien reçu. Chaque pièce étant unique,{' '}
        {order.items.length > 1
          ? 'elles sont désormais les vôtres.'
          : 'celle-ci est désormais la vôtre.'}
      </Text>
      <OrderSummary order={order} />
      <Text style={label}>{order.shippingMethod === 'retrait' ? 'Retrait' : 'Livraison'}</Text>
      <AddressBlock order={order} />
      <Text style={label}>Et maintenant ?</Text>
      <Text style={text}>
        {order.shippingMethod === 'retrait'
          ? 'Je vous contacte très vite pour convenir du retrait.'
          : 'Je prépare votre colis avec soin. Vous recevrez un e-mail avec le numéro de suivi dès son envoi.'}
      </Text>
      <Text style={text}>[TEXTE À FOURNIR : délais de préparation, signature]</Text>
      <WithdrawalInfo orderNumber={order.number} seller={seller} />
    </EmailLayout>
  );
}
