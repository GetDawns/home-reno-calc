/**
 * Slim metadata index for all calculators.
 *
 * This is a derived, read-only view of `content/calculators/manifest.ts` —
 * useful for sitemaps, SEO audits, search indices, and at-a-glance reviews.
 *
 * The full manifest (FAQs, shop products, how-to steps, etc.) lives in
 * `content/calculators/manifest.ts`. Always edit that file; this stays in sync
 * because it's computed from it at build time.
 */

import { calculatorManifest } from '@/content/calculators/manifest';

export interface CalculatorMetadataSlim {
  slug: string;
  title: string;
  description: string;
  targetKeyword: string;
  secondaryKeywords: string[];
  category: string;
}

export const calculatorsMetadata: CalculatorMetadataSlim[] = calculatorManifest.map(
  (c) => ({
    slug: c.slug,
    title: c.title,
    description: c.shortDescription,
    targetKeyword: c.targetKeyword,
    secondaryKeywords: c.secondaryKeywords,
    category: c.category,
  })
);
