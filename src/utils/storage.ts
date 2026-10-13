/** Safe localStorage helpers — storage can be unavailable (private mode, quotas). */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export const STORAGE_KEYS = {
  cart: 'savora:cart',
  promo: 'savora:promo',
  favorites: 'savora:favorites',
  orders: 'savora:orders',
} as const;
