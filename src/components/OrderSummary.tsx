import type { ReactNode } from 'react';
import type { CartTotals, OrderLine } from '../types';
import { formatPrice } from '../utils/format';
import { TotalsTable } from './CartSummary';
import { SmartImage } from './SmartImage';

interface OrderSummaryProps {
  lines: OrderLine[];
  totals: CartTotals;
  isPickup?: boolean;
  title?: string;
  children?: ReactNode;
}

/** Itemized order summary used on checkout and the confirmation page. */
export function OrderSummary({ lines, totals, isPickup, title = 'Order Summary', children }: OrderSummaryProps) {
  return (
    <section aria-labelledby="order-summary-heading" className="card p-6 sm:p-7">
      <h2 id="order-summary-heading" className="text-2xl font-bold">
        {title}
      </h2>
      <ul className="mt-5 max-h-80 divide-y divide-charcoal/10 overflow-y-auto pr-1">
        {lines.map((line, i) => (
          <li key={`${line.itemId}-${i}`} className="flex gap-3 py-3">
            <div className="relative shrink-0">
              <SmartImage src={line.image} alt="" wrapperClassName="h-14 w-14 rounded-xl" />
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-charcoal px-1 text-[11px] font-bold text-cream">
                {line.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{line.name}</p>
              {line.options.length > 0 && <p className="text-xs text-charcoal-500">{line.options.join(' · ')}</p>}
              {line.instructions && <p className="truncate text-xs italic text-charcoal-500">“{line.instructions}”</p>}
            </div>
            <p className="text-sm font-semibold tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-charcoal/10 pt-5">
        <TotalsTable totals={totals} isPickup={isPickup} />
      </div>
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
