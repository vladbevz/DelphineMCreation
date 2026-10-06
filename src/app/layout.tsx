import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost, Mrs_Saint_Delafield } from 'next/font/google';
import { isDemoMode, publicEnv } from '@/lib/env';
import { photos } from '@/lib/photos';
import { site } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  // Variable font: one file per style covers weights 300 to 600.
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

// Handwritten accent word in headings (the <em> of SectionHeading).
const script = Mrs_Saint_Delafield({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-mrs-saint',
});

const jost = Jost({
  subsets: ['latin'],
  // Variable font: a single file covers weights 400 and 500.
  display: 'swap',
  variable: '--font-jost',
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
    <html lang="fr" className={`${cormorant.variable} ${jost.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
