import { TagIcon } from '@sanity/icons/Tag';
import { defineField, defineType } from 'sanity';
import { categories, imageArrayMember, moneyField } from './shared';

export const product = defineType({
  name: 'product',
  title: 'Bijou',
  type: 'document',
  icon: TagIcon,
  groups: [
    { name: 'content', title: 'Présentation', default: true },
    { name: 'details', title: 'Prix et détails' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du bijou',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Générée à partir du nom : cliquez sur « Generate ».',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      description: 'La première photo est utilisée dans la boutique.',
      type: 'array',
      group: 'content',
      of: [imageArrayMember],
      options: { layout: 'grid' },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Histoire du bijou',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'care',
      title: 'Conseils d’entretien',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'collection',
      title: 'Collection',
      type: 'reference',
      to: [{ type: 'collection' }],
      group: 'content',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'content',
      options: { list: [...categories], layout: 'radio' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Mettre en avant sur l’accueil',
      type: 'boolean',
      group: 'content',
      initialValue: false,
    }),
    moneyField({ name: 'price', title: 'Prix', required: true, group: 'details' }),
    defineField({
      name: 'leatherColor',
      title: 'Couleur du cuir',
      description: 'Utilisée pour le filtre de la boutique : gardez toujours la même orthographe.',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'weight',
      title: 'Poids (grammes)',
      description: 'Sert au calcul de la livraison.',
      type: 'number',
      group: 'details',
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: 'stock',
      title: 'Pièces prêtes à expédier',
      description:
        'Bijoux déjà fabriqués. Diminue tout seul à chaque commande. À 0, le bijou reste en vente : il est fabriqué à la commande (délai dans Réglages → Livraison).',
      type: 'number',
      group: 'details',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date de mise en ligne',
      description: 'Sert au tri « Nouveautés ».',
      type: 'datetime',
      group: 'details',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Plus récents',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    { title: 'Prix croissant', name: 'priceAsc', by: [{ field: 'price', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', price: 'price', stock: 'stock', media: 'images.0' },
    prepare({ title, price, stock, media }) {
      const euros =
        typeof price === 'number'
          ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
              price / 100,
            )
          : 'Prix à définir';
      return {
        title,
        subtitle: `${euros} · ${typeof stock === 'number' && stock > 0 ? `${stock} prête(s)` : 'sur commande'}`,
        media,
      };
    },
  },
});
