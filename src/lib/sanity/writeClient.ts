import 'server-only';
import { createClient } from 'next-sanity';
import { serverEnv } from '@/lib/env.server';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Server-only client with write access. Never import from client components.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'raw',
  token: serverEnv.SANITY_API_WRITE_TOKEN,
});
