import { round } from '@/lib/utils';

/**
 * Paint quantity calculator.
 *
 * Industry rules of thumb used:
 *  - 1 US gallon of paint covers ~350 sq ft per coat on smooth, primed surfaces
 *  - Textured/porous surfaces drop coverage to ~250–300 sq ft per coat
 *  - 10% buffer added for waste, touch-ups, and uneven coverage
 *  - Standard interior wall heights: 8 ft (default) or 9–10 ft
 *  - Door deduction: 21 sq ft (3' x 7'); window deduction: 15 sq ft (avg 3' x 5')
 */

export interface PaintInput {
  /** Room length in feet */
  lengthFt: number;
  /** Room width in feet */
  widthFt: number;
  /** Wall height in feet (default 8) */
  heightFt: number;
  /** Number of coats (typically 2) */
  coats: number;
  /** Number of standard doors (deducted from wall area) */
  doorCount: number;
  /** Number of standard windows (deducted from wall area) */
  windowCount: number;
  /** Include ceiling in paint estimate? */
  includeCeiling: boolean;
  /** Surface coverage per gallon in sq ft. 350 = smooth, 275 = textured */
  coveragePerGallon: number;
  /** Cost per gallon in USD (used for cost estimate). $35 is a sensible default for mid-tier interior paint */
  costPerGallon: number;
}

export interface PaintResult {
  wallAreaSqFt: number;
  ceilingAreaSqFt: number;
  totalPaintableSqFt: number;
  totalAreaWithCoats: number;
  gallonsExact: number;
  gallonsToBuy: number;
  /** Quarts to top off if leftover < 0.4 gallon (cheaper than buying a full extra gallon) */
  quartsToBuy: number;
  estimatedCost: number;
  notes: string[];
}

const DOOR_AREA_SQ_FT = 21;
const WINDOW_AREA_SQ_FT = 15;
const WASTE_FACTOR = 1.1;

export function calculatePaint(input: PaintInput): PaintResult {
  const {
    lengthFt,
    widthFt,
    heightFt,
    coats,
    doorCount,
    windowCount,
    includeCeiling,
    coveragePerGallon,
    costPerGallon,
  } = input;

  const perimeter = 2 * (lengthFt + widthFt);
  const grossWallArea = perimeter * heightFt;
  const deductions = doorCount * DOOR_AREA_SQ_FT + windowCount * WINDOW_AREA_SQ_FT;
  const wallArea = Math.max(0, grossWallArea - deductions);

  const ceilingArea = includeCeiling ? lengthFt * widthFt : 0;
  const totalPaintableSqFt = wallArea + ceilingArea;

  const totalAreaWithCoats = totalPaintableSqFt * coats * WASTE_FACTOR;
  const gallonsExact = totalAreaWithCoats / coveragePerGallon;

  // Buy strategy: round up to nearest gallon, but if leftover is small (<0.4 gal),
  // suggest a quart top-off instead — saves money on small overages.
  const wholeGallons = Math.floor(gallonsExact);
  const remainder = gallonsExact - wholeGallons;
  const useQuarts = remainder > 0 && remainder < 0.4;
  const gallonsToBuy = useQuarts ? wholeGallons : Math.ceil(gallonsExact);
  const quartsToBuy = useQuarts ? Math.ceil(remainder * 4) : 0;

  // Quarts are typically priced at ~28% of a gallon (not 25% — small-size premium).
  const estimatedCost =
    gallonsToBuy * costPerGallon + quartsToBuy * (costPerGallon * 0.28);

  const notes: string[] = [];
  if (coats < 2) {
    notes.push(
      'Most projects need 2 coats for full coverage — especially over darker colors or new drywall.'
    );
  }
  if (coveragePerGallon < 300) {
    notes.push('Textured/porous surfaces use ~25–30% more paint than smooth walls.');
  }
  notes.push('Includes a 10% buffer for waste, drips, touch-ups, and uneven coverage.');
  if (includeCeiling) {
    notes.push('Ceilings often need a flat-finish "ceiling paint" rather than wall paint.');
  }

  return {
    wallAreaSqFt: round(wallArea),
    ceilingAreaSqFt: round(ceilingArea),
    totalPaintableSqFt: round(totalPaintableSqFt),
    totalAreaWithCoats: round(totalAreaWithCoats),
    gallonsExact: round(gallonsExact),
    gallonsToBuy,
    quartsToBuy,
    estimatedCost: round(estimatedCost),
    notes,
  };
}

export const PAINT_DEFAULTS: PaintInput = {
  lengthFt: 12,
  widthFt: 14,
  heightFt: 8,
  coats: 2,
  doorCount: 1,
  windowCount: 2,
  includeCeiling: false,
  coveragePerGallon: 350,
  costPerGallon: 35,
};
