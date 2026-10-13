import { AnimatePresence } from 'framer-motion';
import type { FoodItem } from '../types';
import { cn } from '../utils/format';
import { FoodCard } from './FoodCard';

export function FoodGrid({ items, className }: { items: FoodItem[]; className?: string }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
      <AnimatePresence mode="popLayout">
        {items.map((item, i) => (
          <FoodCard key={item.id} item={item} index={i} />
        ))}
      </AnimatePresence>
    </div>
  );
}
