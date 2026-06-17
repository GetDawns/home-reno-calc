'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateFence, FENCE_DEFAULTS, type FenceInput } from '@/lib/calculators/fence';
import { formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

export function FenceCalculator() {
  const [input, setInput] = useState<FenceInput>(FENCE_DEFAULTS);
  const result = useMemo(() => calculateFence(input), [input]);

  const update =
    <K extends keyof FenceInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="Fence run" hint="Total length of fence including any gates.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Total length" htmlFor="lengthFt" unit="ft" example="Example: 100 ft for a typical backyard">
                <Input id="lengthFt" type="number" min={4} step={1} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Height"
                htmlFor="heightFt"
                unit="ft"
                example="4 ft yard · 6 ft privacy · 8 ft max"
                tooltip="Many cities require a permit for fences over 6 ft. Check local code first."
              >
                <Input id="heightFt" type="number" min={3} max={10} step={1} value={input.heightFt} onChange={update('heightFt')} />
              </CalculatorField>
              <CalculatorField
                label="Panel length"
                htmlFor="panelLengthFt"
                unit="ft"
                example="8 ft = standard · 6 ft = stronger"
                tooltip="Longer panels mean fewer posts but more flex on uneven ground."
              >
                <Input id="panelLengthFt" type="number" min={4} max={10} step={2} value={input.panelLengthFt} onChange={update('panelLengthFt')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Gates" hint="Each gate replaces a section of fence. Walk gates are typically 4 ft wide.">
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField label="Number of gates" htmlFor="gateCount" example="0 = no gate · 1 = standard yard · 2 = drive-through">
                <Input id="gateCount" type="number" min={0} max={6} value={input.gateCount} onChange={update('gateCount')} />
              </CalculatorField>
              <CalculatorField label="Gate width" htmlFor="gateWidthFt" unit="ft" example="4 ft walk · 8–10 ft vehicle">
                <Input id="gateWidthFt" type="number" min={3} max={16} step={0.5} value={input.gateWidthFt} onChange={update('gateWidthFt')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Pricing" hint="Defaults match average vinyl/PT wood prices at Home Depot.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CalculatorField label="Cost / panel" htmlFor="costPerPanel" unit="$" example="$60–120 vinyl · $40–80 PT wood">
                <Input id="costPerPanel" type="number" min={0} step={1} value={input.costPerPanel} onChange={update('costPerPanel')} />
              </CalculatorField>
              <CalculatorField label="Cost / post" htmlFor="costPerPost" unit="$" example="$20–40 PT 4×4 · $30–60 vinyl">
                <Input id="costPerPost" type="number" min={0} step={1} value={input.costPerPost} onChange={update('costPerPost')} />
              </CalculatorField>
              <CalculatorField label="Concrete bags / post" htmlFor="bagsPerPost" example="2 = standard for 6 ft fence">
                <Input id="bagsPerPost" type="number" min={1} max={4} value={input.bagsPerPost} onChange={update('bagsPerPost')} />
              </CalculatorField>
              <CalculatorField label="Cost / concrete bag" htmlFor="costPerConcreteBag" unit="$" example="$5–7 for 60-80 lb">
                <Input id="costPerConcreteBag" type="number" min={0} step={0.25} value={input.costPerConcreteBag} onChange={update('costPerConcreteBag')} />
              </CalculatorField>
              <CalculatorField label="Cost / gate" htmlFor="costPerGate" unit="$" example="$120–250 walk · $300+ vehicle">
                <Input id="costPerGate" type="number" min={0} step={5} value={input.costPerGate} onChange={update('costPerGate')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(FENCE_DEFAULTS)} resultPanelId="fence-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="fence-result">
          <PrimaryResult
            label="Materials"
            value={`${result.panels} panels`}
            sub={
              <>
                {result.posts} posts · {result.concreteBags} concrete bags
              </>
            }
          />

          <SecondaryResult label="Total estimate">
            <p className="text-2xl font-bold leading-none mt-1">{formatUSD(result.estimatedCost)}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Solid fence run: {result.fenceRunFt} ft · {result.gates} {pluralize(result.gates, 'gate')}
            </p>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Panels" value={result.panels.toString()} />
            <StatTile label="Posts" value={result.posts.toString()} />
            <StatTile label="Concrete bags" value={result.concreteBags.toString()} />
            <StatTile label="Gates" value={result.gates.toString()} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Fence panels', quantity: `${result.panels} panels`, searchTerm: 'fence panel 6ft' },
              { material: 'Fence posts', quantity: `${result.posts} posts`, searchTerm: 'pressure treated 4x4 fence post' },
              { material: 'Fast-set concrete', quantity: `${result.concreteBags} bags`, searchTerm: 'fast set concrete mix' },
              ...(result.gates > 0
                ? [{ material: 'Fence gate', quantity: `${result.gates}`, searchTerm: 'fence gate kit' }]
                : []),
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Excludes hinges, latches, post caps, and stain. Add ~$50–100 per gate for hardware.
          </p>

          <ShareButtons
            title="Fence Calculator"
            summary={`Need ${result.panels} fence panels + ${result.posts} posts (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="fence-calculator" />
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
