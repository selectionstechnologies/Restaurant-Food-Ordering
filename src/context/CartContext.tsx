import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getItemById } from '../data/menu';
import type { CartLine, CartTotals } from '../types';
import { buildLineId, calculateTotals } from '../utils/cart';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

export const MAX_QUANTITY = 20;

export interface AddToCartInput {
  itemId: string;
  quantity?: number;
  sizeId?: string;
  addOnIds?: string[];
  instructions?: string;
}

interface CartContextValue {
  lines: CartLine[];
  totals: CartTotals;
  promoCode: string | null;
  isDrawerOpen: boolean;
  /** Increments on every add — used to trigger badge animations. */
  addPulse: number;
  addItem: (input: AddToCartInput) => boolean;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => void;
  removePromo: () => void;
  getLineQuantity: (lineId: string) => number;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Drops malformed lines and lines whose items no longer exist in the menu data. */
function sanitize(lines: unknown): CartLine[] {
  if (!Array.isArray(lines)) return [];
  return lines
    .filter(
      (l): l is CartLine =>
        !!l && typeof l.itemId === 'string' && typeof l.lineId === 'string' && !!getItemById(l.itemId) && l.quantity > 0,
    )
    .map((l) => ({ ...l, addOnIds: Array.isArray(l.addOnIds) ? l.addOnIds : [] }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => sanitize(readStorage<unknown>(STORAGE_KEYS.cart, [])));
  const [promoCode, setPromoCode] = useState<string | null>(() => readStorage<string | null>(STORAGE_KEYS.promo, null));
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [addPulse, setAddPulse] = useState(0);

  useEffect(() => writeStorage(STORAGE_KEYS.cart, lines), [lines]);
  useEffect(() => writeStorage(STORAGE_KEYS.promo, promoCode), [promoCode]);

  // Keep the cart in sync across browser tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.cart) setLines(sanitize(readStorage<unknown>(STORAGE_KEYS.cart, [])));
      if (e.key === STORAGE_KEYS.promo) setPromoCode(readStorage<string | null>(STORAGE_KEYS.promo, null));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((input: AddToCartInput) => {
    const item = getItemById(input.itemId);
    if (!item || !item.available) return false;
    const sizeId = input.sizeId ?? item.sizes?.[0]?.id;
    const addOnIds = input.addOnIds ?? [];
    const instructions = input.instructions?.trim() || undefined;
    const lineId = buildLineId(item.id, sizeId, addOnIds, instructions);
    const quantity = Math.max(1, input.quantity ?? 1);

    setLines((current) => {
      const existing = current.find((l) => l.lineId === lineId);
      if (existing) {
        return current.map((l) =>
          l.lineId === lineId ? { ...l, quantity: Math.min(MAX_QUANTITY, l.quantity + quantity) } : l,
        );
      }
      return [
        ...current,
        { lineId, itemId: item.id, quantity: Math.min(MAX_QUANTITY, quantity), sizeId, addOnIds, instructions },
      ];
    });
    setAddPulse((n) => n + 1);
    return true;
  }, []);

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((l) => l.lineId !== lineId)
        : current.map((l) => (l.lineId === lineId ? { ...l, quantity: Math.min(MAX_QUANTITY, quantity) } : l)),
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((current) => current.filter((l) => l.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
    setPromoCode(null);
  }, []);

  const applyPromo = useCallback((code: string) => setPromoCode(code.trim().toUpperCase()), []);
  const removePromo = useCallback(() => setPromoCode(null), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const getLineQuantity = useCallback(
    (lineId: string) => lines.find((l) => l.lineId === lineId)?.quantity ?? 0,
    [lines],
  );

  const totals = useMemo(() => calculateTotals(lines, { promoCode }), [lines, promoCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totals,
      promoCode,
      isDrawerOpen,
      addPulse,
      addItem,
      setQuantity,
      removeLine,
      clearCart,
      applyPromo,
      removePromo,
      getLineQuantity,
      openDrawer,
      closeDrawer,
    }),
    [
      lines, totals, promoCode, isDrawerOpen, addPulse, addItem, setQuantity, removeLine,
      clearCart, applyPromo, removePromo, getLineQuantity, openDrawer, closeDrawer,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
