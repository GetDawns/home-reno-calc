import { type ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Standard calculator input field.
 *
 * Slot pattern: render the input/select as `children`. We handle:
 *  - Label
 *  - Optional tooltip (rendered as info icon next to label)
 *  - Optional example text below the input ("Example: 12 ft × 10 ft bedroom")
 *  - Optional unit suffix or hint
 *
 * Standardizing this across all 7 calculators keeps the form rhythm consistent.
 */
export interface CalculatorFieldProps {
  label: string;
  htmlFor: string;
  /** Helper text directly under the input — e.g., a real-world example. */
  example?: string;
  /** Tooltip text — shown via info icon next to the label. */
  tooltip?: string;
  /** Visual unit suffix (e.g., "ft", "in") — appears as muted text inside grid layouts. */
  unit?: string;
  /** Required indicator (small red asterisk) */
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function CalculatorField({
  label,
  htmlFor,
  example,
  tooltip,
  unit,
  required,
  className,
  children,
}: CalculatorFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-0.5 text-destructive" aria-hidden="true">
              *
            </span>
          )}
          {unit && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({unit})
            </span>
          )}
        </Label>
        {tooltip && <Tooltip content={tooltip} ariaLabel={`Help for ${label}`} />}
      </div>
      {children}
      {example && (
        <p className="text-xs text-muted-foreground italic">{example}</p>
      )}
    </div>
  );
}
