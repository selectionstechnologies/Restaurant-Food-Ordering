import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../utils/format';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  tone?: 'neutral' | 'error';
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, tone = 'neutral', className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      role={tone === 'error' ? 'alert' : undefined}
      className={cn('flex flex-col items-center px-6 py-16 text-center', className)}
    >
      <div
        className={cn(
          'mb-6 grid h-24 w-24 place-items-center rounded-full',
          tone === 'error' ? 'bg-tomato-50 text-tomato' : 'bg-beige text-olive',
        )}
      >
        <Icon className="h-10 w-10" aria-hidden="true" strokeWidth={1.6} />
      </div>
      <h2 className="text-2xl font-bold text-charcoal">{title}</h2>
      {description && <p className="mt-3 max-w-md text-charcoal-600">{description}</p>}
      {action && <div className="mt-8 flex flex-wrap justify-center gap-3">{action}</div>}
    </motion.div>
  );
}
