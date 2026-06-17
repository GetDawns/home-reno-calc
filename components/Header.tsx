import Link from 'next/link';

const NAV = [
  { href: '/calculators', label: 'Calculators' },
  { href: '/blog', label: 'Guides' },
  { href: '/about', label: 'About' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/85 backdrop-blur-md supports-[backdrop-filter]:bg-card/70">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-forest-700 to-forest-900 text-white shadow-sm group-hover:shadow-md transition-shadow"
            aria-hidden="true"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M3 17h14v2H3v-2Zm2-7 5-6 5 6v6H5v-6Zm2 0v4h6v-4l-3-3.6L7 10Z" />
            </svg>
          </span>
          <span className="font-extrabold text-lg tracking-tight text-foreground">
            HomeReno<span className="text-primary">Calc</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-4 md:gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-foreground/80 hover:text-primary px-2 py-1.5 rounded-md hover:bg-warmgray-100 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
