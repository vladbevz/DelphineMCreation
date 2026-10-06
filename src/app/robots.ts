import type { MetadataRoute } from 'next';
import { isDemoMode } from '@/lib/env';
import { absoluteUrl } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  // Demo deployments (placeholder content) must not end up in search results.
  if (isDemoMode) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/studio', '/api', '/merci'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
