import Link from 'next/link';
import { calculatorManifest } from '@/content/calculators/manifest';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NEW_SLUGS = new Set(['fence-calculator', 'roofing-calculator', 'siding-calculator']);

export default function HomePage() {
  const byCategory: Record<string, typeof calculatorManifest> = {};
  for (const c of calculatorManifest) {
    (byCategory[c.category] ??= []).push(c);
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-warmgray-100 to-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-forest-200/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl"
        />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-50 text-forest-800 px-3 py-1 text-xs font-semibold border border-forest-200">
              <span className="relative h-1.5 w-1.5 rounded-full bg-forest-600 live-pulse" />
              Free · No signup · {calculatorManifest.length} calculators · Trusted by DIYers
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
              Plan it before you{' '}
              <span className="bg-gradient-to-r from-forest-700 to-forest-900 bg-clip-text text-transparent">
                buy it.
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Free, accurate calculators for DIY home renovation. Get exact material
              estimates in seconds — paint, lumber, concrete, mulch, tile, fence,
              roofing, siding and more.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/calculators">Browse all {calculatorManifest.length} calculators</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">Read our guides</Link>
              </Button>
            </div>

            {/* Tiny social proof bar */}
            <dl className="mt-10 grid grid-cols-3 max-w-md gap-6 text-left">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Calculators</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-foreground calc-num">{calculatorManifest.length}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Cost</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-foreground">$0</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Signup</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-foreground">None</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ALL CALCULATORS — featured grid */}
      <section className="container section-y">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All free calculators</h2>
            <p className="mt-1 text-muted-foreground">
              Pick a project — the math runs in your browser, instantly.
            </p>
          </div>
          <Link href="/calculators" className="text-sm font-semibold text-primary hover:underline">
            By category →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calculatorManifest.map((c) => (
            <CalculatorCard
              key={c.slug}
              slug={c.slug}
              title={c.title}
              description={c.shortDescription}
              category={c.category}
              isNew={NEW_SLUGS.has(c.slug)}
            />
          ))}
        </div>
      </section>

      {/* TRUST / VALUE PROPS */}
      <section className="bg-warmgray-50 border-y border-border">
        <div className="container section-y">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <ValueProp
              icon={<MaterialIcon />}
              title="Material-accurate math"
              text="Every formula uses manufacturer coverage rates and industry waste factors — not guesses."
            />
            <ValueProp
              icon={<DollarIcon />}
              title="Cost estimates included"
              text="Plug in your local prices to get a true total — bags, bulk delivery, and rebar all priced out."
            />
            <ValueProp
              icon={<PrintIcon />}
              title="Print-friendly results"
              text="Take your numbers right to Home Depot. Shopping list, materials, and total — on one clean page."
            />
          </div>
        </div>
      </section>

      {/* DIRECTORY BY CATEGORY */}
      <section className="container section-y">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">Browse by project</h2>
        <div className="space-y-10">
          {Object.entries(byCategory).map(([category, calcs]) => (
            <div key={category}>
              <h3 className="text-lg font-bold text-foreground mb-4">{category}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {calcs.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/calculators/${c.slug}`}
                      className="block rounded-md border border-border bg-card px-4 py-3 hover:border-forest-200 hover:shadow-card transition-all"
                    >
                      <span className="font-medium text-foreground">{c.title}</span>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.shortDescription}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border bg-gradient-to-br from-forest-800 to-forest-900 text-white">
        <div className="container section-y text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            One bookmark for every DIY project.
          </h2>
          <p className="mt-3 text-forest-50/85 leading-relaxed">
            Save HomeRenoCalc once and stop hunting for "how many bags / boards / gallons" the night before your project.
          </p>
          <div className="mt-7 flex justify-center gap-3 flex-wrap">
            <Button asChild size="lg" variant="secondary" className="!bg-white !text-forest-900 hover:!bg-warmgray-100">
              <Link href="/calculators">Start a calculation</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="!bg-transparent !text-white !border-white/40 hover:!bg-white/10">
              <Link href="/about">How the math works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function CalculatorCard({
  slug,
  title,
  description,
  category,
  isNew,
}: {
  slug: string;
  title: string;
  description: string;
  category: string;
  isNew?: boolean;
}) {
  return (
    <Link href={`/calculators/${slug}`} className="group block h-full">
      <Card className="relative h-full surface-card surface-card-hover hover-lift">
        {isNew && (
          <span className="absolute top-3 right-3 inline-flex items-center rounded-full bg-sky-500 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm">
            New
          </span>
        )}
        <CardContent className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">{category}</p>
          <h3 className="mt-1.5 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Open calculator
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function ValueProp({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto h-12 w-12 rounded-lg bg-forest-50 border border-forest-200 text-forest-800 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{text}</p>
    </div>
  );
}

function MaterialIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z" />
      <path d="M9 11l2 2 4-4" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" rx="1" />
    </svg>
  );
}
