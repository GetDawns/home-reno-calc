import { round } from '@/lib/utils';

/**
 * Gravel / driveway base calculator.
 *
 * Output is volume in cubic yards/feet AND tons (gravel is sold both ways).
 * Each gravel type has a different bulk density — getting this wrong by 10%
 * means a wrong delivery. Densities below are dry, in-place values from
 * standard aggregate spec sheets.
 *
 * Common application depths:
 *  - Driveway base: 4–6"
 *  - Driveway top dressing: 2–3"
 *  - Walkway / patio base: 4"
 *  - French drain backfill: per drain depth
 *  - Decorative beds: 2–3"
 */

export type GravelType =
  | 'pea-gravel'
  | '57-stone'
  | 'crushed-stone'
  | 'crusher-run'
  | 'river-rock'
  | 'sand';

interface GravelTypeMeta {
  label: string;
  /** Tons per cubic yard, dry compacted. */
  tonsPerCuYd: number;
  /** Typical use cases — surfaced in UI hints. */
  bestFor: string;
}

export const GRAVEL_TYPES: Record<GravelType, GravelTypeMeta> = {
  'pea-gravel': {
    label: 'Pea gravel (3/8")',
    tonsPerCuYd: 1.4,
    bestFor: 'Walkways, decorative beds, dog runs',
  },
  '57-stone': {
    label: '#57 stone (3/4")',
    tonsPerCuYd: 1.45,
    bestFor: 'Drainage, French drains, driveway top',
  },
  'crushed-stone': {
    label: 'Crushed stone (1")',
    tonsPerCuYd: 1.5,
    bestFor: 'Driveway base, parking pads',
  },
  'crusher-run': {
    label: 'Crusher run (road base)',
    tonsPerCuYd: 1.55,
    bestFor: 'Compactable base under driveway/patio',
  },
  'river-rock': {
    label: 'River rock (1–3")',
    tonsPerCuYd: 1.4,
    bestFor: 'Decorative landscaping, dry creek beds',
  },
  sand: {
    label: 'Sand (paver / bedding)',
    tonsPerCuYd: 1.4,
    bestFor: 'Paver setting bed, sandbox',
  },
};

export interface GravelInput {
  /** Area length in feet */
  lengthFt: number;
  /** Area width in feet */
  widthFt: number;
  /** Depth in inches */
  depthIn: number;
  /** Type of gravel */
  gravelType: GravelType;
  /** Bag size in cubic feet (typical 0.5 cu ft / 50 lb at HD/Lowe's) */
  bagSizeCuFt: number;
  /** Cost per bag */
  costPerBag: number;
  /** Cost per ton (delivered) */
  costPerTon: number;
  /** Cost per cubic yard (delivered) — some yards sell by volume not weight */
  costPerCuYd: number;
}

export interface GravelResult {
  areaSqFt: number;
  volumeCuFt: number;
  volumeCuYd: number;
  tons: number;
  bagsNeeded: number;
  bagCost: number;
  bulkCostByTon: number;
  bulkCostByCuYd: number;
  recommendation: 'bags' | 'bulk-tons' | 'bulk-cu-yd';
  notes: string[];
}

const CU_FT_PER_CU_YD = 27;
const WASTE_FACTOR = 1.05;
/** Below ~1 cu yd, delivery minimums make bags competitive. */
const BULK_THRESHOLD_CU_YD = 1;

export function calculateGravel(input: GravelInput): GravelResult {
  const {
    lengthFt,
    widthFt,
    depthIn,
    gravelType,
    bagSizeCuFt,
    costPerBag,
    costPerTon,
    costPerCuYd,
  } = input;

  const areaSqFt = lengthFt * widthFt;
  const volumeCuFt = areaSqFt * (depthIn / 12) * WASTE_FACTOR;
  const volumeCuYd = volumeCuFt / CU_FT_PER_CU_YD;

  const meta = GRAVEL_TYPES[gravelType];
  const tons = volumeCuYd * meta.tonsPerCuYd;

  const bagsNeeded = Math.ceil(volumeCuFt / bagSizeCuFt);
  const bagCost = bagsNeeded * costPerBag;
  const bulkCostByTon = tons * costPerTon;
  const bulkCostByCuYd = volumeCuYd * costPerCuYd;

  // Pick the cheapest delivery method when bulk makes sense.
  let recommendation: GravelResult['recommendation'];
  if (volumeCuYd < BULK_THRESHOLD_CU_YD) {
    recommendation = 'bags';
  } else {
    recommendation = bulkCostByTon < bulkCostByCuYd ? 'bulk-tons' : 'bulk-cu-yd';
  }

  const notes: string[] = [];
  notes.push(`Best for: ${meta.bestFor}.`);
  notes.push('Includes 5% waste factor for spreading and compaction.');
  if (volumeCuYd >= BULK_THRESHOLD_CU_YD) {
    notes.push('Above 1 cubic yard, bulk delivery is almost always cheaper than bags.');
  }
  if (gravelType === 'crusher-run' || gravelType === 'crushed-stone') {
    notes.push('Compact in 2" lifts with a plate compactor for a stable driveway base.');
  }
  if (gravelType === 'pea-gravel' || gravelType === 'river-rock') {
    notes.push('Use landscape edging — round stones migrate without containment.');
  }
  if (depthIn < 3) {
    notes.push('Less than 3" of base may not handle vehicle weight without rutting.');
  }

  return {
    areaSqFt: round(areaSqFt),
    volumeCuFt: round(volumeCuFt),
    volumeCuYd: round(volumeCuYd),
    tons: round(tons),
    bagsNeeded,
    bagCost: round(bagCost),
    bulkCostByTon: round(bulkCostByTon),
    bulkCostByCuYd: round(bulkCostByCuYd),
    recommendation,
    notes,
  };
}

export const GRAVEL_DEFAULTS: GravelInput = {
  lengthFt: 30,
  widthFt: 12,
  depthIn: 4,
  gravelType: 'crusher-run',
  bagSizeCuFt: 0.5,
  costPerBag: 5,
  costPerTon: 35,
  costPerCuYd: 50,
};
