import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { publicEnv } from '@/lib/env';
import { site } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  // Variable font: one file per style covers weights 500 and 600.
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const jost = Jost({
  subsets: ['latin'],
  // Variable font: a single file covers weights 400 and 500.
  display: 'swap',
  variable: '--font-jost',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${site.name} — Bijoux en cuir faits main`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: '#fbf7f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  );
}
