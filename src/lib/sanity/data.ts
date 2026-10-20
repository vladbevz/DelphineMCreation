import 'server-only';
import { cache } from 'react';
import { isSanityConfigured } from '@/sanity/env';
import type { PRODUCTS_QUERY_RESULT } from '@/sanity/types';
import { client, sanityFetch } from './client';
import {
  entretienBlocks,
  fixtureCollections,
  fixtureProducts,
  fixtureSettings,
  placeholderBlocks,
} from './fixtures';
import {
  CART_PRODUCTS_QUERY,
  COLLECTION_QUERY,
  COLLECTIONS_QUERY,
  LATEST_PRODUCTS_QUERY,
  PAGE_QUERY,
  PRODUCT_QUERY,
  PRODUCTS_QUERY,
  RELATED_PRODUCTS_QUERY,
  SETTINGS_QUERY,
  SITEMAP_QUERY,
} from './queries';

// Every storefront read goes through here. Without a Sanity project (local development
// before the client's accounts exist) the functions return fixtures with the same shape.
const offline = !isSanityConfigured;

const toCard = ({
  _id,
  title,
  slug,
  price,
  status,
  stock,
  category,
  leatherColor,
  publishedAt,
  image,
  hoverImage,
}: (typeof fixtureProducts)[number]): PRODUCTS_QUERY_RESULT[number] => ({
  _id,
  title,
  slug,
  price,
  status,
  stock,
  category,
  leatherColor,
  publishedAt,
  image,
  hoverImage,
});

export const getSettings = cache(async () => {
  if (offline) return fixtureSettings;
  return sanityFetch(SETTINGS_QUERY, { tags: ['settings'] });
});

export const getLatestProducts = cache(async () => {
  if (offline) return fixtureProducts.filter((p) => p.status !== 'sold').map(toCard);
  return sanityFetch(LATEST_PRODUCTS_QUERY, { tags: ['product'] });
});

export const getProducts = cache(async () => {
  if (offline) return fixtureProducts.map(toCard).reverse();
  return sanityFetch(PRODUCTS_QUERY, { tags: ['product'] });
});

export const getProduct = cache(async (slug: string) => {
  if (offline) return fixtureProducts.find((p) => p.slug === slug) ?? null;
  return sanityFetch(PRODUCT_QUERY, { params: { slug }, tags: ['product'] });
});

const RELATED_COUNT = 4;

type RelatedSource = { _id: string; category: string; collection: { _id: string } | null };

/** Same collection or category first, then topped up with the newest pieces: always a full row. */
export const getRelatedProducts = cache(async (product: RelatedSource) => {
  const [close, latest] = await Promise.all([findRelated(product), getLatestProducts()]);
  const seen = new Set([product._id, ...close.map((p) => p._id)]);
  return [...close, ...latest.filter((p) => !seen.has(p._id))].slice(0, RELATED_COUNT);
});

const findRelated = cache(async (product: RelatedSource) => {
  if (offline) {
    return fixtureProducts
      .filter(
        (p) =>
          p._id !== product._id &&
          p.status !== 'sold' &&
          (p.collection?._id === product.collection?._id || p.category === product.category),
      )
      .slice(0, 4)
      .map(toCard);
  }
  return sanityFetch(RELATED_PRODUCTS_QUERY, {
    params: {
      id: product._id,
      category: product.category,
      collectionId: product.collection?._id ?? null,
    },
    tags: ['product'],
  });
});

export const getCollections = cache(async () => {
  if (offline) return fixtureCollections;
  return sanityFetch(COLLECTIONS_QUERY, { tags: ['collection'] });
});

export const getCollection = cache(async (slug: string) => {
  if (offline) {
    const collection = fixtureCollections.find((c) => c.slug === slug);
    if (!collection) return null;
    const products = fixtureProducts.filter((p) => p.collection?._id === collection._id);
    return { ...collection, products: products.map(toCard) };
  }
  return sanityFetch(COLLECTION_QUERY, { params: { slug }, tags: ['collection', 'product'] });
});

export const getPage = cache(async (slug: string) => {
  if (offline) {
    const body = slug === 'entretien' ? entretienBlocks : placeholderBlocks();
    return { _id: `page-${slug}`, title: '', body, seo: null };
  }
  return sanityFetch(PAGE_QUERY, { params: { slug }, tags: ['page'] });
});

export const getSitemapEntries = cache(async () => {
  if (offline) {
    const at = '2026-10-01T00:00:00Z';
    return {
      products: fixtureProducts.map((p) => ({ slug: p.slug, _updatedAt: at })),
      collections: fixtureCollections.map((c) => ({ slug: c.slug, _updatedAt: at })),
      pages: [],
    };
  }
  return sanityFetch(SITEMAP_QUERY, { tags: ['product', 'collection', 'page'] });
});

/** Uncached read for the cart: availability must be current, not ISR-stale. */
export async function getCartProducts(ids: string[]) {
  if (ids.length === 0) return [];
  if (offline) {
    return fixtureProducts
      .filter((p) => ids.includes(p._id))
      .map(({ _id, title, slug, price, status, image }) => ({
        _id,
        title,
        slug,
        price,
        status,
        reservedUntil: null,
        reservationToken: null,
        image,
      }));
  }
  return client
    .withConfig({ useCdn: false })
    .fetch(CART_PRODUCTS_QUERY, { ids }, { cache: 'no-store' });
}
