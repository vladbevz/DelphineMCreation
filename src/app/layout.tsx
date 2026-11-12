import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { isDemoMode, publicEnv } from '@/lib/env';
import { photos } from '@/lib/photos';
import { site } from '@/lib/site';
import './globals.css';

// Headings. Variable font: weights 200-800 plus the optical-size axis (12-96), so small titles
// get sturdier shapes and large ones tighter ones automatically.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bricolage',
});

// Body text, menus, buttons, prices.
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-sans',
});

// Logo only, until Delphine provides her SVG.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '500'],
  display: 'swap',
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  robots: isDemoMode ? { index: false, follow: false } : undefined,
  title: {
    default: `${site.name} — Bijoux en cuir faits main`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: site.name,
    // Default share image; product pages override it with their own photo.
    images: [
      { url: photos.bouclesLiege.src, width: 1600, height: 1067, alt: photos.bouclesLiege.alt },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#fbf7f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body>{children}</body>
    </html>
  );
}
