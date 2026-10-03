import 'server-only';
import { sendEmail } from './email/send';
import { ShippedEmail } from './email/templates/ShippedEmail';
import { writeClient } from './sanity/writeClient';

type ShippedOrder = {
  _id: string;
  _rev: string;
  number: string;
  status: string;
  shippingMethod: 'colissimo' | 'retrait';
  trackingNumber?: string;
  shippedEmailSentAt?: string;
  customer?: { name?: string; email?: string };
};

/**
 * Sends "Votre colis est parti" once per order. The webhook body is only a hint: the
 * order is re-read with the write token, and `shippedEmailSentAt` guards against repeats
 * (Sanity retries, or Delphine re-publishing the order).
 */
export async function notifyOrderShipped(orderId: string) {
  const order = await writeClient.getDocument<ShippedOrder>(orderId);
  if (!order || order.status !== 'shipped' || order.shippedEmailSentAt) return 'skipped';
  if (order.shippingMethod !== 'colissimo' || !order.trackingNumber || !order.customer?.email) {
    return 'skipped';
  }

  const sent = await sendEmail({
    to: order.customer.email,
    subject: `Votre colis ${order.number} est parti`,
    react: (
      <ShippedEmail
        number={order.number}
        customerName={order.customer.name}
        trackingNumber={order.trackingNumber}
      />
    ),
    idempotencyKey: `shipped/${order._id}/${order.trackingNumber}`,
  });
  if (!sent) return 'failed';

  await writeClient.patch(order._id).set({ shippedEmailSentAt: new Date().toISOString() }).commit();
  return 'sent';
}
