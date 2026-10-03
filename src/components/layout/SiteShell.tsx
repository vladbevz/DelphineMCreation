import type { ReactNode } from 'react';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/components/cart/CartProvider';
import { ConsentScripts } from '@/components/consent/ConsentScripts';
import { CookieBanner } from '@/components/consent/CookieBanner';
import { AnnouncementBar } from './AnnouncementBar';
import { Footer } from './Footer';
import { Header } from './Header';

/** Public site chrome, shared by the (site) layout and the 404 page. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
      <ConsentScripts />
    </CartProvider>
  );
}
