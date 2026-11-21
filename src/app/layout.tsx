import type { Metadata, Viewport } from 'next';
import { Quicksand } from 'next/font/google';
import { isDemoMode, publicEnv } from '@/lib/env';
import { photos } from '@/lib/photos';
import { site } from '@/lib/site';
import './globals.css';

// Charte graphique: Quicksand, the closest web font to Existence (the logo's typeface).
// Variable font: one file covers 300-700.
const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
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
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={quicksand.variable}>
      <body>{children}</body>
    </html>
  );
}
