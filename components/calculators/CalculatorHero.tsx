import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Calculator page hero — establishes the project context before the form.
 *
 * Layout:
 *  - Mobile: text first, image below (stacks naturally)
 *  - Desktop: text left (3 cols), image right (2 cols), 2:3 aspect
 *
 * The heroImage prop should point to a /public path or a remote URL. We use
 * Next/Image with `priority` so it doesn't compete with the calculator's
 * interactive bundle for LCP.
 */
export interface CalculatorHeroProps {
  title: string;
  subtitle: string;
  /** Path to hero photo. Recommended: real project photography, no illustrations. */
  heroImage?: string;
  /** Alt text describing the photo for screen readers. */
  heroAlt?: string;
  breadcrumbs: { name: string; url: string }[];
  /** ISO date for the small "last updated" badge. */
  lastUpdated: string;
  /** Optional category pill (e.g., "Paint & Walls"). */
  category?: string;
}

export function CalculatorHero({
  title,
  subtitle,
  heroImage,
  heroAlt,
  breadcrumbs,
  lastUpdated,
  category,
}: CalculatorHeroProps) {
  return (
    <section className="bg-gradient-to-b from-warmgray-100 to-background border-b border-border">
      <div className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 space-y-4">
            {category && (
              <span className="inline-flex items-center rounded-full bg-forest-50 text-forest-800 px-3 py-1 text-xs font-medium">
                {category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="relative h-2 w-2 rounded-full bg-forest-600 live-pulse" />
                Free · No signup
              </span>
              <span aria-hidden className="text-warmgray-300">·</span>
              <span>Instant results</span>
              <span aria-hidden className="text-warmgray-300">·</span>
              <span>
                Updated{' '}
                <time dateTime={lastUpdated}>
                  {new Date(lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </span>
            </div>
          </div>

          {heroImage ? (
            <div className="lg:col-span-2 relative aspect-[3/2] rounded-xl overflow-hidden bg-warmgray-200 shadow-card">
              <Image
                src={heroImage}
                alt={heroAlt ?? `${title} project example`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="lg:col-span-2 relative aspect-[3/2] rounded-xl overflow-hidden bg-warmgray-100 border border-border flex items-center justify-center">
              <span className="text-xs text-muted-foreground italic px-4 text-center">
                Add a project photo at{' '}
                <code className="font-mono">/public/images/calculators/{title}</code>
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Breadcrumbs({ items }: { items: CalculatorHeroProps['breadcrumbs'] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.url} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4.5 3l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {i === items.length - 1 ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={normalizeHref(item.url)}
                className={cn(
                  'hover:text-foreground transition-colors',
                  'underline-offset-2 hover:underline'
                )}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function normalizeHref(url: string): string {
  // Accepts both absolute (https://homerenocalc.com/x) and relative (/x).
  try {
    const u = new URL(url);
    return u.pathname + u.search + u.hash;
  } catch {
    return url;
  }
}
