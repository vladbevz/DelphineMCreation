import type { Metadata, Viewport } from 'next';
import { Corinthia, Instrument_Sans, Instrument_Serif } from 'next/font/google';
import { isDemoMode, publicEnv } from '@/lib/env';
import { photos } from '@/lib/photos';
import { site } from '@/lib/site';
import './globals.css';

// Editorial pair: Instrument Serif for large titles (one weight, it is a display face),
// Instrument Sans (variable 400-700) for text and interface.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-instrument-serif',
});

// Hero title only: a thin slanted script, close to « Créations en cuir » in the logo (Adelia).
const script = Corinthia({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-corinthia',
});

const sans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  robots: isDemoMode ? { index: false, follow: false } : undefined,
  title: {
    default: `Bijoux en cuir faits main | ${site.name}`,
    template: `%s | ${site.name}`,
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
    <html lang="fr" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <head>
        {/* Touch screens: no View Transitions at all. iOS Safari could leave a card-to-gallery
            transition stuck (a grey full-screen snapshot) after a swipe or a back gesture.
            Without document.startViewTransition React swaps pages directly (it catches the
            missing API). Runs before hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(matchMedia('(hover: none)').matches){Object.defineProperty(document,'startViewTransition',{value:undefined,configurable:true})}}catch(e){}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
