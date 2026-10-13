import { cn } from '../utils/format';

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-beige', className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <div className="card overflow-hidden" aria-hidden="true">
      <Shimmer className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-5">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-5 w-3/4" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Shimmer className="h-6 w-16" />
          <Shimmer className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  variant?: 'grid' | 'spinner';
  count?: number;
  label?: string;
}

export function LoadingState({ variant = 'grid', count = 6, label = 'Loading…' }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div role="status" className="flex flex-col items-center justify-center gap-3 py-20 text-charcoal-600">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-beige border-t-tomato" />
        <span className="text-sm">{label}</span>
      </div>
    );
  }
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
