import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast, type ToastVariant } from '../context/ToastContext';
import { cn } from '../utils/format';

const icons: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const iconColor: Record<ToastVariant, string> = {
  success: 'text-olive-400',
  error: 'text-tomato-400',
  info: 'text-amber-300',
};

/** Renders the global toast stack. Announced politely to screen readers. */
export function ToastNotification() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = icons[toast.variant];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, transition: { duration: 0.2 } }}
              role={toast.variant === 'error' ? 'alert' : 'status'}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-charcoal p-4 text-cream shadow-lift"
            >
              <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconColor[toast.variant])} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-0.5 truncate text-sm text-cream/70">{toast.description}</p>}
              </div>
              {toast.action && (
                <Link
                  to={toast.action.to}
                  onClick={() => dismissToast(toast.id)}
                  className="shrink-0 rounded-full bg-cream/10 px-3 py-1.5 text-xs font-semibold transition hover:bg-tomato"
                >
                  {toast.action.label}
                </Link>
              )}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="-m-1 shrink-0 rounded-full p-1 text-cream/60 transition hover:text-cream"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
