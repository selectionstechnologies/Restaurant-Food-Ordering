import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const HIDDEN_ON = ['/cart', '/checkout', '/order-success'];

export function FloatingCartButton() {
  const { totals, openDrawer, addPulse } = useCart();
  const { pathname } = useLocation();
  const visible = totals.itemCount > 0 && !HIDDEN_ON.includes(pathname);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={openDrawer}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full bg-charcoal py-2.5 pl-3 pr-5 text-cream shadow-lift transition hover:bg-charcoal-800 sm:bottom-6 sm:left-auto sm:right-28"
          aria-label={`View cart: ${totals.itemCount} items, ${formatPrice(totals.subtotal)}`}
        >
          <motion.span
            key={addPulse}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 0.4 }}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-tomato"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-cream px-1 text-[11px] font-bold text-charcoal">
              {totals.itemCount}
            </span>
          </motion.span>
          <span className="text-sm font-semibold tabular-nums">{formatPrice(totals.subtotal)}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
