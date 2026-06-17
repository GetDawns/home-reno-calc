import type { TileLayout } from '@/lib/calculators/tile';
import { cn } from '@/lib/utils';

/**
 * Small SVG previews of tile layout patterns.
 *
 * Each preview is a 56x40 viewBox with tiles drawn as rounded rectangles.
 * Subtle grout lines (offset white strokes) make the pattern legible at thumbnail size.
 *
 * The patterns drive waste %; visual previews help first-time tilers
 * understand "diagonal" before they pick it.
 */

export function TilePatternPreview({
  pattern,
  active = false,
  className,
}: {
  pattern: TileLayout;
  active?: boolean;
  className?: string;
}) {
  const fill = active ? '#dcfce7' : '#f5f5f4';
  const stroke = active ? '#166534' : '#a8a29e';

  return (
    <svg
      viewBox="0 0 56 40"
      className={cn('h-10 w-14', className)}
      aria-hidden="true"
    >
      {pattern === 'straight' && <StraightPattern fill={fill} stroke={stroke} />}
      {pattern === 'brick' && <BrickPattern fill={fill} stroke={stroke} />}
      {pattern === 'diagonal' && <DiagonalPattern fill={fill} stroke={stroke} />}
      {pattern === 'herringbone' && <HerringbonePattern fill={fill} stroke={stroke} />}
    </svg>
  );
}

function StraightPattern({ fill, stroke }: { fill: string; stroke: string }) {
  // 4 cols × 3 rows of square tiles, aligned grid.
  const tiles = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={2 + c * 13}
          y={2 + r * 12}
          width={12}
          height={11}
          rx={1.5}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
      );
    }
  }
  return <>{tiles}</>;
}

function BrickPattern({ fill, stroke }: { fill: string; stroke: string }) {
  // Alternate rows offset by half a tile (true running bond).
  const tiles = [];
  for (let r = 0; r < 3; r++) {
    const offset = r % 2 === 0 ? 0 : -7;
    for (let c = -1; c < 5; c++) {
      const x = 2 + c * 14 + offset;
      const y = 2 + r * 12;
      // Clip to viewBox so half-tiles get cut off cleanly at edges.
      tiles.push(
        <rect
          key={`${r}-${c}`}
          x={Math.max(2, x)}
          y={y}
          width={Math.min(13, 56 - Math.max(2, x))}
          height={11}
          rx={1.5}
          fill={fill}
          stroke={stroke}
          strokeWidth={1}
        />
      );
    }
  }
  return <>{tiles}</>;
}

function DiagonalPattern({ fill, stroke }: { fill: string; stroke: string }) {
  // Square tiles rotated 45° around the center of the viewBox.
  return (
    <g transform="rotate(45 28 20)">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 5 }).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={2 + c * 11}
            y={-8 + r * 11}
            width={10}
            height={10}
            rx={1.2}
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
          />
        ))
      ).flat()}
    </g>
  );
}

function HerringbonePattern({ fill, stroke }: { fill: string; stroke: string }) {
  // Rectangular tiles in alternating perpendicular L-shapes.
  return (
    <g>
      {/* Horizontal tiles */}
      <rect x={2} y={4} width={18} height={7} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={2} y={29} width={18} height={7} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={36} y={4} width={18} height={7} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={36} y={29} width={18} height={7} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      {/* Vertical tiles */}
      <rect x={20} y={4} width={7} height={16} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={29} y={20} width={7} height={16} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={20} y={20} width={7} height={9} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
      <rect x={29} y={11} width={7} height={9} rx={1} fill={fill} stroke={stroke} strokeWidth={1} />
    </g>
  );
}
