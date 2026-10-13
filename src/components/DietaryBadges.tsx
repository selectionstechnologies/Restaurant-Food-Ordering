import { Flame, Leaf, Sprout, WheatOff } from 'lucide-react';
import type { DietaryTag } from '../types';
import { cn } from '../utils/format';

const meta: Record<DietaryTag, { label: string; className: string; Icon: typeof Leaf } | null> = {
  vegetarian: { label: 'Vegetarian', className: 'bg-olive-100 text-olive-800', Icon: Leaf },
  vegan: { label: 'Vegan', className: 'bg-olive-600 text-cream', Icon: Sprout },
  'gluten-free': { label: 'Gluten-free', className: 'bg-beige text-charcoal-800', Icon: WheatOff },
  spicy: { label: 'Spicy', className: 'bg-tomato-50 text-tomato-700', Icon: Flame },
  'dairy-free': null,
};

export function DietaryBadges({ tags, max, className }: { tags: DietaryTag[]; max?: number; className?: string }) {
  // Vegan implies vegetarian — avoid showing both.
  const visible = tags.filter((t) => meta[t] && !(t === 'vegetarian' && tags.includes('vegan'))).slice(0, max);
  if (!visible.length) return null;
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)} aria-label="Dietary information">
      {visible.map((tag) => {
        const m = meta[tag]!;
        return (
          <li key={tag} className={cn('chip', m.className)}>
            <m.Icon className="h-3 w-3" aria-hidden="true" />
            {m.label}
          </li>
        );
      })}
    </ul>
  );
}
