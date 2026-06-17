import { round } from '@/lib/utils';

/**
 * Roofing calculator (asphalt shingles).
 *
 * The hardest variable for DIYers is converting flat footprint area to actual
 * roof area — pitch matters a lot. A 6/12 pitch adds 12% to area; 12/12 adds 41%.
 *
 * Industry rules of thumb:
 *  - 1 "square" of roofing = 100 sq ft
 *  - 3 bundles of architectural shingles = 1 square
 *  - 1 roll synthetic underlayment = ~10 squares (1000 sq ft)
 *  - 1 lb of roofing nails ≈ 230 nails ≈ enough for 1 square (4 nails per shingle)
 *  - Waste factor: 10% for simple gables, 15% for hip roofs, 20% for complex/valleys
 *  - Drip edge runs the entire perimeter (eaves + rakes); estimate from footprint
 *  - Starter strip: enough linear feet to cover the eaves
 */

export type RoofComplexity = 'simple-gable' | 'hip' | 'complex';

const COMPLEXITY_WASTE: Record<RoofComplexity, number> = {
  'simple-gable': 0.1,
  hip: 0.15,
  complex: 0.2,
};

const COMPLEXITY_LABELS: Record<RoofComplexity, string> = {
  'simple-gable': 'Simple gable (10% waste)',
  hip: 'Hip roof (15% waste)',
  complex: 'Complex / multiple valleys (20% waste)',
};

export interface RoofingInput {
  /** Footprint length in feet (the building footprint, not the slope) */
  footprintLengthFt: number;
  /** Footprint width in feet */
  footprintWidthFt: number;
  /** Pitch as rise per 12 inches of run (e.g., 6 means 6/12) */
  pitch: number;
  /** Roof complexity — drives waste factor */
  complexity: RoofComplexity;
  /** Cost per square of shingles (3 bundles) */
  costPerSquare: number;
  /** Cost per roll of underlayment (~10 squares of coverage) */
  costPerUnderlaymentRoll: number;
  /** Cost per box of roofing nails */
  costPerNailBox: number;
}

export interface RoofingResult {
  footprintAreaSqFt: number;
  roofAreaSqFt: number;
  pitchMultiplier: number;
  squares: number;
  bundlesNeeded: number;
  underlaymentRolls: number;
  nailBoxes: number;
  estimatedCost: number;
  wastePercentage: number;
  notes: string[];
}

const BUNDLES_PER_SQUARE = 3;
const UNDERLAYMENT_COVERAGE_SQUARES = 10;
const NAILS_LB_PER_SQUARE = 1;
const NAILS_PER_BOX_LB = 5;

export function calculateRoofing(input: RoofingInput): RoofingResult {
  const {
    footprintLengthFt,
    footprintWidthFt,
    pitch,
    complexity,
    costPerSquare,
    costPerUnderlaymentRoll,
    costPerNailBox,
  } = input;

  const footprintAreaSqFt = footprintLengthFt * footprintWidthFt;

  // Pitch multiplier converts footprint to actual sloped area.
  // multiplier = sqrt(rise^2 + run^2) / run, with run = 12.
  const pitchMultiplier = Math.sqrt(pitch * pitch + 12 * 12) / 12;

  const baseRoofArea = footprintAreaSqFt * pitchMultiplier;
  const wasteFactor = COMPLEXITY_WASTE[complexity];
  const roofAreaSqFt = baseRoofArea * (1 + wasteFactor);

  const squares = roofAreaSqFt / 100;
  const bundlesNeeded = Math.ceil(squares * BUNDLES_PER_SQUARE);
  const underlaymentRolls = Math.max(1, Math.ceil(squares / UNDERLAYMENT_COVERAGE_SQUARES));
  const nailBoxes = Math.max(1, Math.ceil((squares * NAILS_LB_PER_SQUARE) / NAILS_PER_BOX_LB));

  // Cost: bundles converted back to squares for pricing.
  const squaresForCost = bundlesNeeded / BUNDLES_PER_SQUARE;
  const estimatedCost =
    squaresForCost * costPerSquare +
    underlaymentRolls * costPerUnderlaymentRoll +
    nailBoxes * costPerNailBox;

  const notes: string[] = [];
  notes.push(COMPLEXITY_LABELS[complexity]);
  notes.push(`Pitch ${pitch}/12 adds ${Math.round((pitchMultiplier - 1) * 100)}% to flat-footprint area.`);
  if (pitch >= 8) {
    notes.push('Roofs steeper than 8/12 require fall-protection harnesses or scaffolding.');
  }
  if (squares > 30) {
    notes.push('At this size, expect a 1–3 day install for a 3-person crew.');
  }
  notes.push('Excludes drip edge, ridge caps, valleys, and flashing — itemize separately.');

  return {
    footprintAreaSqFt: round(footprintAreaSqFt),
    roofAreaSqFt: round(roofAreaSqFt),
    pitchMultiplier: round(pitchMultiplier, 3),
    squares: round(squares),
    bundlesNeeded,
    underlaymentRolls,
    nailBoxes,
    estimatedCost: round(estimatedCost),
    wastePercentage: wasteFactor * 100,
    notes,
  };
}

export const ROOFING_DEFAULTS: RoofingInput = {
  footprintLengthFt: 40,
  footprintWidthFt: 30,
  pitch: 6,
  complexity: 'simple-gable',
  costPerSquare: 110, // ~$110/square for 30-yr architectural shingles in 2026
  costPerUnderlaymentRoll: 120,
  costPerNailBox: 35,
};
