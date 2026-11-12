'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

/** Fires Purchase once per session id, even if the page is reloaded. */
export function TrackPurchase({
  sessionId,
  value,
  productIds,
}: {
  sessionId: string;
  value: number;
  productIds: string[];
}) {
  useEffect(() => {
    const key = `dmc-purchase-${sessionId}`;
    try {
      if (localStorage.getItem(key)) return;
    } catch {
      // Storage unavailable: eventID still lets Meta deduplicate.
    }
    const tracked = trackEvent(
      'Purchase',
      { content_ids: productIds, content_type: 'product', value: value / 100, currency: 'EUR' },
      { eventID: sessionId },
    );
    // Remember only an event that was actually sent or queued (needs marketing consent).
    if (!tracked) return;
    try {
      localStorage.setItem(key, '1');
    } catch {
      // See above.
    }
  }, [sessionId, value, productIds]);
  return null;
}
