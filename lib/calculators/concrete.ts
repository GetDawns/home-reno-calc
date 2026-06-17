import { round } from '@/lib/utils';

/**
 * Concrete volume calculator (slabs, footings, sonotubes/columns).
 *
 * Conversions / rules of thumb:
 *  - 1 cubic yard = 27 cubic feet
 *  - Standard 80 lb pre-mix bag = 0.6 cubic feet
 *  - Standard 60 lb bag = 0.45 cubic feet
 *  - Standard 40 lb bag = 0.30 cubic feet
 *  - Bulk delivery (ready-mix) usually starts at 1 cu yd; below that, bags are cheaper
 *  - Always round UP and add 5–10% for spillage and over-excavation
 */

export type ConcreteShape = 'slab' | 'footing' | 'sonotube';

export interface ConcreteInput {
  shape: ConcreteShape;
  /** Slab/footing length in feet (sonotube: ignored) */
  lengthFt: number;
  /** Slab/footing width in feet (sonotube: ignored) */
  widthFt: number;
  /** Slab thickness in inches (slab/footing) */
  thicknessIn: number;
  /** Sonotube diameter in inches (sonotube only) */
  diameterIn: number;
  /** Sonotube height in feet (sonotube only) */
  heightFt: number;
  /** Number of footings or sonotubes (1 if a single slab) */
  count: number;
  /** Bag size in pounds (60 or 80 typical) */
  bagSizeLb: 40 | 60 | 80;
  /** Cost per bag */
  costPerBag: number;
  /** Cost per cubic yard (ready-mix delivered) */
  costPerCuYd: number;
  /** Include rebar grid in the estimate? */
  includeRebar: boolean;
  /** Rebar grid spacing in inches OC. 12" for heavy loads, 16-18" residential, 24" light duty. */
  rebarSpacingIn: number;
  /** Cost per 20 ft #4 rebar stick (most common residential size). */
  costPerRebarStick: number;
}

export interface RebarEstimate {
  /** Total linear feet of rebar */
  linearFt: number;
  /** Number of 20 ft sticks to buy */
  sticks: number;
  /** Estimated rebar cost */
  cost: number;
  /** Bars running parallel to length (one direction of the grid) */
  barsLengthwise: number;
  /** Bars running parallel to width */
  barsWidthwise: number;
}

export interface ConcreteResult {
  volumeCuFt: number;
  volumeCuYd: number;
  bagsNeeded: number;
  bagCost: number;
  bulkCost: number;
  recommendation: 'bags' | 'bulk';
  /** Rebar estimate. null when sonotube selected (different reinforcement strategy). */
  rebar: RebarEstimate | null;
  notes: string[];
}

const CU_FT_PER_CU_YD = 27;
const BAG_VOLUMES_CU_FT: Record<40 | 60 | 80, number> = {
  40: 0.3,
  60: 0.45,
  80: 0.6,
};
const WASTE_FACTOR = 1.07;

/**
 * Estimate rebar grid for a rectangular slab or footing.
 *
 * Uses the standard grid pattern: bars run both directions, every `spacing` inches
 * on-center. Each bar spans the full slab dimension.
 *
 *   bars across width  = floor(L*12 / spacing) + 1   (each W ft long)
 *   bars across length = floor(W*12 / spacing) + 1   (each L ft long)
 *
 * Then round total LF up to 20 ft sticks.
 */
function calculateRebarForSlab(
  lengthFt: number,
  widthFt: number,
  spacingIn: number,
  count: number,
  costPerStick: number
): RebarEstimate {
  const lengthBars = Math.floor((lengthFt * 12) / spacingIn) + 1; // bars at each length-direction position
  const widthBars = Math.floor((widthFt * 12) / spacingIn) + 1;

  // Bars at length positions span the width; bars at width positions span the length.
  const linearFtPerSlab = lengthBars * widthFt + widthBars * lengthFt;
  const linearFt = linearFtPerSlab * count;

  const sticks = Math.ceil(linearFt / 20);
  const cost = sticks * costPerStick;

  return {
    linearFt: round(linearFt),
    sticks,
    cost: round(cost),
    barsLengthwise: lengthBars,
    barsWidthwise: widthBars,
  };
}

export function calculateConcrete(input: ConcreteInput): ConcreteResult {
  const {
    shape,
    lengthFt,
    widthFt,
    thicknessIn,
    diameterIn,
    heightFt,
    count,
    bagSizeLb,
    costPerBag,
    costPerCuYd,
    includeRebar,
    rebarSpacingIn,
    costPerRebarStick,
  } = input;

  let baseVolumeCuFt: number;

  if (shape === 'sonotube') {
    // Cylinder: π r^2 h. Diameter in inches → feet.
    const radiusFt = diameterIn / 2 / 12;
    baseVolumeCuFt = Math.PI * radiusFt * radiusFt * heightFt;
  } else {
    // Slab/footing: length × width × (thickness in feet).
    baseVolumeCuFt = lengthFt * widthFt * (thicknessIn / 12);
  }

  const volumeCuFt = baseVolumeCuFt * count * WASTE_FACTOR;
  const volumeCuYd = volumeCuFt / CU_FT_PER_CU_YD;

  const bagVolume = BAG_VOLUMES_CU_FT[bagSizeLb];
  const bagsNeeded = Math.ceil(volumeCuFt / bagVolume);
  const bagCost = bagsNeeded * costPerBag;
  const bulkCost = volumeCuYd * costPerCuYd;

  // Below ~1 cu yd, ready-mix has minimum delivery fees that make bags cheaper.
  // Above ~1 cu yd, bulk is usually cheaper and saves significant labor.
  const recommendation: ConcreteResult['recommendation'] =
    volumeCuYd >= 1 && bulkCost < bagCost ? 'bulk' : 'bags';

  const notes: string[] = [];
  notes.push('Includes 7% waste factor for spillage and over-excavation.');
  if (volumeCuYd >= 1) {
    notes.push('Above 1 cubic yard, ready-mix delivery is usually faster and cheaper.');
  }
  if (volumeCuYd < 0.5) {
    notes.push('For small pours, bags are simpler and avoid delivery minimum fees.');
  }
  if (thicknessIn < 4 && shape === 'slab') {
    notes.push('Slabs less than 4" thick may crack under vehicle traffic. Consider thickening.');
  }
  // Rebar — grid for slabs/footings, vertical-only note for sonotubes.
  let rebar: RebarEstimate | null = null;
  if (includeRebar && shape !== 'sonotube') {
    rebar = calculateRebarForSlab(lengthFt, widthFt, rebarSpacingIn, count, costPerRebarStick);
    notes.push(
      `Rebar grid at ${rebarSpacingIn}" OC: ${rebar.barsLengthwise} bars lengthwise, ${rebar.barsWidthwise} crosswise.`
    );
  } else if (shape === 'sonotube') {
    notes.push('Sonotubes typically use 4 vertical #4 bars + horizontal ties every 12" — use a separate rebar plan.');
  } else {
    notes.push('Add rebar or wire mesh for slabs to control cracking, especially over 8 ft in any direction.');
  }

  return {
    volumeCuFt: round(volumeCuFt),
    volumeCuYd: round(volumeCuYd),
    bagsNeeded,
    bagCost: round(bagCost),
    bulkCost: round(bulkCost),
    recommendation,
    rebar,
    notes,
  };
}

export const CONCRETE_DEFAULTS: ConcreteInput = {
  shape: 'slab',
  lengthFt: 10,
  widthFt: 10,
  thicknessIn: 4,
  diameterIn: 12,
  heightFt: 4,
  count: 1,
  bagSizeLb: 80,
  costPerBag: 6,
  costPerCuYd: 180,
  includeRebar: true,
  rebarSpacingIn: 16,
  costPerRebarStick: 9,
};
