/**
 * Affiliate link helpers.
 *
 * We prioritize Home Depot (8% commission, deepest catalog for DIY).
 * Lowe's and Amazon are fallbacks. Each retailer requires a unique tracking tag
 * appended to product URLs.
 *
 * Set in .env.local:
 *   NEXT_PUBLIC_HD_TAG, NEXT_PUBLIC_LOWES_TAG, NEXT_PUBLIC_AMAZON_TAG
 */

export type Retailer = 'home-depot' | 'lowes' | 'amazon';

export interface ProductLink {
  retailer: Retailer;
  /** Stable product identifier for that retailer (sku, store id, asin) */
  productId: string;
  /** Display title shown in CTA buttons */
  title: string;
  /** Optional thumbnail image URL */
  image?: string;
  /** Optional approximate price in USD (display only — never trusted for math) */
  approxPrice?: number;
}

const HD_TAG = process.env.NEXT_PUBLIC_HD_TAG ?? '';
const LOWES_TAG = process.env.NEXT_PUBLIC_LOWES_TAG ?? '';
const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? '';

export function buildAffiliateUrl(link: ProductLink): string {
  switch (link.retailer) {
    case 'home-depot':
      // Home Depot uses Impact Radius (impactradius). productId here is the
      // store's product id and we forward it through their affiliate domain.
      return `https://homedepot.sjv.io/c/${HD_TAG}/p/${link.productId}`;
    case 'lowes':
      return `https://lowes.5pm6.net/c/${LOWES_TAG}/p/${link.productId}`;
    case 'amazon':
      return `https://www.amazon.com/dp/${link.productId}/?tag=${AMAZON_TAG}`;
  }
}

/**
 * Returns retailer metadata for display.
 * Order in the array = our display priority.
 */
export const RETAILER_META: Record<Retailer, { name: string; commissionRate: number; brandColor: string }> = {
  'home-depot': { name: 'Home Depot', commissionRate: 0.08, brandColor: '#F96302' },
  lowes: { name: "Lowe's", commissionRate: 0.03, brandColor: '#004990' },
  amazon: { name: 'Amazon', commissionRate: 0.03, brandColor: '#FF9900' },
};

/**
 * Sort product links by retailer priority so the highest-commission retailer
 * is shown first.
 */
export function sortByPriority(links: ProductLink[]): ProductLink[] {
  const order: Retailer[] = ['home-depot', 'lowes', 'amazon'];
  return [...links].sort(
    (a, b) => order.indexOf(a.retailer) - order.indexOf(b.retailer)
  );
}
