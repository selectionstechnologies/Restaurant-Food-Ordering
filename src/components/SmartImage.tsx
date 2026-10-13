import { UtensilsCrossed } from 'lucide-react';
import { useState, type ImgHTMLAttributes } from 'react';
import { cn } from '../utils/format';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Classes for the wrapper (controls size/aspect ratio). */
  wrapperClassName?: string;
  priority?: boolean;
}

/** Lazy-loaded image with fade-in, a skeleton while loading and a branded fallback on error. */
export function SmartImage({ src, alt, className, wrapperClassName, priority = false, ...rest }: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={cn('relative overflow-hidden bg-beige', wrapperClassName)}>
      {status === 'loading' && <div className="absolute inset-0 animate-pulse bg-beige-dark/60" aria-hidden="true" />}
      {status === 'error' ? (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-beige to-beige-dark text-olive"
        >
          <UtensilsCrossed className="h-8 w-8" aria-hidden="true" />
          <span className="px-4 text-center text-xs font-medium text-charcoal-600">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-expect-error — fetchpriority is valid HTML but not yet in React 18's types
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...rest}
        />
      )}
    </div>
  );
}
