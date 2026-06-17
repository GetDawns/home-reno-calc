'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  calculateGravel,
  GRAVEL_DEFAULTS,
  GRAVEL_TYPES,
  type GravelInput,
  type GravelType,
} from '@/lib/calculators/gravel';
import { cn, formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { GravelTypePreview } from './GravelTypePreview';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const RECOMMENDATION_LABELS = {
  bags: 'Buy bags (small project)',
  'bulk-tons': 'Bulk delivery (sold by ton)',
  'bulk-cu-yd': 'Bulk delivery (sold by cubic yard)',
} as const;

export function GravelCalculator() {
  const [input, setInput] = useState<GravelInput>(GRAVEL_DEFAULTS);
  const result = useMemo(() => calculateGravel(input), [input]);

  const update =
    <K extends keyof GravelInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) as GravelInput[K] }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="Project area" hint="Length × width of the driveway, walkway, or pad you're filling.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Length" htmlFor="lengthFt" unit="ft" example="Example: 30 ft (typical driveway)">
                <Input id="lengthFt" type="number" min={1} step={0.5} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField label="Width" htmlFor="widthFt" unit="ft" example="Example: 12 ft (single-car wide)">
                <Input id="widthFt" type="number" min={1} step={0.5} value={input.widthFt} onChange={update('widthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Depth"
                htmlFor="depthIn"
                unit="in"
                example="4–6 in for driveways · 2–3 in for beds"
                tooltip="Less than 3 inches won't hold up under vehicle weight."
              >
                <Input id="depthIn" type="number" min={1} max={24} step={0.5} value={input.depthIn} onChange={update('depthIn')} />
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Gravel type"
            hint="Density varies by stone — pea gravel is lighter than crusher run by ~10%."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(GRAVEL_TYPES) as GravelType[]).map((key) => {
                const meta = GRAVEL_TYPES[key];
                const active = input.gravelType === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setInput((p) => ({ ...p, gravelType: key }))}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5 text-left transition-all',
                      active
                        ? 'border-forest-700 ring-2 ring-forest-700/30 bg-forest-50/30'
                        : 'border-border hover:border-forest-200 hover:bg-warmgray-50'
                    )}
                  >
                    <GravelTypePreview type={key} active={active} />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{meta.label}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{meta.bestFor}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Pricing" hint="Plug in your local supplier's rates — bag prices, per-ton, and per-cubic-yard.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorField label="Bag size" htmlFor="bagSizeCuFt" unit="cu ft" example="0.5 cu ft (50 lb) standard">
                <Input id="bagSizeCuFt" type="number" min={0.25} step={0.25} value={input.bagSizeCuFt} onChange={update('bagSizeCuFt')} />
              </CalculatorField>
              <CalculatorField label="Cost / bag" htmlFor="costPerBag" unit="$" example="$4–6">
                <Input id="costPerBag" type="number" min={0} step={0.25} value={input.costPerBag} onChange={update('costPerBag')} />
              </CalculatorField>
              <CalculatorField label="Cost / ton" htmlFor="costPerTon" unit="$" example="$25–55 delivered">
                <Input id="costPerTon" type="number" min={0} step={1} value={input.costPerTon} onChange={update('costPerTon')} />
              </CalculatorField>
              <CalculatorField label="Cost / cu yd" htmlFor="costPerCuYd" unit="$" example="$40–80 delivered">
                <Input id="costPerCuYd" type="number" min={0} step={1} value={input.costPerCuYd} onChange={update('costPerCuYd')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(GRAVEL_DEFAULTS)} resultPanelId="gravel-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="gravel-result">
          <PrimaryResult
            label="You'll need"
            value={`${result.volumeCuYd} cu yd`}
            sub={
              <>
                {result.tons} tons · {result.bagsNeeded} {pluralize(result.bagsNeeded, 'bag')}
              </>
            }
          />

          <SecondaryResult label="Cost comparison">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Bags ({result.bagsNeeded})</span>
                <strong>{formatUSD(result.bagCost)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Bulk by the ton</span>
                <strong>{formatUSD(result.bulkCostByTon)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Bulk by cu yd</span>
                <strong>{formatUSD(result.bulkCostByCuYd)}</strong>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 text-forest-800 px-2.5 py-1 text-xs font-semibold">
                  Recommended: {RECOMMENDATION_LABELS[result.recommendation]}
                </span>
              </div>
            </div>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Area" value={`${result.areaSqFt} sq ft`} />
            <StatTile label="Volume" value={`${result.volumeCuFt} cu ft`} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: GRAVEL_TYPES[input.gravelType].label, quantity: `${result.tons} tons`, searchTerm: gravelSearchTerm(input.gravelType) },
              { material: 'Bulk delivery', quantity: `${result.volumeCuYd} cu yd`, searchTerm: 'gravel delivery near me', retailers: ['Home Depot', "Lowe's"] },
              { material: 'Landscape fabric', quantity: 'Optional', searchTerm: 'landscape fabric' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Density varies by supplier. Ask for the spec sheet for exact tonnage on a known cubic yard.
          </p>

          <ShareButtons
            title="Gravel Calculator"
            summary={`Need ${result.volumeCuYd} cu yd of gravel (~${result.tons} tons)`}
          />
          <FeedbackButton calculator="gravel-calculator" />
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

function gravelSearchTerm(type: GravelType): string {
  switch (type) {
    case 'pea-gravel': return 'pea gravel';
    case '57-stone': return '#57 stone gravel';
    case 'crushed-stone': return '3/4 crushed stone';
    case 'crusher-run': return 'crusher run gravel';
    case 'river-rock': return 'river rock landscape';
    case 'sand': return 'paver bedding sand';
  }
}
