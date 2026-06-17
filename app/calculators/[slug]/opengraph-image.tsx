import { ImageResponse } from 'next/og';
import { getCalculatorBySlug } from '@/content/calculators/manifest';

/**
 * Per-calculator Open Graph image (1200×630).
 *
 * Single template that consumes the manifest — all 7 calculators get matching
 * images automatically. New calculators get their OG image for free.
 *
 * Style:
 *   - Warm-white background with soft forest-green and sky-blue corner accents
 *   - Category pill (top-left)
 *   - Big title in dark text
 *   - 2-line description
 *   - Sample-result preview card on the right
 *   - HomeRenoCalc lockup at the bottom
 */

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'HomeRenoCalc — DIY home improvement calculator';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OgImage({ params }: Props) {
  const { slug } = await params;
  const meta = getCalculatorBySlug(slug);

  if (!meta) {
    return new ImageResponse(<DefaultBranding />, size);
  }

  const sampleResult = pickSampleResult(meta.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#fafaf9',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Soft forest accent — bottom-left wedge */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 360,
            height: 360,
            background: 'radial-gradient(ellipse at 0% 100%, #166534 0%, transparent 70%)',
            opacity: 0.08,
            display: 'flex',
          }}
        />
        {/* Subtle sky accent — top-right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 320,
            height: 320,
            background: 'radial-gradient(ellipse at 100% 0%, #0ea5e9 0%, transparent 70%)',
            opacity: 0.07,
            display: 'flex',
          }}
        />

        {/* LEFT — content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '64px 60px',
            width: 720,
            height: '100%',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Top: brand + category */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: '#166534',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 20,
                  fontWeight: 800,
                }}
              >
                HR
              </div>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                }}
              >
                HomeReno
                <span style={{ color: '#166534' }}>Calc</span>
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                borderRadius: 999,
                padding: '6px 14px',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {meta.category}
            </div>
          </div>

          {/* Middle: title + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h1
              style={{
                fontSize: 64,
                lineHeight: 1.05,
                fontWeight: 800,
                color: '#111827',
                margin: 0,
                letterSpacing: '-0.025em',
                display: 'flex',
              }}
            >
              {meta.title}
            </h1>
            <p
              style={{
                fontSize: 26,
                lineHeight: 1.35,
                color: '#57534e',
                margin: 0,
                maxWidth: 600,
                display: 'flex',
              }}
            >
              {meta.shortDescription}
            </p>
          </div>

          {/* Bottom: trust + url */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                fontSize: 18,
                color: '#57534e',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: '#16a34a',
                  }}
                />
                Free · No signup
              </div>
              <span>•</span>
              <span>Instant results</span>
              <span>•</span>
              <span>Print-friendly</span>
            </div>
            <p
              style={{
                fontSize: 18,
                color: '#a8a29e',
                margin: 0,
                display: 'flex',
              }}
            >
              homerenocalc.com/calculators/{meta.slug}
            </p>
          </div>
        </div>

        {/* RIGHT — sample result card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 480,
            padding: '0 56px 0 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              width: 380,
              padding: 28,
              borderRadius: 16,
              background: 'white',
              border: '1px solid #e7e5e4',
              boxShadow: '0 6px 22px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: '#16a34a',
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#166534',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                }}
              >
                Live result
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 12,
                padding: '16px 18px',
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#166534',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                }}
              >
                {sampleResult.label}
              </span>
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: '#111827',
                  letterSpacing: '-0.02em',
                  display: 'flex',
                }}
              >
                {sampleResult.value}
              </span>
              <span
                style={{
                  fontSize: 16,
                  color: '#57534e',
                  display: 'flex',
                }}
              >
                {sampleResult.sub}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                fontSize: 15,
                color: '#44403c',
              }}
            >
              {sampleResult.bullets.map((b) => (
                <div
                  key={b}
                  style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#0ea5e9',
                    }}
                  />
                  <span style={{ display: 'flex' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}

function DefaultBranding() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafaf9',
        fontSize: 64,
        fontWeight: 800,
        color: '#111827',
      }}
    >
      HomeReno
      <span style={{ color: '#166534', marginLeft: 8 }}>Calc</span>
    </div>
  );
}

/**
 * Curated sample results per calculator — written for the OG image.
 * Doesn't need to be a live calculation; just needs to look credible to
 * a user scanning their feed.
 */
function pickSampleResult(slug: string): {
  label: string;
  value: string;
  sub: string;
  bullets: string[];
} {
  switch (slug) {
    case 'paint-calculator':
      return {
        label: "You'll need",
        value: '3 gallons',
        sub: 'Estimated cost: $105',
        bullets: ['12 × 14 ft room', '2 coats + 10% buffer', '+1 quart for touch-ups'],
      };
    case 'mulch-calculator':
      return {
        label: 'Volume',
        value: '1.5 cu yd',
        sub: '~20 bags · or bulk delivery',
        bullets: ['20 × 8 ft bed', '3 in depth', 'Recommendation: bags'],
      };
    case 'deck-calculator':
      return {
        label: 'Materials',
        value: '57 boards',
        sub: 'Estimated cost: $1,109',
        bullets: ['16 × 12 ft deck', '12 joists at 16″ OC', '~1,400 fasteners'],
      };
    case 'concrete-calculator':
      return {
        label: 'Concrete',
        value: '1.3 cu yd',
        sub: '60 bags or ready-mix',
        bullets: ['10 × 10 ft × 4″ slab', '+8 sticks of #4 rebar', 'Recommendation: bulk'],
      };
    case 'drywall-calculator':
      return {
        label: 'Drywall',
        value: '28 sheets',
        sub: 'Total cost: $511',
        bullets: ['800 sq ft', '4 × 8 ft sheets', '+7 pails compound'],
      };
    case 'tile-calculator':
      return {
        label: "You'll need",
        value: '6 boxes',
        sub: '48 tiles total · ~$338',
        bullets: ['10 × 8 ft floor', '12 × 24″ tiles', 'Straight grid · 7% waste'],
      };
    case 'gravel-calculator':
      return {
        label: 'Volume',
        value: '4.7 cu yd',
        sub: '~7.3 tons · ~$255',
        bullets: ['30 × 12 ft × 4″ depth', 'Crusher run base', 'Bulk delivery recommended'],
      };
    case 'fence-calculator':
      return {
        label: 'Materials',
        value: '13 panels',
        sub: '14 posts · 28 concrete bags',
        bullets: ['100 ft × 6 ft fence', '8-ft panels · 1 walk gate', 'Estimated $1,748'],
      };
    case 'roofing-calculator':
      return {
        label: 'Roof size',
        value: '14.7 squares',
        sub: '44 bundles · 1,470 sq ft',
        bullets: ['40 × 30 ft footprint', '6/12 pitch · simple gable', 'Estimated $1,857'],
      };
    case 'siding-calculator':
      return {
        label: 'Siding',
        value: '8 boxes',
        sub: '15.4 squares · vinyl',
        bullets: ['160 ft perimeter · 9 ft tall', '10 windows · 2 doors', 'Estimated $1,212'],
      };
    default:
      return {
        label: "You'll need",
        value: '—',
        sub: 'Open the calculator to see your estimate',
        bullets: ['Free', 'Instant', 'Print-friendly'],
      };
  }
}
