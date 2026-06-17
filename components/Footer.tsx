import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border bg-warmgray-50 mt-20 no-print">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-3 group">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-forest-700 to-forest-900 text-white shadow-sm group-hover:shadow-md transition-shadow"
                aria-hidden="true"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M3 17h14v2H3v-2Zm2-7 5-6 5 6v6H5v-6Zm2 0v4h6v-4l-3-3.6L7 10Z" />
                </svg>
              </span>
              <span className="font-extrabold tracking-tight text-foreground">
                HomeReno<span className="text-primary">Calc</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-xs">
              Free, accurate calculators for DIY home renovation projects. Real
              coverage rates, real cost math.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Indoor</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><FooterLink href="/calculators/paint-calculator">Paint</FooterLink></li>
              <li><FooterLink href="/calculators/drywall-calculator">Drywall</FooterLink></li>
              <li><FooterLink href="/calculators/tile-calculator">Tile</FooterLink></li>
              <li><FooterLink href="/calculators/concrete-calculator">Concrete</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Outdoor</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><FooterLink href="/calculators/deck-calculator">Deck</FooterLink></li>
              <li><FooterLink href="/calculators/fence-calculator">Fence</FooterLink></li>
              <li><FooterLink href="/calculators/roofing-calculator">Roofing</FooterLink></li>
              <li><FooterLink href="/calculators/siding-calculator">Siding</FooterLink></li>
              <li><FooterLink href="/calculators/mulch-calculator">Mulch &amp; Soil</FooterLink></li>
              <li><FooterLink href="/calculators/gravel-calculator">Gravel</FooterLink></li>
              <li><FooterLink href="/calculators">All calculators →</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Resources</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><FooterLink href="/blog">DIY Guides</FooterLink></li>
              <li><FooterLink href="/about">About</FooterLink></li>
              <li><FooterLink href="/contact">Contact</FooterLink></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-foreground">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><FooterLink href="/privacy">Privacy</FooterLink></li>
              <li><FooterLink href="/terms">Terms</FooterLink></li>
              <li><FooterLink href="/affiliate-disclosure">Affiliate Disclosure</FooterLink></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 text-xs text-muted-foreground text-center leading-relaxed">
          <p>
            © {new Date().getFullYear()} HomeRenoCalc. All rights reserved.{' '}
            <span className="hidden sm:inline">Estimates are guidance only —</span> verify with your specific materials and local building codes.
          </p>
          <p className="mt-1">
            We don&apos;t collect personal data. Anonymous analytics only.{' '}
            <Link href="/privacy" className="hover:text-foreground underline underline-offset-2">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
