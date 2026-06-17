import type { GravelType } from '@/lib/calculators/gravel';
import { cn } from '@/lib/utils';

/**
 * Small visual swatch for each gravel type.
 *
 * Each swatch combines:
 *  - A solid background tinted to match the actual stone color
 *  - 3-5 stone shapes in slightly varied tones to suggest aggregate texture
 *
 * Colors are derived from real photo-pulled palettes, kept muted to fit the
 * warm-neutral design system.
 */

interface SwatchSpec {
  bg: string;
  stones: string[];
  /** Stone shape: round (pea/river), angular (crushed/57), mixed (crusher run), grainy (sand) */
  shape: 'round' | 'angular' | 'mixed' | 'grainy';
}

const SWATCHES: Record<GravelType, SwatchSpec> = {
  'pea-gravel':    { bg: '#d6cfb8', stones: ['#a8a087', '#bbae8e', '#c4b89a'], shape: 'round' },
  '57-stone':      { bg: '#aaa9a4', stones: ['#7a7872', '#94928c', '#5c5b56'], shape: 'angular' },
  'crushed-stone': { bg: '#9a9994', stones: ['#6f6e69', '#82817c', '#525150'], shape: 'angular' },
  'crusher-run':   { bg: '#857f73', stones: ['#5c574c', '#a39c8e', '#73705f'], shape: 'mixed' },
  'river-rock':    { bg: '#b8a796', stones: ['#7d6a55', '#9e8d77', '#5b4a36'], shape: 'round' },
  sand:            { bg: '#e0d4b1', stones: ['#cdbf95', '#d6c79b', '#bfb088'], shape: 'grainy' },
};

export function GravelTypePreview({
  type,
  active = false,
  className,
}: {
  type: GravelType;
  active?: boolean;
  className?: string;
}) {
  const spec = SWATCHES[type];
  return (
    <div
      className={cn(
        'relative h-12 w-12 shrink-0 rounded-md overflow-hidden border',
        active ? 'border-forest-700 ring-2 ring-forest-700/40' : 'border-warmgray-300',
        className
      )}
      style={{ backgroundColor: spec.bg }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
        {renderShapes(spec)}
      </svg>
    </div>
  );
}

function renderShapes(spec: SwatchSpec): React.ReactNode {
  const { stones, shape } = spec;

  if (shape === 'round') {
    // Pea / river rock — soft circles in clusters.
    return (
      <>
        <circle cx="14" cy="16" r="6" fill={stones[0]} />
        <circle cx="32" cy="14" r="5" fill={stones[1]} />
        <circle cx="22" cy="30" r="7" fill={stones[2]} />
        <circle cx="38" cy="34" r="4.5" fill={stones[0]} />
        <circle cx="8" cy="36" r="5" fill={stones[1]} />
      </>
    );
  }

  if (shape === 'angular') {
    // Crushed / #57 — sharp polygons.
    return (
      <>
        <polygon points="6,12 16,8 18,18 10,22" fill={stones[0]} />
        <polygon points="22,6 32,10 30,20 20,16" fill={stones[1]} />
        <polygon points="36,14 44,16 40,26 34,22" fill={stones[2]} />
        <polygon points="10,28 18,26 22,38 12,40" fill={stones[1]} />
        <polygon points="26,28 38,30 36,42 24,38" fill={stones[0]} />
      </>
    );
  }

  if (shape === 'mixed') {
    // Crusher run — angular stones + smaller fines.
    return (
      <>
        <polygon points="8,10 18,8 16,18 6,16" fill={stones[0]} />
        <polygon points="24,12 34,14 30,24 22,22" fill={stones[1]} />
        <polygon points="34,30 44,32 40,42 32,40" fill={stones[0]} />
        <circle cx="14" cy="32" r="3" fill={stones[2]} />
        <circle cx="22" cy="38" r="2.5" fill={stones[2]} />
        <circle cx="38" cy="20" r="2" fill={stones[2]} />
        <circle cx="6" cy="40" r="2" fill={stones[2]} />
      </>
    );
  }

  // Grainy (sand) — many tiny dots.
  const dots = [];
  const seedDots = [
    [8, 10], [14, 16], [22, 12], [30, 18], [38, 14],
    [10, 22], [18, 28], [26, 24], [34, 30], [42, 22],
    [6, 32], [14, 38], [22, 36], [30, 40], [38, 38],
    [12, 28], [28, 32], [40, 8], [4, 18], [44, 38],
  ];
  for (const [x, y] of seedDots) {
    dots.push(
      <circle
        key={`${x}-${y}`}
        cx={x}
        cy={y}
        r={0.9}
        fill={stones[(x + y) % stones.length]}
      />
    );
  }
  return <>{dots}</>;
}
