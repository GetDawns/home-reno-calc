import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'DIY Home Improvement Guides',
  description:
    'In-depth, field-tested guides for DIY home renovation projects. Practical math, real-world tips, and material recommendations.',
  alternates: { canonical: 'https://homerenocalc.com/blog' },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="container py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">DIY guides</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Practical how-tos with the math worked out for you.
        </p>
      </header>

      <div className="space-y-4">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
            <Card className="hover:border-primary hover:shadow-md transition">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {p.frontmatter.title}
                </h2>
                <p className="mt-2 text-muted-foreground">{p.frontmatter.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {p.frontmatter.authorName} ·{' '}
                  <time dateTime={p.frontmatter.dateUpdated}>
                    {new Date(p.frontmatter.dateUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
