import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getItemById } from '../data/menu';
import type { CartLine } from '../types';
import { getLineOptionLabels, getLineUnitPrice } from '../utils/cart';
import { cn, formatPrice } from '../utils/format';
import { QuantitySelector } from './QuantitySelector';
import { SmartImage } from './SmartImage';

interface CartItemProps {
  line: CartLine;
  compact?: boolean;
  onNavigate?: () => void;
}

export function CartItem({ line, compact = false, onNavigate }: CartItemProps) {
  const { setQuantity, removeLine } = useCart();
  const item = getItemById(line.itemId);
  if (!item) return null;

  const unitPrice = getLineUnitPrice(line);
  const options = getLineOptionLabels(line);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      className={cn('flex gap-4', compact ? 'py-4' : 'card p-4 sm:p-5')}
    >
      <Link to={`/menu/${item.slug}`} onClick={onNavigate} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <SmartImage
          src={item.image}
          alt={item.name}
          wrapperClassName={cn('rounded-2xl', compact ? 'h-20 w-20' : 'h-24 w-24 sm:h-28 sm:w-28')}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn('font-bold leading-snug', compact ? 'text-base' : 'text-lg')}>
              <Link to={`/menu/${item.slug}`} onClick={onNavigate} className="hover:text-tomato">
                {item.name}
              </Link>
            </h3>
            {options.length > 0 && <p className="mt-0.5 text-xs text-charcoal-500">{options.join(' · ')}</p>}
            {line.instructions && (
              <p className="mt-0.5 line-clamp-1 text-xs italic text-charcoal-500">“{line.instructions}”</p>
            )}
            {!compact && <p className="mt-1 text-sm text-charcoal-600">{formatPrice(unitPrice)} each</p>}
          </div>
          <button
            type="button"
            onClick={() => removeLine(line.lineId)}
            className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-charcoal-400 transition hover:bg-tomato-50 hover:text-tomato-700"
            aria-label={`Remove ${item.name} from cart`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantitySelector
            size="sm"
            value={line.quantity}
            label={`${item.name} quantity`}
            allowRemove
            onChange={(q) => setQuantity(line.lineId, q)}
          />
          <p className="font-bold tabular-nums">{formatPrice(unitPrice * line.quantity)}</p>
        </div>
      </div>
    </motion.li>
  );
}
