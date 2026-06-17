import {
  buildAffiliateUrl,
  RETAILER_META,
  sortByPriority,
  type ProductLink,
} from '@/lib/affiliates/links';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AffiliateDisclosure } from './AffiliateDisclosure';

export interface ShopMaterialsProps {
  /** Section title — e.g., "Shop Paint Supplies" */
  title?: string;
  /** Map of category name -> product links across retailers */
  categories: { name: string; products: ProductLink[] }[];
}

/**
 * Reusable affiliate panel that appears on every calculator and relevant
 * article. Highest-commission retailer (Home Depot) is shown first.
 */
export function ShopMaterials({
  title = 'Shop the materials',
  categories,
}: ShopMaterialsProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-gradient-to-br from-forest-50 to-warmgray-50 px-6 py-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <CartIcon /> {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Direct links to the materials our calculator estimated. Home Depot first; alternatives below.
        </p>
      </div>
      <div className="p-6 space-y-6">
        <AffiliateDisclosure compact />
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              {cat.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sortByPriority(cat.products).map((p) => (
                <a
                  key={`${p.retailer}-${p.productId}`}
                  href={buildAffiliateUrl(p)}
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="block group"
                >
                  <Card className="hover:shadow-card-hover hover:border-forest-200 transition-all h-full">
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex-1">
                        <p
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: RETAILER_META[p.retailer].brandColor }}
                        >
                          {RETAILER_META[p.retailer].name}
                        </p>
                        <p className="font-medium mt-1 text-sm leading-snug text-foreground group-hover:text-primary transition-colors">
                          {p.title}
                        </p>
                        {p.approxPrice !== undefined && (
                          <p className="text-xs text-muted-foreground mt-1">
                            ~${p.approxPrice.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant={p.retailer === 'home-depot' ? 'affiliate' : 'outline'}
                        size="sm"
                        className="mt-3 w-full pointer-events-none"
                        tabIndex={-1}
                      >
                        View at {RETAILER_META[p.retailer].name}
                      </Button>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-forest-700"
      aria-hidden="true"
    >
      <path d="M3 4h2l3 12h11l3-9H6.5" />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}
