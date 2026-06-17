import { cn } from '@/lib/utils';

/**
 * Ad slot placeholder.
 *
 * Sizes match common ad units to prevent CLS (the #1 ad performance killer):
 *   in-content       — 336x280 medium rectangle
 *   sidebar          — 300x600 half-page (sticky)
 *   sticky-bottom    — 320x50 / 728x90 anchor
 *   leaderboard      — 728x90 / 970x90
 *   between-sections — 336x280 spacer
 *
 * Replace the placeholder div with your ad network's script in production.
 */
export type AdVariant =
  | 'in-content'
  | 'sidebar'
  | 'sticky-bottom'
  | 'leaderboard'
  | 'between-sections';

const SIZES: Record<AdVariant, string> = {
  'in-content': 'min-h-[280px] mx-auto max-w-[336px]',
  sidebar: 'min-h-[600px] sticky top-24',
  'sticky-bottom':
    'fixed bottom-0 left-0 right-0 min-h-[60px] z-40 no-print bg-warmgray-50 border-t border-border',
  leaderboard: 'min-h-[90px] mx-auto max-w-[728px]',
  'between-sections': 'min-h-[280px] mx-auto max-w-[336px]',
};

export interface AdSlotProps {
  variant: AdVariant;
  /** Unique ID for the slot — Mediavine/Raptive map this to a placement config */
  slotId?: string;
  className?: string;
}

export function AdSlot({ variant, slotId, className }: AdSlotProps) {
  return (
    <div
      data-ad-slot={slotId ?? variant}
      className={cn(
        'flex items-center justify-center bg-warmgray-50 border border-dashed border-warmgray-300 rounded-md text-xs text-muted-foreground italic no-print',
        SIZES[variant],
        className
      )}
      aria-label="Advertisement"
    >
      <span>Ad: {slotId ?? variant}</span>
    </div>
  );
}
