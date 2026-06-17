# Duplication Recipe — adding calculators 8 through 100

The starter is intentionally repetitive in shape. After you build one, the next 94 are the same five files in slightly different math. Target time per calculator: **30–45 minutes** including manifest and basic FAQs.

## Files you touch (every single time)

| # | File | Purpose |
|---|------|---------|
| 1 | `lib/calculators/<slug>.ts` | The math (pure function, plus `<SLUG>_DEFAULTS`) |
| 2 | `components/calculators/<Slug>Calculator.tsx` | The form + result UI (`'use client'`) |
| 3 | `components/calculators/registry.ts` | Add one line: slug → component |
| 4 | `lib/calculators/index.ts` | Add one line: `export * from './<slug>'` |
| 5 | `content/calculators/manifest.ts` | Append a new manifest entry |

That's it. The dynamic route `/calculators/[slug]` finds the new calculator automatically. The sitemap regenerates. The homepage and `/calculators` index list it under its category.

## Step-by-step recipe

### 1. Pick a calculator from the top-50 list

Start with `docs/top-50-calculators.md`. Confirm:
- Search volume (Ahrefs / Semrush)
- Competition / KD score
- Is the target keyword still open? (If the top SERP result is a thin AI page, easy to outrank. If it's NerdWallet, skip.)

### 2. Build the math (`lib/calculators/<slug>.ts`)

Copy `lib/calculators/paint.ts` as your template. Pattern:

```ts
import { round } from '@/lib/utils';

/** Top-of-file comment block: industry rules of thumb, conversions used. */

export interface <Slug>Input {
  // All inputs — ALWAYS document units in JSDoc
}

export interface <Slug>Result {
  // All outputs — include `notes: string[]` for inline guidance
}

const WASTE_FACTOR = 1.10; // or whatever fits the category

export function calculate<Slug>(input: <Slug>Input): <Slug>Result {
  // Pure function. No side effects. Throws nothing.
  // Returns rounded values via round().
}

export const <SLUG>_DEFAULTS: <Slug>Input = { /* sane realistic defaults */ };
```

**Rules:**
- Pure function — no `Date.now()`, no `Math.random()`, nothing impure
- All input units documented in JSDoc
- Always include a `notes: string[]` array — that's the per-result guidance the user reads
- Always include a waste factor where applicable (5–20% depending on category)
- Defaults must be realistic enough to produce a plausible result on first page load

### 3. Hand-verify your math

Before writing the UI, plug 2–3 known scenarios into the math function and compare to:
- Manufacturer's coverage spec sheet
- A known-good competitor calculator (Inch Calculator, Omni)
- A textbook / Pro reference (e.g., RSMeans for cost data)

If your output differs by more than ~5%, debug the math, not the test.

### 4. Build the UI (`components/calculators/<Slug>Calculator.tsx`)

Copy `components/calculators/PaintCalculator.tsx` as your template — it's the most polished. Pattern:

```tsx
'use client';

import { useMemo, useState } from 'react';
// imports...

export function <Slug>Calculator() {
  const [input, setInput] = useState<<Slug>Input>(<SLUG>_DEFAULTS);
  const result = useMemo(() => calculate<Slug>(input), [input]);

  const update = <K extends keyof <Slug>Input>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(prev => ({ ...prev, [key]: Number(e.target.value) as <Slug>Input[K] }));
    };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-3">{/* INPUTS */}</Card>
      <Card className="lg:col-span-2 bg-secondary/40 border-wood-200">
        {/* RESULTS */}
      </Card>
    </div>
  );
}
```

**Layout invariants:**
- 5-column grid: inputs span 3, results span 2
- Inputs grouped in sub-sections with `<h3>` headers + one-line description
- Results panel always has: big primary number, supporting stats grid, notes box, print button, italic disclaimer
- Number inputs always have `min`, `step`, and a sensible `max`
- Use the `<Field>` and `<Stat>` helpers (copy from PaintCalculator)

### 5. Register the component

`components/calculators/registry.ts`:

```ts
import { <Slug>Calculator } from './<Slug>Calculator';

export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  // ...existing...
  '<slug>-calculator': <Slug>Calculator,
};
```

### 6. Re-export from barrel

`lib/calculators/index.ts`:

```ts
export * from './<slug>';
```

### 7. Add manifest entry

`content/calculators/manifest.ts` — append a new entry. Required fields:

- `slug` — must match the registry key
- `title`, `subtitle`, `shortDescription`, `metaDescription`
- `category` (existing or new — they auto-group on the index)
- `targetKeyword` + `secondaryKeywords` (3–5 from your keyword research)
- `lastUpdated` (ISO date)
- `howToSteps` (3–5 — drives the HowTo schema for rich snippets)
- `faqs` (3–5 — drives FAQPage schema, eats SERP real estate)
- `related` (slugs of 1–3 related calculators for cross-linking)
- `shop` — your affiliate panel data (priority: Home Depot first)
- `tools` + `supplies` (string arrays for HowTo schema)

### 8. Smoke-test

```bash
pnpm dev
```

Open `http://localhost:3000/calculators/<your-slug>`. Verify:
- Calculator renders, inputs are populated with defaults
- Typing in any input updates the result instantly
- Numbers in the result panel are sensible (not NaN, not Infinity)
- Print button opens print preview with form hidden via the `no-print` class
- Schema markup parses: paste the URL into [validator.schema.org](https://validator.schema.org/) after deploy

### 9. Write 1–3 supporting blog posts

For every calculator, write at least one supporting article:

- **Direct-answer:** "How much [material] do I need for [common scenario]?" (e.g., "How many tiles for a 10×8 bathroom floor?")
- **Comparison:** "[Material A] vs [Material B] for [use case]"
- **Cost:** "How much does it cost to [project]? [Year] price guide"

Drop the `.mdx` file in `content/blog/`. Required frontmatter:

```yaml
---
title: "..."
description: "..."
datePublished: "..."
dateUpdated: "..."
authorName: "..."
relatedCalculators: ["<your-slug>-calculator"]
targetKeyword: "..."
category: "..."
---
```

Internal-link to the calculator from the article (above the fold AND in the conclusion).

## Common gotchas

- **TypeScript: `Number(e.target.value) as <Type>` cast.** Without the cast, TS infers `number` and your `bagSizeLb: 40 | 60 | 80` won't accept it. Always cast.
- **`'use client'` directive.** Forgetting it = the calculator silently fails to update on input. Pattern: only the `<Slug>Calculator.tsx` file is a client component. Everything else (page, layout, manifest, math) stays server.
- **Math must be pure.** If you want a "current year" reference, accept it as an input or compute it server-side and pass it in — never call `new Date()` inside the math function.
- **Defaults that break.** If `0` is a valid input but breaks division, your defaults better not start at 0. Test the defaults FIRST — they're what every visitor sees.
- **Shop product IDs.** The `productId` in `lib/affiliates/links.ts` builds the affiliate URL. Get real product IDs from the retailer's affiliate dashboard before going live; the strings in the starter are illustrative.

## Speed-run pace target

If you're shipping at full speed:

| Day | Output |
|-----|--------|
| Day 1 | 1 calculator, fully tested + 1 article |
| Week 1 | 5 calculators, 5 articles |
| Month 1 | 15 calculators, 15 articles |
| Month 6 | 50 calculators, 75 articles |
| Month 12 | 100 calculators, 200 articles |

Burnout signal: if math QA starts feeling tedious, batch-write 5 math files in one session, then batch-build 5 UIs the next session, then batch-write 5 manifest entries the third. Pure context switching is what eats your week.

## When to deviate from the template

The 5-column grid layout breaks down for these cases:

- **Calculators with a *visualizer*** (e.g., stair calculator wants a stair diagram). Use a 2-row layout: visualizer on top spanning full width, then inputs/results below.
- **Multi-step calculators** (e.g., roofing — choose roof shape → enter dimensions → choose materials). Use a stepper component.
- **Calculators with map/geo input** (e.g., BTU sizing wants climate zone). Add a region selector at the top.

When you deviate, copy the deviation into a new template (`<DeviatedSlug>Calculator.tsx`) and document it here so the next 5 calculators using that pattern stay consistent.
