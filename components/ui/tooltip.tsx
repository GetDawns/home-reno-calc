'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Lightweight tooltip — no Radix dependency for this one.
 *
 * Pattern: a button with an Info icon that toggles a positioned bubble.
 * On mobile, opens on tap and closes on outside tap.
 * On desktop, also opens on hover/focus.
 *
 * Accessibility:
 *  - `aria-describedby` ties button to the tooltip content
 *  - `role="tooltip"` on the bubble
 *  - Closes on Escape
 */
export interface TooltipProps {
  /** Help text shown in the bubble. */
  content: React.ReactNode;
  /** Visible label for the trigger (visually hidden). */
  ariaLabel?: string;
  className?: string;
}

let tooltipIdCounter = 0;

export function Tooltip({ content, ariaLabel = 'More info', className }: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const idRef = React.useRef(`tooltip-${++tooltipIdCounter}`);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-describedby={open ? idRef.current : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
          <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM7.25 11V7h1.5v4h-1.5Zm.75-5.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z" />
        </svg>
      </button>
      {open && (
        <span
          id={idRef.current}
          role="tooltip"
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-60 rounded-md bg-warmgray-900 text-white text-xs leading-relaxed px-3 py-2 shadow-lg animate-fade-in pointer-events-none"
        >
          {content}
          <span className="absolute left-1/2 -translate-x-1/2 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-warmgray-900" />
        </span>
      )}
    </span>
  );
}
