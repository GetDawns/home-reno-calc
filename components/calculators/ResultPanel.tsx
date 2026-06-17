import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Standard result panel chrome — sticky on desktop, full-width on mobile.
 *
 * Provides:
 *  - The "Live results" badge (replaces the missing Calculate-button CTA on desktop)
 *  - Consistent padding, border, and visual hierarchy
 *  - Scroll target ID so the mobile Calculate button can scroll into view
 */
export interface ResultPanelProps {
  /** Anchor ID for scroll-to-result on mobile. Default: 'calc-result' */
  id?: string;
  /** Brief explanation shown under the title. Default: "Updates instantly as you type" */
  hint?: string;
  /** Title shown at the top of the result panel. Default: "Your estimate" */
  title?: string;
  className?: string;
  children: ReactNode;
}

export function ResultPanel({
  id = 'calc-result',
  hint = 'Updates instantly as you type',
  title = 'Your estimate',
  className,
  children,
}: ResultPanelProps) {
  return (
    <aside
      id={id}
      aria-live="polite"
      className={cn(
        'lg:sticky lg:top-24 surface-card overflow-hidden bg-warmgray-50',
        className
      )}
    >
      <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-base text-foreground tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 text-forest-800 px-2.5 py-1 text-xs font-semibold border border-forest-200">
          <span className="relative h-1.5 w-1.5 live-pulse rounded-full bg-forest-600" />
          Live
        </span>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </aside>
  );
}

/**
 * Big primary number with label — for the headline result.
 * Used like: `<PrimaryResult label="You'll need" value="3 gallons" sub="Estimated cost: $105" />`
 */
export interface PrimaryResultProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** Optional icon shown to the left of the value */
  icon?: ReactNode;
}

export function PrimaryResult({ label, value, sub, icon }: PrimaryResultProps) {
  return (
    <div className="relative rounded-xl border border-forest-200 bg-gradient-to-br from-forest-50 to-forest-50/40 px-5 py-4 overflow-hidden">
      {/* Subtle decorative corner — gives the panel a touch of premium polish. */}
      <div
        className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-forest-200/30 blur-2xl"
        aria-hidden="true"
      />
      <p className="relative text-xs uppercase tracking-wider font-semibold text-forest-800">
        {label}
      </p>
      <div className="relative mt-1 flex items-center gap-3">
        {icon}
        <p className="text-3xl md:text-[2.125rem] font-extrabold tracking-tight text-foreground leading-[1.05] calc-num">
          {value}
        </p>
      </div>
      {sub && <p className="relative mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

/**
 * Secondary result card — used alongside PrimaryResult for additional outputs
 * (e.g., "1 box of screws + 2 pails of compound").
 */
export function SecondaryResult({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-5 py-4">
      <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 text-foreground space-y-1">{children}</div>
    </div>
  );
}

/**
 * Small stat tile — used in 2-column grids for breakdown numbers.
 * Tabular numerics so the values stay aligned as inputs change.
 */
export function StatTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-warmgray-50/50">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground mt-0.5 calc-num">{value}</dd>
    </div>
  );
}

/**
 * Notes/warnings list — yellow-tinted to feel like a printed pro tip card.
 */
export function ResultNotes({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="rounded-md border border-warmgray-200 bg-warmgray-100/70 px-4 py-3">
      <p className="text-xs uppercase tracking-wide font-semibold text-warmgray-700 mb-1.5">
        Pro tips
      </p>
      <ul className="space-y-1.5 text-sm text-foreground/85">
        {notes.map((n) => (
          <li key={n} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-forest-600" aria-hidden="true" />
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
