import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — HomeRenoCalc',
  description:
    'How HomeRenoCalc handles data. Short version: we do not collect personal data. Calculators run in your browser. We use anonymous analytics only.',
  alternates: { canonical: 'https://homerenocalc.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="container py-12 md:py-20 max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-foreground font-medium">Privacy</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated: May 7, 2026</p>

      <div className="mt-6 rounded-xl border border-forest-200 bg-forest-50/40 px-5 py-4">
        <p className="text-foreground/90 leading-relaxed">
          <strong>The short version:</strong> we don&apos;t collect personal data. The
          calculators run entirely in your browser. We use anonymous, aggregate
          analytics only — no cookies that identify you, no email collection, no
          accounts.
        </p>
      </div>

      <section className="prose-diy mt-10">
        <h2>What we collect</h2>
        <p>
          HomeRenoCalc collects only anonymous, aggregate analytics through Google
          Analytics 4 (GA4) when you have analytics-enabled cookies allowed in
          your browser. This includes:
        </p>
        <ul>
          <li>Page views (which calculator was opened)</li>
          <li>Browser type, device class (mobile/desktop), and country</li>
          <li>Referrer (the site you came from)</li>
        </ul>
        <p>
          We do <strong>not</strong> collect or store any of the values you type into
          the calculators. Inputs never leave your device.
        </p>

        <h2>What we don&apos;t do</h2>
        <ul>
          <li>We don&apos;t require an account or email address.</li>
          <li>We don&apos;t sell or share data with third parties.</li>
          <li>We don&apos;t use ad-network retargeting cookies.</li>
          <li>We don&apos;t fingerprint your device.</li>
        </ul>

        <h2>Affiliate links</h2>
        <p>
          Some links on the site (clearly marked &ldquo;Shop the materials&rdquo; or
          retailer-branded buttons) are affiliate links. When you click one and
          make a purchase, the retailer (Home Depot, Lowe&apos;s, Amazon) may pay us
          a small commission. The retailer drops their own cookie at that point —
          we do not control what they do with it. See our{' '}
          <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for the
          full FTC-required statement.
        </p>

        <h2>Cookies</h2>
        <p>
          We use one first-party cookie set by Google Analytics for anonymous
          aggregation, plus any cookies that retailers set when you click an
          affiliate link to their site. You can disable cookies in your browser
          settings — the calculators will continue to work normally.
        </p>

        <h2>Your rights</h2>
        <p>
          Because we don&apos;t store personal data, there is nothing to delete or
          correct. If you have questions about your privacy, email{' '}
          <a href="mailto:privacy@homerenocalc.com">privacy@homerenocalc.com</a>.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We&apos;ll update the &ldquo;last updated&rdquo; date above when this policy changes.
          Material changes will be announced on the site for at least 30 days.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email{' '}
          <a href="mailto:privacy@homerenocalc.com">privacy@homerenocalc.com</a>.
        </p>
      </section>
    </article>
  );
}
