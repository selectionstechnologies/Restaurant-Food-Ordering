import { AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import { EmptyState } from '../components/EmptyState';
import { useCart } from '../context/CartContext';
import { usePageMeta } from '../hooks/usePageMeta';

export function CartPage() {
  usePageMeta('Your Cart');
  const { lines, clearCart, totals } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!lines.length) {
    return (
      <div className="container-page py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is feeling a little empty"
          description="Good food is just a few taps away. Explore the menu and add something delicious."
          action={
            <>
              <Link to="/menu" className="btn-primary">
                Browse the menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link to="/" className="btn-outline">
                Back to home
              </Link>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Your order</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Shopping Cart</h1>
          <p className="mt-2 text-charcoal-600">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} ready to go
          </p>
        </div>
        {confirmClear ? (
          <div className="flex items-center gap-2" role="group" aria-label="Confirm clearing cart">
            <span className="text-sm text-charcoal-600">Remove all items?</span>
            <button
              type="button"
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
              className="btn bg-tomato-700 py-2 text-cream hover:bg-tomato-800"
            >
              Yes, clear
            </button>
            <button type="button" onClick={() => setConfirmClear(false)} className="btn-ghost py-2">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmClear(true)} className="btn-ghost text-tomato-700">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear cart
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        <div>
          <ul className="space-y-4" aria-label="Cart items">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <CartItem key={line.lineId} line={line} />
              ))}
            </AnimatePresence>
          </ul>
          <Link to="/menu" className="btn-outline mt-8">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Continue Shopping
          </Link>
        </div>

        <div className="lg:sticky lg:top-28">
          <CartSummary>
            <Link to="/checkout" className="btn-primary w-full py-4 text-base">
              Proceed to Checkout <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal-500">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> Demo checkout — no real payment is taken
            </p>
          </CartSummary>
        </div>
      </div>
    </div>
  );
}
