/**
 * Public, non-secret configuration read from Vite environment variables.
 * Never place secret keys in VITE_ variables — they are bundled into the client.
 */
function num(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const config = {
  currency: import.meta.env.VITE_CURRENCY || 'USD',
  locale: import.meta.env.VITE_LOCALE || 'en-US',
  deliveryFee: num(import.meta.env.VITE_DELIVERY_FEE, 3.99),
  freeDeliveryThreshold: num(import.meta.env.VITE_FREE_DELIVERY_THRESHOLD, 40),
  taxRate: num(import.meta.env.VITE_TAX_RATE, 0.08),
  onlinePaymentEnabled: import.meta.env.VITE_ONLINE_PAYMENT_ENABLED === 'true',
  onlinePaymentLabel: import.meta.env.VITE_ONLINE_PAYMENT_LABEL || 'Pay Online',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '15551234567',
} as const;
