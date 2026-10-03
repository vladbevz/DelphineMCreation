'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/tracking';

export function TrackViewContent({
  id,
  title,
  price,
}: {
  id: string;
  title: string;
  price: number;
}) {
  useEffect(() => {
    trackEvent('ViewContent', {
      content_ids: [id],
      content_name: title,
      content_type: 'product',
      value: price / 100,
      currency: 'EUR',
    });
  }, [id, title, price]);
  return null;
}
