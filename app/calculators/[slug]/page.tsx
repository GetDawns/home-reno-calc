import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { calculatorManifest, getCalculatorBySlug } from '@/content/calculators/manifest';
import { CALCULATOR_COMPONENTS } from '@/components/calculators/registry';
import { CalculatorLayout } from '@/components/calculators/CalculatorLayout';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Statically pre-render every calculator slug at build time.
 * Adding a new calculator -> append to manifest -> automatically built.
 */
export async function generateStaticParams() {
  return calculatorManifest.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCalculatorBySlug(slug);
  if (!meta) return {};

  const url = `https://homerenocalc.com/calculators/${slug}`;
  const seoTitle = meta.seoTitle ?? meta.title;
  return {
    title: seoTitle,
    description: meta.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: seoTitle,
      description: meta.metaDescription,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: meta.metaDescription,
    },
    keywords: [meta.targetKeyword, ...meta.secondaryKeywords],
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const meta = getCalculatorBySlug(slug);
  if (!meta) notFound();

  const Calculator = CALCULATOR_COMPONENTS[slug];
  if (!Calculator) notFound();

  // Build related list from slugs in manifest.
  const related = meta.related
    .map((s) => getCalculatorBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ slug: c.slug, title: c.title, shortDescription: c.shortDescription }));

  const breadcrumbs = [
    { name: 'Home', url: 'https://homerenocalc.com' },
    { name: 'Calculators', url: 'https://homerenocalc.com/calculators' },
    { name: meta.title, url: `https://homerenocalc.com/calculators/${meta.slug}` },
  ];

  return (
    <CalculatorLayout
      title={meta.title}
      subtitle={meta.subtitle}
      shop={meta.shop}
      howToSteps={meta.howToSteps}
      faqs={meta.faqs}
      related={related}
      relatedArticles={meta.relatedArticles}
      breadcrumbs={breadcrumbs}
      lastUpdated={meta.lastUpdated}
      category={meta.category}
      heroImage={meta.heroImage}
      heroAlt={meta.heroAlt}
      schema={{
        name: meta.title,
        description: meta.metaDescription,
        url: `https://homerenocalc.com/calculators/${meta.slug}`,
        steps: meta.howToSteps,
        tools: meta.tools,
        supplies: meta.supplies,
      }}
    >
      <Calculator />
    </CalculatorLayout>
  );
}
