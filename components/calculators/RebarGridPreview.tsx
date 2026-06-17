import { cn } from '@/lib/utils';

/**
 * Visual preview of a rebar grid laid out inside a slab.
 *
 * Inputs are real-world values; we scale into a 200×140 viewBox preserving
 * aspect ratio. The preview gives users an immediate "yes, that's what I
 * meant" confirmation before they commit to materials.
 *
 * Bars are drawn at 0.25 stroke width with rounded line caps for a clean look.
 * The slab outline is a subtle dashed rectangle.
 */
export function RebarGridPreview({
  lengthFt,
  widthFt,
  spacingIn,
  className,
}: {
  lengthFt: number;
  widthFt: number;
  spacingIn: number;
  className?: string;
}) {
  // Scale slab into the SVG viewport — pick whichever dimension fills first.
  const PAD = 12;
  const SVG_W = 200;
  const SVG_H = 140;
  const usableW = SVG_W - PAD * 2;
  const usableH = SVG_H - PAD * 2;

  const scaleX = usableW / lengthFt;
  const scaleY = usableH / widthFt;
  const scale = Math.min(scaleX, scaleY);

  const slabPxW = lengthFt * scale;
  const slabPxH = widthFt * scale;
  const offsetX = (SVG_W - slabPxW) / 2;
  const offsetY = (SVG_H - slabPxH) / 2;

  const spacingFt = spacingIn / 12;

  // Bar positions from the slab edge.
  const lengthBars = computePositions(widthFt, spacingFt);
  const widthBars = computePositions(lengthFt, spacingFt);

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-warmgray-50 p-3',
        className
      )}
    >
      <p className="text-xs text-muted-foreground mb-2">
        Rebar grid preview · {spacingIn}" on-center
      </p>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Rebar grid for a ${lengthFt} by ${widthFt} foot slab at ${spacingIn} inch spacing`}
      >
        {/* Slab outline */}
        <rect
          x={offsetX}
          y={offsetY}
          width={slabPxW}
          height={slabPxH}
          fill="#fafaf9"
          stroke="#a8a29e"
          strokeWidth="1"
          strokeDasharray="3 3"
          rx="2"
        />

        {/* Bars running parallel to length (horizontal in viewport) */}
        {lengthBars.map((pos, i) => (
          <line
            key={`h-${i}`}
            x1={offsetX}
            x2={offsetX + slabPxW}
            y1={offsetY + pos * scale}
            y2={offsetY + pos * scale}
            stroke="#166534"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Bars running parallel to width (vertical in viewport) */}
        {widthBars.map((pos, i) => (
          <line
            key={`v-${i}`}
            x1={offsetX + pos * scale}
            x2={offsetX + pos * scale}
            y1={offsetY}
            y2={offsetY + slabPxH}
            stroke="#166534"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

        {/* Dimension labels */}
        <text
          x={SVG_W / 2}
          y={offsetY + slabPxH + 10}
          textAnchor="middle"
          fontSize="9"
          fill="#57534e"
        >
          {lengthFt} ft
        </text>
        <text
          x={offsetX - 4}
          y={SVG_H / 2 + 3}
          textAnchor="end"
          fontSize="9"
          fill="#57534e"
        >
          {widthFt} ft
        </text>
      </svg>
      <p className="text-xs text-muted-foreground mt-2">
        {lengthBars.length} bars across width × {widthBars.length} along length
      </p>
    </div>
  );
}

/**
 * Bar positions from one edge of the slab, in feet.
 *
 * Pattern: place a bar at every spacing increment, plus one final bar at the
 * far edge. We start at offset = spacing/2 to keep cover from the edge.
 */
function computePositions(spanFt: number, spacingFt: number): number[] {
  if (spacingFt <= 0 || spanFt <= 0) return [];
  const count = Math.floor(spanFt / spacingFt) + 1;
  // Offset so bars are centered relative to the slab.
  const totalUsed = (count - 1) * spacingFt;
  const offset = (spanFt - totalUsed) / 2;
  return Array.from({ length: count }, (_, i) => offset + i * spacingFt);
}
