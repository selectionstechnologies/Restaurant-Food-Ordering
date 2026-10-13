import { useCallback, useEffect, useState } from 'react';
import { menuItems } from '../data/menu';
import type { FoodItem } from '../types';

type MenuState =
  | { status: 'loading'; items: FoodItem[] }
  | { status: 'success'; items: FoodItem[] }
  | { status: 'error'; items: FoodItem[]; error: string };

/**
 * Loads the menu. The data is local, but the hook simulates a short network delay so the
 * loading skeletons and error states are exercised exactly as they would be with a real API.
 * Append `?simulateError=1` to the URL to preview the error state.
 */
export function useMenu(delay = 450) {
  const [state, setState] = useState<MenuState>({ status: 'loading', items: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setState({ status: 'loading', items: [] });
    const shouldFail = attempt === 0 && new URLSearchParams(window.location.search).has('simulateError');
    const timer = window.setTimeout(() => {
      if (shouldFail) {
        setState({ status: 'error', items: [], error: 'We couldn’t load the menu right now.' });
      } else {
        setState({ status: 'success', items: menuItems });
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [attempt, delay]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
