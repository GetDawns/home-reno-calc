import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';
import './globals.css';

/**
 * Inter is the only typeface used site-wide.
 *
 * `display: 'swap'` lets text render in the system fallback while Inter loads
 * (eliminates FOIT and the "preloaded but not used" warning when Next can't
 * detect Inter on the critical render path quickly enough).
 *
 * Weight subsetting cuts the preloaded WOFF2 substantially. We rely on
 * variable-font interpolation for in-between weights instead of shipping each
 * weight as a separate file.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://homerenocalc.com'),
  title: {
    default: 'HomeRenoCalc — Free DIY Home Improvement Calculators',
    template: '%s | HomeRenoCalc',
  },
  description:
    'Free, accurate calculators for DIY home renovation projects. Paint, mulch, decks, concrete, drywall, tile, gravel, fence, roofing, and siding — instant material estimates before your hardware store run.',
  keywords: [
    'home improvement calculator',
    'diy calculator',
    'paint calculator',
    'concrete calculator',
    'deck calculator',
    'drywall calculator',
    'tile calculator',
    'gravel calculator',
    'fence calculator',
    'roofing calculator',
    'siding calculator',
    'mulch calculator',
  ],
  applicationName: 'HomeRenoCalc',
  authors: [{ name: 'HomeRenoCalc' }],
  creator: 'HomeRenoCalc',
  publisher: 'HomeRenoCalc',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    siteName: 'HomeRenoCalc',
    locale: 'en_US',
    title: 'HomeRenoCalc — Free DIY Home Improvement Calculators',
    description:
      'Free, accurate calculators for DIY home renovation. 10 calculators including paint, concrete, deck, drywall, tile, gravel, fence, roofing, and siding.',
    url: 'https://homerenocalc.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeRenoCalc — Free DIY Home Improvement Calculators',
    description:
      'Free, accurate calculators for DIY home renovation. 10 calculators, instant results, no signup.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: 'https://homerenocalc.com' },
};

export const viewport: Viewport = {
  themeColor: '#166534',
  width: 'device-width',
  initialScale: 1,
};

const SITE_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HomeRenoCalc',
    url: 'https://homerenocalc.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://homerenocalc.com/calculators?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'HomeRenoCalc',
    url: 'https://homerenocalc.com',
    logo: 'https://homerenocalc.com/logo.png',
    sameAs: [],
    description:
      'HomeRenoCalc builds free, accurate calculators for DIY home renovation — paint, lumber, concrete, mulch, tile, fence, roofing, siding, and more.',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-card-hover focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
