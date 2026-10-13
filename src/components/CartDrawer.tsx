import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { CartItem } from './CartItem';

/** Slide-in mini cart opened from the navbar. */
export function CartDrawer() {
  const { isDrawerOpen, closeDrawer, lines, totals } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => closeDrawer(), [location.pathname, closeDrawer]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
      // Simple focus trap
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.();
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-lift outline-none"
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <h2 id="cart-drawer-title" className="text-2xl font-bold">
                Your Cart
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-beige"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-beige text-olive">
                  <ShoppingBag className="h-9 w-9" aria-hidden="true" />
                </span>
                <p className="font-display text-xl font-bold">Your cart is hungry</p>
                <p className="text-sm text-charcoal-600">Add a few favorites and they’ll show up here.</p>
                <Link to="/menu" className="btn-primary mt-2">
                  Browse the menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartItem key={line.lineId} line={line} compact onNavigate={closeDrawer} />
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="space-y-3 border-t border-charcoal/10 bg-white px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-charcoal-600">Subtotal</span>
                    <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(totals.subtotal)}</span>
                  </div>
                  <p className="text-xs text-charcoal-500">Delivery, taxes and promos are calculated at checkout.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/cart" className="btn-outline">
                      View cart
                    </Link>
                    <Link to="/checkout" className="btn-primary">
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
