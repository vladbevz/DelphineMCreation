import { ViewTransition, type ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { ConsentScripts } from '@/components/consent/ConsentScripts';
import { CookieBanner } from '@/components/consent/CookieBanner';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { getSettings } from '@/lib/sanity/data';
import { AnnouncementBar } from './AnnouncementBar';
import { Footer } from './Footer';
import { Header } from './Header';

/** Public site chrome, shared by the (site) layout and the 404 page. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <MotionProvider>
      <CartProvider>
        <AnnouncementBar />
        <Header instagram={settings?.instagram ?? null} />
        {/* Soft cross-fade between pages (browsers without View Transitions: plain navigation). */}
        <main id="contenu">
          <ViewTransition>{children}</ViewTransition>
        </main>
        <Footer />
        <CartDrawer freeShippingThreshold={settings?.freeShippingThreshold ?? null} />
        <CookieBanner />
        <ConsentScripts />
      </CartProvider>
    </MotionProvider>
  );
}
