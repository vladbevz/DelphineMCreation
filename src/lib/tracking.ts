// Meta Pixel events. Sent only while marketing consent is given (CookieBanner); events fired
// before the Pixel script has loaded (Merci page, product page opened from Instagram) wait in
// a queue that the Pixel flushes once initialised (ConsentScripts).
import { consentStore } from '@/components/consent/consentStore';

type PixelEvent = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    __dmcPixelQueue?: unknown[][];
  }
}

/** Returns false when nothing was sent or queued (no marketing consent, server render). */
export function trackEvent(
  event: PixelEvent,
  params: Record<string, unknown>,
  /** Same eventID on browser and server events lets Meta deduplicate them. */
  options?: { eventID?: string },
) {
  if (typeof window === 'undefined' || !consentStore.getSnapshot()?.marketing) return false;
  const args = ['track', event, params, options];
  if (window.fbq) window.fbq(...args);
  else (window.__dmcPixelQueue ??= []).push(args);
  return true;
}
