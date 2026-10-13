import { Minus, Plus, Trash2 } from 'lucide-react';
import { MAX_QUANTITY } from '../context/CartContext';
import { cn } from '../utils/format';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
  /** When true and value is at min=1, the decrement button shows a trash icon and emits 0. */
  allowRemove?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = MAX_QUANTITY,
  size = 'md',
  label = 'Quantity',
  allowRemove = false,
  className,
}: QuantitySelectorProps) {
  const showRemove = allowRemove && value <= 1;
  const btn = cn(
    'grid place-items-center rounded-full transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-40',
    size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
  );

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-full border border-charcoal/10 bg-white p-0.5', className)}
    >
      <button
        type="button"
        className={cn(btn, showRemove && 'text-tomato-700')}
        onClick={() => onChange(showRemove ? 0 : Math.max(min, value - 1))}
        disabled={!showRemove && value <= min}
        aria-label={showRemove ? 'Remove item' : 'Decrease quantity'}
      >
        {showRemove ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>
      <span
        className={cn('min-w-[2rem] text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : 'text-base')}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
