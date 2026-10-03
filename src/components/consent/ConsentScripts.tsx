'use client';

import { Analytics } from '@vercel/analytics/next';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { clientEnv } from '@/lib/env.client';
import { consentStore } from './consentStore';

/** Loads analytics and the Meta Pixel only after the matching consent. */
export function ConsentScripts() {
  const consent = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );
  const pixelId = clientEnv.metaPixelId;

  return (
    <>
      {consent?.analytics && <Analytics />}
      {consent?.marketing && pixelId && <MetaPixel pixelId={pixelId} />}
    </>
  );
}

function MetaPixel({ pixelId }: { pixelId: string }) {
  const pathname = usePathname();
  const firstRender = useRef(true);

  // The init snippet tracks the first PageView; client-side navigations are tracked here.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', ${JSON.stringify(pixelId)});
fbq('track', 'PageView');`}
    </Script>
  );
}
