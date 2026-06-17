import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — HomeRenoCalc',
  description:
    'How HomeRenoCalc earns money. We use affiliate links to Home Depot, Lowe\'s, and Amazon. They never change the price you pay or which products we recommend.',
  alternates: { canonical: 'https://homerenocalc.com/affiliate-disclosure' },
};

export default function AffiliateDisclosurePage() {
  return (
    <article className="container py-12 md:py-20 max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-foreground font-medium">Affiliate Disclosure</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Affiliate Disclosure</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: May 7, 2026</p>

      <section className="prose-diy mt-10">
        <p>
          HomeRenoCalc participates in affiliate programs from{' '}
          <strong>The Home Depot</strong>, <strong>Lowe&apos;s</strong>, and the{' '}
          <strong>Amazon Services LLC Associates Program</strong>. When you click
          a product link on our site and make a qualifying purchase, the retailer
          may pay us a small commission.
        </p>

        <h2>What this means for you</h2>
        <ul>
          <li>The price you pay is the same — affiliate links never inflate the price.</li>
          <li>You never need to use our links — search the same product directly if you prefer.</li>
          <li>Commissions <strong>never</strong> influence which products we recommend.</li>
        </ul>

        <h2>How we choose products</h2>
        <p>
          The materials we link to in &ldquo;Shop the materials&rdquo; panels are the ones
          our authors actually use, or the closest stock-available equivalent at
          Home Depot or Lowe&apos;s. We sort by retailer in the order Home Depot →
          Lowe&apos;s → Amazon to keep things consistent, not because of commission
          rate.
        </p>

        <h2>Where to Buy boxes</h2>
        <p>
          The compact &ldquo;Where to buy&rdquo; boxes at the bottom of every result panel
          are <em>generic search links</em>, not deep affiliate links. They open
          the retailer&apos;s catalog with a search for the material — letting you
          see local pricing and stock without us steering you to a specific SKU.
        </p>

        <h2>FTC compliance</h2>
        <p>
          This disclosure is provided in compliance with the FTC&apos;s 16 CFR Part
          255 guidelines on endorsements and testimonials. Every product card
          that links to a retailer is also marked with the retailer name and uses
          a <code>rel=&quot;sponsored&quot;</code> attribute on its link.
        </p>

        <h2>Questions</h2>
        <p>
          Email{' '}
          <a href="mailto:hello@homerenocalc.com">hello@homerenocalc.com</a> if
          anything is unclear.
        </p>
      </section>
    </article>
  );
}
