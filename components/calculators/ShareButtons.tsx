'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Share buttons that live at the bottom of every result panel.
 *
 * The share text is composed from the calculator title + a short result summary
 * passed in by the parent calculator. Buttons:
 *
 *  - X / Twitter
 *  - Facebook
 *  - Email
 *  - Copy link
 *
 * Buttons are progressively enhanced — they degrade to a no-op if window/
 * navigator APIs aren't available (so this stays SSR-safe).
 */

export interface ShareButtonsProps {
  /** Calculator title — used in the prefilled tweet/email subject. */
  title: string;
  /** One-line summary of the result (e.g., "Estimated 3 gallons of paint, $105"). */
  summary: string;
}

export function ShareButtons({ title, summary }: ShareButtonsProps) {
  const [url, setUrl] = useState('https://homerenocalc.com');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const tweetText = `${summary} — calculated with the free ${title} at`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const emailSubject = `${title}: ${summary}`;
  const emailBody = `I just used HomeRenoCalc's ${title} and it estimated:\n\n${summary}\n\nTry it yourself: ${url}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const handleCopy = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      track('share_copy_link', { calculator: title });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard rejected — silent. (Old browsers, restricted contexts.)
    }
  }, [url, title]);

  const onShare = (network: string) => () => {
    track(`share_${network}`, { calculator: title });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 no-print">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Share this estimate
      </p>
      <div className="flex flex-wrap gap-2">
        <ShareLink
          href={twitterUrl}
          label="X / Twitter"
          onClick={onShare('twitter')}
          icon={<TwitterIcon />}
        />
        <ShareLink
          href={facebookUrl}
          label="Facebook"
          onClick={onShare('facebook')}
          icon={<FacebookIcon />}
        />
        <ShareLink
          href={emailUrl}
          label="Email"
          onClick={onShare('email')}
          icon={<EmailIcon />}
          target="_self"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-warmgray-50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-warmgray-100 hover:border-forest-200 transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon /> Copied!
            </>
          ) : (
            <>
              <LinkIcon /> Copy link
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ShareLink({
  href,
  label,
  icon,
  onClick,
  target = '_blank',
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  target?: '_blank' | '_self';
}) {
  return (
    <a
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-warmgray-50 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-warmgray-100 hover:border-forest-200 transition-colors"
    >
      {icon}
      {label}
    </a>
  );
}

// Forward to GA4 if available; otherwise log to console for dev.
function track(event: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag('event', event, params);
  } else {
    console.debug('[HomeRenoCalc] track', event, params);
  }
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M9.294 6.928 14.357 1H13.157L8.762 6.147 5.247 1H1.2l5.31 7.78L1.2 15h1.2l4.642-5.435L10.752 15H14.8L9.294 6.928Zm-1.643 1.926-.539-.78L2.832 1.91h1.844l3.456 5.005.539.781 4.49 6.502h-1.844L7.65 8.854Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M16 8a8 8 0 1 0-9.25 7.903v-5.59H4.719V8H6.75V6.237c0-2.005 1.194-3.112 3.022-3.112.875 0 1.79.156 1.79.156v1.969h-1.008c-.994 0-1.304.617-1.304 1.25V8h2.219l-.355 2.313H9.25v5.59A8.001 8.001 0 0 0 16 8Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M7 9a3 3 0 0 0 4.24 0l2-2a3 3 0 0 0-4.24-4.24l-1 1M9 7a3 3 0 0 0-4.24 0l-2 2a3 3 0 0 0 4.24 4.24l1-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-forest-700" aria-hidden="true">
      <path d="m3 8 3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
