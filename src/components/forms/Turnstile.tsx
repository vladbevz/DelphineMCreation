'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { clientEnv } from '@/lib/env.client';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget. It adds a hidden `cf-turnstile-response` input to the
 * enclosing form. Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * Change `resetKey` after each submission to get a fresh token.
 */
export function Turnstile({ resetKey }: { resetKey?: unknown }) {
  const siteKey = clientEnv.turnstileSiteKey;
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!siteKey || !ready || !ref.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      language: 'fr',
      theme: 'light',
      appearance: 'interaction-only',
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey, ready]);

  useEffect(() => {
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, [resetKey]);

  if (!siteKey) return null;
  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setReady(true)}
      />
      <div ref={ref} />
    </>
  );
}
