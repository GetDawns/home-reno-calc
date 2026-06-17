/**
 * "Where to Buy" — search-style retailer links for each main material.
 *
 * Different from <ShopMaterials/>:
 *  - ShopMaterials = curated affiliate links to specific products (deeper conversion)
 *  - WhereToBuy   = generic search links to find the material at any retailer
 *
 * Designed to live at the bottom of every result panel. Compact, scannable,
 * non-spammy. Uses retailer search URLs so links never go stale.
 */

interface Retailer {
  name: string;
  baseUrl: (search: string) => string;
  /** Used only for the small inline label color. Keep muted — not a CTA color. */
  brand: string;
}

const RETAILERS: Retailer[] = [
  {
    name: 'Home Depot',
    baseUrl: (s) => `https://www.homedepot.com/s/${encodeURIComponent(s)}`,
    brand: '#F96302',
  },
  {
    name: "Lowe's",
    baseUrl: (s) => `https://www.lowes.com/search?searchTerm=${encodeURIComponent(s)}`,
    brand: '#004990',
  },
  {
    name: 'Amazon',
    baseUrl: (s) => `https://www.amazon.com/s?k=${encodeURIComponent(s)}`,
    brand: '#FF9900',
  },
];

export interface WhereToBuyItem {
  /** Display name of the material (e.g., "Interior paint") */
  material: string;
  /** Quantity from the live result (e.g., "3 gallons") — purely descriptive */
  quantity: string;
  /** What to search for at each retailer */
  searchTerm: string;
  /** Optional: limit which retailers show for this item. Default = all 3. */
  retailers?: ('Home Depot' | "Lowe's" | 'Amazon')[];
}

export interface WhereToBuyProps {
  items: WhereToBuyItem[];
  /** Optional title override. Default: "Where to buy" */
  title?: string;
}

export function WhereToBuy({ items, title = 'Where to buy' }: WhereToBuyProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <CartIcon />
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const enabled = RETAILERS.filter((r) =>
            item.retailers ? item.retailers.includes(r.name as any) : true
          );
          return (
            <li key={item.material} className="space-y-1.5">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {item.material}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {item.quantity}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {enabled.map((r) => (
                  <a
                    key={r.name}
                    href={r.baseUrl(item.searchTerm)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-warmgray-50 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-warmgray-100 hover:border-forest-200 transition-colors"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: r.brand }}
                      aria-hidden="true"
                    />
                    {r.name}
                    <ExternalArrow />
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-[11px] text-muted-foreground italic leading-relaxed pt-1 border-t border-border">
        Search links open the retailer's catalog — you'll see local pricing and stock.
      </p>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-forest-700"
      aria-hidden="true"
    >
      <path d="M2 3h2l2 8h7.5L15 5H5" />
      <circle cx="6" cy="13.5" r="0.75" fill="currentColor" />
      <circle cx="13" cy="13.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="opacity-60"
      aria-hidden="true"
    >
      <path d="M3.5 6.5l3-3M4 3.5h2.5V6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
