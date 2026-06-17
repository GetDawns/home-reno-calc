/**
 * JSON-LD structured data builders.
 *
 * Calculators get HowTo / SoftwareApplication-ish schema (we use HowTo since
 * Google rewards step-based snippets in DIY queries).
 * Articles use Article + BreadcrumbList.
 */

export interface CalculatorSchemaInput {
  name: string;
  description: string;
  url: string;
  /** Steps a user follows on the page (helps rich snippets) */
  steps: { name: string; text: string }[];
  /** Total estimated time in ISO 8601 duration (e.g., "PT2M") */
  totalTime?: string;
  /** Categories / tools relevant to the project */
  tools?: string[];
  /** Materials relevant to the project */
  supplies?: string[];
}

export function calculatorJsonLd(input: CalculatorSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    url: input.url,
    totalTime: input.totalTime ?? 'PT2M',
    tool: input.tools?.map((t) => ({ '@type': 'HowToTool', name: t })),
    supply: input.supplies?.map((s) => ({ '@type': 'HowToSupply', name: s })),
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  authorName: string;
  authorUrl?: string;
  datePublished: string;
  dateModified: string;
}

export function articleJsonLd(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: [input.imageUrl],
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: [
      {
        '@type': 'Person',
        name: input.authorName,
        url: input.authorUrl,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'HomeRenoCalc',
      logo: {
        '@type': 'ImageObject',
        url: 'https://homerenocalc.com/logo.png',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': input.url },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
