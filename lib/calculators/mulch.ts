import { round } from '@/lib/utils';

/**
 * Mulch / soil / compost volume calculator.
 *
 * Conversions:
 *  - 1 cubic yard = 27 cubic feet
 *  - Standard mulch bag = 2 cu ft (most common at HD/Lowe's)
 *  - Soil bags vary; typical sizes are 0.75, 1.0, 1.5, 2.0 cu ft
 *  - Mulch depth: 2–3" for established beds, 3–4" for new beds, 1–2" around trees (avoid volcano mulching)
 */

export interface MulchInput {
  /** Bed length in feet */
  lengthFt: number;
  /** Bed width in feet */
  widthFt: number;
  /** Mulch depth in inches (2–4 typical) */
  depthIn: number;
  /** Bag size in cubic feet (default 2) */
  bagSizeCuFt: number;
  /** Cost per bag in USD */
  costPerBag: number;
  /** Cost per cubic yard in USD (if buying bulk) */
  costPerCuYd: number;
}

export interface MulchResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  bagsNeeded: number;
  bagCost: number;
  bulkCost: number;
  recommendation: 'bags' | 'bulk' | 'either';
  notes: string[];
}

const CU_FT_PER_CU_YD = 27;
/** Bulk delivery is usually cheaper but cost-effective only above ~3 cu yd (one truck minimum). */
const BULK_THRESHOLD_CU_YD = 3;

export function calculateMulch(input: MulchInput): MulchResult {
  const {
    lengthFt,
    widthFt,
    depthIn,
    bagSizeCuFt,
    costPerBag,
    costPerCuYd,
  } = input;

  const areaSqFt = lengthFt * widthFt;
  // Convert depth from inches to feet for cu ft calculation.
  const volumeCuFt = areaSqFt * (depthIn / 12);
  const volumeCuYd = volumeCuFt / CU_FT_PER_CU_YD;

  const bagsNeeded = Math.ceil(volumeCuFt / bagSizeCuFt);
  const bagCost = bagsNeeded * costPerBag;
  const bulkCost = volumeCuYd * costPerCuYd;

  let recommendation: MulchResult['recommendation'];
  if (volumeCuYd >= BULK_THRESHOLD_CU_YD && bulkCost < bagCost) {
    recommendation = 'bulk';
  } else if (volumeCuYd < 1) {
    recommendation = 'bags';
  } else {
    recommendation = bulkCost < bagCost * 0.85 ? 'bulk' : 'either';
  }

  const notes: string[] = [];
  if (depthIn < 2) {
    notes.push('Less than 2" of mulch may not suppress weeds effectively.');
  }
  if (depthIn > 4) {
    notes.push('Over 4" of mulch can suffocate roots and trap excess moisture.');
  }
  if (volumeCuYd >= BULK_THRESHOLD_CU_YD) {
    notes.push('Above 3 cubic yards, bulk delivery is usually cheaper than bags.');
  }
  notes.push('Avoid "volcano mulching" — keep mulch a few inches away from tree trunks.');

  return {
    areaSqFt: round(areaSqFt),
    volumeCuFt: round(volumeCuFt),
    volumeCuYd: round(volumeCuYd),
    bagsNeeded,
    bagCost: round(bagCost),
    bulkCost: round(bulkCost),
    recommendation,
    notes,
  };
}

export const MULCH_DEFAULTS: MulchInput = {
  lengthFt: 20,
  widthFt: 8,
  depthIn: 3,
  bagSizeCuFt: 2,
  costPerBag: 4.5,
  costPerCuYd: 45,
};
