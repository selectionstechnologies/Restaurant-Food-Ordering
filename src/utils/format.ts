import { config } from './config';

const currencyFormatter = new Intl.NumberFormat(config.locale, {
  style: 'currency',
  currency: config.currency,
});

export function formatPrice(amount: number): string {
  return currencyFormatter.format(amount);
}

/** Currency symbol only, e.g. "$" — used in compact UI like the price slider. */
export const currencySymbol =
  currencyFormatter.formatToParts(0).find((p) => p.type === 'currency')?.value ?? '$';

export function formatTime(date: Date): string {
  return date.toLocaleTimeString(config.locale, { hour: 'numeric', minute: '2-digit' });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(config.locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
