'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Was-this-helpful thumbs up / thumbs down at the bottom of every result panel.
 *
 * Local-only for now — logs to GA4 if available, console otherwise. No backend.
 * The "thank you" state shows immediately and locks further clicks; that's
 * intentional, we don't want users to "test" both buttons and skew metrics.
 */

export interface FeedbackButtonProps {
  /** Calculator slug — used in the GA event so we can break out per-tool. */
  calculator: string;
}

type State = 'idle' | 'positive' | 'negative';

export function FeedbackButton({ calculator }: FeedbackButtonProps) {
  const [state, setState] = useState<State>('idle');

  const onClick = (vote: 'positive' | 'negative') => () => {
    if (state !== 'idle') return;
    setState(vote);
    track('feedback_vote', { calculator, vote });
  };

  return (
    <div
      className="rounded-lg border border-border bg-card p-4 no-print"
      aria-live="polite"
    >
      {state === 'idle' ? (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-medium text-foreground">Was this calculation helpful?</p>
          <div className="flex gap-2">
            <FeedbackBtn label="Yes" onClick={onClick('positive')} icon={<ThumbUpIcon />} />
            <FeedbackBtn label="No" onClick={onClick('negative')} icon={<ThumbDownIcon />} />
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-full',
              state === 'positive'
                ? 'bg-forest-50 text-forest-800 border border-forest-200'
                : 'bg-warmgray-100 text-warmgray-700 border border-warmgray-200'
            )}
          >
            {state === 'positive' ? <ThumbUpIcon /> : <ThumbDownIcon />}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Thanks for the feedback!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {state === 'positive'
                ? 'Glad it helped. We appreciate you using HomeRenoCalc.'
                : (
                  <>
                    Sorry it missed. Tell us what was off:{' '}
                    <a
                      href={`mailto:corrections@homerenocalc.com?subject=${encodeURIComponent(`Feedback: ${calculator}`)}`}
                      className="underline underline-offset-2 hover:text-foreground"
                    >
                      corrections@homerenocalc.com
                    </a>
                    .
                  </>
                )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackBtn({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Mark as ${label.toLowerCase()}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-warmgray-50 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-warmgray-100 hover:border-forest-200 transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}

function track(event: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (gtag) {
    gtag('event', event, params);
  } else {
    console.debug('[HomeRenoCalc] track', event, params);
  }
}

function ThumbUpIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
      <path d="M5.5 14V7M5.5 7V4.5a2 2 0 0 1 2-2l.5 4h3.5a1.5 1.5 0 0 1 1.49 1.66l-.6 5A1.5 1.5 0 0 1 10.4 14H5.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7h2v7H2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
      <path d="M10.5 2v7M10.5 9v2.5a2 2 0 0 1-2 2L8 9.5H4.5a1.5 1.5 0 0 1-1.49-1.66l.6-5A1.5 1.5 0 0 1 5.1 1.5H10.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2h-2v7h2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
