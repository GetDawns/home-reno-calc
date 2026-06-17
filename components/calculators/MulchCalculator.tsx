'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateMulch, MULCH_DEFAULTS, type MulchInput } from '@/lib/calculators/mulch';
import { formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

const RECOMMENDATION_LABELS: Record<string, string> = {
  bags: 'Buy bags',
  bulk: 'Order bulk delivery',
  either: 'Either works',
};

export function MulchCalculator() {
  const [input, setInput] = useState<MulchInput>(MULCH_DEFAULTS);
  const result = useMemo(() => calculateMulch(input), [input]);

  const update =
    <K extends keyof MulchInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section
            title="Garden bed dimensions"
            hint="Length × width of the bed you're filling. Round up to the nearest foot."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Length" htmlFor="lengthFt" unit="ft" example="Example: 20 ft along a fence">
                <Input id="lengthFt" type="number" min={1} step={0.5} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField label="Width" htmlFor="widthFt" unit="ft" example="Example: 8 ft (standard front border)">
                <Input id="widthFt" type="number" min={1} step={0.5} value={input.widthFt} onChange={update('widthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Depth"
                htmlFor="depthIn"
                unit="in"
                example="2–3 in is ideal · 3–4 in for new beds"
                tooltip="Less than 2 inches won't suppress weeds; more than 4 inches can suffocate roots."
              >
                <Input id="depthIn" type="number" min={1} max={6} step={0.5} value={input.depthIn} onChange={update('depthIn')} />
              </CalculatorField>
            </div>
          </Section>

          <Section
            title="Pricing"
            hint="Most home centers sell 2 cu ft bags. Bulk delivery starts paying off above 3 cu yd."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Bag size" htmlFor="bagSizeCuFt" unit="cu ft" example="2 cu ft = standard">
                <Input id="bagSizeCuFt" type="number" min={0.5} step={0.25} value={input.bagSizeCuFt} onChange={update('bagSizeCuFt')} />
              </CalculatorField>
              <CalculatorField label="Cost / bag" htmlFor="costPerBag" unit="$" example="$4–6 typical">
                <Input id="costPerBag" type="number" min={0} step={0.25} value={input.costPerBag} onChange={update('costPerBag')} />
              </CalculatorField>
              <CalculatorField label="Cost / cu yd" htmlFor="costPerCuYd" unit="$" example="$30–60 delivered">
                <Input id="costPerCuYd" type="number" min={0} step={1} value={input.costPerCuYd} onChange={update('costPerCuYd')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(MULCH_DEFAULTS)} resultPanelId="mulch-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="mulch-result">
          <PrimaryResult
            label="You'll need"
            value={`${result.volumeCuYd} cu yd`}
            sub={
              <>
                {result.volumeCuFt} cu ft · <strong>{result.bagsNeeded}</strong> {pluralize(result.bagsNeeded, 'bag')}
              </>
            }
          />

          <SecondaryResult label="Cost comparison">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>By the bag</span>
                <strong>{formatUSD(result.bagCost)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Bulk delivery</span>
                <strong>{formatUSD(result.bulkCost)}</strong>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 text-forest-800 px-2.5 py-1 text-xs font-semibold">
                  Recommended: {RECOMMENDATION_LABELS[result.recommendation] ?? result.recommendation}
                </span>
              </div>
            </div>
          </SecondaryResult>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Bagged mulch', quantity: `${result.bagsNeeded} bags`, searchTerm: 'mulch 2 cu ft bag' },
              { material: 'Bulk mulch (delivery)', quantity: `${result.volumeCuYd} cu yd`, searchTerm: 'bulk mulch delivery near me', retailers: ['Home Depot', "Lowe's"] },
              { material: 'Landscape edging', quantity: 'Optional', searchTerm: 'landscape edging' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Estimates only. Verify with your specific materials.
          </p>

          <ShareButtons
            title="Mulch Calculator"
            summary={`Need ${result.volumeCuYd} cu yd of mulch (~${result.bagsNeeded} bags)`}
          />
          <FeedbackButton calculator="mulch-calculator" />
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
