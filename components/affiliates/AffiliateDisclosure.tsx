/**
 * FTC-required affiliate disclosure (16 CFR Part 255).
 * Disclosures must be clear, conspicuous, and near affiliate links.
 */
export function AffiliateDisclosure({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-muted-foreground italic leading-relaxed">
        We earn a small commission on purchases through these links — at no extra
        cost to you. Prices and availability may vary.
      </p>
    );
  }
  return (
    <div className="rounded-md bg-warmgray-50 border border-border px-4 py-3 text-sm text-muted-foreground leading-relaxed">
      <strong className="text-foreground">Affiliate disclosure:</strong>{' '}
      HomeRenoCalc earns a commission when you buy through links on this page.
      It does not change the price you pay, and it never influences which
      products we recommend.
    </div>
  );
}
