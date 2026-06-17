import { round } from '@/lib/utils';

/**
 * Deck board, joist, and fastener calculator.
 *
 * Assumptions / rules of thumb:
 *  - Common board widths: 5.5" (5/4 x 6 standard) or 3.5" (2x4 less common for decking)
 *  - Standard board lengths: 8, 10, 12, 16 ft
 *  - Spacing between boards: 1/8" (3.175mm) typical for ventilation
 *  - Joists at 16" on-center for residential decks (12" if heavy load or composite)
 *  - 2 fasteners per board per joist (deck screws or hidden fasteners)
 *  - 5% waste factor for board cuts; up to 10% for diagonal patterns
 *  - Add ~10% for fasteners (lost / stripped)
 */

export interface DeckInput {
  /** Deck length (parallel to board run) in feet */
  lengthFt: number;
  /** Deck width (perpendicular to boards) in feet */
  widthFt: number;
  /** Board width in inches (5.5 default) */
  boardWidthIn: number;
  /** Board length in feet (8/10/12/16) */
  boardLengthFt: number;
  /** Gap between boards in inches (0.125 default) */
  gapIn: number;
  /** Joist on-center spacing in inches (16 default) */
  joistOcIn: number;
  /** Cost per board in USD */
  costPerBoard: number;
  /** Cost per box of fasteners (typical 350-count box) */
  costPerFastenerBox: number;
  /** Fasteners per box */
  fastenersPerBox: number;
}

export interface DeckResult {
  deckAreaSqFt: number;
  boardsNeeded: number;
  boardsWithWaste: number;
  joistsNeeded: number;
  fastenersNeeded: number;
  fastenerBoxesNeeded: number;
  estimatedCost: number;
  notes: string[];
}

const WASTE_FACTOR = 1.05;
const FASTENER_WASTE = 1.1;

export function calculateDeck(input: DeckInput): DeckResult {
  const {
    lengthFt,
    widthFt,
    boardWidthIn,
    boardLengthFt,
    gapIn,
    joistOcIn,
    costPerBoard,
    costPerFastenerBox,
    fastenersPerBox,
  } = input;

  const deckAreaSqFt = lengthFt * widthFt;

  // Effective board coverage: actual width + gap = how much one board "fills" sideways.
  const effectiveBoardWidthIn = boardWidthIn + gapIn;
  // Convert deck width (perpendicular to boards) to inches.
  const widthIn = widthFt * 12;
  // Rows of boards needed across the width direction.
  const rowsNeeded = Math.ceil(widthIn / effectiveBoardWidthIn);

  // Length of each row equals deck length; how many boards per row depends on board length.
  const boardsPerRow = Math.ceil(lengthFt / boardLengthFt);
  const boardsNeeded = rowsNeeded * boardsPerRow;
  const boardsWithWaste = Math.ceil(boardsNeeded * WASTE_FACTOR);

  // Joists run perpendicular to boards. Number of joists = ceil(length / OC) + 1.
  const lengthIn = lengthFt * 12;
  const joistsNeeded = Math.floor(lengthIn / joistOcIn) + 1;

  // 2 fasteners per board per joist crossing.
  const fastenersNeeded = Math.ceil(boardsWithWaste * joistsNeeded * 2 * FASTENER_WASTE);
  const fastenerBoxesNeeded = Math.ceil(fastenersNeeded / fastenersPerBox);

  const estimatedCost =
    boardsWithWaste * costPerBoard + fastenerBoxesNeeded * costPerFastenerBox;

  const notes: string[] = [];
  notes.push('Includes 5% waste for cuts. Add 5–10% more for diagonal or herringbone patterns.');
  if (joistOcIn > 16) {
    notes.push('Joist spacing wider than 16" OC may cause board sag, especially for composite decking.');
  }
  if (boardLengthFt < lengthFt) {
    notes.push('Plan butt-joints to land on a joist and stagger them between rows for strength.');
  }
  notes.push('Joist count assumes a simple rectangle. Add joists for stairs, framing around posts, or cantilevers.');

  return {
    deckAreaSqFt: round(deckAreaSqFt),
    boardsNeeded,
    boardsWithWaste,
    joistsNeeded,
    fastenersNeeded,
    fastenerBoxesNeeded,
    estimatedCost: round(estimatedCost),
    notes,
  };
}

export const DECK_DEFAULTS: DeckInput = {
  lengthFt: 16,
  widthFt: 12,
  boardWidthIn: 5.5,
  boardLengthFt: 12,
  gapIn: 0.125,
  joistOcIn: 16,
  costPerBoard: 18,
  costPerFastenerBox: 35,
  fastenersPerBox: 350,
};
