'use server';

import { getCartProducts } from '@/lib/sanity/data';
import { urlFor } from '@/lib/sanity/image';
import { cartIdsSchema } from '@/lib/validation';

export type CartItem = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  /** Pieces ready to ship; the rest of the quantity is made to order. */
  stock: number;
  imageUrl: string | null;
  imageAlt: string;
};

/** Current price and ready stock for the ids in the browser cart. Unknown or unpublished ids are dropped. */
export async function getCartItems(ids: unknown): Promise<CartItem[]> {
  const parsed = cartIdsSchema.safeParse(ids);
  if (!parsed.success) return [];

  const products = await getCartProducts(parsed.data);
  return products.map((p) => ({
    _id: p._id,
    title: p.title ?? '',
    slug: p.slug ?? '',
    price: p.price ?? 0,
    stock: p.stock ?? 0,
    imageUrl: p.image?.asset ? urlFor(p.image).width(160).height(160).url() : null,
    imageAlt: p.image?.alt ?? p.title ?? '',
  }));
}
