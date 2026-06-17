import type { MetadataRoute } from 'next';
import { calculatorManifest } from '@/content/calculators/manifest';
import { getAllPosts } from '@/lib/blog';

const BASE = 'https://homerenocalc.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const calculators = calculatorManifest.map((c) => ({
    url: `${BASE}/calculators/${c.slug}`,
    lastModified: c.lastUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const posts = await getAllPosts();
  const articles = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.frontmatter.dateUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/calculators`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...calculators,
    ...articles,
  ];
}
