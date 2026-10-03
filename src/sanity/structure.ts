import { BasketIcon } from '@sanity/icons/Basket';
import { CogIcon } from '@sanity/icons/Cog';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { EnvelopeIcon } from '@sanity/icons/Envelope';
import { TagIcon } from '@sanity/icons/Tag';
import type { StructureResolver } from 'sanity/structure';
import { SETTINGS_ID } from './schemaTypes/settings';

export const structure: StructureResolver = (S) => {
  const products = (title: string, filter: string) =>
    S.listItem()
      .title(title)
      .schemaType('product')
      .child(
        S.documentList()
          .title(title)
          .schemaType('product')
          .filter(`_type == "product" && ${filter}`)
          .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
      );

  const orders = (title: string, filter: string) =>
    S.listItem()
      .title(title)
      .schemaType('order')
      .child(
        S.documentList()
          .title(title)
          .schemaType('order')
          .filter(`_type == "order" && ${filter}`)
          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
          .initialValueTemplates([]),
      );

  const requests = (title: string, filter: string) =>
    S.listItem()
      .title(title)
      .schemaType('customRequest')
      .child(
        S.documentList()
          .title(title)
          .schemaType('customRequest')
          .filter(`_type == "customRequest" && ${filter}`)
          .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
          .initialValueTemplates([]),
      );

  return S.list()
    .title('Delphine M. Créations')
    .items([
      S.listItem()
        .title('Produits')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Produits')
            .items([
              S.documentTypeListItem('product').title('Tous les bijoux'),
              products('Disponibles', 'status == "available"'),
              products('Réservés (paiement en cours)', 'status == "reserved"'),
              products('Vendus', 'status == "sold"'),
              S.divider(),
              S.documentTypeListItem('collection').title('Collections'),
            ]),
        ),
      S.listItem()
        .title('Commandes')
        .icon(BasketIcon)
        .child(
          S.list()
            .title('Commandes')
            .items([
              orders('À expédier', 'status == "paid"'),
              orders('Expédiées', 'status == "shipped"'),
              orders('Livrées', 'status == "delivered"'),
              orders('Remboursées ou annulées', 'status in ["refunded", "cancelled"]'),
              S.divider(),
              orders('Toutes les commandes', 'true'),
            ]),
        ),
      S.listItem()
        .title('Demandes sur-mesure')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Demandes sur-mesure')
            .items([
              requests('Nouvelles', 'status == "new"'),
              requests('En cours', 'status in ["replied", "accepted"]'),
              requests('Clôturées', 'status == "closed"'),
              S.divider(),
              requests('Toutes les demandes', 'true'),
            ]),
        ),
      S.documentTypeListItem('page').title('Pages').icon(DocumentTextIcon),
      S.divider(),
      S.listItem()
        .title('Réglages')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId(SETTINGS_ID).title('Réglages')),
    ]);
};
