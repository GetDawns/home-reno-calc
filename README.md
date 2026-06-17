# HomeRenoCalc

DIY home renovation calculator + content hub. Next.js 15 / App Router / TypeScript / Tailwind / MDX.

## Getting started

```bash
pnpm install   # or npm / yarn
pnpm dev       # http://localhost:3000
```

## Adding a new calculator

1. Add the math: `lib/calculators/<slug>.ts` exports `calculate<Slug>(input) => result`.
2. Add the UI: `components/calculators/<Name>Calculator.tsx`.
3. Register: add an entry to `content/calculators/manifest.ts` and `components/calculators/registry.ts`.
4. The dynamic route `/calculators/[slug]` picks it up automatically.

## Adding a blog post

Drop an `.mdx` file in `content/blog/` with frontmatter (title, description, date, calculatorSlug, etc.). The dynamic route `/blog/[slug]` renders it.

## Affiliate setup

Set environment variables in `.env.local`:

```
NEXT_PUBLIC_HD_TAG=your-home-depot-tag
NEXT_PUBLIC_LOWES_TAG=your-lowes-tag
NEXT_PUBLIC_AMAZON_TAG=your-amazon-tag-20
```

`lib/affiliates/links.ts` builds tagged URLs and rotates between retailers (Home Depot prioritized).

## Ad slots

`<AdSlot>` components are placeholder containers. Replace with Mediavine / Raptive ad scripts once you hit their traffic threshold (~50K monthly sessions).
