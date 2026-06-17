import { round } from '@/lib/utils';

/**
 * Drywall (sheetrock) sheet, screw, joint compound, and tape calculator.
 *
 * Standard drywall sheets:
 *  - 4' x 8' = 32 sq ft (most common, easiest to handle solo)
 *  - 4' x 10' = 40 sq ft (fewer joints; harder to maneuver)
 *  - 4' x 12' = 48 sq ft (commercial / high ceilings)
 *
 * Material rules of thumb:
 *  - ~1 lb of drywall screws per 1000 sq ft (or ~32 screws per sheet)
 *  - 1 gallon (4.5 quart pail) joint compound covers ~100–150 sq ft of drywall
 *  - 1 roll (250 ft) paper tape covers ~7–10 sheets (~250 sq ft of seams)
 *  - 10% waste factor minimum; more for rooms with many cutouts
 */

export interface DrywallInput {
  /** Total wall + ceiling area in sq ft */
  totalSqFt: number;
  /** Sheet size selection */
  sheetSize: '4x8' | '4x10' | '4x12';
  /** Cost per sheet */
  costPerSheet: number;
  /** Cost per 1 lb box of drywall screws */
  costPerScrewBox: number;
  /** Cost per 4.5 qt joint compound pail */
  costPerCompoundPail: number;
  /** Cost per 250 ft tape roll */
  costPerTapeRoll: number;
}

export interface DrywallResult {
  sheetsNeeded: number;
  screwBoxesNeeded: number;
  compoundPailsNeeded: number;
  tapeRollsNeeded: number;
  estimatedCost: number;
  notes: string[];
}

const SHEET_AREAS: Record<DrywallInput['sheetSize'], number> = {
  '4x8': 32,
  '4x10': 40,
  '4x12': 48,
};
const WASTE_FACTOR = 1.1;
const SCREW_LB_PER_SQ_FT = 1 / 1000;
const COMPOUND_COVERAGE_SQ_FT = 125; // midpoint of 100–150 range
const TAPE_COVERAGE_SQ_FT = 250;

export function calculateDrywall(input: DrywallInput): DrywallResult {
  const {
    totalSqFt,
    sheetSize,
    costPerSheet,
    costPerScrewBox,
    costPerCompoundPail,
    costPerTapeRoll,
  } = input;

  const adjustedArea = totalSqFt * WASTE_FACTOR;
  const sheetsNeeded = Math.ceil(adjustedArea / SHEET_AREAS[sheetSize]);

  // Round screws up to nearest 1 lb box.
  const screwLb = totalSqFt * SCREW_LB_PER_SQ_FT;
  const screwBoxesNeeded = Math.max(1, Math.ceil(screwLb));

  const compoundPailsNeeded = Math.ceil(totalSqFt / COMPOUND_COVERAGE_SQ_FT);
  const tapeRollsNeeded = Math.max(1, Math.ceil(totalSqFt / TAPE_COVERAGE_SQ_FT));

  const estimatedCost =
    sheetsNeeded * costPerSheet +
    screwBoxesNeeded * costPerScrewBox +
    compoundPailsNeeded * costPerCompoundPail +
    tapeRollsNeeded * costPerTapeRoll;

  const notes: string[] = [];
  notes.push('Includes 10% waste factor — increase to 15% for rooms with many doors, windows, or angles.');
  if (sheetSize === '4x12') {
    notes.push('12-foot sheets need at least 2 people to maneuver safely.');
  }
  notes.push('Buy at least 1 extra sheet on top of this estimate to handle a damaged or miscut piece.');
  notes.push('Consider mold-resistant (purple) drywall for bathrooms and basements.');

  return {
    sheetsNeeded,
    screwBoxesNeeded,
    compoundPailsNeeded,
    tapeRollsNeeded,
    estimatedCost: round(estimatedCost),
    notes,
  };
}

export const DRYWALL_DEFAULTS: DrywallInput = {
  totalSqFt: 800,
  sheetSize: '4x8',
  costPerSheet: 16,
  costPerScrewBox: 12,
  costPerCompoundPail: 18,
  costPerTapeRoll: 6,
};
