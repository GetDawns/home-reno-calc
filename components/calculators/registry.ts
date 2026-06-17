/**
 * Calculator registry — maps URL slug to the React component that renders it.
 *
 * Adding a new calculator:
 *  1. Build the math: lib/calculators/<slug>.ts
 *  2. Build the UI: components/calculators/<Slug>Calculator.tsx (must be 'use client')
 *  3. Register here.
 *  4. Add metadata to content/calculators/manifest.ts
 *
 * The dynamic route /calculators/[slug] uses this registry to render the right
 * component without each calculator needing its own route file.
 */

import type { ComponentType } from 'react';
import { PaintCalculator } from './PaintCalculator';
import { MulchCalculator } from './MulchCalculator';
import { DeckCalculator } from './DeckCalculator';
import { ConcreteCalculator } from './ConcreteCalculator';
import { DrywallCalculator } from './DrywallCalculator';
import { TileCalculator } from './TileCalculator';
import { GravelCalculator } from './GravelCalculator';
import { FenceCalculator } from './FenceCalculator';
import { RoofingCalculator } from './RoofingCalculator';
import { SidingCalculator } from './SidingCalculator';

export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  'paint-calculator': PaintCalculator,
  'mulch-calculator': MulchCalculator,
  'deck-calculator': DeckCalculator,
  'concrete-calculator': ConcreteCalculator,
  'drywall-calculator': DrywallCalculator,
  'tile-calculator': TileCalculator,
  'gravel-calculator': GravelCalculator,
  'fence-calculator': FenceCalculator,
  'roofing-calculator': RoofingCalculator,
  'siding-calculator': SidingCalculator,
};
