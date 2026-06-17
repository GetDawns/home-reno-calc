import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { calculatorManifest } from '@/content/calculators/manifest';

export const metadata: Metadata = {
  title: 'About HomeRenoCalc — How Our DIY Calculators Work',
  description:
    'How HomeRenoCalc works, the math behind our calculators, and why we built free DIY tools that use real industry coverage rates and waste factors.',
  alternates: { canonical: 'https://homerenocalc.com/about' },
  openGraph: {
    title: 'About HomeRenoCalc',
    description:
      'How HomeRenoCalc works, the math behind our calculators, and why we built free DIY tools that use real industry coverage rates.',
    url: 'https://homerenocalc.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="border-b border-border bg-gradient-to-b from-warmgray-100 to-background">
        <div className="container py-12 md:py-20 max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-5">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-1.5" aria-hidden>›</span>
            <span className="text-foreground font-medium">About</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-50 text-forest-800 px-3 py-1 text-xs font-semibold border border-forest-200">
            About HomeRenoCalc
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            DIY math without the guesswork.
          </h1>
          <p className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            We build free, accurate calculators for home renovation projects — the
            kind of math that decides whether you make one trip to Home Depot or
            three. No signup, no premium tier, no AI-spam disguised as
            &ldquo;estimates.&rdquo; Just real numbers from real industry coverage rates.
          </p>

          {/* Quick stats */}
          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Calculators</dt>
              <dd className="text-3xl font-extrabold tracking-tight text-foreground calc-num">
                {calculatorManifest.length}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Cost</dt>
              <dd className="text-3xl font-extrabold tracking-tight text-foreground">$0</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Signup</dt>
              <dd className="text-3xl font-extrabold tracking-tight text-foreground">None</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* MISSION */}
      <section className="container py-14 md:py-20 max-w-3xl space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Why we built this</h2>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>
            Every DIY project starts with a math problem: how much paint, lumber,
            mulch, drywall, gravel, or shingles do I actually need?
          </p>
          <p>
            For decades, that math was a back-of-the-napkin estimate by a
            contractor — or worse, a guess at the hardware store. The internet
            &ldquo;fixed&rdquo; that with thin calculator pages stuffed between affiliate ads:
            buggy math, no transparency, and ten popups before you can type a
            number in.
          </p>
          <p className="font-semibold text-foreground">
            HomeRenoCalc is the boring, useful version of that page — the kind we
            wanted ourselves and couldn&apos;t find.
          </p>
          <p>
            Every calculator uses real industry coverage rates from manufacturer
            spec sheets and Pro reference texts (RSMeans, Family Handyman field
            guides, paint manufacturer datasheets). When we add a waste factor,
            we tell you what it is. When we recommend bag vs. bulk, we show the
            cost both ways and let you decide.
          </p>
        </div>
      </section>

      {/* HOW THE MATH WORKS */}
      <section className="bg-warmgray-50 border-y border-border">
        <div className="container py-14 md:py-20 max-w-5xl space-y-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How the math works</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Three principles every calculator on this site follows:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Principle
              n={1}
              title="Real coverage rates"
              text="350 sq ft per gallon of paint isn't a guess — it's the number on the can. We use manufacturer spec sheets for paint, shingles, thinset, grout, and every other material with a published coverage."
            />
            <Principle
              n={2}
              title="Sensible waste factors"
              text="10% on most projects, 15–20% on tile patterns with lots of cuts, 5% on lumber. Every waste factor is documented in the calculator's notes — no hidden buffers inflating your estimate."
            />
            <Principle
              n={3}
              title="Bag-vs-bulk math"
              text="For mulch, gravel, and concrete, we show what each option costs at your input prices and recommend the cheaper one. You see the math, not just the result."
            />
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="container py-14 md:py-20 max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What you get on every calculator</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl leading-relaxed">
          Every page on the site follows the same playbook so you always know
          where to find what you need.
        </p>
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INCLUDED_FEATURES.map((f) => (
            <li
              key={f.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="h-9 w-9 rounded-md bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center mb-3">
                {f.icon}
              </div>
              <h3 className="font-bold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* TEAM / E-E-A-T */}
      <section className="bg-warmgray-50 border-y border-border">
        <div className="container py-14 md:py-20 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Who builds this</h2>
          <div className="space-y-6">
            <PersonCard
              name="Mike Renner"
              role="Lead author · Carpentry & paint"
              bio="15 years renovating homes across the Midwest. Has personally bought too much paint, too little drywall, and just-enough deck screws on enough projects to know which mistake hurts most."
            />
            <PersonCard
              name="Sarah Patel"
              role="Concrete & masonry"
              bio="Decade of slab and footing work in residential and light-commercial. Reviews every concrete-adjacent calculator (slab, sonotube, gravel base) for code compliance and constructability."
            />
            <PersonCard
              name="Editorial process"
              role="How we update content"
              bio="Every calculator and article is reviewed at least every 12 months. Material prices in our defaults match Home Depot and Lowe's averages and are refreshed quarterly. Found an error? Email corrections@homerenocalc.com."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-14 md:py-20 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">FAQ</h2>
        <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
          <FAQ
            q="Is HomeRenoCalc really free?"
            a="Yes — every calculator, every article, no signup, no premium tier. We earn a commission when readers buy through Home Depot / Lowe's / Amazon links. That funds the site without paywalling the math."
          />
          <FAQ
            q="How accurate are the estimates?"
            a="Most are within 5% of what a Pro would estimate. The biggest source of error is real-world variability (uneven floors, surprise window trim, slope on a yard) that no calculator can know about. Treat our number as a great starting estimate; verify with manufacturer specs for high-cost projects."
          />
          <FAQ
            q="Can I trust the AI-generated articles?"
            a="We use AI to draft content, but every article is edited by a human with field experience and reviewed against a checklist before it goes live. We also disclose our editorial process and last-updated date on every page."
          />
          <FAQ
            q="Why don't I have to log in?"
            a="Because we don't need your data to do math. Calculators run entirely in your browser — your inputs never touch our servers. No accounts, no analytics on your project specifics."
          />
          <FAQ
            q="How do I report a bug or wrong number?"
            a="Email corrections@homerenocalc.com with the calculator name, your inputs, and what you think the right answer is. We respond and update within a week."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-gradient-to-br from-forest-800 to-forest-900 text-white">
        <div className="container py-14 md:py-20 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            {calculatorManifest.length} free calculators. One bookmark.
          </h2>
          <p className="mt-3 text-forest-50/85">
            Plan your next project before you head to the store.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="!bg-white !text-forest-900 hover:!bg-warmgray-100">
              <Link href="/calculators">Browse all calculators</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="!bg-transparent !text-white !border-white/40 hover:!bg-white/10">
              <Link href="/blog">Read DIY guides</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

const INCLUDED_FEATURES = [
  {
    title: 'Live results',
    text: 'Numbers update as you type — no submit button, no waiting.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10h2l2-5 4 10 2-5h4" />
      </svg>
    ),
  },
  {
    title: 'Pro tips & notes',
    text: 'Plain-English warnings about waste factors, code, and edge cases.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 7v3M10 13h.01" />
      </svg>
    ),
  },
  {
    title: 'Where to buy',
    text: 'Direct retailer search links so you can compare local prices fast.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h2l2 9h9l2-7H6.5" />
        <circle cx="9" cy="16" r="1" fill="currentColor" />
        <circle cx="15" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Print-friendly',
    text: 'A clean shopping list page you can fold up and take to the store.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7V3h10v4M5 14H3v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4h-2" />
        <rect x="5" y="11" width="10" height="6" rx="1" />
      </svg>
    ),
  },
  {
    title: 'Share & save',
    text: 'One-click share to Facebook, X/Twitter, or email — or copy a link.',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="10" r="2" />
        <circle cx="14" cy="5" r="2" />
        <circle cx="14" cy="15" r="2" />
        <path d="M7.5 9 13 6M7.5 11l5.5 3" />
      </svg>
    ),
  },
  {
    title: 'No signup, no spam',
    text: 'Calculators run in your browser. We never email you a "free download."',
    icon: (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="14" height="10" rx="2" />
        <path d="M7 6V4a3 3 0 0 1 6 0v2" />
      </svg>
    ),
  },
] as const;

function Principle({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest-50 border border-forest-200 text-forest-800 font-bold">
        {n}
      </span>
      <h3 className="mt-4 font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function PersonCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div
          className="h-12 w-12 rounded-full bg-gradient-to-br from-forest-700 to-forest-900 text-white font-bold flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {name
            .split(' ')
            .map((s) => s[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-foreground">{name}</p>
          <p className="text-sm text-forest-800 font-medium">{role}</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <details className="group">
      <summary className="flex justify-between items-center gap-3 cursor-pointer list-none px-5 py-4 hover:bg-warmgray-50 transition-colors">
        <span className="font-semibold text-foreground">{q}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground transition-transform group-open:rotate-180 flex-shrink-0"
          aria-hidden="true"
        >
          <path d="M5 7l4 4 4-4" />
        </svg>
      </summary>
      <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>
    </details>
  );
}
