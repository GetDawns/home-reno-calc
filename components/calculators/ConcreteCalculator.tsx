'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  calculateConcrete,
  CONCRETE_DEFAULTS,
  type ConcreteInput,
  type ConcreteShape,
} from '@/lib/calculators/concrete';
import { cn, formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, ResultNotes } from './ResultPanel';
import { RebarGridPreview } from './RebarGridPreview';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const SHAPES: { value: ConcreteShape; label: string; hint: string }[] = [
  { value: 'slab', label: 'Slab', hint: 'Patio, garage floor, shed pad' },
  { value: 'footing', label: 'Footing', hint: 'Below-grade support trench' },
  { value: 'sonotube', label: 'Sonotube', hint: 'Round column for posts/decks' },
];

export function ConcreteCalculator() {
  const [input, setInput] = useState<ConcreteInput>(CONCRETE_DEFAULTS);
  const result = useMemo(() => calculateConcrete(input), [input]);

  const updateNum =
    <K extends keyof ConcreteInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({
        ...prev,
        [key]: Number(e.target.value) as ConcreteInput[K],
      }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="What are you pouring?">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SHAPES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setInput((prev) => ({ ...prev, shape: s.value }))}
                  aria-pressed={input.shape === s.value}
                  className={cn(
                    'rounded-lg border px-4 py-3 text-left transition-all',
                    input.shape === s.value
                      ? 'bg-forest-50 border-forest-700 ring-2 ring-forest-700/30'
                      : 'bg-card border-border hover:border-forest-200 hover:bg-warmgray-50'
                  )}
                >
                  <span className="block font-semibold text-foreground">{s.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{s.hint}</span>
                </button>
              ))}
            </div>
          </Section>

          {input.shape !== 'sonotube' ? (
            <Section title="Slab dimensions" hint="Length × width × thickness — 4″ is the residential minimum.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CalculatorField label="Length" htmlFor="lengthFt" unit="ft" example="Example: 10 ft (shed pad)">
                  <Input id="lengthFt" type="number" min={1} step={0.5} value={input.lengthFt} onChange={updateNum('lengthFt')} />
                </CalculatorField>
                <CalculatorField label="Width" htmlFor="widthFt" unit="ft" example="Example: 10 ft">
                  <Input id="widthFt" type="number" min={1} step={0.5} value={input.widthFt} onChange={updateNum('widthFt')} />
                </CalculatorField>
                <CalculatorField
                  label="Thickness"
                  htmlFor="thicknessIn"
                  unit="in"
                  example="4 in = patios · 6 in = driveways"
                  tooltip="Less than 4 inches is prone to cracking under any vehicle weight."
                >
                  <Input id="thicknessIn" type="number" min={2} max={24} step={0.5} value={input.thicknessIn} onChange={updateNum('thicknessIn')} />
                </CalculatorField>
              </div>
              <CalculatorField label="How many?" htmlFor="count" example="Most jobs are 1; multiple footings are common.">
                <Input id="count" type="number" min={1} value={input.count} onChange={updateNum('count')} />
              </CalculatorField>
            </Section>
          ) : (
            <Section title="Sonotube dimensions" hint="Round columns used for deck posts, fence posts, and porch supports.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CalculatorField label="Diameter" htmlFor="diameterIn" unit="in" example="8–12 in is typical for residential">
                  <Input id="diameterIn" type="number" min={4} max={36} step={1} value={input.diameterIn} onChange={updateNum('diameterIn')} />
                </CalculatorField>
                <CalculatorField label="Height" htmlFor="heightFt" unit="ft" example="Below frost line + 6 in above grade">
                  <Input id="heightFt" type="number" min={1} step={0.5} value={input.heightFt} onChange={updateNum('heightFt')} />
                </CalculatorField>
                <CalculatorField label="How many?" htmlFor="count" example="A 16×12 deck typically uses 6">
                  <Input id="count" type="number" min={1} max={50} value={input.count} onChange={updateNum('count')} />
                </CalculatorField>
              </div>
            </Section>
          )}

          <Section title="Concrete pricing">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Bag size" htmlFor="bagSizeLb" unit="lb">
                <select
                  id="bagSizeLb"
                  className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={input.bagSizeLb}
                  onChange={(e) =>
                    setInput((p) => ({ ...p, bagSizeLb: Number(e.target.value) as 40 | 60 | 80 }))
                  }
                >
                  <option value={40}>40 lb (0.30 cu ft)</option>
                  <option value={60}>60 lb (0.45 cu ft)</option>
                  <option value={80}>80 lb (0.60 cu ft)</option>
                </select>
              </CalculatorField>
              <CalculatorField label="Cost / bag" htmlFor="costPerBag" unit="$" example="$5–7 typical">
                <Input id="costPerBag" type="number" min={0} step={0.25} value={input.costPerBag} onChange={updateNum('costPerBag')} />
              </CalculatorField>
              <CalculatorField label="Cost / cu yd" htmlFor="costPerCuYd" unit="$" example="$140–200 ready-mix">
                <Input id="costPerCuYd" type="number" min={0} step={1} value={input.costPerCuYd} onChange={updateNum('costPerCuYd')} />
              </CalculatorField>
            </div>
          </Section>

          {input.shape !== 'sonotube' && (
            <Section
              title="Rebar (optional but recommended)"
              hint="Grid of #4 (½″) rebar prevents cracking. Standard residential spacing is 16″ OC."
            >
              <label className="flex items-center gap-3 cursor-pointer rounded-md border border-border bg-warmgray-50 px-4 py-3 hover:bg-warmgray-100 transition-colors">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-input accent-forest-700"
                  checked={input.includeRebar}
                  onChange={(e) => setInput((p) => ({ ...p, includeRebar: e.target.checked }))}
                />
                <span className="text-sm font-medium">Include rebar grid in estimate</span>
              </label>
              {input.includeRebar && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CalculatorField
                      label="Spacing"
                      htmlFor="rebarSpacingIn"
                      unit="in OC"
                      tooltip="Tighter spacing = stronger but more rebar. 12 in for driveways/heavy loads."
                    >
                      <select
                        id="rebarSpacingIn"
                        className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={input.rebarSpacingIn}
                        onChange={(e) =>
                          setInput((p) => ({ ...p, rebarSpacingIn: Number(e.target.value) }))
                        }
                      >
                        <option value={12}>12″ — heavy load / driveway</option>
                        <option value={16}>16″ — standard residential</option>
                        <option value={18}>18″ — light residential</option>
                        <option value={24}>24″ — light duty / shed</option>
                      </select>
                    </CalculatorField>
                    <CalculatorField label="Cost / 20 ft stick" htmlFor="costPerRebarStick" unit="$" example="$8–10 typical">
                      <Input id="costPerRebarStick" type="number" min={0} step={0.25} value={input.costPerRebarStick} onChange={updateNum('costPerRebarStick')} />
                    </CalculatorField>
                  </div>

                  <RebarGridPreview
                    lengthFt={input.lengthFt}
                    widthFt={input.widthFt}
                    spacingIn={input.rebarSpacingIn}
                  />
                </>
              )}
            </Section>
          )}

          <CalculatorActions onReset={() => setInput(CONCRETE_DEFAULTS)} resultPanelId="concrete-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="concrete-result">
          <PrimaryResult
            label="Concrete needed"
            value={`${result.volumeCuYd} cu yd`}
            sub={
              <>
                {result.volumeCuFt} cu ft · {result.bagsNeeded} bags ({formatUSD(result.bagCost)})
              </>
            }
          />

          <SecondaryResult label="Bags vs ready-mix">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Bags ({result.bagsNeeded})</span>
                <strong>{formatUSD(result.bagCost)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Ready-mix delivery</span>
                <strong>{formatUSD(result.bulkCost)}</strong>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 text-forest-800 px-2.5 py-1 text-xs font-semibold">
                  Recommended: {result.recommendation === 'bulk' ? 'Ready-mix delivery' : 'Bags'}
                </span>
              </div>
            </div>
          </SecondaryResult>

          {result.rebar && (
            <SecondaryResult label="Rebar (#4 / ½″)">
              <p className="text-2xl font-bold leading-none mt-1">{result.rebar.sticks} sticks</p>
              <p className="text-sm text-muted-foreground">
                {result.rebar.linearFt} ft total · {result.rebar.barsLengthwise} × {result.rebar.barsWidthwise} grid
              </p>
              <p className="text-sm pt-1.5">
                Estimated cost: <strong>{formatUSD(result.rebar.cost)}</strong>
              </p>
            </SecondaryResult>
          )}

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Concrete mix', quantity: `${result.bagsNeeded} ${pluralize(result.bagsNeeded, 'bag')}`, searchTerm: '80 lb concrete mix' },
              ...(result.rebar
                ? [{ material: '#4 rebar (½″)', quantity: `${result.rebar.sticks} sticks`, searchTerm: '1/2 inch rebar 20 ft' }]
                : []),
              { material: 'Forming lumber', quantity: 'Optional', searchTerm: 'pressure treated 2x4' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Verify with local code. Some jurisdictions require specific rebar grades or footings below frost line.
          </p>

          <ShareButtons
            title="Concrete Calculator"
            summary={`Need ${result.volumeCuYd} cu yd of concrete (${result.bagsNeeded} bags)`}
          />
          <FeedbackButton calculator="concrete-calculator" />
        </ResultPanel>
      </div>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
