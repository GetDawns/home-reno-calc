import { round } from '@/lib/utils';

/**
 * Fence calculator (panel-based privacy/picket fences).
 *
 * Why panel-based: 70%+ of residential fence installs use pre-built panels
 * (vinyl, pre-built wood) or the panel-equivalent of stick-built picket sections.
 * Panel math is also the easiest to reason about for first-time DIYers.
 *
 * Industry rules of thumb:
 *  - Standard panel lengths: 6 ft or 8 ft
 *  - Standard fence heights: 4 ft (yard), 6 ft (privacy), 8 ft (max in many municipalities)
 *  - Post spacing matches panel length (6 or 8 ft on-center)
 *  - 2 bags of 50–80 lb concrete per post hole (depth 1/3 of post above-ground)
 *  - Walk gate: typically 4 ft wide; vehicle/double gate: 8–10 ft wide
 *  - Each gate adds 1 extra post (gate posts beefier than fence posts)
 */

export interface FenceInput {
  /** Total fence run in linear feet (gates included) */
  lengthFt: number;
  /** Fence height in feet (4, 6, or 8 typical) */
  heightFt: number;
  /** Length of one prefab panel in feet (typically 6 or 8) */
  panelLengthFt: number;
  /** Number of gates */
  gateCount: number;
  /** Width of each gate in feet (4 = walk, 8–10 = vehicle) */
  gateWidthFt: number;
  /** Bags of concrete per post hole (typically 2) */
  bagsPerPost: number;
  /** Cost per panel */
  costPerPanel: number;
  /** Cost per post (4×4 PT or vinyl sleeve) */
  costPerPost: number;
  /** Cost per bag of concrete */
  costPerConcreteBag: number;
  /** Cost per gate (hardware + frame) */
  costPerGate: number;
}

export interface FenceResult {
  /** Length of solid fence (after gate widths subtracted) */
  fenceRunFt: number;
  panels: number;
  posts: number;
  concreteBags: number;
  gates: number;
  estimatedCost: number;
  notes: string[];
}

export function calculateFence(input: FenceInput): FenceResult {
  const {
    lengthFt,
    heightFt,
    panelLengthFt,
    gateCount,
    gateWidthFt,
    bagsPerPost,
    costPerPanel,
    costPerPost,
    costPerConcreteBag,
    costPerGate,
  } = input;

  // Subtract gate openings from total length to get the "solid fence" run.
  const gateRunFt = gateCount * gateWidthFt;
  const fenceRunFt = Math.max(0, lengthFt - gateRunFt);

  // Panels needed to cover the solid fence run, rounded up.
  const panels = Math.ceil(fenceRunFt / panelLengthFt);

  // Posts: one between every panel, plus end posts, plus one extra at each gate
  // (gates need beefier post pairs; we add one extra per gate to account for that).
  const posts = panels + 1 + gateCount;

  const concreteBags = posts * bagsPerPost;

  const estimatedCost =
    panels * costPerPanel +
    posts * costPerPost +
    concreteBags * costPerConcreteBag +
    gateCount * costPerGate;

  const notes: string[] = [];
  notes.push(`${gateCount > 0 ? gateCount : 'No'} gate${gateCount === 1 ? '' : 's'} subtracted from fence run.`);
  if (heightFt >= 6) {
    notes.push('At 6 ft+, set posts at least 30" deep (below frost line in cold climates).');
  }
  if (panelLengthFt > 8) {
    notes.push('Panels longer than 8 ft sag without a mid-rail support.');
  }
  notes.push('Many cities require a permit for fences over 6 ft. Check local code first.');
  notes.push('Add 5% to materials for slope-cuts and miscut panels on uneven terrain.');

  return {
    fenceRunFt: round(fenceRunFt),
    panels,
    posts,
    concreteBags,
    gates: gateCount,
    estimatedCost: round(estimatedCost),
    notes,
  };
}

export const FENCE_DEFAULTS: FenceInput = {
  lengthFt: 100,
  heightFt: 6,
  panelLengthFt: 8,
  gateCount: 1,
  gateWidthFt: 4,
  bagsPerPost: 2,
  costPerPanel: 75,
  costPerPost: 25,
  costPerConcreteBag: 6,
  costPerGate: 150,
};
