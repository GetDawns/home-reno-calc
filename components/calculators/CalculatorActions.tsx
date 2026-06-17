'use client';

import { Button } from '@/components/ui/button';

/**
 * Action bar at the bottom of every calculator's input panel.
 *
 * Why it exists when calculations are real-time:
 *  - On mobile, the result panel is below the form. The "Calculate" button
 *    smooth-scrolls to the result so users see what they just generated.
 *  - The Reset button is the killer feature when users have over-tweaked
 *    inputs and want to start over.
 *  - Together they give the page a clear sense of "I did the thing."
 */
export interface CalculatorActionsProps {
  onReset: () => void;
  /** ID of the result panel — used to scroll into view on mobile. */
  resultPanelId: string;
}

export function CalculatorActions({ onReset, resultPanelId }: CalculatorActionsProps) {
  const scrollToResult = () => {
    const el = document.getElementById(resultPanelId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 no-print">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onReset}
        className="sm:w-auto"
      >
        <ResetIcon />
        Reset to defaults
      </Button>
      <Button
        type="button"
        size="lg"
        onClick={scrollToResult}
        className="sm:w-auto sm:ml-auto"
      >
        <CalculateIcon />
        Calculate
      </Button>
    </div>
  );
}

function ResetIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 7a6 6 0 0 1 10.5-4M14 9A6 6 0 0 1 3.5 13" />
      <path d="M2 3v4h4M14 13V9h-4" />
    </svg>
  );
}

function CalculateIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="2" width="10" height="12" rx="1.5" />
      <path d="M5.5 5h5M5.5 8h.01M8 8h.01M10.5 8h.01M5.5 11h5" />
    </svg>
  );
}
