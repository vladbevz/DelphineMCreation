import 'server-only';
import { revalidateTag } from 'next/cache';

/** Invalidates every cached page that shows products (catalog, product pages, home). */
export function revalidateCatalog() {
  revalidateTag('product', { expire: 0 });
  revalidateTag('collection', { expire: 0 });
}
