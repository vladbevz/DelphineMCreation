import { createClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

// Read-only client for published content, served from Sanity's CDN.
export const client = createClient({
  projectId: projectId || 'not-configured',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

type FetchOptions = {
  params?: Record<string, unknown>;
  /** Cache tags for on-demand revalidation (stage 4). */
  tags?: string[];
  revalidate?: number | false;
};

/** Fetches from Sanity with Next.js caching. */
export function sanityFetch<const Q extends string>(
  query: Q,
  { params = {}, tags = [], revalidate = 60 }: FetchOptions = {},
) {
  if (!isSanityConfigured) {
    throw new Error('Sanity is not configured: set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  }
  return client.fetch(query, params, { next: { revalidate, tags } });
}
