import Link from 'next/link';
import type { AnchorHTMLAttributes, ComponentType } from 'react';

/**
 * MDX component overrides used by next-mdx-remote/rsc.
 *
 * We avoid pulling `@types/mdx` just for the MDXComponents type — the actual
 * shape consumed by next-mdx-remote is just a Record<string, ComponentType>.
 */
type MDXComponents = Record<string, ComponentType<any>>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
      // Internal links (relative paths starting with `/`) use Next Link for
      // client-side navigation; external links open in a new tab.
      if (href?.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    ...components,
  };
}
