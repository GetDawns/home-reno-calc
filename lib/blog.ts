import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export interface BlogFrontmatter {
  title: string;
  description: string;
  /** ISO date when the post was first published */
  datePublished: string;
  /** ISO date when the post was last meaningfully updated */
  dateUpdated: string;
  authorName: string;
  authorUrl?: string;
  /** Hero image (relative to /public or absolute) */
  image?: string;
  /** Slugs of related calculators (used to build internal links + Shop Materials) */
  relatedCalculators?: string[];
  /** Primary target keyword for SEO debugging */
  targetKeyword?: string;
  /** Categorization for site nav */
  category?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
}

export async function getAllSlugs(): Promise<string[]> {
  const files = await fs.readdir(BLOG_DIR);
  return files
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const candidates = [`${slug}.mdx`, `${slug}.md`];
  for (const file of candidates) {
    try {
      const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as BlogFrontmatter, content };
    } catch {
      // Try next extension.
    }
  }
  return null;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = await getAllSlugs();
  const posts = await Promise.all(slugs.map((s) => getPostBySlug(s)));
  return posts
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) =>
      b.frontmatter.datePublished.localeCompare(a.frontmatter.datePublished)
    );
}
