import 'server-only';
import { createClient } from 'next-sanity';
import { serverEnv } from '@/lib/env.server';
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env';

// The dataset is private (orders and requests hold personal data), so even published
// content is read server-side with a Viewer token. Image URLs on the CDN stay public.
export const client = createClient({
  projectId: projectId || 'not-configured',
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token: serverEnv.SANITY_API_READ_TOKEN,
});

type FetchOptions = {
  params?: Record<string, unknown>;
  /** Cache tags for on-demand revalidation (stage 4). */
  tags?: string[];
  revalidate?: number | false;
};

/** Fetches from Sanity with Next.js caching. Server-only. */
export function sanityFetch<const Q extends string>(
  query: Q,
  { params = {}, tags = [], revalidate = 60 }: FetchOptions = {},
) {
  if (!isSanityConfigured) {
    throw new Error('Sanity is not configured: set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  }
  return client.fetch(query, params, { next: { revalidate, tags } });
}
