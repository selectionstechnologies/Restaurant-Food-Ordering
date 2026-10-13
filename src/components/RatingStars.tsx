import { Star } from 'lucide-react';
import { cn } from '../utils/format';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  compact?: boolean;
  className?: string;
}

export function RatingStars({ rating, reviewCount, compact = false, className }: RatingStarsProps) {
  if (compact) {
    return (
      <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', className)}>
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
        <span>{rating.toFixed(1)}</span>
        {reviewCount !== undefined && <span className="font-normal text-charcoal-500">({reviewCount})</span>}
        <span className="sr-only">out of 5 stars</span>
      </span>
    );
  }
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn('h-4 w-4', i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-charcoal-200')}
          />
        ))}
      </span>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
      {reviewCount !== undefined && (
        <span className="text-sm text-charcoal-600">
          {rating.toFixed(1)} · {reviewCount} reviews
        </span>
      )}
    </span>
  );
}
