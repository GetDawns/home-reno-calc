'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculatePaint, PAINT_DEFAULTS, type PaintInput } from '@/lib/calculators/paint';
import { formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import {
  ResultPanel,
  PrimaryResult,
  SecondaryResult,
  StatTile,
  ResultNotes,
} from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

export function PaintCalculator() {
  const [input, setInput] = useState<PaintInput>(PAINT_DEFAULTS);
  const result = useMemo(() => calculatePaint(input), [input]);

  const update =
    <K extends keyof PaintInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      setInput((prev) => ({ ...prev, [key]: value }));
    };

  const toggle =
    (key: keyof PaintInput) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: e.target.checked }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* INPUTS */}
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section
            title="Room dimensions"
            hint="Measure the floor and wall height. Most rooms are 8 ft tall."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField
                label="Length"
                htmlFor="lengthFt"
                unit="ft"
                example="Example: 14 ft for a typical bedroom"
              >
                <Input id="lengthFt" type="number" min={1} step={0.5} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Width"
                htmlFor="widthFt"
                unit="ft"
                example="Example: 12 ft (half a 2-car garage)"
              >
                <Input id="widthFt" type="number" min={1} step={0.5} value={input.widthFt} onChange={update('widthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Wall height"
                htmlFor="heightFt"
                unit="ft"
                example="8 ft = standard. 9–10 ft = newer construction."
                tooltip="Measure from finished floor to ceiling. Don't include crown molding or attic space."
              >
                <Input id="heightFt" type="number" min={6} step={0.5} value={input.heightFt} onChange={update('heightFt')} />
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Doors & windows"
            hint="Each door deducts ~21 sq ft; each window ~15 sq ft."
          >
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField label="Doors" htmlFor="doorCount" example="Closet doors count too">
                <Input id="doorCount" type="number" min={0} max={10} value={input.doorCount} onChange={update('doorCount')} />
              </CalculatorField>
              <CalculatorField label="Windows" htmlFor="windowCount" example="Standard 3 ft × 5 ft assumed">
                <Input id="windowCount" type="number" min={0} max={20} value={input.windowCount} onChange={update('windowCount')} />
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Paint settings"
            hint="Two coats is standard. Most paints cover ~350 sq ft per gallon on smooth walls."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField
                label="Coats"
                htmlFor="coats"
                example="2 = standard. 3 = light over dark."
                tooltip="Even paint-and-primer combos benefit from a second coat for full color depth."
              >
                <Input id="coats" type="number" min={1} max={4} value={input.coats} onChange={update('coats')} />
              </CalculatorField>
              <CalculatorField
                label="Coverage / gal"
                htmlFor="coveragePerGallon"
                unit="sq ft"
                example="350 = smooth · 275 = textured"
                tooltip="Check your paint can — premium paints cover 400 sq ft, budget paints sometimes only 250."
              >
                <Input id="coveragePerGallon" type="number" min={150} max={500} step={25} value={input.coveragePerGallon} onChange={update('coveragePerGallon')} />
              </CalculatorField>
              <CalculatorField
                label="Cost / gallon"
                htmlFor="costPerGallon"
                unit="$"
                example="$30–40 mid-tier · $55+ premium"
              >
                <Input id="costPerGallon" type="number" min={0} step={1} value={input.costPerGallon} onChange={update('costPerGallon')} />
              </CalculatorField>
            </div>

            <label className="mt-2 flex items-center gap-3 cursor-pointer rounded-md border border-border bg-warmgray-50 px-4 py-3 hover:bg-warmgray-100 transition-colors">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-input accent-forest-700"
                checked={input.includeCeiling}
                onChange={toggle('includeCeiling')}
              />
              <span className="text-sm font-medium">Include ceiling in estimate</span>
              <span className="ml-auto text-xs text-muted-foreground">+~½ gallon typical</span>
            </label>
          </Section>

          <CalculatorActions onReset={() => setInput(PAINT_DEFAULTS)} resultPanelId="paint-result" />
        </CardContent>
      </Card>

      {/* RESULTS */}
      <div className="lg:col-span-2">
        <ResultPanel id="paint-result" hint="Updates instantly as you type">
          <PrimaryResult
            label="You'll need"
            value={
              <>
                {result.gallonsToBuy} {pluralize(result.gallonsToBuy, 'gallon')}
                {result.quartsToBuy > 0 && (
                  <span className="text-2xl text-muted-foreground"> + {result.quartsToBuy} qt</span>
                )}
              </>
            }
            sub={
              <>
                Estimated cost:{' '}
                <strong className="text-foreground">{formatUSD(result.estimatedCost)}</strong>
              </>
            }
          />

          <SecondaryResult label="Coverage breakdown">
            <dl className="grid grid-cols-2 gap-2 mt-1">
              <StatTile label="Wall area" value={`${result.wallAreaSqFt} sq ft`} />
              {result.ceilingAreaSqFt > 0 && (
                <StatTile label="Ceiling" value={`${result.ceilingAreaSqFt} sq ft`} />
              )}
              <StatTile label="Total paintable" value={`${result.totalPaintableSqFt} sq ft`} />
              <StatTile label="With coats + buffer" value={`${result.totalAreaWithCoats} sq ft`} />
            </dl>
          </SecondaryResult>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Interior paint', quantity: `${result.gallonsToBuy} ${pluralize(result.gallonsToBuy, 'gallon')}`, searchTerm: 'interior paint' },
              { material: 'Roller & tray kit', quantity: '1 set', searchTerm: 'paint roller kit' },
              { material: "Painter's tape", quantity: '1–2 rolls', searchTerm: "painter's tape" },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Estimates only. Verify with your specific paint and surface.
          </p>

          <ShareButtons
            title="Paint Calculator"
            summary={`Need ${result.gallonsToBuy} ${pluralize(result.gallonsToBuy, 'gallon')} of paint (${formatUSD(result.estimatedCost)} estimated)`}
          />
          <FeedbackButton calculator="paint-calculator" />
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
