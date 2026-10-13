import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

interface FavoritesContextValue {
  favorites: string[];
  isFavorite: (itemId: string) => boolean;
  /** Returns the new favorite state. */
  toggleFavorite: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = readStorage<unknown>(STORAGE_KEYS.favorites, []);
    return Array.isArray(stored) ? stored.filter((v): v is string => typeof v === 'string') : [];
  });

  useEffect(() => writeStorage(STORAGE_KEYS.favorites, favorites), [favorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = !favorites.includes(id);
      setFavorites((current) => (next ? [...current, id] : current.filter((f) => f !== id)));
      return next;
    },
    [favorites],
  );

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite }), [favorites, isFavorite, toggleFavorite]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
