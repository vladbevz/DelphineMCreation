import { defineArrayMember, defineField, defineType } from 'sanity';
import { PriceInput } from '../components/PriceInput';

export const categories = [
  { title: "Boucles d'oreilles", value: 'boucles-d-oreilles' },
  { title: 'Collier', value: 'collier' },
  { title: 'Bracelet', value: 'bracelet' },
  { title: 'Bague', value: 'bague' },
  { title: 'Autre', value: 'autre' },
];

export const productStatuses = [
  { title: 'Disponible', value: 'available' },
  { title: 'Réservé (paiement en cours)', value: 'reserved' },
  { title: 'Vendu', value: 'sold' },
];

export const orderStatuses = [
  { title: 'Payée — à expédier', value: 'paid' },
  { title: 'Expédiée', value: 'shipped' },
  { title: 'Livrée', value: 'delivered' },
  { title: 'Remboursée', value: 'refunded' },
  { title: 'Annulée', value: 'cancelled' },
];

export const shippingMethods = [
  { title: 'Colissimo', value: 'colissimo' },
  { title: 'Retrait dans la Vaunage', value: 'retrait' },
];

/** A price stored as integer cents and edited in euros. */
export function moneyField({
  name,
  title,
  description,
  required = false,
  readOnly = false,
  group,
}: {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
  readOnly?: boolean;
  group?: string;
}) {
  return defineField({
    name,
    title,
    description,
    type: 'number',
    readOnly,
    group,
    components: { input: PriceInput },
    validation: (rule) => (required ? rule.required() : rule).integer().min(0),
  });
}

/** Image with hotspot and a required alt text. */
export function imageField(name: string, title: string, required = true) {
  return defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Texte alternatif',
        description: "Décrivez l'image en quelques mots (pour l'accessibilité et Google).",
        type: 'string',
        validation: (rule) => rule.required(),
      }),
    ],
    validation: required ? (rule) => rule.required() : undefined,
  });
}

export const imageArrayMember = defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      description: "Décrivez l'image en quelques mots (pour l'accessibilité et Google).",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ],
});

export const blockContent = defineType({
  name: 'blockContent',
  title: 'Texte',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Titre', value: 'h2' },
        { title: 'Sous-titre', value: 'h3' },
      ],
      lists: [
        { title: 'Puces', value: 'bullet' },
        { title: 'Numérotée', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Gras', value: 'strong' },
          { title: 'Italique', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'Lien',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Adresse',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          }),
        ],
      },
    }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'Référencement (SEO)',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Titre pour Google',
      description:
        'Laisser vide pour utiliser le titre principal. Idéalement moins de 60 caractères.',
      type: 'string',
      validation: (rule) => rule.max(70).warning('Un titre plus court sera mieux affiché.'),
    }),
    defineField({
      name: 'description',
      title: 'Description pour Google',
      description: 'Une ou deux phrases, idéalement moins de 160 caractères.',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(180).warning('Une description plus courte sera mieux affichée.'),
    }),
  ],
});
