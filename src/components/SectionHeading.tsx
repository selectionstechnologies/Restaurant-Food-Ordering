import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../utils/format';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  as: Heading = 'h2',
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'mb-10 flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Heading
          className={cn(
            'text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl',
            light ? 'text-cream' : 'text-charcoal',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn('mt-4 text-base leading-relaxed sm:text-lg', light ? 'text-cream/75' : 'text-charcoal-600')}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
