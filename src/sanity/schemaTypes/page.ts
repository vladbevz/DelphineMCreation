import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description:
        'Pages prévues : cgv, mentions-legales, livraison-retours, confidentialite, entretien.',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'body', title: 'Contenu', type: 'blockContent' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current' } },
});
