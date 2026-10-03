// Meta Pixel events. A no-op until the Pixel is loaded, which only happens after
// marketing consent (stage 5, CookieBanner).

type PixelEvent = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: PixelEvent,
  params: Record<string, unknown>,
  /** Same eventID on browser and server events lets Meta deduplicate them. */
  options?: { eventID?: string },
) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, params, options);
}
