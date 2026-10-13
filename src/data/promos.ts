import type { PromoCode } from '../types';

/** Demo promo codes — validated client-side for demonstration only. */
export const promoCodes: PromoCode[] = [
  { code: 'SAVORA10', description: '10% off your order', type: 'percent', value: 10 },
  { code: 'WELCOME5', description: '$5 off orders over $25', type: 'fixed', value: 5, minSubtotal: 25 },
  { code: 'FREESHIP', description: 'Free delivery', type: 'free-delivery', value: 0 },
];

export function findPromo(code: string): PromoCode | undefined {
  return promoCodes.find((p) => p.code === code.trim().toUpperCase());
}
