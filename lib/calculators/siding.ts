import { round } from '@/lib/utils';

/**
 * Siding calculator (vinyl, fiber cement, wood, engineered wood).
 *
 * Industry rules of thumb:
 *  - 1 "square" of siding = 100 sq ft, just like roofing
 *  - Vinyl: typically 2 squares per box (200 sq ft)
 *  - Fiber cement (HardiePlank): typically sold by the piece — 12 ft pieces × 5.25" exposure = ~5.25 sq ft each
 *  - Door deduction: ~21 sq ft (3' × 7'); window deduction: ~15 sq ft (3' × 5')
 *  - Waste factor: 10% standard, 15% if cutting around lots of windows
 *  - Starter strip: equals the perimeter
 *  - J-channel: ~16 LF per window, ~10 LF per door (3 sides each)
 *  - Outside corners: 4 typical for a rectangular house, length = wall height
 */

export type SidingType = 'vinyl' | 'fiber-cement' | 'wood' | 'engineered-wood';

interface SidingTypeMeta {
  label: string;
  /** Coverage per box in squares (100 sq ft units) */
  squaresPerBox: number;
  /** Typical price per box at HD/Lowe's in 2026 */
  defaultBoxCost: number;
  /** Pro tip surfaced as a note */
  tip: string;
}

export const SIDING_TYPES: Record<SidingType, SidingTypeMeta> = {
  vinyl: {
    label: 'Vinyl',
    squaresPerBox: 2,
    defaultBoxCost: 95,
    tip: 'Vinyl expands and contracts — leave 1/4" play at every j-channel.',
  },
  'fiber-cement': {
    label: 'Fiber cement (HardiePlank)',
    squaresPerBox: 1.6,
    defaultBoxCost: 220,
    tip: 'Fiber cement is heavy and dust-hazardous. Use a Hardie shears or carbide blade.',
  },
  wood: {
    label: 'Wood (cedar / pine clapboard)',
    squaresPerBox: 1.5,
    defaultBoxCost: 280,
    tip: 'Pre-prime all 6 sides of each board before installing for max longevity.',
  },
  'engineered-wood': {
    label: 'Engineered wood (LP SmartSide)',
    squaresPerBox: 2.0,
    defaultBoxCost: 180,
    tip: 'Use approved fasteners only — wrong nails void the 30-year warranty.',
  },
};

export interface SidingInput {
  /** Total exterior wall perimeter in linear feet */
  perimeterFt: number;
  /** Wall height in feet */
  wallHeightFt: number;
  /** Number of standard windows */
  windowCount: number;
  /** Number of standard doors */
  doorCount: number;
  /** Siding type */
  sidingType: SidingType;
  /** Cost per box (override default for type) */
  costPerBox: number;
  /** Number of outside corners (typical 4 for rectangular house, 6+ for L-shape) */
  cornersCount: number;
  /** Cost per corner post (full wall-height piece) */
  costPerCornerPost: number;
  /** Cost per linear foot of starter strip */
  costPerStarterStripFt: number;
  /** Cost per linear foot of J-channel */
  costPerJChannelFt: number;
}

export interface SidingResult {
  grossWallAreaSqFt: number;
  netWallAreaSqFt: number;
  squares: number;
  boxesNeeded: number;
  starterStripFt: number;
  jChannelFt: number;
  cornerPostsNeeded: number;
  estimatedCost: number;
  notes: string[];
}

const DOOR_DEDUCTION_SQ_FT = 21;
const WINDOW_DEDUCTION_SQ_FT = 15;
const WASTE_FACTOR = 1.1;
const J_CHANNEL_PER_WINDOW_FT = 16;
const J_CHANNEL_PER_DOOR_FT = 10;

export function calculateSiding(input: SidingInput): SidingResult {
  const {
    perimeterFt,
    wallHeightFt,
    windowCount,
    doorCount,
    sidingType,
    costPerBox,
    cornersCount,
    costPerCornerPost,
    costPerStarterStripFt,
    costPerJChannelFt,
  } = input;

  const meta = SIDING_TYPES[sidingType];

  const grossWallAreaSqFt = perimeterFt * wallHeightFt;
  const deductions =
    windowCount * WINDOW_DEDUCTION_SQ_FT + doorCount * DOOR_DEDUCTION_SQ_FT;
  const netWallAreaSqFt = Math.max(0, grossWallAreaSqFt - deductions);

  const adjustedArea = netWallAreaSqFt * WASTE_FACTOR;
  const squares = adjustedArea / 100;
  const boxesNeeded = Math.ceil(squares / meta.squaresPerBox);

  // Accessories.
  const starterStripFt = Math.ceil(perimeterFt);
  const jChannelFt = Math.ceil(
    windowCount * J_CHANNEL_PER_WINDOW_FT + doorCount * J_CHANNEL_PER_DOOR_FT
  );
  const cornerPostsNeeded = cornersCount;

  const estimatedCost =
    boxesNeeded * costPerBox +
    cornerPostsNeeded * costPerCornerPost +
    starterStripFt * costPerStarterStripFt +
    jChannelFt * costPerJChannelFt;

  const notes: string[] = [];
  notes.push(meta.tip);
  notes.push('Includes 10% waste factor — bump to 15% for houses with many windows or detailed trim.');
  if (cornersCount > 4) {
    notes.push('More than 4 corners means an L- or U-shaped house. Recheck perimeter.');
  }
  if (wallHeightFt > 10) {
    notes.push('Walls over 10 ft need scaffolding or staged courses.');
  }

  return {
    grossWallAreaSqFt: round(grossWallAreaSqFt),
    netWallAreaSqFt: round(netWallAreaSqFt),
    squares: round(squares),
    boxesNeeded,
    starterStripFt,
    jChannelFt,
    cornerPostsNeeded,
    estimatedCost: round(estimatedCost),
    notes,
  };
}

export const SIDING_DEFAULTS: SidingInput = {
  perimeterFt: 160,
  wallHeightFt: 9,
  windowCount: 10,
  doorCount: 2,
  sidingType: 'vinyl',
  costPerBox: 95,
  cornersCount: 4,
  costPerCornerPost: 22,
  costPerStarterStripFt: 1.2,
  costPerJChannelFt: 1.5,
};
