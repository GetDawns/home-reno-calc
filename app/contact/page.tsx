import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact HomeRenoCalc — Corrections, Suggestions, Press',
  description:
    'How to reach HomeRenoCalc. We respond to corrections, calculator suggestions, and press inquiries within a week.',
  alternates: { canonical: 'https://homerenocalc.com/contact' },
};

export default function ContactPage() {
  return (
    <article className="container py-12 md:py-20 max-w-3xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-5">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span className="mx-1.5" aria-hidden>›</span>
        <span className="text-foreground font-medium">Contact</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Contact us</h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        We&apos;re a small team. Email is the fastest way to reach us — we reply
        within a week, often same-day.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ContactCard
          title="Corrections"
          email="corrections@homerenocalc.com"
          description="Calculator outputting the wrong number? Coverage rate looks off? Tell us the calculator name, your inputs, and what you expected. We respond and update fast."
        />
        <ContactCard
          title="Suggestions"
          email="hello@homerenocalc.com"
          description="Calculator we should add? Article you'd love to see written? We read every email."
        />
        <ContactCard
          title="Privacy questions"
          email="privacy@homerenocalc.com"
          description="Anything related to data, GDPR, or our analytics setup. We don't store personal data, but we'll confirm specifics."
        />
        <ContactCard
          title="Press & partnerships"
          email="hello@homerenocalc.com"
          description="Media interviews, citations in your article, or content collaboration."
        />
      </div>

      <p className="mt-12 text-sm text-muted-foreground">
        See also: <Link href="/about" className="underline underline-offset-2 hover:text-primary">About</Link> ·{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-primary">Privacy</Link> ·{' '}
        <Link href="/terms" className="underline underline-offset-2 hover:text-primary">Terms</Link>
      </p>
    </article>
  );
}

function ContactCard({
  title,
  email,
  description,
}: {
  title: string;
  email: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="font-bold text-foreground">{title}</h2>
      <a
        href={`mailto:${email}`}
        className="mt-1 block text-sm font-semibold text-primary hover:underline break-all"
      >
        {email}
      </a>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
