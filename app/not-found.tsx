import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { calculatorManifest } from '@/content/calculators/manifest';

export default function NotFound() {
  const popular = calculatorManifest.slice(0, 4);
  return (
    <section className="container py-20 md:py-28 max-w-2xl text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">404</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">
        That page wandered off.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
        We couldn&apos;t find what you were looking for. Try one of the popular
        calculators below, or head back to the home page.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/calculators">All calculators</Link>
        </Button>
      </div>
      <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {popular.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/calculators/${c.slug}`}
              className="block rounded-lg border border-border bg-card px-4 py-3 hover:border-forest-200 hover:shadow-card transition-all"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-forest-700">{c.category}</p>
              <p className="mt-0.5 font-semibold text-foreground">{c.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
