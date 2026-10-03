import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { defineField, defineType } from 'sanity';
import { categories, imageArrayMember } from './shared';

const requestStatuses = [
  { title: 'Nouvelle', value: 'new' },
  { title: 'Répondu', value: 'replied' },
  { title: 'Acceptée', value: 'accepted' },
  { title: 'Clôturée', value: 'closed' },
];
const statusLabel = Object.fromEntries(requestStatuses.map((s) => [s.value, s.title]));

// Created by the sur-mesure form (stage 5). Delphine only updates `status`.
export const customRequest = defineType({
  name: 'customRequest',
  title: 'Demande sur-mesure',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'status',
      title: 'Suivi',
      type: 'string',
      options: { list: requestStatuses, layout: 'radio' },
      initialValue: 'new',
    }),
    defineField({ name: 'createdAt', title: 'Reçue le', type: 'datetime', readOnly: true }),
    defineField({ name: 'name', title: 'Nom', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'E-mail', type: 'string', readOnly: true }),
    defineField({ name: 'phone', title: 'Téléphone', type: 'string', readOnly: true }),
    defineField({
      name: 'type',
      title: 'Type de bijou',
      type: 'string',
      readOnly: true,
      options: { list: categories },
    }),
    defineField({ name: 'colors', title: 'Couleurs souhaitées', type: 'string', readOnly: true }),
    defineField({ name: 'budget', title: 'Budget', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', rows: 6, readOnly: true }),
    defineField({
      name: 'images',
      title: 'Photos d’inspiration',
      type: 'array',
      readOnly: true,
      of: [imageArrayMember],
      options: { layout: 'grid' },
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
    select: { name: 'name', type: 'type', status: 'status', createdAt: 'createdAt' },
    prepare({ name, type, status, createdAt }) {
      const date = createdAt ? new Date(createdAt as string).toLocaleDateString('fr-FR') : '';
      const typeLabel = categories.find((c) => c.value === type)?.title;
      return {
        title: name ?? 'Demande',
        subtitle: [statusLabel[status as string], typeLabel, date].filter(Boolean).join(' · '),
      };
    },
  },
});
