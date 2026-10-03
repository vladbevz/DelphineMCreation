import { defineQuery } from 'next-sanity';

// Products must have a slug and at least one image to be shown publicly.
const PUBLIC_PRODUCT_FILTER = `_type == "product" && defined(slug.current) && count(images) > 0`;

const PRODUCT_CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  price,
  status,
  stock,
  category,
  leatherColor,
  "image": images[0]{ ..., "lqip": asset->metadata.lqip }
`;

/** Home page "Nouvelle collection": featured first, then newest; sold pieces excluded. */
export const LATEST_PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER} && status != "sold"]
    | order(featured desc, publishedAt desc)[0...8]{ ${PRODUCT_CARD_FIELDS} }
`);

/** Boutique: everything, sold pieces last. Filtering and sorting are refined in stage 2. */
export const PRODUCTS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER}]
    | order(status == "sold" asc, publishedAt desc){ ${PRODUCT_CARD_FIELDS} }
`);

export const PRODUCT_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER} && slug.current == $slug][0]{
    ${PRODUCT_CARD_FIELDS},
    "images": images[]{ ..., "lqip": asset->metadata.lqip, "dimensions": asset->metadata.dimensions },
    description,
    care,
    dimensions,
    weight,
    publishedAt,
    seo,
    collection->{ title, "slug": slug.current }
  }
`);

export const PRODUCT_SLUGS_QUERY = defineQuery(`
  *[${PUBLIC_PRODUCT_FILTER}]{ "slug": slug.current, _updatedAt }
`);

export const COLLECTIONS_QUERY = defineQuery(`
  *[_type == "collection" && defined(slug.current)] | order(order asc, title asc){
    _id, title, "slug": slug.current, cover, description
  }
`);

export const COLLECTION_QUERY = defineQuery(`
  *[_type == "collection" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, cover, description,
    "products": *[${PUBLIC_PRODUCT_FILTER} && collection._ref == ^._id]
      | order(status == "sold" asc, publishedAt desc){ ${PRODUCT_CARD_FIELDS} }
  }
`);

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{ _id, title, body, seo }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings" && _id == "settings"][0]{
    vacationMode, announcementBar, colissimoPrice, freeShippingThreshold, pickupEnabled,
    email, phone, instagram, facebook
  }
`);
