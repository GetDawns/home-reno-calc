import Script from 'next/script';

/**
 * Google Analytics 4 — anonymous, aggregate analytics only.
 *
 * Renders nothing in development or when NEXT_PUBLIC_GA_MEASUREMENT_ID is not
 * set, so launch-day gating is just one env var. Uses next/script with
 * strategy="afterInteractive" so analytics never blocks first paint.
 *
 * Privacy:
 *  - anonymize_ip is the GA4 default and isn't a setting we expose
 *  - We don't attach any user identifiers, calculator inputs, or PII
 *  - Set in .env.production (or Vercel project env): NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXX
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
