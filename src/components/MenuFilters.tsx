import { Leaf, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useId, useState } from 'react';
import { categories, MENU_MAX_PRICE } from '../data/menu';
import type { CategoryId, MenuFilterState, SortOption } from '../types';
import { cn, currencySymbol } from '../utils/format';

interface MenuFiltersProps {
  filters: MenuFilterState;
  onChange: (patch: Partial<MenuFilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function MenuFilters({ filters, onChange, onReset, resultCount }: MenuFiltersProps) {
  const [showMore, setShowMore] = useState(false);
  const ids = { search: useId(), sort: useId(), price: useId(), panel: useId() };
  const isFiltered =
    filters.query !== '' || filters.category !== 'all' || filters.vegetarianOnly || filters.maxPrice < MENU_MAX_PRICE;

  return (
    <div className="space-y-5">
      {/* Search + sort */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor={ids.search} className="sr-only">
            Search dishes
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
          <input
            id={ids.search}
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search burgers, pasta, ingredients…"
            className="input rounded-full py-3.5 pl-12 pr-10"
            autoComplete="off"
          />
          {filters.query && (
            <button
              type="button"
              onClick={() => onChange({ query: '' })}
              className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full hover:bg-beige"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <label htmlFor={ids.sort} className="sr-only">
            Sort by
          </label>
          <select
            id={ids.sort}
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            className="input flex-1 cursor-pointer rounded-full py-3.5 sm:w-52"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowMore((v) => !v)}
            aria-expanded={showMore}
            aria-controls={ids.panel}
            className={cn('btn-outline px-4 lg:hidden', showMore && 'border-charcoal bg-white')}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Filters</span>
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="-mx-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0">
        <div role="radiogroup" aria-label="Filter by category" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {[{ id: 'all' as const, name: 'All dishes' }, ...categories].map((c) => {
            const active = filters.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ category: c.id as CategoryId | 'all' })}
                className={cn(
                  'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition',
                  active
                    ? 'border-charcoal bg-charcoal text-cream'
                    : 'border-charcoal/10 bg-white text-charcoal-700 hover:border-charcoal/40',
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Veg + price */}
      <div
        id={ids.panel}
        className={cn(
          'flex-col gap-4 rounded-3xl bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between lg:flex',
          showMore ? 'flex' : 'hidden',
        )}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <label className="inline-flex cursor-pointer items-center gap-3">
            <span className="relative inline-flex">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={filters.vegetarianOnly}
                onChange={(e) => onChange({ vegetarianOnly: e.target.checked })}
              />
              <span className="h-6 w-11 rounded-full bg-charcoal-200 transition peer-checked:bg-olive peer-focus-visible:ring-2 peer-focus-visible:ring-tomato peer-focus-visible:ring-offset-2" />
              <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              <Leaf className="h-4 w-4 text-olive" aria-hidden="true" /> Vegetarian only
            </span>
          </label>

          <div className="flex items-center gap-3">
            <label htmlFor={ids.price} className="whitespace-nowrap text-sm font-medium">
              Max price
            </label>
            <input
              id={ids.price}
              type="range"
              min={4}
              max={MENU_MAX_PRICE}
              step={1}
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
              className="w-36 accent-tomato sm:w-44"
              aria-valuetext={`${currencySymbol}${filters.maxPrice}`}
            />
            <span className="w-12 text-sm font-semibold tabular-nums">
              {currencySymbol}
              {filters.maxPrice}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <p className="text-sm text-charcoal-600" aria-live="polite">
            <span className="font-semibold text-charcoal">{resultCount}</span> {resultCount === 1 ? 'dish' : 'dishes'}
          </p>
          {isFiltered && (
            <button type="button" onClick={onReset} className="btn-ghost py-2 text-tomato-700">
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
