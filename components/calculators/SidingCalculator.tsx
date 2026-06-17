'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  calculateSiding,
  SIDING_DEFAULTS,
  SIDING_TYPES,
  type SidingInput,
  type SidingType,
} from '@/lib/calculators/siding';
import { cn, formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const SIDING_SEARCH_TERMS: Record<SidingType, string> = {
  vinyl: 'vinyl siding',
  'fiber-cement': 'hardieplank fiber cement siding',
  wood: 'cedar clapboard siding',
  'engineered-wood': 'lp smartside lap siding',
};

export function SidingCalculator() {
  const [input, setInput] = useState<SidingInput>(SIDING_DEFAULTS);
  const result = useMemo(() => calculateSiding(input), [input]);

  const update =
    <K extends keyof SidingInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) as SidingInput[K] }));
    };

  // When user picks a type, set the cost-per-box default if they haven't customized it yet.
  const setSidingType = (type: SidingType) => {
    setInput((prev) => ({
      ...prev,
      sidingType: type,
      costPerBox: SIDING_TYPES[type].defaultBoxCost,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="House dimensions" hint="Total exterior wall perimeter and wall height. Two-story houses use 18 ft height (9 + 9).">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField
                label="Wall perimeter"
                htmlFor="perimeterFt"
                unit="ft"
                example="Example: 160 ft (40×40 house)"
                tooltip="Add up the lengths of every exterior wall. For a 40×30 rectangle: 2 × (40 + 30) = 140 ft."
              >
                <Input id="perimeterFt" type="number" min={20} step={1} value={input.perimeterFt} onChange={update('perimeterFt')} />
              </CalculatorField>
              <CalculatorField label="Wall height" htmlFor="wallHeightFt" unit="ft" example="9 ft single-story · 18 ft two-story">
                <Input id="wallHeightFt" type="number" min={7} max={30} step={0.5} value={input.wallHeightFt} onChange={update('wallHeightFt')} />
              </CalculatorField>
              <CalculatorField label="Outside corners" htmlFor="cornersCount" example="4 = rectangle · 6+ = L-shape">
                <Input id="cornersCount" type="number" min={2} max={20} value={input.cornersCount} onChange={update('cornersCount')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Openings" hint="Each window deducts ~15 sq ft; each door ~21 sq ft.">
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField label="Windows" htmlFor="windowCount" example="Standard 3 ft × 5 ft assumed">
                <Input id="windowCount" type="number" min={0} max={50} value={input.windowCount} onChange={update('windowCount')} />
              </CalculatorField>
              <CalculatorField label="Exterior doors" htmlFor="doorCount" example="Front + back = 2 typical">
                <Input id="doorCount" type="number" min={0} max={10} value={input.doorCount} onChange={update('doorCount')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Siding type" hint="Each material has different coverage per box and different installation requirements.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(SIDING_TYPES) as SidingType[]).map((key) => {
                const meta = SIDING_TYPES[key];
                const active = input.sidingType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSidingType(key)}
                    aria-pressed={active}
                    className={cn(
                      'rounded-lg border px-4 py-3 text-left transition-all',
                      active
                        ? 'border-forest-700 ring-2 ring-forest-700/30 bg-forest-50/40'
                        : 'border-border bg-card hover:border-forest-200 hover:bg-warmgray-50'
                    )}
                  >
                    <p className="font-semibold text-sm text-foreground">{meta.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {meta.squaresPerBox} sq per box · ~${meta.defaultBoxCost}
                    </p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Pricing" hint="Defaults match average 2026 prices. Update with your local supplier's quote.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorField label="Cost / box" htmlFor="costPerBox" unit="$">
                <Input id="costPerBox" type="number" min={0} step={1} value={input.costPerBox} onChange={update('costPerBox')} />
              </CalculatorField>
              <CalculatorField label="Cost / corner post" htmlFor="costPerCornerPost" unit="$" example="$15–30 vinyl">
                <Input id="costPerCornerPost" type="number" min={0} step={1} value={input.costPerCornerPost} onChange={update('costPerCornerPost')} />
              </CalculatorField>
              <CalculatorField label="Cost / starter strip ft" htmlFor="costPerStarterStripFt" unit="$" example="$1.00–1.50 / LF">
                <Input id="costPerStarterStripFt" type="number" min={0} step={0.05} value={input.costPerStarterStripFt} onChange={update('costPerStarterStripFt')} />
              </CalculatorField>
              <CalculatorField label="Cost / J-channel ft" htmlFor="costPerJChannelFt" unit="$" example="$1.20–2.00 / LF">
                <Input id="costPerJChannelFt" type="number" min={0} step={0.05} value={input.costPerJChannelFt} onChange={update('costPerJChannelFt')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(SIDING_DEFAULTS)} resultPanelId="siding-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="siding-result">
          <PrimaryResult
            label="Siding"
            value={`${result.boxesNeeded} ${pluralize(result.boxesNeeded, 'box', 'boxes')}`}
            sub={
              <>
                {result.squares} squares · covers {result.netWallAreaSqFt} sq ft of wall
              </>
            }
          />

          <SecondaryResult label="Total estimate">
            <p className="text-2xl font-bold leading-none mt-1">{formatUSD(result.estimatedCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Includes accessories: corner posts, starter strip, J-channel
            </p>
          </SecondaryResult>

          <SecondaryResult label="Accessories">
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span>Corner posts</span>
                <strong>{result.cornerPostsNeeded}</strong>
              </li>
              <li className="flex justify-between">
                <span>Starter strip</span>
                <strong>{result.starterStripFt} LF</strong>
              </li>
              <li className="flex justify-between">
                <span>J-channel</span>
                <strong>{result.jChannelFt} LF</strong>
              </li>
            </ul>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Gross wall area" value={`${result.grossWallAreaSqFt} sq ft`} />
            <StatTile label="After openings" value={`${result.netWallAreaSqFt} sq ft`} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: SIDING_TYPES[input.sidingType].label, quantity: `${result.boxesNeeded} ${pluralize(result.boxesNeeded, 'box', 'boxes')}`, searchTerm: SIDING_SEARCH_TERMS[input.sidingType] },
              { material: 'Corner posts', quantity: `${result.cornerPostsNeeded}`, searchTerm: 'siding corner post' },
              { material: 'J-channel & starter strip', quantity: `${result.jChannelFt + result.starterStripFt} LF`, searchTerm: 'vinyl siding j channel' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Excludes house wrap, fasteners, and trim. Order all siding from the same dye lot.
          </p>

          <ShareButtons
            title="Siding Calculator"
            summary={`Need ${result.boxesNeeded} ${pluralize(result.boxesNeeded, 'box', 'boxes')} of siding (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="siding-calculator" />
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
