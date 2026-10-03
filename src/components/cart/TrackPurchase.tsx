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
      localStorage.setItem(key, '1');
    } catch {
      // Storage unavailable: eventID still lets Meta deduplicate.
    }
    trackEvent(
      'Purchase',
      { content_ids: productIds, content_type: 'product', value: value / 100, currency: 'EUR' },
      { eventID: sessionId },
    );
  }, [sessionId, value, productIds]);
  return null;
}
