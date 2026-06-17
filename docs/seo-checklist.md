# SEO Checklist & Technical Optimizations

Treat this as a pre-flight for every page and a periodic site audit. If it's red, ranking will suffer.

## Per-page (Calculator)

- [ ] Single H1 matches the target keyword exactly (e.g., "Paint Calculator")
- [ ] H2s use natural variants of the keyword and answer questions ("How to use this calculator", "How much paint do I need?")
- [ ] Meta `<title>` ≤ 60 chars, includes target keyword + brand
- [ ] Meta description ≤ 155 chars, includes the keyword and the primary value prop
- [ ] `canonical` URL set in metadata
- [ ] HowTo + FAQPage JSON-LD injected (already wired in `CalculatorLayout`)
- [ ] BreadcrumbList JSON-LD injected (already wired)
- [ ] At least 3 internal links: to related calculators, to a deep article, to homepage
- [ ] At least 3 outbound links to high-authority sources (Family Handyman, This Old House, Home Depot product pages)
- [ ] Affiliate disclosure visible above the fold of the Shop Materials section
- [ ] `lastUpdated` date visible to user AND in metadata
- [ ] Original photo or diagram (Google rewards original media — stock kills E-E-A-T)
- [ ] Page weight < 200KB JS for the calculator (it's just math; no excuse otherwise)
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (Core Web Vitals)

## Per-page (Article)

- [ ] H1 matches target long-tail (e.g., "How much paint do I need for a 12x14 room?")
- [ ] First paragraph contains a **direct, scannable answer** (Google rewards featured-snippet structure)
- [ ] Word count 1500–3000 for guides; 800–1500 for direct-answer posts
- [ ] At least 1 link to the related calculator (above the fold + at the end)
- [ ] Author bio at the end of the article (E-E-A-T signal)
- [ ] Article JSON-LD with author, datePublished, dateModified
- [ ] At least 1 original image per 500 words (with descriptive `alt` text)
- [ ] Internal links to 2–3 related articles (cluster strategy)
- [ ] FAQ section at the bottom (drives FAQPage schema; eats SERP real estate)

## Site-wide technical

- [ ] `robots.txt` allows everything except `/api/` and `/_next/`
- [ ] `sitemap.xml` auto-generated (use Next 15's `app/sitemap.ts`)
- [ ] `next.config.mjs` has `images.remotePatterns` set for affiliate retailers
- [ ] OG image present (`/public/og-default.png`) — 1200×630 PNG
- [ ] Favicon set (16/32/192/512 + apple-touch-icon)
- [ ] `theme-color` meta tag set (matches primary brand color)
- [ ] HTTPS only — Vercel handles this; double-check the cert
- [ ] HSTS preload submitted (after 6 months stable)
- [ ] 301 redirect from `www` to apex (or vice versa, but pick one)
- [ ] All links return 200 — run periodic broken-link sweep

## Performance budget

| Metric | Budget | Why |
|--------|--------|-----|
| LCP | < 2.0s mobile | Calculators are read on mobile in the store |
| CLS | < 0.05 | Ads are the #1 CLS offender. Pre-size all ad slots. |
| INP | < 200ms | Form inputs must feel instant |
| Total page weight | < 800KB | Includes ads. Strip libs you don't use. |
| JS for calculator | < 60KB | It's literally a math function. No bloat. |

## Crawl & index hygiene

- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster
- [ ] Use "URL Inspection" in GSC after each new calculator launches; request indexing
- [ ] Watch for "Discovered – not indexed" — usually means thin content; expand the page
- [ ] No-index `/api/`, `/admin/` (we don't have these but stay vigilant)
- [ ] Use `next/link` for internal nav (preserves crawl budget)

## E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

- [ ] About page with real author bios + headshots
- [ ] Per-article author byline pointing to the bio
- [ ] Editorial process page explaining how content is researched and reviewed
- [ ] Sources cited inline ("Per Behr's coverage spec…")
- [ ] Original photos of work being done (not stock kitchen shots)
- [ ] Display affiliate disclosures clearly per FTC 16 CFR Part 255
- [ ] Privacy Policy + Terms of Use linked in footer

## Schema markup checklist (already wired in `lib/seo/schema.ts`)

- [ ] HowTo schema on calculators
- [ ] FAQPage schema where FAQs exist
- [ ] BreadcrumbList on every nested page
- [ ] Article schema on blog posts
- [ ] Organization + Logo on the site root (add to layout for sitelinks)
- [ ] WebSite SearchAction (enables Google sitelinks search box)

## Backlink hygiene

- [ ] No reciprocal link schemes
- [ ] Disavow any obviously spammy links (quarterly review)
- [ ] Earn links via guest posts on **DIY blogs** (Bob Vila, Family Handyman partners, niche Substack writers)
- [ ] Get listed on tool roundups: "Best DIY calculator websites"
- [ ] Pinterest-pinning every article = backlinks + traffic
- [ ] HARO / Help A B2B Writer for expert quotes — use to earn DR 50+ links

## Quick wins to ship in week 1

1. `app/sitemap.ts` (auto-generates from manifest + blog posts)
2. `app/robots.ts` (Next 15 file convention)
3. OG image generator: `app/calculators/[slug]/opengraph-image.tsx` using Next's built-in image generation
4. RSS feed at `/feed.xml` for blog posts
5. WebSite SearchAction JSON-LD in root layout

## Tools to actually use

- **Google Search Console** — daily glance, weekly deep-dive
- **Google Analytics 4** — set up Conversions for affiliate clicks
- **Microsoft Clarity** — free heatmaps, session recordings
- **Ahrefs** or **Semrush** — keyword research, content gap, backlink intel ($99/mo, worth it once you scale)
- **PageSpeed Insights** — pre-deploy check on Vercel previews
- **Schema.org Validator** — paste URL after deploy to confirm schema parses
