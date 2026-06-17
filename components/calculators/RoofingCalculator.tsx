'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  calculateRoofing,
  ROOFING_DEFAULTS,
  type RoofingInput,
  type RoofComplexity,
} from '@/lib/calculators/roofing';
import { cn, formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const COMPLEXITY_OPTIONS: { value: RoofComplexity; label: string; waste: number; hint: string }[] = [
  { value: 'simple-gable', label: 'Simple gable', waste: 10, hint: 'Two slopes, no valleys' },
  { value: 'hip',          label: 'Hip',          waste: 15, hint: 'All four sides slope down' },
  { value: 'complex',      label: 'Complex',      waste: 20, hint: 'Multiple valleys, dormers' },
];

const PITCH_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 12];

export function RoofingCalculator() {
  const [input, setInput] = useState<RoofingInput>(ROOFING_DEFAULTS);
  const result = useMemo(() => calculateRoofing(input), [input]);

  const update =
    <K extends keyof RoofingInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) as RoofingInput[K] }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="House footprint" hint="The flat area of the building under the roof — not the slope.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Length" htmlFor="footprintLengthFt" unit="ft" example="Example: 40 ft (typical ranch)">
                <Input id="footprintLengthFt" type="number" min={10} step={1} value={input.footprintLengthFt} onChange={update('footprintLengthFt')} />
              </CalculatorField>
              <CalculatorField label="Width" htmlFor="footprintWidthFt" unit="ft" example="Example: 30 ft">
                <Input id="footprintWidthFt" type="number" min={10} step={1} value={input.footprintWidthFt} onChange={update('footprintWidthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Pitch"
                htmlFor="pitch"
                unit="/12"
                example="6/12 = standard · 12/12 = very steep"
                tooltip="Pitch = inches of rise per 12 inches of run. A 6/12 pitch goes up 6″ for every 12″ across."
              >
                <select
                  id="pitch"
                  className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={input.pitch}
                  onChange={(e) => setInput((p) => ({ ...p, pitch: Number(e.target.value) }))}
                >
                  {PITCH_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}/12</option>
                  ))}
                </select>
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Roof complexity"
            hint="Drives waste factor — more cuts and odd angles mean more scrap."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {COMPLEXITY_OPTIONS.map((opt) => {
                const active = input.complexity === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setInput((p) => ({ ...p, complexity: opt.value }))}
                    aria-pressed={active}
                    className={cn(
                      'rounded-lg border bg-card px-4 py-3 text-left transition-all',
                      active
                        ? 'border-forest-700 ring-2 ring-forest-700/30 bg-forest-50/40'
                        : 'border-border hover:border-forest-200 hover:bg-warmgray-50'
                    )}
                  >
                    <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.hint}</p>
                    <p
                      className={cn(
                        'text-xs font-semibold mt-1.5',
                        active ? 'text-forest-800' : 'text-muted-foreground'
                      )}
                    >
                      ~{opt.waste}% waste
                    </p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Pricing" hint="Defaults match 30-year architectural shingle pricing in 2026.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Cost / square" htmlFor="costPerSquare" unit="$" example="$95 3-tab · $110–140 architectural">
                <Input id="costPerSquare" type="number" min={0} step={1} value={input.costPerSquare} onChange={update('costPerSquare')} />
              </CalculatorField>
              <CalculatorField label="Cost / underlayment roll" htmlFor="costPerUnderlaymentRoll" unit="$" example="$100–150 synthetic">
                <Input id="costPerUnderlaymentRoll" type="number" min={0} step={1} value={input.costPerUnderlaymentRoll} onChange={update('costPerUnderlaymentRoll')} />
              </CalculatorField>
              <CalculatorField label="Cost / nail box" htmlFor="costPerNailBox" unit="$" example="$30–40 (5 lb)">
                <Input id="costPerNailBox" type="number" min={0} step={1} value={input.costPerNailBox} onChange={update('costPerNailBox')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(ROOFING_DEFAULTS)} resultPanelId="roofing-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="roofing-result">
          <PrimaryResult
            label="Roof size"
            value={`${result.squares} squares`}
            sub={
              <>
                {result.roofAreaSqFt} sq ft · {result.bundlesNeeded} {pluralize(result.bundlesNeeded, 'bundle')}
              </>
            }
          />

          <SecondaryResult label="Total estimate">
            <p className="text-2xl font-bold leading-none mt-1">{formatUSD(result.estimatedCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Pitch {input.pitch}/12 adds {Math.round((result.pitchMultiplier - 1) * 100)}% to flat-footprint area
            </p>
          </SecondaryResult>

          <SecondaryResult label="Materials breakdown">
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span>Shingle bundles</span>
                <strong>{result.bundlesNeeded}</strong>
              </li>
              <li className="flex justify-between">
                <span>Underlayment rolls</span>
                <strong>{result.underlaymentRolls}</strong>
              </li>
              <li className="flex justify-between">
                <span>Nail boxes</span>
                <strong>{result.nailBoxes}</strong>
              </li>
            </ul>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Footprint" value={`${result.footprintAreaSqFt} sq ft`} />
            <StatTile label="Roof area" value={`${result.roofAreaSqFt} sq ft`} />
            <StatTile label="Pitch multiplier" value={result.pitchMultiplier.toString()} />
            <StatTile label="Waste built in" value={`${result.wastePercentage}%`} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Architectural shingles', quantity: `${result.bundlesNeeded} bundles`, searchTerm: 'architectural shingles' },
              { material: 'Synthetic underlayment', quantity: `${result.underlaymentRolls} ${pluralize(result.underlaymentRolls, 'roll')}`, searchTerm: 'synthetic roofing underlayment' },
              { material: 'Roofing nails', quantity: `${result.nailBoxes} ${pluralize(result.nailBoxes, 'box', 'boxes')}`, searchTerm: 'galvanized roofing nails 1.25 in' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Excludes drip edge, ridge cap, valleys, and flashing. Get a separate estimate for those.
          </p>

          <ShareButtons
            title="Roofing Calculator"
            summary={`Need ${result.bundlesNeeded} shingle bundles for ${result.squares} squares (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="roofing-calculator" />
        </ResultPanel>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-base text-foreground">{title}</h3>
        {hint && <p className="text-sm text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
