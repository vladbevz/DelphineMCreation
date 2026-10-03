import type { MetadataRoute } from 'next';
import { legalPages } from '@/lib/catalog';
import { getSitemapEntries } from '@/lib/sanity/data';
import { absoluteUrl } from '@/lib/url';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, collections, pages } = await getSitemapEntries();
  const pageUpdatedAt = new Map(pages.map((p) => [p.slug, p._updatedAt]));

  const staticRoutes = ['/', '/boutique', '/atelier', '/sur-mesure', '/contact'].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === '/boutique' ? ('daily' as const) : ('monthly' as const),
    priority: path === '/' ? 1 : path === '/boutique' ? 0.9 : 0.6,
  }));

  const contentRoutes = ['entretien', ...Object.keys(legalPages)].map((slug) => ({
    url: absoluteUrl(`/${slug}`),
    lastModified: pageUpdatedAt.get(slug),
    changeFrequency: 'yearly' as const,
    priority: slug === 'entretien' ? 0.5 : 0.2,
  }));

  return [
    ...staticRoutes,
    ...products.map((p) => ({
      url: absoluteUrl(`/boutique/${p.slug}`),
      lastModified: p._updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...collections.map((c) => ({
      url: absoluteUrl(`/collections/${c.slug}`),
      lastModified: c._updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...contentRoutes,
  ];
}
