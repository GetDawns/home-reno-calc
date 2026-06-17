'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateDrywall, DRYWALL_DEFAULTS, type DrywallInput } from '@/lib/calculators/drywall';
import { formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

export function DrywallCalculator() {
  const [input, setInput] = useState<DrywallInput>(DRYWALL_DEFAULTS);
  const result = useMemo(() => calculateDrywall(input), [input]);

  const update =
    <K extends keyof DrywallInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) as DrywallInput[K] }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="Total area to cover" hint="Add up all wall + ceiling square footage. Use our paint calculator to compute room areas first.">
            <CalculatorField
              label="Total square footage"
              htmlFor="totalSqFt"
              unit="sq ft"
              example="A 12 × 14 room with 8 ft ceilings ≈ 416 sq ft of wall"
            >
              <Input id="totalSqFt" type="number" min={0} step={10} value={input.totalSqFt} onChange={update('totalSqFt')} />
            </CalculatorField>
          </Section>

          <Section title="Sheet size" hint="4 × 8 is easiest solo. 4 × 12 means fewer joints but needs 2 people.">
            <CalculatorField
              label="Sheet dimensions"
              htmlFor="sheetSize"
              tooltip="Larger sheets = fewer seams to tape, but harder to maneuver in finished spaces."
            >
              <select
                id="sheetSize"
                className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={input.sheetSize}
                onChange={(e) => setInput((p) => ({ ...p, sheetSize: e.target.value as DrywallInput['sheetSize'] }))}
              >
                <option value="4x8">4 × 8 ft (32 sq ft) — most common</option>
                <option value="4x10">4 × 10 ft (40 sq ft)</option>
                <option value="4x12">4 × 12 ft (48 sq ft) — needs 2 people</option>
              </select>
            </CalculatorField>
          </Section>

          <Section title="Pricing" hint="Defaults match Home Depot averages for residential 1/2″ drywall.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorField label="Cost / sheet" htmlFor="costPerSheet" unit="$" example="$15–20 standard · $25 mold-resistant">
                <Input id="costPerSheet" type="number" min={0} step={0.5} value={input.costPerSheet} onChange={update('costPerSheet')} />
              </CalculatorField>
              <CalculatorField label="Cost / 1 lb screw box" htmlFor="costPerScrewBox" unit="$" example="$10–15">
                <Input id="costPerScrewBox" type="number" min={0} step={0.5} value={input.costPerScrewBox} onChange={update('costPerScrewBox')} />
              </CalculatorField>
              <CalculatorField label="Cost / compound pail" htmlFor="costPerCompoundPail" unit="$" example="$15–20 (4.5 qt)">
                <Input id="costPerCompoundPail" type="number" min={0} step={0.5} value={input.costPerCompoundPail} onChange={update('costPerCompoundPail')} />
              </CalculatorField>
              <CalculatorField label="Cost / tape roll" htmlFor="costPerTapeRoll" unit="$" example="$5–8 per 250 ft roll">
                <Input id="costPerTapeRoll" type="number" min={0} step={0.25} value={input.costPerTapeRoll} onChange={update('costPerTapeRoll')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(DRYWALL_DEFAULTS)} resultPanelId="drywall-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="drywall-result">
          <PrimaryResult
            label="You'll need"
            value={`${result.sheetsNeeded} sheets`}
            sub={
              <>
                Total cost: <strong className="text-foreground">{formatUSD(result.estimatedCost)}</strong>
              </>
            }
          />

          <SecondaryResult label="Finishing materials">
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span>Drywall screws</span>
                <strong>{result.screwBoxesNeeded} {pluralize(result.screwBoxesNeeded, 'box', 'boxes')} (1 lb each)</strong>
              </li>
              <li className="flex justify-between">
                <span>Joint compound</span>
                <strong>{result.compoundPailsNeeded} {pluralize(result.compoundPailsNeeded, 'pail')}</strong>
              </li>
              <li className="flex justify-between">
                <span>Paper tape</span>
                <strong>{result.tapeRollsNeeded} {pluralize(result.tapeRollsNeeded, 'roll')}</strong>
              </li>
            </ul>
          </SecondaryResult>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Drywall sheets', quantity: `${result.sheetsNeeded} sheets`, searchTerm: '1/2 in drywall sheet 4x8' },
              { material: 'Joint compound', quantity: `${result.compoundPailsNeeded} ${pluralize(result.compoundPailsNeeded, 'pail')}`, searchTerm: 'all-purpose joint compound' },
              { material: 'Drywall screws', quantity: `${result.screwBoxesNeeded} ${pluralize(result.screwBoxesNeeded, 'box', 'boxes')}`, searchTerm: 'drywall screws 1.25 in' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Excludes corner bead, sandpaper, and texture spray. Buy 1 extra sheet for damaged or miscut pieces.
          </p>

          <ShareButtons
            title="Drywall Calculator"
            summary={`Need ${result.sheetsNeeded} drywall sheets (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="drywall-calculator" />
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
