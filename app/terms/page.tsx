import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use — HomeRenoCalc',
  description:
    'Terms of use for HomeRenoCalc. Estimates are guidance only and must be verified against your specific materials and local building codes.',
  alternates: { canonical: 'https://homerenocalc.com/terms' },
};

export default function TermsPage() {
  return (
    <article className="container py-12 md:py-20 max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-foreground font-medium">Terms</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Use</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: May 7, 2026</p>

      <section className="prose-diy mt-10">
        <h2>Estimates are guidance only</h2>
        <p>
          The calculators on HomeRenoCalc produce estimates based on industry
          coverage rates and reasonable waste factors. They do not replace
          professional measurement, an architect, an engineer, or a licensed
          contractor. Always verify with manufacturer specs and local code before
          purchasing materials or starting work.
        </p>

        <h2>No warranty</h2>
        <p>
          HomeRenoCalc is provided &ldquo;as-is&rdquo; with no warranty of any kind. We do
          our best to keep formulas, default prices, and content accurate, but
          markets and codes change. We are not liable for material shortages,
          overages, project costs, code violations, or injuries arising from
          reliance on the estimates.
        </p>

        <h2>Permitted use</h2>
        <p>
          You may use the site freely for personal and commercial DIY planning.
          You may not scrape the site at scale, mirror it, or repackage the
          calculators as a competing service.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Site text, design, illustrations, and calculator code are © HomeRenoCalc.
          You retain copyright on anything you type into the calculators (we
          don&apos;t store it anyway — see the{' '}
          <Link href="/privacy">Privacy Policy</Link>).
        </p>

        <h2>Affiliate links</h2>
        <p>
          Many of the &ldquo;Shop the materials&rdquo; links are affiliate links. See our{' '}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for
          details.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms over time. Continued use of the site after a
          change constitutes acceptance.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email{' '}
          <a href="mailto:hello@homerenocalc.com">hello@homerenocalc.com</a>.
        </p>
      </section>
    </article>
  );
}
