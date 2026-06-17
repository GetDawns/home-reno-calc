import { round } from '@/lib/utils';

/**
 * Tile, grout, and thinset calculator.
 *
 * Layout patterns drive waste — the most under-estimated variable for first-time tilers.
 *
 * Industry rules of thumb:
 *  - Straight grid:    5–7% waste
 *  - Brick/offset:    ~10% waste (more cut tiles at row ends)
 *  - Diagonal:        ~15% waste (every edge tile is a cut)
 *  - Herringbone:     ~20% waste (each tile cut at 45°)
 *  - Hexagon/specialty: 15–20%, lean to 20%
 *
 * Grout coverage (25 lb bag, 1/8" joint width — most common):
 *  - 12x12 tile: ~150 sq ft
 *  - 18x18 tile: ~200 sq ft
 *  - 24x24 tile: ~250 sq ft
 *  - Mosaic (≤4"):  ~80 sq ft (lots of joint surface)
 *  Wider joints (1/4"+) cut coverage roughly in half.
 *
 * Thinset coverage (50 lb bag for floor tile):
 *  - <12" tile, smooth back: ~95 sq ft (1/4" notched trowel)
 *  - 12–18" tile, ribbed back: ~80 sq ft (1/2" notched)
 *  - >18" tile, large format: ~65 sq ft (3/4" notched, back-buttering)
 */

export type TileLayout = 'straight' | 'brick' | 'diagonal' | 'herringbone';

const LAYOUT_WASTE: Record<TileLayout, number> = {
  straight: 0.07,
  brick: 0.1,
  diagonal: 0.15,
  herringbone: 0.2,
};

export interface TileInput {
  /** Room length in feet */
  lengthFt: number;
  /** Room width in feet */
  widthFt: number;
  /** Tile width in inches (e.g., 12) */
  tileWidthIn: number;
  /** Tile length in inches (e.g., 24) */
  tileLengthIn: number;
  /** Layout pattern — biggest driver of waste */
  layout: TileLayout;
  /** Grout joint width in inches (1/16=0.0625, 1/8=0.125, 1/4=0.25 are common) */
  groutJointIn: number;
  /** Tiles per box (varies by tile size) */
  tilesPerBox: number;
  /** Cost per box of tile */
  costPerBox: number;
  /** Cost per 25 lb bag of grout */
  costPerGroutBag: number;
  /** Cost per 50 lb bag of thinset mortar */
  costPerThinsetBag: number;
}

export interface TileResult {
  areaSqFt: number;
  sqFtPerTile: number;
  tilesNeededExact: number;
  /** Tiles to actually buy, rounded up to full boxes */
  tilesToBuy: number;
  boxesToBuy: number;
  groutBagsNeeded: number;
  thinsetBagsNeeded: number;
  estimatedCost: number;
  wastePercentage: number;
  notes: string[];
}

export function calculateTile(input: TileInput): TileResult {
  const {
    lengthFt,
    widthFt,
    tileWidthIn,
    tileLengthIn,
    layout,
    groutJointIn,
    tilesPerBox,
    costPerBox,
    costPerGroutBag,
    costPerThinsetBag,
  } = input;

  const wasteFactor = 1 + LAYOUT_WASTE[layout];
  const areaSqFt = lengthFt * widthFt;

  // Each tile covers (w * l) / 144 sq ft.
  const sqFtPerTile = (tileWidthIn * tileLengthIn) / 144;
  const tilesNeededExact = Math.ceil((areaSqFt * wasteFactor) / sqFtPerTile);

  // Round up to full boxes — you can't buy partial boxes.
  const boxesToBuy = Math.ceil(tilesNeededExact / tilesPerBox);
  const tilesToBuy = boxesToBuy * tilesPerBox;

  // Grout coverage scales with tile size + joint width.
  // Larger tile = less linear inches of joint per sq ft = better coverage.
  // 1/8" joint baseline. Halving for 1/4", doubling for 1/16".
  const baseCoverage = pickGroutCoverage(tileWidthIn, tileLengthIn);
  const jointMultiplier = 0.125 / Math.max(groutJointIn, 0.0625);
  const groutCoverage = baseCoverage * jointMultiplier;
  const groutBagsNeeded = Math.max(1, Math.ceil(areaSqFt / groutCoverage));

  // Thinset by tile size.
  const thinsetCoverage = pickThinsetCoverage(tileWidthIn, tileLengthIn);
  const thinsetBagsNeeded = Math.max(1, Math.ceil(areaSqFt / thinsetCoverage));

  const estimatedCost =
    boxesToBuy * costPerBox +
    groutBagsNeeded * costPerGroutBag +
    thinsetBagsNeeded * costPerThinsetBag;

  const notes: string[] = [];
  notes.push(
    `${layout.charAt(0).toUpperCase() + layout.slice(1)} layout: ${(LAYOUT_WASTE[layout] * 100).toFixed(0)}% waste built in.`
  );
  if (layout === 'herringbone' || layout === 'diagonal') {
    notes.push('Consider buying an extra box — angle cuts produce more unusable scrap.');
  }
  if (groutJointIn >= 0.25) {
    notes.push('Wide joints (≥1/4") use roughly 2× the grout of standard 1/8" joints.');
  }
  if (tileWidthIn >= 18 || tileLengthIn >= 18) {
    notes.push('Large-format tile requires back-buttering and a 1/2"+ notched trowel.');
  }
  notes.push('Save 2–3 unopened tiles for repairs — dye lots vary if you reorder later.');

  return {
    areaSqFt: round(areaSqFt),
    sqFtPerTile: round(sqFtPerTile, 3),
    tilesNeededExact,
    tilesToBuy,
    boxesToBuy,
    groutBagsNeeded,
    thinsetBagsNeeded,
    estimatedCost: round(estimatedCost),
    wastePercentage: LAYOUT_WASTE[layout] * 100,
    notes,
  };
}

function pickGroutCoverage(w: number, l: number): number {
  const dim = Math.max(w, l);
  if (dim <= 4) return 80;
  if (dim <= 12) return 150;
  if (dim <= 18) return 200;
  return 250;
}

function pickThinsetCoverage(w: number, l: number): number {
  const dim = Math.max(w, l);
  if (dim < 12) return 95;
  if (dim <= 18) return 80;
  return 65;
}

export const TILE_DEFAULTS: TileInput = {
  lengthFt: 10,
  widthFt: 8,
  tileWidthIn: 12,
  tileLengthIn: 24,
  layout: 'straight',
  groutJointIn: 0.125,
  tilesPerBox: 8,
  costPerBox: 38,
  costPerGroutBag: 18,
  costPerThinsetBag: 22,
};
