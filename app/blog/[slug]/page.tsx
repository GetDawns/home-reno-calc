import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { getCalculatorBySlug } from '@/content/calculators/manifest';
import { useMDXComponents } from '@/mdx-components';
import { AdSlot } from '@/components/ads/AdSlot';
import { ShopMaterials } from '@/components/affiliates/ShopMaterials';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/schema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `https://homerenocalc.com/blog/${slug}`;
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: 'article',
      url,
      publishedTime: post.frontmatter.datePublished,
      modifiedTime: post.frontmatter.dateUpdated,
      authors: [post.frontmatter.authorName],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const url = `https://homerenocalc.com/blog/${slug}`;
  const articleLd = articleJsonLd({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    url,
    imageUrl: post.frontmatter.image
      ? `https://homerenocalc.com${post.frontmatter.image}`
      : 'https://homerenocalc.com/og-default.png',
    authorName: post.frontmatter.authorName,
    authorUrl: post.frontmatter.authorUrl,
    datePublished: post.frontmatter.datePublished,
    dateModified: post.frontmatter.dateUpdated,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', url: 'https://homerenocalc.com' },
    { name: 'Blog', url: 'https://homerenocalc.com/blog' },
    { name: post.frontmatter.title, url },
  ]);

  // Build the Shop Materials panel by pulling from related calculators' shop data.
  const related = (post.frontmatter.relatedCalculators ?? [])
    .map((s) => getCalculatorBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const shopCategories = related.flatMap((c) => c.shop.categories);
  const components = useMDXComponents({});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <article className="container max-w-3xl py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-primary">Home</Link>
          {' › '}
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          {' › '}
          <span className="text-foreground">{post.frontmatter.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {post.frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {post.frontmatter.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>By {post.frontmatter.authorName}</span>
            <span aria-hidden>·</span>
            <span>
              Updated{' '}
              <time dateTime={post.frontmatter.dateUpdated}>
                {new Date(post.frontmatter.dateUpdated).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </span>
          </div>
        </header>

        <div className="prose-diy">
          <MDXRemote source={post.content} components={components} />
        </div>

        <AdSlot variant="in-content" slotId="article-mid" className="my-10" />

        {related.length > 0 && (
          <div className="mt-12">
            <ShopMaterials
              title="Shop materials for this project"
              categories={shopCategories}
            />
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-12 rounded-lg border bg-secondary/30 p-6">
            <h3 className="font-bold mb-3">Run the numbers</h3>
            <ul className="space-y-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link href={`/calculators/${c.slug}`} className="text-primary hover:underline">
                    → {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
