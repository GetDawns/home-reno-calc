'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  calculateTile,
  TILE_DEFAULTS,
  type TileInput,
  type TileLayout,
} from '@/lib/calculators/tile';
import { cn, formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { TilePatternPreview } from './TilePatternPreview';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const LAYOUT_OPTIONS: { value: TileLayout; label: string; waste: number; hint: string }[] = [
  { value: 'straight',    label: 'Straight grid', waste: 7,  hint: 'Easiest. Lowest waste.' },
  { value: 'brick',       label: 'Brick / offset', waste: 10, hint: 'Hides minor inconsistencies.' },
  { value: 'diagonal',    label: 'Diagonal',       waste: 15, hint: 'Visually expanding. More cuts.' },
  { value: 'herringbone', label: 'Herringbone',    waste: 20, hint: 'Designer look. Lots of waste.' },
];

const JOINT_OPTIONS = [
  { value: 0.0625, label: '1/16″ (rectified tile)' },
  { value: 0.125,  label: '1/8″ (most common)' },
  { value: 0.1875, label: '3/16″' },
  { value: 0.25,   label: '1/4″ (rustic / tumbled)' },
];

export function TileCalculator() {
  const [input, setInput] = useState<TileInput>(TILE_DEFAULTS);
  const result = useMemo(() => calculateTile(input), [input]);

  const update =
    <K extends keyof TileInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) as TileInput[K] }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="Room dimensions" hint="Length × width of the surface you're tiling.">
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField label="Length" htmlFor="lengthFt" unit="ft" example="Example: 10 ft (medium bathroom)">
                <Input id="lengthFt" type="number" min={1} step={0.5} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField label="Width" htmlFor="widthFt" unit="ft" example="Example: 8 ft">
                <Input id="widthFt" type="number" min={1} step={0.5} value={input.widthFt} onChange={update('widthFt')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Tile size" hint="Common sizes: 12×12, 12×24, 18×18, 24×24, mosaic.">
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField
                label="Tile width"
                htmlFor="tileWidthIn"
                unit="in"
                example="12 in = standard square"
                tooltip="Measure the actual tile face. Don't include grout joint width."
              >
                <Input id="tileWidthIn" type="number" min={1} max={48} step={0.5} value={input.tileWidthIn} onChange={update('tileWidthIn')} />
              </CalculatorField>
              <CalculatorField label="Tile length" htmlFor="tileLengthIn" unit="in" example="24 in for plank-style">
                <Input id="tileLengthIn" type="number" min={1} max={48} step={0.5} value={input.tileLengthIn} onChange={update('tileLengthIn')} />
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Layout pattern"
            hint="Pattern is the biggest driver of tile waste. Pick early — you'll need more tile for diagonal or herringbone."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {LAYOUT_OPTIONS.map((opt) => {
                const active = input.layout === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setInput((p) => ({ ...p, layout: opt.value }))}
                    aria-pressed={active}
                    className={cn(
                      'rounded-lg border bg-card text-left transition-all p-3',
                      active
                        ? 'border-forest-700 ring-2 ring-forest-700/30 bg-forest-50/40'
                        : 'border-border hover:border-forest-200 hover:bg-warmgray-50'
                    )}
                  >
                    <div className="flex items-center justify-center mb-2 h-12 bg-warmgray-100 rounded-md">
                      <TilePatternPreview pattern={opt.value} active={active} />
                    </div>
                    <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.hint}</p>
                    <p className={cn(
                      'text-xs font-semibold mt-1.5',
                      active ? 'text-forest-800' : 'text-muted-foreground'
                    )}>
                      ~{opt.waste}% waste
                    </p>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Grout & material">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorField
                label="Grout joint width"
                htmlFor="groutJointIn"
                tooltip="Wider joints (1/4 in+) double grout consumption vs the standard 1/8 in."
              >
                <select
                  id="groutJointIn"
                  className="flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-base md:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={input.groutJointIn}
                  onChange={(e) => setInput((p) => ({ ...p, groutJointIn: Number(e.target.value) }))}
                >
                  {JOINT_OPTIONS.map((j) => (
                    <option key={j.value} value={j.value}>{j.label}</option>
                  ))}
                </select>
              </CalculatorField>
              <CalculatorField label="Tiles per box" htmlFor="tilesPerBox" example="Check the box label. 12×12 ≈ 10 · 24×24 ≈ 4">
                <Input id="tilesPerBox" type="number" min={1} step={1} value={input.tilesPerBox} onChange={update('tilesPerBox')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Cost / box" htmlFor="costPerBox" unit="$" example="$30–80 typical">
                <Input id="costPerBox" type="number" min={0} step={0.5} value={input.costPerBox} onChange={update('costPerBox')} />
              </CalculatorField>
              <CalculatorField label="Cost / grout bag" htmlFor="costPerGroutBag" unit="$" example="$15–22 (25 lb)">
                <Input id="costPerGroutBag" type="number" min={0} step={0.5} value={input.costPerGroutBag} onChange={update('costPerGroutBag')} />
              </CalculatorField>
              <CalculatorField label="Cost / thinset bag" htmlFor="costPerThinsetBag" unit="$" example="$18–28 (50 lb)">
                <Input id="costPerThinsetBag" type="number" min={0} step={0.5} value={input.costPerThinsetBag} onChange={update('costPerThinsetBag')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(TILE_DEFAULTS)} resultPanelId="tile-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="tile-result">
          <PrimaryResult
            label="You'll need"
            value={`${result.boxesToBuy} ${pluralize(result.boxesToBuy, 'box', 'boxes')}`}
            sub={
              <>
                {result.tilesToBuy} tiles total · {result.tilesNeededExact} needed +{' '}
                {result.tilesToBuy - result.tilesNeededExact} extra
              </>
            }
          />

          <SecondaryResult label="Finishing materials">
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span>Grout</span>
                <strong>{result.groutBagsNeeded} {pluralize(result.groutBagsNeeded, 'bag')}</strong>
              </li>
              <li className="flex justify-between">
                <span>Thinset</span>
                <strong>{result.thinsetBagsNeeded} {pluralize(result.thinsetBagsNeeded, 'bag')}</strong>
              </li>
              <li className="flex justify-between pt-2 border-t border-border">
                <span>Total</span>
                <strong className="text-base">{formatUSD(result.estimatedCost)}</strong>
              </li>
            </ul>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Floor area" value={`${result.areaSqFt} sq ft`} />
            <StatTile label="Waste built in" value={`${result.wastePercentage}%`} />
            <StatTile label="Sq ft / tile" value={result.sqFtPerTile.toString()} />
            <StatTile label="Tiles needed" value={result.tilesNeededExact.toString()} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Floor tile', quantity: `${result.boxesToBuy} ${pluralize(result.boxesToBuy, 'box', 'boxes')}`, searchTerm: 'porcelain floor tile' },
              { material: 'Thinset mortar', quantity: `${result.thinsetBagsNeeded} ${pluralize(result.thinsetBagsNeeded, 'bag')}`, searchTerm: 'thinset mortar' },
              { material: 'Sanded grout', quantity: `${result.groutBagsNeeded} ${pluralize(result.groutBagsNeeded, 'bag')}`, searchTerm: 'sanded grout 25 lb' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Save 2–3 unopened tiles for repairs — dye lots vary if you reorder later.
          </p>

          <ShareButtons
            title="Tile Calculator"
            summary={`Need ${result.boxesToBuy} ${pluralize(result.boxesToBuy, 'box', 'boxes')} of tile (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="tile-calculator" />
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
