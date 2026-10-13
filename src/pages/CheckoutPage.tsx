import { ArrowLeft, Loader2, Lock, ShoppingBag } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CHECKOUT_FORM_ID, CheckoutForm } from '../components/CheckoutForm';
import { EmptyState } from '../components/EmptyState';
import { OrderSummary } from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { restaurant } from '../data/restaurant';
import { usePageMeta } from '../hooks/usePageMeta';
import type { CheckoutDetails, FulfillmentMethod, Order } from '../types';
import { calculateTotals, toOrderLines } from '../utils/cart';
import { formatPrice } from '../utils/format';
import { generateOrderNumber, saveOrder } from '../utils/order';

export function CheckoutPage() {
  usePageMeta('Checkout');
  const { lines, promoCode, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('delivery');
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(() => calculateTotals(lines, { promoCode, fulfillment }), [lines, promoCode, fulfillment]);
  const orderLines = useMemo(() => toOrderLines(lines), [lines]);
  const onFulfillmentChange = useCallback((m: FulfillmentMethod) => setFulfillment(m), []);

  const placeOrder = async (details: CheckoutDetails) => {
    if (!lines.length) return;
    setSubmitting(true);
    try {
      // Simulated request — swap for a real API call when a backend is connected.
      await new Promise((r) => setTimeout(r, 1200));
      const customer: CheckoutDetails =
        details.fulfillment === 'pickup'
          ? { ...details, address: undefined, city: undefined, postalCode: undefined, deliveryInstructions: undefined }
          : details;
      const order: Order = {
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toISOString(),
        customer,
        lines: orderLines,
        totals,
        promoCode: promoCode ?? undefined,
        estimatedMinutes: details.fulfillment === 'delivery' ? restaurant.delivery.estimate : restaurant.delivery.pickupEstimate,
      };
      saveOrder(order);
      clearCart();
      navigate('/order-success', { state: { orderNumber: order.orderNumber }, replace: true });
    } catch {
      showToast({ variant: 'error', title: 'Could not place order', description: 'Please try again in a moment.' });
      setSubmitting(false);
    }
  };

  if (!lines.length) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Nothing to check out yet"
          description="Your cart is empty. Add a few dishes and come back to complete your order."
          action={
            <Link to="/menu" className="btn-primary">
              Browse the menu
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-tomato">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to cart
      </Link>
      <div className="mb-10">
        <h1 className="text-4xl font-bold sm:text-5xl">Checkout</h1>
        <p className="mt-2 text-charcoal-600">
          Almost there! <span className="chip ml-1 bg-tomato-50 text-tomato-700">Demo checkout</span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <CheckoutForm onSubmit={placeOrder} onFulfillmentChange={onFulfillmentChange} />

        <div className="lg:sticky lg:top-28">
          <OrderSummary lines={orderLines} totals={totals} isPickup={fulfillment === 'pickup'}>
            <button
              type="submit"
              form={CHECKOUT_FORM_ID}
              disabled={submitting}
              className="btn-primary w-full py-4 text-base"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Placing order…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" aria-hidden="true" /> Place Demo Order · {formatPrice(totals.total)}
                </>
              )}
            </button>
            <p className="mt-3 text-center text-xs text-charcoal-500">
              By placing this demo order you agree that no real food will be prepared or delivered.
            </p>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
