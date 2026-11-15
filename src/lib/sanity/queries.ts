import { defineQuery } from 'next-sanity';

// Products must have a slug and at least one image to be shown publicly.
const PUBLIC_PRODUCT_FILTER = `_type == "product" && defined(slug.current) && count(images) > 0`;

const PRODUCT_CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  price,
  // Pieces ready to ship; at 0 the piece is still for sale, made to order.
  "stock": coalesce(stock, 0),
  category,
  leatherColor,
  publishedAt,
  "image": images[0]{ ..., "lqip": asset->metadata.lqip },
  // Second photo, shown on hover in the catalog.
  "hoverImage": images[1]{ ... }
`;

/** Home page "Nouvelle collection": featured first, then newest. */
export const LATEST_PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER}]
    | order(featured desc, publishedAt desc)[0...8]{ ${PRODUCT_CARD_FIELDS} }
`);

/** Boutique: the whole catalog (a few dozen pieces); filtering and sorting happen on the server. */
export const PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER}] | order(publishedAt desc){ ${PRODUCT_CARD_FIELDS} }
`);

export const PRODUCT_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER} && slug.current == $slug][0]{
    ${PRODUCT_CARD_FIELDS},
    "images": images[]{ ..., "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions },
    description,
    care,
    dimensions,
    weight,
    seo,
    collection->{ _id, title, "slug": slug.current }
  }
`);

/** "Vous aimerez aussi": same collection or category. */
export const RELATED_PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER} && _id != $id
    && ((defined($collectionId) && collection._ref == $collectionId) || category == $category)]
    | order(publishedAt desc)[0...4]{ ${PRODUCT_CARD_FIELDS} }
`);

export const COLLECTIONS_QUERY = defineQuery(`
  *[_type == "collection" && defined(slug.current)] | order(order asc, title asc){
    _id, title, "slug": slug.current, cover, description, _updatedAt
  }
`);

export const COLLECTION_QUERY = defineQuery(`
  *[_type == "collection" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, cover, description,
    "products": *[${PUBLIC_PRODUCT_FILTER} && collection._ref == ^._id]
      | order(publishedAt desc){ ${PRODUCT_CARD_FIELDS} }
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{ _id, title, body, seo }
`);

export const SITEMAP_QUERY = defineQuery(`{
  "products": *[${PUBLIC_PRODUCT_FILTER}]{ "slug": slug.current, _updatedAt },
  "collections": *[_type == "collection" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
}`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings" && _id == "settings"][0]{
    vacationMode, announcementBar, colissimoPrice, freeShippingThreshold, pickupEnabled,
    shippingDays, madeToOrderDays,
    email, postalAddress, phone, instagram, facebook
  }
`);

/** Cart drawer: current price and ready stock of the pieces in the cart (published only). */
export const CART_PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER} && _id in $ids]{
    _id, title, "slug": slug.current, price, "stock": coalesce(stock, 0), "image": images[0]
  }
`);
