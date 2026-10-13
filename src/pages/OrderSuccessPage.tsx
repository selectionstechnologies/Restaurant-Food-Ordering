import { motion } from 'framer-motion';
import { Clock, Copy, Home, MapPin, ReceiptText, Store, UtensilsCrossed } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { OrderSummary } from '../components/OrderSummary';
import { useToast } from '../context/ToastContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatDateTime } from '../utils/format';
import { findOrder, getLatestOrder } from '../utils/order';

function SuccessIllustration() {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 14, stiffness: 180 }}
      className="relative mx-auto h-40 w-40"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-olive-100" />
      <div className="absolute inset-4 rounded-full bg-olive-200" />
      <svg viewBox="0 0 120 120" className="absolute inset-0">
        {/* plate */}
        <ellipse cx="60" cy="78" rx="38" ry="10" fill="#FFF9F0" stroke="#64734B" strokeWidth="3" />
        {/* cloche */}
        <path d="M28 74c0-19 14-34 32-34s32 15 32 34z" fill="#E64B3C" />
        <circle cx="60" cy="36" r="5" fill="#E64B3C" />
        {/* check */}
        <motion.path
          d="M47 59l9 9 18-19"
          fill="none"
          stroke="#FFF9F0"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        />
      </svg>
      {['🍕', '🍔', '🥗'].map((emoji, i) => (
        <motion.span
          key={emoji}
          className="absolute text-2xl"
          style={{ left: `${[-8, 82, 40][i]}%`, top: `${[18, 10, -14][i]}%` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.12 }}
        >
          {emoji}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function OrderSuccessPage() {
  usePageMeta('Order Confirmed');
  const location = useLocation();
  const { showToast } = useToast();
  const stateOrderNumber = (location.state as { orderNumber?: string } | null)?.orderNumber;
  const order = useMemo(
    () => (stateOrderNumber ? findOrder(stateOrderNumber) : undefined) ?? getLatestOrder(),
    [stateOrderNumber],
  );

  if (!order) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ReceiptText}
          title="No recent order found"
          description="Once you place a demo order, its confirmation will appear here."
          action={
            <Link to="/menu" className="btn-primary">
              Start an order
            </Link>
          }
        />
      </div>
    );
  }

  const isDelivery = order.customer.fulfillment === 'delivery';
  const [minEta, maxEta] = order.estimatedMinutes;
  const firstName = order.customer.fullName.split(' ')[0];

  const copyOrderNumber = async () => {
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      showToast({ variant: 'success', title: 'Order number copied' });
    } catch {
      showToast({ variant: 'error', title: 'Couldn’t copy', description: 'Please copy it manually.' });
    }
  };

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <SuccessIllustration />
        <h1 className="mt-8 text-4xl font-bold sm:text-5xl">Thank you, {firstName}!</h1>
        <p className="mt-4 text-lg text-charcoal-600">
          Your demo order has been received. {isDelivery ? 'We’ll bring it to your door.' : 'We’ll have it ready for pickup.'}
        </p>
        <p className="mt-2 text-sm text-charcoal-500">
          This is a portfolio demo — no food will be prepared and no payment was taken.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <div className="space-y-6">
          <div className="card p-6 sm:p-8">
            <p className="text-sm font-medium uppercase tracking-wider text-charcoal-500">Demo order number</p>
            <div className="mt-2 flex items-center gap-3">
              <p className="font-display text-3xl font-bold tracking-wide text-tomato sm:text-4xl">{order.orderNumber}</p>
              <button
                type="button"
                onClick={copyOrderNumber}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-beige"
                aria-label="Copy order number"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm text-charcoal-500">Placed {formatDateTime(order.createdAt)}</p>
            <p className="mt-4 text-sm text-charcoal-600">
              Tip: ask the Savora Food Assistant about this order number any time.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-tomato-50 text-tomato">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-charcoal-500">Estimated {isDelivery ? 'delivery' : 'pickup'} time</p>
                <p className="font-display text-2xl font-bold">
                  {minEta}–{maxEta} min
                </p>
                <p className="mt-1 text-xs text-charcoal-500">Estimate only — actual times may vary.</p>
              </div>
            </div>
            <div className="card flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-olive-50 text-olive">
                {isDelivery ? <MapPin className="h-5 w-5" aria-hidden="true" /> : <Store className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-charcoal-500">{isDelivery ? 'Delivering to' : 'Pickup from'}</p>
                <p className="font-semibold">
                  {isDelivery
                    ? `${order.customer.address}, ${order.customer.city} ${order.customer.postalCode}`
                    : '128 Harvest Lane, Brooklyn'}
                </p>
                <p className="mt-1 text-xs text-charcoal-500">
                  Payment: {order.customer.paymentMethod === 'cod' ? (isDelivery ? 'Cash on delivery' : 'Pay at pickup') : 'Online (demo)'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn-dark">
              <Home className="h-4 w-4" aria-hidden="true" /> Back to Home
            </Link>
            <Link to="/menu" className="btn-outline">
              <UtensilsCrossed className="h-4 w-4" aria-hidden="true" /> Continue Browsing
            </Link>
          </div>
        </div>

        <OrderSummary lines={order.lines} totals={order.totals} isPickup={!isDelivery} title="Your order" />
      </div>
    </div>
  );
}
