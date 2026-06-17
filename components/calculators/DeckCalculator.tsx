'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { calculateDeck, DECK_DEFAULTS, type DeckInput } from '@/lib/calculators/deck';
import { formatUSD, pluralize } from '@/lib/utils';
import { CalculatorField } from './CalculatorField';
import { CalculatorActions } from './CalculatorActions';
import { ResultPanel, PrimaryResult, SecondaryResult, StatTile, ResultNotes } from './ResultPanel';
import { WhereToBuy } from './WhereToBuy';
import { ShareButtons } from './ShareButtons';
import { FeedbackButton } from './FeedbackButton';

export function DeckCalculator() {
  const [input, setInput] = useState<DeckInput>(DECK_DEFAULTS);
  const result = useMemo(() => calculateDeck(input), [input]);

  const update =
    <K extends keyof DeckInput>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, [key]: Number(e.target.value) }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-3 surface-card">
        <CardContent className="p-6 md:p-8 space-y-7">
          <Section title="Deck size" hint="Length runs parallel to your boards. Width is perpendicular.">
            <div className="grid grid-cols-2 gap-4">
              <CalculatorField label="Length" htmlFor="lengthFt" unit="ft" example="Example: 16 ft (board direction)">
                <Input id="lengthFt" type="number" min={2} step={0.5} value={input.lengthFt} onChange={update('lengthFt')} />
              </CalculatorField>
              <CalculatorField label="Width" htmlFor="widthFt" unit="ft" example="Example: 12 ft (joist direction)">
                <Input id="widthFt" type="number" min={2} step={0.5} value={input.widthFt} onChange={update('widthFt')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Boards" hint="Standard 5/4 × 6 boards are 5.5″ wide. Lengths come in 8, 10, 12, and 16 ft.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField
                label="Board width"
                htmlFor="boardWidthIn"
                unit="in"
                example="5.5 in = standard 5/4 × 6"
                tooltip="Most pressure-treated and composite decking is 5.5 inches actual."
              >
                <Input id="boardWidthIn" type="number" min={3} max={8} step={0.25} value={input.boardWidthIn} onChange={update('boardWidthIn')} />
              </CalculatorField>
              <CalculatorField label="Board length" htmlFor="boardLengthFt" unit="ft" example="12 ft = best price-to-waste ratio">
                <Input id="boardLengthFt" type="number" min={6} max={20} step={2} value={input.boardLengthFt} onChange={update('boardLengthFt')} />
              </CalculatorField>
              <CalculatorField
                label="Gap"
                htmlFor="gapIn"
                unit="in"
                example="1/8 in = 0.125 (standard)"
                tooltip="Gaps allow drainage and seasonal expansion. Pressure-treated may close up after drying."
              >
                <Input id="gapIn" type="number" min={0} max={0.5} step={0.0625} value={input.gapIn} onChange={update('gapIn')} />
              </CalculatorField>
            </div>
          </Section>

          <Section title="Joists & fasteners" hint="16″ on-center handles most decks. Use 12″ for composite or hot tubs.">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CalculatorField label="Joist spacing" htmlFor="joistOcIn" unit="in OC" example="16 in = standard">
                <Input id="joistOcIn" type="number" min={12} max={24} step={4} value={input.joistOcIn} onChange={update('joistOcIn')} />
              </CalculatorField>
              <CalculatorField label="Cost / board" htmlFor="costPerBoard" unit="$" example="$15–25 PT · $35–55 composite">
                <Input id="costPerBoard" type="number" min={0} step={0.5} value={input.costPerBoard} onChange={update('costPerBoard')} />
              </CalculatorField>
              <CalculatorField label="Cost / fastener box" htmlFor="costPerFastenerBox" unit="$" example="350-count box ~ $35">
                <Input id="costPerFastenerBox" type="number" min={0} step={1} value={input.costPerFastenerBox} onChange={update('costPerFastenerBox')} />
              </CalculatorField>
            </div>
          </Section>

          <CalculatorActions onReset={() => setInput(DECK_DEFAULTS)} resultPanelId="deck-result" />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <ResultPanel id="deck-result">
          <PrimaryResult
            label="You'll need"
            value={`${result.boardsWithWaste} boards`}
            sub={
              <>
                Estimated cost: <strong className="text-foreground">{formatUSD(result.estimatedCost)}</strong>
              </>
            }
          />

          <SecondaryResult label="Materials breakdown">
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between">
                <span>{result.joistsNeeded} joists</span>
                <span className="text-muted-foreground">{result.deckAreaSqFt} sq ft deck</span>
              </li>
              <li className="flex justify-between">
                <span>{result.fastenersNeeded.toLocaleString()} fasteners</span>
                <span className="text-muted-foreground">
                  {result.fastenerBoxesNeeded} {pluralize(result.fastenerBoxesNeeded, 'box', 'boxes')}
                </span>
              </li>
            </ul>
          </SecondaryResult>

          <dl className="grid grid-cols-2 gap-2">
            <StatTile label="Board count (raw)" value={result.boardsNeeded.toString()} />
            <StatTile label="With 5% waste" value={result.boardsWithWaste.toString()} />
          </dl>

          <ResultNotes notes={result.notes} />

          <WhereToBuy
            items={[
              { material: 'Deck boards', quantity: `${result.boardsWithWaste} boards`, searchTerm: 'pressure treated deck boards' },
              { material: 'Deck screws', quantity: `${result.fastenerBoxesNeeded} ${pluralize(result.fastenerBoxesNeeded, 'box', 'boxes')}`, searchTerm: 'exterior deck screws' },
              { material: 'Joist hangers', quantity: `${result.joistsNeeded}+`, searchTerm: 'joist hanger 2x10' },
            ]}
          />

          <p className="text-xs text-muted-foreground italic">
            Excludes framing, posts, stairs, and railing. See deck-framing calculator for those.
          </p>

          <ShareButtons
            title="Deck Calculator"
            summary={`Need ${result.boardsWithWaste} deck boards + ${result.joistsNeeded} joists (${formatUSD(result.estimatedCost)})`}
          />
          <FeedbackButton calculator="deck-calculator" />
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
