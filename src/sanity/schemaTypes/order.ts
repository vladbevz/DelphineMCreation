import { BasketIcon } from '@sanity/icons/Basket';
import { defineArrayMember, defineField, defineType } from 'sanity';
import { moneyField, orderStatuses, shippingMethods } from './shared';

const statusLabel = Object.fromEntries(orderStatuses.map((s) => [s.value, s.title]));

// Orders are created only by the Stripe webhook. Delphine edits `status` and `trackingNumber`.
export const order = defineType({
  name: 'order',
  title: 'Commande',
  type: 'document',
  icon: BasketIcon,
  fieldsets: [{ name: 'stripe', title: 'Stripe', options: { collapsible: true, collapsed: true } }],
  fields: [
    defineField({
      name: 'status',
      title: 'État de la commande',
      type: 'string',
      options: { list: orderStatuses, layout: 'radio' },
      initialValue: 'paid',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Numéro de suivi Colissimo',
      description:
        'À remplir avant de passer la commande en « Expédiée » : la cliente le reçoit par e-mail.',
      type: 'string',
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { status?: string; shippingMethod?: string } | undefined;
          if (doc?.status === 'shipped' && doc.shippingMethod === 'colissimo' && !value) {
            return 'Ajoutez le numéro de suivi pour une commande expédiée.';
          }
          return true;
        }),
    }),
    defineField({ name: 'number', title: 'Numéro', type: 'string', readOnly: true }),
    defineField({ name: 'createdAt', title: 'Date', type: 'datetime', readOnly: true }),
    defineField({
      name: 'items',
      title: 'Bijoux',
      type: 'array',
      readOnly: true,
      of: [
        defineArrayMember({
          name: 'orderItem',
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Bijou',
              type: 'reference',
              to: [{ type: 'product' }],
              // Weak: a sold product can still be deleted; title/price are snapshotted below.
              weak: true,
            }),
            defineField({ name: 'title', title: 'Nom', type: 'string' }),
            moneyField({ name: 'price', title: 'Prix' }),
          ],
          preview: {
            select: { title: 'title', price: 'price', media: 'product.images.0' },
            prepare({ title, price, media }) {
              return {
                title,
                subtitle:
                  typeof price === 'number'
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                        price / 100,
                      )
                    : undefined,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'customer',
      title: 'Cliente',
      type: 'object',
      readOnly: true,
      fields: [
        defineField({ name: 'name', title: 'Nom', type: 'string' }),
        defineField({ name: 'email', title: 'E-mail', type: 'string' }),
        defineField({ name: 'phone', title: 'Téléphone', type: 'string' }),
      ],
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Livraison',
      type: 'string',
      readOnly: true,
      options: { list: shippingMethods },
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Adresse de livraison',
      type: 'object',
      readOnly: true,
      hidden: ({ document }) => document?.shippingMethod === 'retrait',
      fields: [
        defineField({ name: 'name', title: 'Destinataire', type: 'string' }),
        defineField({ name: 'line1', title: 'Adresse', type: 'string' }),
        defineField({ name: 'line2', title: 'Complément', type: 'string' }),
        defineField({ name: 'postalCode', title: 'Code postal', type: 'string' }),
        defineField({ name: 'city', title: 'Ville', type: 'string' }),
        defineField({ name: 'country', title: 'Pays', type: 'string' }),
      ],
    }),
    defineField({
      name: 'amounts',
      title: 'Montants',
      type: 'object',
      readOnly: true,
      fields: [
        moneyField({ name: 'subtotal', title: 'Bijoux' }),
        moneyField({ name: 'shipping', title: 'Livraison' }),
        moneyField({ name: 'total', title: 'Total payé' }),
      ],
    }),
    // Idempotency for the "Votre colis est parti" e-mail (Sanity webhook).
    defineField({ name: 'shippedEmailSentAt', type: 'datetime', readOnly: true, hidden: true }),
    defineField({
      name: 'stripeSessionId',
      title: 'Session Checkout',
      type: 'string',
      readOnly: true,
      fieldset: 'stripe',
    }),
    defineField({
      name: 'stripePaymentIntentId',
      title: 'Paiement (Payment Intent)',
      description: 'À rechercher dans le tableau de bord Stripe pour un remboursement.',
      type: 'string',
      readOnly: true,
      fieldset: 'stripe',
    }),
  ],
  orderings: [
    {
      title: 'Plus récentes',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { number: 'number', name: 'customer.name', total: 'amounts.total', status: 'status' },
    prepare({ number, name, total, status }) {
      const euros =
        typeof total === 'number'
          ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
              total / 100,
            )
          : '';
      return {
        title: `${number ?? 'Commande'} · ${name ?? ''}`,
        subtitle: [euros, statusLabel[status as string]].filter(Boolean).join(' · '),
      };
    },
  },
});
