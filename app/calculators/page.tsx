import type { Metadata } from 'next';
import Link from 'next/link';
import { calculatorManifest } from '@/content/calculators/manifest';
import { Card, CardContent } from '@/components/ui/card';

const NEW_SLUGS = new Set(['fence-calculator', 'roofing-calculator', 'siding-calculator']);

export const metadata: Metadata = {
  title: 'All DIY Home Improvement Calculators — Free, Instant, No Signup',
  description:
    'Free calculators for paint, mulch, decks, concrete, drywall, tile, gravel, fence, roofing, and siding. Get exact material estimates for any DIY home renovation project.',
  alternates: { canonical: 'https://homerenocalc.com/calculators' },
  openGraph: {
    title: 'All DIY Home Improvement Calculators — HomeRenoCalc',
    description:
      'All 10 free calculators for DIY home renovation: paint, mulch, decks, concrete, drywall, tile, gravel, fence, roofing, and siding.',
    url: 'https://homerenocalc.com/calculators',
    type: 'website',
  },
};

export default function CalculatorsIndexPage() {
  const byCategory: Record<string, typeof calculatorManifest> = {};
  for (const c of calculatorManifest) {
    (byCategory[c.category] ??= []).push(c);
  }

  // ItemList JSON-LD helps Google list every calculator as a discoverable item.
  const itemListLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'HomeRenoCalc — DIY Home Improvement Calculators',
    itemListElement: calculatorManifest.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://homerenocalc.com/calculators/${c.slug}`,
      name: c.title,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <section className="border-b border-border bg-gradient-to-b from-warmgray-100 to-background">
        <div className="container py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span className="mx-1.5" aria-hidden>›</span>
            <span className="text-foreground font-medium">Calculators</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            All calculators
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {calculatorManifest.length} free calculators, organized by project type. Every one includes
            material estimates, cost projections, and Home Depot shopping links.
          </p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="space-y-14">
          {Object.entries(byCategory).map(([category, calcs]) => (
            <div key={category}>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-5">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {calcs.map((c) => (
                  <Link key={c.slug} href={`/calculators/${c.slug}`} className="group">
                    <Card className="relative h-full surface-card surface-card-hover hover-lift">
                      {NEW_SLUGS.has(c.slug) && (
                        <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-sky-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                          New
                        </span>
                      )}
                      <CardContent className="p-5">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {c.shortDescription}
                        </p>
                        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          Open
                          <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
