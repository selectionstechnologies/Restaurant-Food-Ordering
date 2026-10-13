import { Link } from 'react-router-dom';
import { cn } from '../utils/format';

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5', className)} aria-label="Savora — home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-tomato shadow-soft transition-transform duration-300 group-hover:rotate-[-8deg]">
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <path d="M20 40c0-8 5-14 12-14s12 6 12 14" fill="none" stroke="#FFF9F0" strokeWidth="4" strokeLinecap="round" />
          <path d="M16 42h32" stroke="#FFF9F0" strokeWidth="4" strokeLinecap="round" />
          <circle cx="32" cy="21" r="3" fill="#FFF9F0" />
        </svg>
      </span>
      <span className={cn('font-display text-2xl font-bold tracking-tight', light ? 'text-cream' : 'text-charcoal')}>
        Savora
      </span>
    </Link>
  );
}
