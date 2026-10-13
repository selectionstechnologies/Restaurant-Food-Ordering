import { Info, Tag, X } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { findPromo } from '../data/promos';
import type { CartTotals } from '../types';
import { validatePromo } from '../utils/cart';
import { config } from '../utils/config';
import { cn, formatPrice } from '../utils/format';

export function TotalsTable({ totals, isPickup = false }: { totals: CartTotals; isPickup?: boolean }) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-charcoal-600">Subtotal ({totals.itemCount} items)</dt>
        <dd className="font-medium tabular-nums">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-olive-700">
          <dt>Discount</dt>
          <dd className="font-medium tabular-nums">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-charcoal-600">{isPickup ? 'Pickup' : 'Delivery fee'}</dt>
        <dd className="font-medium tabular-nums">{totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-charcoal-600">Taxes ({Math.round(config.taxRate * 1000) / 10}%)</dt>
        <dd className="font-medium tabular-nums">{formatPrice(totals.tax)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-charcoal/10 pt-4">
        <dt className="text-base font-semibold">Total</dt>
        <dd className="font-display text-2xl font-bold tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}

export function PromoCodeInput() {
  const { promoCode, applyPromo, removePromo, totals } = useCart();
  const { showToast } = useToast();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const applied = promoCode ? findPromo(promoCode) : undefined;
  const appliedStillValid = promoCode ? validatePromo(promoCode, totals.subtotal) : null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = validatePromo(code, totals.subtotal);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    applyPromo(result.promo.code);
    setError(null);
    setCode('');
    showToast({ variant: 'success', title: `Promo ${result.promo.code} applied`, description: result.promo.description });
  };

  if (applied) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-2xl bg-olive-50 px-4 py-3 text-sm">
          <span className="inline-flex items-center gap-2 font-medium text-olive-800">
            <Tag className="h-4 w-4" aria-hidden="true" /> {applied.code} — {applied.description}
          </span>
          <button
            type="button"
            onClick={removePromo}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-olive-100"
            aria-label="Remove promo code"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {appliedStillValid && !appliedStillValid.ok && (
          <p className="field-error">{appliedStillValid.error}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="promo" className="label">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(null);
          }}
          placeholder="e.g. SAVORA10"
          className={cn('input uppercase placeholder:normal-case', error && 'input-error')}
          aria-invalid={!!error}
          aria-describedby={error ? 'promo-error' : 'promo-hint'}
          autoComplete="off"
        />
        <button type="submit" className="btn-dark shrink-0 px-5">
          Apply
        </button>
      </div>
      {error ? (
        <p id="promo-error" className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <p id="promo-hint" className="mt-1.5 text-xs text-charcoal-500">
          Demo codes: SAVORA10, WELCOME5, FREESHIP
        </p>
      )}
    </form>
  );
}

interface CartSummaryProps {
  children?: ReactNode;
  showPromo?: boolean;
}

export function CartSummary({ children, showPromo = true }: CartSummaryProps) {
  const { totals } = useCart();
  const remainingForFree = config.freeDeliveryThreshold - totals.subtotal;

  return (
    <section aria-labelledby="summary-heading" className="card space-y-6 p-6 sm:p-7">
      <h2 id="summary-heading" className="text-2xl font-bold">
        Order Summary
      </h2>
      {totals.deliveryFee > 0 && remainingForFree > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-2 text-sm text-charcoal-700">
            <Info className="h-4 w-4 text-olive" aria-hidden="true" />
            Add {formatPrice(remainingForFree)} more for free delivery
          </p>
          <div className="h-2 overflow-hidden rounded-full bg-beige">
            <div
              className="h-full rounded-full bg-olive transition-all duration-500"
              style={{ width: `${Math.min(100, (totals.subtotal / config.freeDeliveryThreshold) * 100)}%` }}
            />
          </div>
        </div>
      )}
      {showPromo && <PromoCodeInput />}
      <TotalsTable totals={totals} />
      {children}
    </section>
  );
}
