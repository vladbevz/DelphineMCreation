import { FolderIcon } from '@sanity/icons/Folder';
import { defineField, defineType } from 'sanity';
import { imageField } from './shared';

export const collection = defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  icon: FolderIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom de la collection',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    imageField('cover', 'Photo de couverture', false),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: 'Les plus petits nombres apparaissent en premier.',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: 'Ordre d’affichage', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'title', media: 'cover' } },
});
