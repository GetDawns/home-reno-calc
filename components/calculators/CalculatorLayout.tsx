import Link from 'next/link';
import { type ReactNode } from 'react';
import { AdSlot } from '@/components/ads/AdSlot';
import { ShopMaterials, type ShopMaterialsProps } from '@/components/affiliates/ShopMaterials';
import { CalculatorHero } from './CalculatorHero';
import { breadcrumbJsonLd, calculatorJsonLd, type CalculatorSchemaInput } from '@/lib/seo/schema';

export interface CalculatorLayoutProps {
  title: string;
  subtitle: string;
  /** Calculator UI — should be a 'use client' component. Renders inside the form column. */
  children: ReactNode;
  /** ShopMaterials affiliate panel data */
  shop: ShopMaterialsProps;
  /** "How to use this calculator" steps for the in-content section AND HowTo schema */
  howToSteps: { name: string; text: string }[];
  /** FAQs surfaced under the calculator */
  faqs?: { question: string; answer: string }[];
  /** Related calculators for cross-linking */
  related?: { slug: string; title: string; shortDescription?: string }[];
  /** Slugs of in-depth blog articles relevant to this calculator */
  relatedArticles?: { slug: string; title: string }[];
  /** Schema metadata */
  schema: CalculatorSchemaInput;
  /** Breadcrumb trail */
  breadcrumbs: { name: string; url: string }[];
  /** Date of last meaningful update (ISO) — surfaced for E-E-A-T */
  lastUpdated: string;
  /** Optional category pill shown in the hero */
  category?: string;
  /** Optional hero photo */
  heroImage?: string;
  heroAlt?: string;
}

/**
 * Server component layout for every calculator page.
 *
 * Order:
 *   1. Hero (gradient bg, breadcrumb, title, subtitle, image)
 *   2. Calculator (the client component children)
 *   3. In-content ad slot
 *   4. How to use steps
 *   5. Shop Materials affiliate panel
 *   6. FAQ accordion
 *   7. Related calculators / articles
 *   8. Bottom ad slot
 *
 * Schema: HowTo + Breadcrumb (always), FAQPage (when faqs present).
 */
export function CalculatorLayout({
  title,
  subtitle,
  children,
  shop,
  howToSteps,
  faqs,
  related,
  relatedArticles,
  schema,
  breadcrumbs,
  lastUpdated,
  category,
  heroImage,
  heroAlt,
}: CalculatorLayoutProps) {
  const calcLd = calculatorJsonLd({ ...schema, steps: howToSteps });
  const breadcrumbLd = breadcrumbJsonLd(breadcrumbs);
  const faqLd = faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <CalculatorHero
        title={title}
        subtitle={subtitle}
        heroImage={heroImage}
        heroAlt={heroAlt}
        breadcrumbs={breadcrumbs}
        lastUpdated={lastUpdated}
        category={category}
      />

      <div className="container py-10 md:py-14 max-w-6xl">
        <div className="calculator-result">{children}</div>

        <AdSlot variant="in-content" slotId="calc-mid" className="mt-12" />

        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How to use this calculator
          </h2>
          <p className="mt-2 text-muted-foreground">
            Five-minute walkthrough — get from "I have a project" to "here's my materials list."
          </p>
          <ol className="mt-6 space-y-4">
            {howToSteps.map((s, i) => (
              <li key={s.name} className="flex gap-4">
                <span className="flex-shrink-0 h-9 w-9 rounded-full bg-forest-50 border border-forest-200 text-forest-800 font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <p className="text-muted-foreground mt-0.5 leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <ShopMaterials {...shop} />
        </section>

        {faqs?.length ? (
          <section className="mt-14">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-6 divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
              {faqs.map((f) => (
                <details key={f.question} className="group">
                  <summary className="flex justify-between items-center gap-3 cursor-pointer list-none px-5 py-4 hover:bg-warmgray-50 transition-colors">
                    <span className="font-semibold text-foreground">{f.question}</span>
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
                  <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                    {f.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {(related?.length || relatedArticles?.length) && (
          <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {related?.length ? (
              <div>
                <h3 className="font-bold text-lg mb-4">Related calculators</h3>
                <ul className="space-y-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/calculators/${r.slug}`}
                        className="block surface-card px-4 py-3 hover:shadow-card-hover hover:border-forest-200 transition-all"
                      >
                        <span className="font-semibold text-foreground hover:text-primary transition-colors">
                          {r.title}
                        </span>
                        {r.shortDescription && (
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {r.shortDescription}
                          </p>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {relatedArticles?.length ? (
              <div>
                <h3 className="font-bold text-lg mb-4">In-depth guides</h3>
                <ul className="space-y-2">
                  {relatedArticles.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/blog/${r.slug}`}
                        className="block surface-card px-4 py-3 hover:shadow-card-hover hover:border-forest-200 transition-all"
                      >
                        <span className="font-semibold text-foreground hover:text-primary transition-colors">
                          → {r.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        )}

        <AdSlot variant="leaderboard" slotId="calc-bottom" className="mt-14" />
      </div>
    </>
  );
}
