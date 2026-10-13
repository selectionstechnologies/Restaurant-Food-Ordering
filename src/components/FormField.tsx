import type { ReactNode } from 'react';
import { cn } from '../utils/format';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + error/hint wrapper. Controls should set aria-describedby={`${id}-msg`}. */
export function FormField({ id, label, error, hint, optional, className, children }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
        {optional && <span className="ml-1 font-normal text-charcoal-500">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className={cn('mt-1.5 text-xs text-charcoal-500')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
