import { AlertTriangle, SearchX } from 'lucide-react';
import { useCallback, useDeferredValue, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { FoodGrid } from '../components/FoodGrid';
import { LoadingState } from '../components/LoadingState';
import { MenuFilters } from '../components/MenuFilters';
import { SectionHeading } from '../components/SectionHeading';
import { categories, isVegetarian, MENU_MAX_PRICE } from '../data/menu';
import { useMenu } from '../hooks/useMenu';
import { usePageMeta } from '../hooks/usePageMeta';
import type { CategoryId, FoodItem, MenuFilterState, SortOption } from '../types';

const SORTS: SortOption[] = ['popular', 'rating', 'price-asc', 'price-desc'];

/** Filter state lives in the URL so it is shareable and survives back/forward navigation. */
function readFilters(params: URLSearchParams): MenuFilterState {
  const category = params.get('category');
  const sort = params.get('sort') as SortOption | null;
  const maxPrice = Number(params.get('max'));
  return {
    query: params.get('q') ?? '',
    category: categories.some((c) => c.id === category) ? (category as CategoryId) : 'all',
    vegetarianOnly: params.get('veg') === '1',
    maxPrice: maxPrice > 0 && maxPrice <= MENU_MAX_PRICE ? maxPrice : MENU_MAX_PRICE,
    sort: sort && SORTS.includes(sort) ? sort : 'popular',
  };
}

function applyFilters(items: FoodItem[], f: MenuFilterState): FoodItem[] {
  const q = f.query.trim().toLowerCase();
  const filtered = items.filter(
    (item) =>
      (f.category === 'all' || item.category === f.category) &&
      (!f.vegetarianOnly || isVegetarian(item)) &&
      item.price <= f.maxPrice &&
      (!q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q))),
  );
  const sorted = [...filtered].sort((a, b) => {
    switch (f.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return b.popularity - a.popularity;
    }
  });
  // Sold-out items sink to the bottom.
  return sorted.sort((a, b) => Number(b.available) - Number(a.available));
}

export function MenuPage() {
  usePageMeta('Menu', 'Browse the full Savora menu — burgers, pizza, pasta, salads, Asian plates, desserts and drinks.');
  const menu = useMenu();
  const [params, setParams] = useSearchParams();
  const filters = readFilters(params);
  const deferredFilters = useDeferredValue(filters);

  const updateFilters = useCallback(
    (patch: Partial<MenuFilterState>) => {
      const next = { ...readFilters(params), ...patch };
      const out = new URLSearchParams();
      if (next.query) out.set('q', next.query);
      if (next.category !== 'all') out.set('category', next.category);
      if (next.vegetarianOnly) out.set('veg', '1');
      if (next.maxPrice < MENU_MAX_PRICE) out.set('max', String(next.maxPrice));
      if (next.sort !== 'popular') out.set('sort', next.sort);
      setParams(out, { replace: true });
    },
    [params, setParams],
  );

  const results = useMemo(() => applyFilters(menu.items, deferredFilters), [menu.items, deferredFilters]);
  const activeCategory = categories.find((c) => c.id === filters.category);

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Our menu"
        title={activeCategory ? activeCategory.name : 'Find your next favorite'}
        description={
          activeCategory
            ? `${activeCategory.description}. Every dish is made to order.`
            : 'Search by dish or ingredient, filter by diet and budget, and add to your cart in one tap.'
        }
      />

      <MenuFilters
        filters={filters}
        onChange={updateFilters}
        onReset={() => setParams(new URLSearchParams(), { replace: true })}
        resultCount={menu.status === 'success' ? results.length : 0}
      />

      <div className="mt-10">
        {menu.status === 'loading' && <LoadingState label="Loading the menu…" />}

        {menu.status === 'error' && (
          <EmptyState
            tone="error"
            icon={AlertTriangle}
            title="Something went wrong"
            description={`${menu.error} Please check your connection and try again.`}
            action={
              <button type="button" onClick={menu.retry} className="btn-primary">
                Try again
              </button>
            }
          />
        )}

        {menu.status === 'success' &&
          (results.length ? (
            <FoodGrid items={results} />
          ) : (
            <EmptyState
              icon={SearchX}
              title="No dishes match your filters"
              description={
                filters.query
                  ? `We couldn’t find anything for “${filters.query}”. Try a different search or loosen your filters.`
                  : 'Try widening the price range or choosing another category.'
              }
              action={
                <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="btn-primary">
                  Clear all filters
                </button>
              }
            />
          ))}
      </div>
    </div>
  );
}
