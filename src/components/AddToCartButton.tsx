import { AnimatePresence, motion } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAddToCart } from '../hooks/useAddToCart';
import type { FoodItem } from '../types';
import { defaultLineId } from '../utils/cart';
import { cn } from '../utils/format';
import { QuantitySelector } from './QuantitySelector';

interface AddToCartButtonProps {
  item: FoodItem;
  /** "quick" swaps to quantity controls once the item is in the cart (used on cards). */
  mode?: 'quick' | 'button';
  /** Options used in "button" mode (details page). */
  quantity?: number;
  sizeId?: string;
  addOnIds?: string[];
  instructions?: string;
  label?: string;
  className?: string;
  onAdded?: () => void;
}

export function AddToCartButton({
  item,
  mode = 'quick',
  quantity = 1,
  sizeId,
  addOnIds,
  instructions,
  label = 'Add to Cart',
  className,
  onAdded,
}: AddToCartButtonProps) {
  const { getLineQuantity, setQuantity } = useCart();
  const addToCart = useAddToCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const t = window.setTimeout(() => setJustAdded(false), 1400);
    return () => window.clearTimeout(t);
  }, [justAdded]);

  if (!item.available) {
    return (
      <button type="button" disabled className={cn('btn bg-beige text-charcoal-500', className)}>
        Sold out
      </button>
    );
  }

  const lineId = defaultLineId(item);
  const inCart = getLineQuantity(lineId);

  if (mode === 'quick' && inCart > 0) {
    return (
      <QuantitySelector
        size="sm"
        value={inCart}
        allowRemove
        label={`${item.name} quantity in cart`}
        onChange={(q) => setQuantity(lineId, q)}
        className={className}
      />
    );
  }

  const handleAdd = () => {
    const ok = addToCart({ itemId: item.id, quantity, sizeId, addOnIds, instructions });
    if (ok) {
      setJustAdded(true);
      onAdded?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn('btn-primary relative overflow-hidden', mode === 'quick' && 'px-4 py-2.5', className)}
      aria-label={mode === 'quick' ? `Add ${item.name} to cart` : undefined}
    >
      <AnimatePresence mode="wait" initial={false}>
        {justAdded ? (
          <motion.span
            key="added"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <Check className="h-4 w-4" aria-hidden="true" /> Added
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            className="inline-flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" /> {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
