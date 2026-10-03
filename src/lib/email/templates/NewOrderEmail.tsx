import { Button, Text } from '@react-email/components';
import { buttonStyle, EmailLayout, heading, label, text } from './EmailLayout';
import { AddressBlock, OrderSummary, type EmailOrder } from './OrderSummary';

/** To Delphine: a new paid order to prepare. */
export function NewOrderEmail({ order, studioUrl }: { order: EmailOrder; studioUrl: string }) {
  return (
    <EmailLayout preview={`Nouvelle commande ${order.number} — ${order.customer.name ?? ''}`}>
      <Text style={label}>Nouvelle commande</Text>
      <Text style={heading}>{order.number}</Text>
      <Text style={label}>Cliente</Text>
      <Text style={text}>
        {order.customer.name}
        <br />
        {order.customer.email}
        {order.customer.phone && (
          <>
            <br />
            {order.customer.phone}
          </>
        )}
      </Text>
      <OrderSummary order={order} />
      <Text style={label}>
        {order.shippingMethod === 'retrait' ? 'Retrait dans la Vaunage' : 'Colissimo'}
      </Text>
      <AddressBlock order={order} />
      <Button href={studioUrl} style={buttonStyle}>
        Ouvrir la commande
      </Button>
    </EmailLayout>
  );
}
