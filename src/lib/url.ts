import { publicEnv } from './env';

/** Absolute URL on the public site, for JSON-LD, sitemap and e-mails. */
export function absoluteUrl(path = '/') {
  return new URL(path, publicEnv.NEXT_PUBLIC_SITE_URL).toString();
}
