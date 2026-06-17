import type { ProductLink } from '@/lib/affiliates/links';

/**
 * Calculator manifest — single source of truth for metadata.
 *
 * The dynamic route /calculators/[slug] looks up entries here for SEO metadata,
 * how-to steps, FAQ, related items, and shop affiliate panels.
 *
 * Add a new calculator: append an entry, then register the component in
 * components/calculators/registry.ts.
 */

export interface CalculatorMeta {
  slug: string;
  title: string;
  /** Keyword-rich page title used in <title>, social cards, and search snippets. Falls back to title when missing. */
  seoTitle?: string;
  /** Subtitle / value prop shown under H1 */
  subtitle: string;
  /** One-liner used in homepage cards and related lists */
  shortDescription: string;
  /** SEO meta description (~155 chars) */
  metaDescription: string;
  category: string;
  /** Primary target keyword (for our internal tracking, not user-facing) */
  targetKeyword: string;
  /** Long-tail keywords this page should also rank for */
  secondaryKeywords: string[];
  /** ISO date of last meaningful content update */
  lastUpdated: string;
  /** How-to-use steps — also drives HowTo schema */
  howToSteps: { name: string; text: string }[];
  /** FAQ entries — drives FAQPage schema */
  faqs: { question: string; answer: string }[];
  /** Related calculator slugs (must match keys in this manifest) */
  related: string[];
  /** Related blog post slugs */
  relatedArticles?: { slug: string; title: string }[];
  /** Shop affiliate panel data */
  shop: {
    title: string;
    categories: { name: string; products: ProductLink[] }[];
  };
  /** Tools / supplies arrays for HowTo schema */
  tools?: string[];
  supplies?: string[];
  /** Hero photo path (under /public). Use real project photography. */
  heroImage?: string;
  /** Alt text describing the hero photo. */
  heroAlt?: string;
}

export const calculatorManifest: CalculatorMeta[] = [
  {
    slug: 'paint-calculator',
    title: 'Paint Calculator',
    seoTitle: 'Paint Calculator — Free Gallons & Coverage Estimator',
    subtitle: 'How much paint do you need? Get exact gallons in seconds.',
    shortDescription: 'Calculate exactly how many gallons of paint you need for any room.',
    metaDescription:
      'Free paint calculator. Enter your room dimensions, doors, windows, and coats — get exact gallons of paint plus cost estimate in seconds.',
    category: 'Paint & Walls',
    targetKeyword: 'paint calculator',
    secondaryKeywords: [
      'how much paint do i need',
      'paint calculator gallons',
      'how much paint for a 12x14 room',
      'how many gallons of paint to paint a bedroom',
    ],
    lastUpdated: '2026-04-15',
    howToSteps: [
      {
        name: 'Measure your room',
        text: 'Measure floor length, width, and wall height in feet. Most rooms are 8 ft tall by default.',
      },
      {
        name: 'Count doors and windows',
        text: 'Each door deducts ~21 sq ft; each window ~15 sq ft. The calculator handles the math.',
      },
      {
        name: 'Choose coats and coverage',
        text: 'Use 2 coats for full coverage, especially over darker colors. Smooth walls cover ~350 sq ft per gallon; textured walls ~275.',
      },
      {
        name: 'Read the result',
        text: "Buy the gallons (and quart, if suggested) shown. Includes a 10% buffer for waste and touch-ups.",
      },
    ],
    faqs: [
      {
        question: 'How much paint do I need for a 12x14 room?',
        answer:
          'A standard 12x14 room with 8-foot ceilings, one door, and two windows needs about 2 gallons for two coats. Add a quart for touch-ups, or buy 3 gallons if you’re also painting the ceiling.',
      },
      {
        question: 'How many coats of paint do I need?',
        answer:
          'Two coats is standard. Three may be needed when painting light over dark, painting fresh drywall (which absorbs heavily), or using thin specialty paints.',
      },
      {
        question: 'Should I buy extra paint?',
        answer:
          'Yes — keep at least a quart for future touch-ups. Paint colors get mixed at the store and can vary slightly between batches if you buy more later.',
      },
      {
        question: 'Does the calculator account for primer?',
        answer:
          'No — primer is a separate calculation but uses similar math. Most modern paints are paint-and-primer combos that skip the separate primer step on previously painted walls.',
      },
    ],
    related: ['drywall-calculator'],
    relatedArticles: [
      { slug: 'how-much-paint-for-12x14-room', title: 'How much paint do I need for a 12x14 room?' },
    ],
    shop: {
      title: 'Shop paint supplies',
      categories: [
        {
          name: 'Interior paint',
          products: [
            { retailer: 'home-depot', productId: 'PAINT-BEHR-MARQUEE-1G', title: 'BEHR Marquee Interior Paint (1 gal)', approxPrice: 47 },
            { retailer: 'lowes', productId: 'PAINT-VALSPAR-REVOLUTION-1G', title: 'Valspar Reserve Paint + Primer (1 gal)', approxPrice: 42 },
            { retailer: 'amazon', productId: 'B07KMSPZQX', title: 'Rust-Oleum Painter\'s Touch (1 qt)', approxPrice: 9 },
          ],
        },
        {
          name: 'Tools',
          products: [
            { retailer: 'home-depot', productId: 'TOOL-PURDY-NYLOX-2.5IN', title: 'Purdy Nylox Glide 2.5" Brush', approxPrice: 14 },
            { retailer: 'home-depot', productId: 'TOOL-WOOSTER-9IN-ROLLER-KIT', title: 'Wooster 9" Roller + Tray Kit', approxPrice: 22 },
            { retailer: 'amazon', productId: 'B00N4TREVA', title: 'ScotchBlue Painter\'s Tape (1.88 in × 60 yd)', approxPrice: 10 },
          ],
        },
      ],
    },
    tools: ['Tape measure', '2.5" angled brush', '9" roller and tray', 'Painter\'s tape'],
    supplies: ['Interior paint', 'Drop cloth', 'Spackle for wall prep'],
  },

  {
    slug: 'mulch-calculator',
    title: 'Mulch & Soil Calculator',
    seoTitle: 'Mulch Calculator — Free Cubic Yards & Bag Count Estimator',
    subtitle: 'How many cubic yards (or bags) of mulch do you need? Find out instantly.',
    shortDescription: 'Get exact cubic yards or bag counts for any garden bed or landscape area.',
    metaDescription:
      'Free mulch calculator. Enter your bed size and depth — get cubic yards, number of bags, and bag-vs-bulk cost comparison in seconds.',
    category: 'Garden & Landscaping',
    targetKeyword: 'mulch calculator',
    secondaryKeywords: [
      'how much mulch do i need',
      'cubic yards of mulch calculator',
      'mulch bags calculator',
      'how many bags of mulch in a yard',
    ],
    lastUpdated: '2026-04-10',
    howToSteps: [
      { name: 'Measure your bed', text: 'Measure length and width of the bed in feet.' },
      { name: 'Choose depth', text: 'Most beds use 2–3 inches. New or weed-prone beds may need 3–4.' },
      { name: 'Compare bag vs bulk', text: 'Below 3 cu yd, bags are usually fine. Above that, bulk is cheaper.' },
    ],
    faqs: [
      {
        question: 'How many bags of mulch do I need?',
        answer:
          'Standard mulch bags are 2 cu ft. A 100 sq ft bed at 3" depth needs about 25 cu ft, or ~13 bags. Always round up.',
      },
      {
        question: 'How deep should mulch be?',
        answer:
          '2–3" is ideal for most beds. Less than 2" won\'t suppress weeds; more than 4" can suffocate roots.',
      },
      {
        question: 'How many cubic feet are in a cubic yard?',
        answer: '1 cubic yard = 27 cubic feet, or about 13.5 standard 2-cubic-foot bags.',
      },
    ],
    related: ['concrete-calculator'],
    shop: {
      title: 'Shop mulch and soil',
      categories: [
        {
          name: 'Mulch',
          products: [
            { retailer: 'home-depot', productId: 'MULCH-VIGORO-BROWN-2CF', title: 'Vigoro Premium Brown Mulch (2 cu ft)', approxPrice: 4.5 },
            { retailer: 'lowes', productId: 'MULCH-SCOTTS-BLACK-2CF', title: 'Scotts Black Mulch (2 cu ft)', approxPrice: 4.25 },
          ],
        },
        {
          name: 'Tools',
          products: [
            { retailer: 'home-depot', productId: 'TOOL-FISKARS-BORDER-EDGER', title: 'Fiskars Steel Lawn Edger', approxPrice: 35 },
            { retailer: 'amazon', productId: 'B07RQTSK4Z', title: 'Heavy-Duty Garden Wheelbarrow (6 cu ft)', approxPrice: 110 },
          ],
        },
      ],
    },
    tools: ['Tape measure', 'Wheelbarrow', 'Garden rake'],
    supplies: ['Mulch (bagged or bulk)', 'Landscape fabric (optional)'],
  },

  {
    slug: 'deck-calculator',
    title: 'Deck Board & Joist Calculator',
    seoTitle: 'Deck Calculator — Free Board, Joist & Fastener Estimator',
    subtitle: 'How many deck boards, joists, and screws for your deck? Calculate now.',
    shortDescription: 'Estimate deck boards, joists, and fasteners for any rectangular deck.',
    metaDescription:
      'Free deck calculator. Enter deck size and board specs — get exact board count, joist count, and fastener boxes plus cost.',
    category: 'Decks & Outdoor',
    targetKeyword: 'deck calculator',
    secondaryKeywords: [
      'how many deck boards do i need',
      'deck board calculator',
      'how many deck screws per board',
      'deck joist calculator',
    ],
    lastUpdated: '2026-04-12',
    howToSteps: [
      { name: 'Measure your deck', text: 'Length runs parallel to your boards. Width is perpendicular.' },
      { name: 'Pick board size', text: 'Standard 5/4 x 6 boards are 5.5" wide. Lengths come in 8, 10, 12, 16 ft.' },
      { name: 'Set joist spacing', text: '16" on-center is standard. Use 12" OC for composite boards or heavy loads.' },
    ],
    faqs: [
      {
        question: 'How many deck boards do I need for a 12x16 deck?',
        answer:
          'A 12x16 deck (192 sq ft) using 5.5"-wide boards in 12-ft lengths needs about 27 boards before waste, or ~29 with a 5% buffer.',
      },
      {
        question: 'How far apart should deck joists be?',
        answer:
          '16" on-center for standard pressure-treated decking. 12" OC for composite, heavy snow loads, or under hot tubs.',
      },
      {
        question: 'How many screws per deck board?',
        answer: 'Two screws per joist crossing. A 12-ft board over 9 joists uses 18 screws.',
      },
    ],
    related: ['concrete-calculator'],
    shop: {
      title: 'Shop deck materials',
      categories: [
        {
          name: 'Decking',
          products: [
            { retailer: 'home-depot', productId: 'DECK-PT-5/4X6X12', title: 'Pressure-Treated 5/4 x 6 x 12 ft Deck Board', approxPrice: 18 },
            { retailer: 'home-depot', productId: 'DECK-TREX-ENHANCE-12', title: 'Trex Enhance Composite Board (12 ft)', approxPrice: 38 },
          ],
        },
        {
          name: 'Fasteners',
          products: [
            { retailer: 'home-depot', productId: 'SCREW-DECKMATE-3IN-350', title: 'Deckmate 3" Deck Screws (350 ct)', approxPrice: 35 },
            { retailer: 'lowes', productId: 'SCREW-CAMO-EDGE-1700', title: 'Camo Edge Hidden Deck Fasteners (1700 ct)', approxPrice: 95 },
          ],
        },
      ],
    },
    tools: ['Circular saw', 'Cordless drill / impact driver', 'Speed square', 'Tape measure'],
    supplies: ['Deck boards', 'Deck screws', 'Joist tape'],
  },

  {
    slug: 'concrete-calculator',
    title: 'Concrete Calculator',
    seoTitle: 'Concrete Calculator — Free Cubic Yards, Bags & Rebar Estimator',
    subtitle: 'Slabs, footings, and sonotubes — get cubic yards and bag counts instantly.',
    shortDescription: 'Calculate concrete volume for slabs, footings, or sonotubes — bags or bulk.',
    metaDescription:
      'Free concrete calculator for slabs, footings, and sonotubes. Get cubic yards, bag counts, and bag-vs-bulk cost in seconds.',
    category: 'Concrete & Masonry',
    targetKeyword: 'concrete calculator',
    secondaryKeywords: [
      'how much concrete do i need',
      'concrete bag calculator',
      'sonotube concrete calculator',
      'concrete slab calculator cubic yards',
    ],
    lastUpdated: '2026-04-08',
    howToSteps: [
      { name: 'Pick a shape', text: 'Slab, footing, or sonotube — each has different math.' },
      { name: 'Enter dimensions', text: 'Slabs: length × width × thickness. Sonotubes: diameter × height.' },
      { name: 'Compare bags vs bulk', text: 'Above ~1 cu yd, ready-mix delivery beats bagging.' },
    ],
    faqs: [
      {
        question: 'How many bags of concrete in a cubic yard?',
        answer:
          '~45 bags of 80 lb pre-mix, ~60 bags of 60 lb, or ~90 bags of 40 lb. Each 80 lb bag yields about 0.6 cu ft.',
      },
      {
        question: 'How thick should a concrete slab be?',
        answer:
          '4" for sidewalks, patios, and shed pads. 6" for driveways and garage floors. 8"+ for areas with heavy vehicle traffic.',
      },
      {
        question: 'When should I buy ready-mix instead of bags?',
        answer:
          'Above 1 cubic yard, ready-mix is usually cheaper and saves enormous labor. Below that, bags are simpler and avoid delivery minimums.',
      },
    ],
    related: ['deck-calculator', 'mulch-calculator'],
    shop: {
      title: 'Shop concrete supplies',
      categories: [
        {
          name: 'Concrete mix',
          products: [
            { retailer: 'home-depot', productId: 'CONCRETE-QUIKRETE-80LB', title: 'Quikrete 80 lb Concrete Mix', approxPrice: 6 },
            { retailer: 'home-depot', productId: 'CONCRETE-SAKRETE-FAST-50LB', title: 'Sakrete Fast-Setting (50 lb)', approxPrice: 8 },
          ],
        },
        {
          name: 'Forms and rebar',
          products: [
            { retailer: 'home-depot', productId: 'SONOTUBE-12IN-4FT', title: 'Sonotube 12" × 4 ft Concrete Form', approxPrice: 22 },
            { retailer: 'home-depot', productId: 'REBAR-1/2IN-20FT', title: '#4 Rebar (1/2") × 20 ft', approxPrice: 9 },
          ],
        },
      ],
    },
    tools: ['Wheelbarrow', 'Mixing hoe', 'Float and trowel', 'Tape measure'],
    supplies: ['Concrete mix or ready-mix delivery', 'Rebar / wire mesh', 'Form lumber'],
  },

  {
    slug: 'drywall-calculator',
    title: 'Drywall (Sheetrock) Calculator',
    seoTitle: 'Drywall Calculator — Free Sheetrock, Screw & Mud Estimator',
    subtitle: 'Sheets, screws, joint compound, and tape — calculate your full drywall order.',
    shortDescription: 'Calculate drywall sheets, screws, mud, and tape for any room.',
    metaDescription:
      'Free drywall calculator. Get exact sheet count, screws, joint compound pails, and tape rolls plus cost estimate.',
    category: 'Walls & Ceilings',
    targetKeyword: 'drywall calculator',
    secondaryKeywords: [
      'how much drywall do i need',
      'sheetrock calculator',
      'drywall sheets calculator',
      'how many drywall screws per sheet',
    ],
    lastUpdated: '2026-04-05',
    howToSteps: [
      { name: 'Sum your areas', text: 'Add wall + ceiling sq ft. Use our paint calculator to compute room areas.' },
      { name: 'Pick sheet size', text: '4×8 is easiest solo. 4×12 means fewer joints but needs 2 people.' },
      { name: 'Buy 1 extra sheet', text: 'Always grab one extra beyond the calculator output for damaged or miscut pieces.' },
    ],
    faqs: [
      {
        question: 'How many drywall sheets do I need?',
        answer:
          'Divide total sq ft by 32 (4×8 sheet) and round up, then add 10% for waste. A 400 sq ft room needs about 14 sheets of 4×8.',
      },
      {
        question: 'How many screws per drywall sheet?',
        answer: 'About 32 screws per 4×8 sheet — every 12" along studs.',
      },
      {
        question: 'How much joint compound do I need?',
        answer: 'One 4.5-quart pail covers ~125 sq ft of drywall (taping, two coats, and finish).',
      },
    ],
    related: ['paint-calculator'],
    shop: {
      title: 'Shop drywall supplies',
      categories: [
        {
          name: 'Drywall sheets',
          products: [
            { retailer: 'home-depot', productId: 'DRYWALL-1/2IN-4X8', title: '1/2 in × 4 × 8 ft Drywall Sheet', approxPrice: 16 },
            { retailer: 'home-depot', productId: 'DRYWALL-PURPLE-4X8', title: 'Mold-Resistant 1/2 in × 4 × 8 (Purple)', approxPrice: 22 },
          ],
        },
        {
          name: 'Finishing supplies',
          products: [
            { retailer: 'home-depot', productId: 'COMPOUND-USG-4.5QT', title: 'USG All-Purpose Joint Compound (4.5 qt)', approxPrice: 18 },
            { retailer: 'home-depot', productId: 'TAPE-PAPER-250FT', title: 'Drywall Paper Tape (250 ft)', approxPrice: 6 },
            { retailer: 'home-depot', productId: 'SCREW-DRYWALL-1.25IN-1LB', title: 'Drywall Screws 1-1/4" (1 lb)', approxPrice: 12 },
          ],
        },
      ],
    },
    tools: ['Drywall T-square', 'Utility knife', 'Drywall screw gun', '12" taping knife'],
    supplies: ['Drywall sheets', 'Joint compound', 'Paper tape', 'Drywall screws'],
  },

  {
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    seoTitle: 'Tile Calculator — Free Tile, Grout & Thinset Estimator With Waste',
    subtitle: 'How many tiles, boxes, grout, and thinset for your floor or wall? Calculate now.',
    shortDescription: 'Calculate tile, grout, and thinset needed — including waste for any layout pattern.',
    metaDescription:
      'Free tile calculator. Enter room size, tile size, and layout pattern — get exact tile boxes, grout, and thinset plus cost estimate.',
    category: 'Floors & Surfaces',
    targetKeyword: 'tile calculator',
    secondaryKeywords: [
      'how many tiles do i need',
      'tile waste calculator',
      'grout calculator',
      'tile boxes calculator',
      'how many tiles in a square foot',
    ],
    lastUpdated: '2026-05-07',
    howToSteps: [
      { name: 'Measure the room', text: 'Length × width of the floor (or wall) you\'re tiling, in feet.' },
      { name: 'Pick tile size', text: 'Common sizes: 12×12, 12×24, 18×18, 24×24. Bigger tile = fewer joints.' },
      { name: 'Choose layout', text: 'Layout drives waste. Straight grid is 7%; herringbone hits 20%.' },
      { name: 'Plug in pricing', text: 'Cost per box, grout bag, and thinset bag — defaults match Home Depot averages.' },
    ],
    faqs: [
      {
        question: 'How many tiles do I need for a 100 square foot room?',
        answer:
          'For 12×12 tile in a straight layout: 100 sq ft × 1.07 waste ÷ 1 sq ft per tile ≈ 107 tiles. Round up to full boxes — typically about 11 boxes of 10.',
      },
      {
        question: 'How much grout do I need?',
        answer:
          'For 1/8" joints: ~150 sq ft per 25 lb bag with 12×12 tile, ~200 sq ft with 18×18. Wider 1/4" joints cut coverage roughly in half.',
      },
      {
        question: 'Why does herringbone need so much extra tile?',
        answer:
          'Every edge tile is a 45° cut, and the offcut is rarely usable. Plan for ~20% waste vs ~7% for a straight grid.',
      },
      {
        question: 'Should I buy extra tile?',
        answer:
          'Yes — keep 2–3 unopened tiles for repairs. Tile dye lots vary, so reordering the same SKU later may not match.',
      },
    ],
    related: ['drywall-calculator', 'paint-calculator'],
    shop: {
      title: 'Shop tile supplies',
      categories: [
        {
          name: 'Setting materials',
          products: [
            { retailer: 'home-depot', productId: 'THINSET-MAPEI-50LB', title: 'Mapei Type 1 Thinset (50 lb)', approxPrice: 22 },
            { retailer: 'home-depot', productId: 'GROUT-CUSTOM-SANDED-25LB', title: 'Custom Sanded Grout (25 lb)', approxPrice: 18 },
            { retailer: 'lowes', productId: 'GROUT-POLYBLEND-PLUS-25LB', title: 'Polyblend Plus Sanded Grout (25 lb)', approxPrice: 19 },
          ],
        },
        {
          name: 'Tools',
          products: [
            { retailer: 'home-depot', productId: 'TROWEL-NOTCHED-1/2IN', title: '1/2" Notched Trowel', approxPrice: 14 },
            { retailer: 'home-depot', productId: 'SAW-TILE-WET-BREAKER-12IN', title: '12 in Tile Wet Saw', approxPrice: 110 },
            { retailer: 'amazon', productId: 'B07MN3WX7H', title: 'Tile Spacers Variety Pack (1/16, 1/8, 3/16, 1/4)', approxPrice: 12 },
          ],
        },
      ],
    },
    tools: ['Wet saw or manual tile cutter', 'Notched trowel', 'Grout float', 'Tile spacers', 'Bucket and sponge'],
    supplies: ['Tile', 'Thinset mortar', 'Grout', 'Cement backer board (for floors)'],
  },

  {
    slug: 'fence-calculator',
    title: 'Fence Calculator',
    seoTitle: 'Fence Calculator — Free Panel, Post & Concrete Estimator',
    subtitle: 'How many panels, posts, and bags of concrete? Calculate your full fence build.',
    shortDescription: 'Estimate fence panels, posts, concrete bags, and gate hardware for any yard.',
    metaDescription:
      'Free fence calculator. Enter length, height, and gates — get exact panels, posts, concrete, and total cost in seconds.',
    category: 'Decks & Outdoor',
    targetKeyword: 'fence calculator',
    secondaryKeywords: [
      'how many fence panels do i need',
      'fence post calculator',
      'fence cost calculator',
      'how much fence do i need',
      'privacy fence calculator',
    ],
    lastUpdated: '2026-05-07',
    howToSteps: [
      { name: 'Measure the run', text: 'Total fence length in feet, including the space gates will occupy.' },
      { name: 'Pick height & panel size', text: '6 ft privacy with 8 ft panels is the most common build.' },
      { name: 'Add gates', text: 'Each gate replaces a section of fence and adds an extra post.' },
      { name: 'Verify with code', text: 'Permits often required for fences over 6 ft. Check your jurisdiction.' },
    ],
    faqs: [
      {
        question: 'How many fence posts do I need for 100 feet?',
        answer:
          'For 100 ft of 8-ft panels: 13 panels and 14 posts (one between each panel + end posts). Add one extra post per gate.',
      },
      {
        question: 'How deep should fence posts be?',
        answer:
          'At least 1/3 of the post above-ground (so 30" deep for a 6 ft fence). In freezing climates, set posts below the frost line — usually 36–48".',
      },
      {
        question: 'How many bags of concrete per fence post?',
        answer: 'Two 50–80 lb bags per hole is standard. Use fast-setting mix to skip mixing — pour dry, add water.',
      },
      {
        question: 'What is the cheapest fence material?',
        answer:
          'Pressure-treated wood panels are the cheapest upfront ($40–80/panel). Vinyl costs more but lasts longer with no painting.',
      },
    ],
    related: ['deck-calculator', 'concrete-calculator'],
    shop: {
      title: 'Shop fence materials',
      categories: [
        {
          name: 'Panels',
          products: [
            { retailer: 'home-depot', productId: 'FENCE-VINYL-PRIVACY-6X8', title: 'Vinyl Privacy Fence Panel (6×8)', approxPrice: 95 },
            { retailer: 'home-depot', productId: 'FENCE-PT-DOG-EAR-6X8', title: 'Pressure-Treated Dog-Ear Panel (6×8)', approxPrice: 65 },
            { retailer: 'lowes', productId: 'FENCE-CEDAR-PRIVACY-6X8', title: 'Cedar Privacy Fence Panel', approxPrice: 110 },
          ],
        },
        {
          name: 'Posts & concrete',
          products: [
            { retailer: 'home-depot', productId: 'POST-PT-4X4X8', title: 'Pressure-Treated 4×4 × 8 ft Post', approxPrice: 18 },
            { retailer: 'home-depot', productId: 'CONCRETE-FAST-50LB', title: 'Fast-Setting Concrete (50 lb)', approxPrice: 6 },
          ],
        },
      ],
    },
    tools: ['Post-hole digger', 'Level', 'Tape measure', 'Drill / impact driver', 'String line'],
    supplies: ['Fence panels', 'Posts', 'Fast-setting concrete', 'Post caps', 'Gate hardware'],
  },

  {
    slug: 'roofing-calculator',
    title: 'Roofing Calculator',
    seoTitle: 'Roofing Calculator — Free Shingle, Square & Pitch Estimator',
    subtitle: 'How many shingle bundles do you need? Get pitch-corrected roof area in seconds.',
    shortDescription: 'Calculate roofing squares, bundles, underlayment, and nails — pitch-corrected for any roof.',
    metaDescription:
      'Free roofing calculator. Enter footprint and pitch — get exact shingle bundles, underlayment rolls, nails, and total cost.',
    category: 'Roof & Exterior',
    targetKeyword: 'roofing calculator',
    secondaryKeywords: [
      'how many shingles do i need',
      'roofing squares calculator',
      'asphalt shingle calculator',
      'roof bundle calculator',
      'how to calculate roof area',
    ],
    lastUpdated: '2026-05-07',
    howToSteps: [
      { name: 'Measure the footprint', text: 'Length × width of the building footprint — the flat area below the roof.' },
      { name: 'Find the pitch', text: 'Inches of rise per 12 inches of run. 6/12 is common; 12/12 is steep.' },
      { name: 'Pick complexity', text: 'Simple gable = 10% waste · hip = 15% · complex = 20%.' },
      { name: 'Buy by the square', text: 'Shingles are sold by the "square" (100 sq ft). 3 bundles = 1 square.' },
    ],
    faqs: [
      {
        question: 'How many bundles of shingles do I need for a 1,000 sq ft roof?',
        answer:
          'A 1,000 sq ft roof = 10 squares = 30 bundles of architectural shingles, plus a 10–15% waste buffer (33–35 bundles total).',
      },
      {
        question: 'What is a "square" of shingles?',
        answer:
          'One square covers 100 sq ft of roof. Most architectural shingles take 3 bundles per square.',
      },
      {
        question: 'How do I calculate roof pitch from inside the attic?',
        answer:
          'Hold a level horizontally against a rafter. At the 12-inch mark, measure straight down to the rafter — that\'s the rise. So if it\'s 6", you have a 6/12 pitch.',
      },
      {
        question: 'How long does an asphalt shingle roof last?',
        answer:
          'Architectural shingles last 25–30 years. 3-tab last 15–20 years. Premium designer shingles can last 40+ years with proper installation and ventilation.',
      },
    ],
    related: ['siding-calculator', 'drywall-calculator'],
    shop: {
      title: 'Shop roofing materials',
      categories: [
        {
          name: 'Shingles',
          products: [
            { retailer: 'home-depot', productId: 'SHINGLE-OWENS-CORNING-DURATION', title: 'Owens Corning Duration Architectural Shingles', approxPrice: 38 },
            { retailer: 'home-depot', productId: 'SHINGLE-GAF-TIMBERLINE-HDZ', title: 'GAF Timberline HDZ Shingles', approxPrice: 36 },
          ],
        },
        {
          name: 'Underlayment & accessories',
          products: [
            { retailer: 'home-depot', productId: 'UNDERLAYMENT-FELTBUSTER-10SQ', title: 'GAF FeltBuster Synthetic (10 squares)', approxPrice: 130 },
            { retailer: 'home-depot', productId: 'NAILS-ROOFING-1.25IN-5LB', title: 'Galvanized Roofing Nails 1¼" (5 lb)', approxPrice: 32 },
          ],
        },
      ],
    },
    tools: ['Roofing nailer or hammer', 'Roofing knife', 'Chalk line', 'Tape measure', 'Fall harness (8/12+ pitch)'],
    supplies: ['Architectural shingles', 'Synthetic underlayment', 'Roofing nails', 'Drip edge', 'Ridge cap'],
  },

  {
    slug: 'siding-calculator',
    title: 'Siding Calculator',
    seoTitle: 'Siding Calculator — Free Vinyl, HardiePlank & J-Channel Estimator',
    subtitle: 'How many boxes of siding do you need? Plus corner posts, J-channel, and starter strip.',
    shortDescription: 'Calculate vinyl, fiber cement, or wood siding — boxes, accessories, and total cost.',
    metaDescription:
      'Free siding calculator. Enter wall perimeter and openings — get exact siding boxes, corner posts, J-channel, and starter strip estimates.',
    category: 'Roof & Exterior',
    targetKeyword: 'siding calculator',
    secondaryKeywords: [
      'how much siding do i need',
      'vinyl siding calculator',
      'siding squares calculator',
      'how many boxes of siding',
      'house siding cost calculator',
    ],
    lastUpdated: '2026-05-07',
    howToSteps: [
      { name: 'Measure the perimeter', text: 'Add up the lengths of every exterior wall in feet.' },
      { name: 'Set wall height', text: '9 ft for single-story, 18 ft for two-story (combine both floors).' },
      { name: 'Count openings', text: 'Each window deducts ~15 sq ft, each door ~21 sq ft.' },
      { name: 'Pick the material', text: 'Vinyl is cheapest; fiber cement (HardiePlank) lasts longest.' },
    ],
    faqs: [
      {
        question: 'How much siding do I need for a 2,000 sq ft house?',
        answer:
          'A 2,000 sq ft house typically has ~1,800 sq ft of exterior wall (after openings). That\'s 18 squares, or about 9 boxes of vinyl.',
      },
      {
        question: 'How many boxes of vinyl siding per square?',
        answer:
          'Most vinyl siding boxes cover 2 squares (200 sq ft). So 18 squares of wall = 9 boxes.',
      },
      {
        question: 'How much J-channel do I need per window?',
        answer:
          'About 16 linear feet per standard window (3 sides ≈ 13 LF + waste). Doors use ~10 LF (just the top + sides).',
      },
      {
        question: 'Should I install siding myself?',
        answer:
          'Vinyl is DIY-friendly with patience. Fiber cement is heavy, dust-hazardous, and requires specific fasteners — most people hire it out.',
      },
    ],
    related: ['roofing-calculator', 'paint-calculator'],
    shop: {
      title: 'Shop siding materials',
      categories: [
        {
          name: 'Siding',
          products: [
            { retailer: 'home-depot', productId: 'SIDING-VINYL-DOUBLE-4-WHITE', title: 'Vinyl Siding Double 4 (200 sq ft / box)', approxPrice: 95 },
            { retailer: 'home-depot', productId: 'SIDING-HARDIE-LAP-8.25', title: 'James Hardie HardiePlank Lap (160 sq ft)', approxPrice: 220 },
            { retailer: 'lowes', productId: 'SIDING-LP-SMARTSIDE-LAP', title: 'LP SmartSide Lap (engineered wood)', approxPrice: 180 },
          ],
        },
        {
          name: 'Trim & accessories',
          products: [
            { retailer: 'home-depot', productId: 'JCHAN-VINYL-WHITE-12FT', title: 'Vinyl J-Channel White (12 ft)', approxPrice: 12 },
            { retailer: 'home-depot', productId: 'CORNER-VINYL-WHITE-OUTSIDE', title: 'Vinyl Outside Corner Post', approxPrice: 22 },
            { retailer: 'home-depot', productId: 'STARTER-STRIP-VINYL-12FT', title: 'Vinyl Starter Strip (12 ft)', approxPrice: 8 },
          ],
        },
      ],
    },
    tools: ['Tin snips', 'Utility knife', 'Hammer', 'Level', 'Chalk line', 'Snap-lock punch'],
    supplies: ['Siding (vinyl, fiber cement, or wood)', 'Corner posts', 'J-channel', 'Starter strip', 'House wrap'],
  },

  {
    slug: 'gravel-calculator',
    title: 'Gravel & Driveway Base Calculator',
    seoTitle: 'Gravel Calculator — Free Cubic Yards, Tons & Driveway Base Estimator',
    subtitle: 'How many cubic yards or tons of gravel? Compare bag and bulk pricing instantly.',
    shortDescription: 'Calculate gravel by cubic yards, tons, or bags for any driveway, walkway, or pad.',
    metaDescription:
      'Free gravel calculator. Enter area and depth, pick gravel type — get cubic yards, tons, bag count, and bag-vs-bulk cost comparison.',
    category: 'Garden & Landscaping',
    targetKeyword: 'gravel calculator',
    secondaryKeywords: [
      'how much gravel do i need',
      'gravel for driveway calculator',
      'crushed stone calculator',
      'tons of gravel calculator',
      'driveway base calculator',
    ],
    lastUpdated: '2026-05-07',
    howToSteps: [
      { name: 'Measure your area', text: 'Length × width of the driveway, walkway, or pad in feet.' },
      { name: 'Set depth', text: 'Driveway base: 4–6". Walkways: 4". Decorative beds: 2–3".' },
      { name: 'Pick gravel type', text: 'Density varies — pea gravel is lighter than crusher run by ~10%.' },
      { name: 'Compare delivery options', text: 'Above 1 cu yd, bulk is almost always cheaper than bags.' },
    ],
    faqs: [
      {
        question: 'How much does a cubic yard of gravel weigh?',
        answer:
          'Roughly 2,800 lb (1.4 tons) for pea gravel and #57 stone. Crusher run weighs ~3,100 lb (1.55 tons) per cubic yard.',
      },
      {
        question: 'How many tons of gravel do I need for a driveway?',
        answer:
          'A 30 × 12 ft driveway at 4" deep needs about 4.6 cu yd, or ~7 tons of crusher run. Add 5% for compaction loss.',
      },
      {
        question: 'What\'s the difference between #57 stone and crusher run?',
        answer:
          '#57 stone is washed 3/4" angular rock — great drainage, doesn\'t compact. Crusher run includes fines that lock together when compacted, making it the right choice for driveway base.',
      },
      {
        question: 'How deep should driveway gravel be?',
        answer:
          '4 inches minimum for a stable base, 6 inches for soft soil or heavy vehicles. Compact in 2-inch lifts with a plate compactor.',
      },
    ],
    related: ['concrete-calculator', 'mulch-calculator'],
    shop: {
      title: 'Shop gravel and base materials',
      categories: [
        {
          name: 'Bagged stone',
          products: [
            { retailer: 'home-depot', productId: 'GRAVEL-PEA-0.5CF', title: 'Pea Gravel (0.5 cu ft bag)', approxPrice: 5 },
            { retailer: 'home-depot', productId: 'GRAVEL-57-0.5CF', title: '#57 Crushed Stone (0.5 cu ft bag)', approxPrice: 5 },
            { retailer: 'lowes', productId: 'GRAVEL-CRUSHER-0.5CF', title: 'Crusher Run (0.5 cu ft bag)', approxPrice: 4.75 },
          ],
        },
        {
          name: 'Tools',
          products: [
            { retailer: 'home-depot', productId: 'COMPACTOR-WACKER-PLATE', title: 'Plate Compactor (rental sku)', approxPrice: 75 },
            { retailer: 'home-depot', productId: 'TOOL-LANDSCAPE-RAKE', title: 'Razor-Back Landscape Rake', approxPrice: 42 },
          ],
        },
      ],
    },
    tools: ['Tape measure', 'Wheelbarrow', 'Landscape rake', 'Plate compactor (for driveway base)'],
    supplies: ['Gravel (bagged or bulk)', 'Landscape fabric (under decorative gravel)'],
  },
];

/** Lookup helper for the dynamic route. */
export function getCalculatorBySlug(slug: string): CalculatorMeta | undefined {
  return calculatorManifest.find((c) => c.slug === slug);
}
