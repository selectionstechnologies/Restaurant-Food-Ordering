import { useCallback } from 'react';
import { useCart, type AddToCartInput } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getItemById } from '../data/menu';

/** Adds an item to the cart and shows consistent success / error feedback. */
export function useAddToCart() {
  const { addItem } = useCart();
  const { showToast } = useToast();

  return useCallback(
    (input: AddToCartInput) => {
      const item = getItemById(input.itemId);
      const ok = addItem(input);
      if (ok && item) {
        const qty = input.quantity ?? 1;
        showToast({
          variant: 'success',
          title: 'Added to your cart',
          description: `${qty} × ${item.name}`,
          action: { label: 'View cart', to: '/cart' },
        });
      } else {
        showToast({
          variant: 'error',
          title: 'Unavailable',
          description: item ? `${item.name} is currently sold out.` : 'This item could not be found.',
        });
      }
      return ok;
    },
    [addItem, showToast],
  );
}
