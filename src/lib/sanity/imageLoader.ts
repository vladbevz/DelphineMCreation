import type { ImageLoaderProps } from 'next/image';

/**
 * next/image loader: Sanity's CDN resizes images, so Next's optimizer is not used.
 * If the source URL already has w and h (a crop for a given aspect ratio), the ratio is kept.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  if (!src.startsWith('https://cdn.sanity.io/')) return src;

  const url = new URL(src);
  const w = Number(url.searchParams.get('w'));
  const h = Number(url.searchParams.get('h'));
  if (w > 0 && h > 0) {
    url.searchParams.set('h', String(Math.round((width * h) / w)));
  }
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('auto', 'format');
  return url.toString();
}
