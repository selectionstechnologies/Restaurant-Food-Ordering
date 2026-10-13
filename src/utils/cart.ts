import { getItemById } from '../data/menu';
import { findPromo } from '../data/promos';
import type { CartLine, CartTotals, FoodItem, FulfillmentMethod, OrderLine, PromoCode } from '../types';
import { config } from './config';
import { formatPrice } from './format';

const round = (n: number) => Math.round(n * 100) / 100;

export function buildLineId(itemId: string, sizeId?: string, addOnIds: string[] = [], instructions = ''): string {
  return [itemId, sizeId ?? '', [...addOnIds].sort().join('+'), instructions.trim().toLowerCase()].join('|');
}

/** Default line id for an item added without customization (used by quick-add controls). */
export function defaultLineId(item: FoodItem): string {
  return buildLineId(item.id, item.sizes?.[0]?.id);
}

export function getUnitPrice(item: FoodItem, sizeId?: string, addOnIds: string[] = []): number {
  const size = item.sizes?.find((s) => s.id === sizeId);
  const addOns = item.addOns?.filter((a) => addOnIds.includes(a.id)) ?? [];
  return round(item.price + (size?.priceDelta ?? 0) + addOns.reduce((sum, a) => sum + a.price, 0));
}

export function getLineUnitPrice(line: CartLine): number {
  const item = getItemById(line.itemId);
  return item ? getUnitPrice(item, line.sizeId, line.addOnIds) : 0;
}

/** Human-readable option labels for a cart line, e.g. ["Large 14\"", "+ Extra mozzarella"]. */
export function getLineOptionLabels(line: CartLine): string[] {
  const item = getItemById(line.itemId);
  if (!item) return [];
  const labels: string[] = [];
  const size = item.sizes?.find((s) => s.id === line.sizeId);
  if (size && item.sizes && item.sizes.length > 1) labels.push(size.label);
  item.addOns?.filter((a) => line.addOnIds.includes(a.id)).forEach((a) => labels.push(`+ ${a.name}`));
  return labels;
}

/** Snapshot cart lines into order lines (names and prices frozen at order time). */
export function toOrderLines(lines: CartLine[]): OrderLine[] {
  return lines.flatMap((line) => {
    const item = getItemById(line.itemId);
    if (!item) return [];
    return [
      {
        itemId: item.id,
        name: item.name,
        image: item.image,
        quantity: line.quantity,
        unitPrice: getLineUnitPrice(line),
        options: getLineOptionLabels(line),
        instructions: line.instructions,
      },
    ];
  });
}

export type PromoResult = { ok: true; promo: PromoCode } | { ok: false; error: string };

export function validatePromo(code: string, subtotal: number): PromoResult {
  if (!code.trim()) return { ok: false, error: 'Please enter a promo code.' };
  const promo = findPromo(code);
  if (!promo) return { ok: false, error: 'That code isn’t valid. Try SAVORA10, WELCOME5 or FREESHIP.' };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { ok: false, error: `This code requires a subtotal of at least ${formatPrice(promo.minSubtotal)}.` };
  }
  return { ok: true, promo };
}

export function calculateTotals(
  lines: CartLine[],
  options: { promoCode?: string | null; fulfillment?: FulfillmentMethod } = {},
): CartTotals {
  const fulfillment = options.fulfillment ?? 'delivery';
  const subtotal = round(lines.reduce((sum, line) => sum + getLineUnitPrice(line) * line.quantity, 0));
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const promoCheck = options.promoCode ? validatePromo(options.promoCode, subtotal) : null;
  const promo = promoCheck?.ok ? promoCheck.promo : null;

  let discount = 0;
  if (promo?.type === 'percent') discount = round((subtotal * promo.value) / 100);
  if (promo?.type === 'fixed') discount = Math.min(promo.value, subtotal);

  let deliveryFee = 0;
  if (fulfillment === 'delivery' && subtotal > 0) {
    const qualifiesForFree = subtotal >= config.freeDeliveryThreshold || promo?.type === 'free-delivery';
    deliveryFee = qualifiesForFree ? 0 : config.deliveryFee;
  }

  const tax = round((subtotal - discount) * config.taxRate);
  const total = round(subtotal - discount + deliveryFee + tax);

  return { subtotal, discount: round(discount), deliveryFee, tax, total, itemCount };
}
