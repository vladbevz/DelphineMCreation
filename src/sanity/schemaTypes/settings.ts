import { CogIcon } from '@sanity/icons/Cog';
import { defineField, defineType } from 'sanity';
import { moneyField } from './shared';

export const SETTINGS_ID = 'settings';

export const settings = defineType({
  name: 'settings',
  title: 'Réglages',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'shop', title: 'Boutique', default: true },
    { name: 'shipping', title: 'Livraison' },
    { name: 'contact', title: 'Contact' },
    { name: 'legal', title: 'Documents légaux' },
  ],
  fields: [
    defineField({
      name: 'vacationMode',
      title: 'Mode vacances',
      description:
        'Quand il est activé, les achats sont suspendus et le message s’affiche sur le site.',
      type: 'object',
      group: 'shop',
      fields: [
        defineField({ name: 'enabled', title: 'Activer', type: 'boolean', initialValue: false }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 2,
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),
    defineField({
      name: 'announcementBar',
      title: 'Bandeau d’annonce',
      description: 'Petit message en haut de toutes les pages.',
      type: 'object',
      group: 'shop',
      fields: [
        defineField({ name: 'enabled', title: 'Afficher', type: 'boolean', initialValue: false }),
        defineField({
          name: 'text',
          title: 'Texte',
          type: 'string',
          hidden: ({ parent }) => !parent?.enabled,
        }),
      ],
    }),
    moneyField({ name: 'colissimoPrice', title: 'Prix Colissimo', group: 'shipping' }),
    moneyField({
      name: 'freeShippingThreshold',
      title: 'Livraison offerte à partir de',
      description: 'Laisser vide pour ne jamais offrir la livraison.',
      group: 'shipping',
    }),
    defineField({
      name: 'pickupEnabled',
      title: 'Proposer le retrait dans la Vaunage',
      type: 'boolean',
      group: 'shipping',
      initialValue: false,
    }),
    defineField({ name: 'email', title: 'E-mail de contact', type: 'email', group: 'contact' }),
    defineField({
      name: 'postalAddress',
      title: 'Adresse postale',
      description:
        'Imprimée dans le formulaire de rétractation envoyé avec chaque commande (obligation légale).',
      type: 'text',
      rows: 3,
      group: ['contact', 'legal'],
    }),
    defineField({
      name: 'cgvPdf',
      title: 'CGV (PDF)',
      description:
        'Joint automatiquement à l’e-mail de confirmation de commande. Remplacez-le à chaque modification des CGV.',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'legal',
    }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', group: 'contact' }),
    defineField({ name: 'instagram', title: 'Lien Instagram', type: 'url', group: 'contact' }),
    defineField({ name: 'facebook', title: 'Lien Facebook', type: 'url', group: 'contact' }),
    // Order number counter (DMC-YYYY-0001), incremented by the Stripe webhook in a transaction.
    defineField({ name: 'orderCounterYear', type: 'number', readOnly: true, hidden: true }),
    defineField({ name: 'orderCounter', type: 'number', readOnly: true, hidden: true }),
  ],
  preview: { prepare: () => ({ title: 'Réglages' }) },
});
