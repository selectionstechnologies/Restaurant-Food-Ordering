import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';
import { getCategory } from '../data/menu';
import type { FoodItem } from '../types';
import { cn, formatPrice } from '../utils/format';
import { AddToCartButton } from './AddToCartButton';
import { DietaryBadges } from './DietaryBadges';
import { RatingStars } from './RatingStars';
import { SmartImage } from './SmartImage';

interface FoodCardProps {
  item: FoodItem;
  index?: number;
}

export function FoodCard({ item, index = 0 }: FoodCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const favorite = isFavorite(item.id);
  const category = getCategory(item.category);
  const detailsHref = `/menu/${item.slug}`;
  const ribbon = item.chefSpecial ? "Chef's Special" : item.bestseller ? 'Bestseller' : null;

  const onFavorite = () => {
    const now = toggleFavorite(item.id);
    showToast({
      variant: 'info',
      title: now ? 'Saved to favorites' : 'Removed from favorites',
      description: item.name,
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      className="card group relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative">
        <Link to={detailsHref} tabIndex={-1} aria-hidden="true">
          <SmartImage
            src={item.image}
            alt={item.name}
            wrapperClassName="aspect-[4/3]"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        {ribbon && (
          <span className="chip absolute left-4 top-4 bg-charcoal/85 text-cream backdrop-blur">{ribbon}</span>
        )}
        {!item.available && (
          <span className="chip absolute bottom-4 left-4 bg-white text-charcoal">Sold out today</span>
        )}
        <button
          type="button"
          onClick={onFavorite}
          aria-pressed={favorite}
          aria-label={favorite ? `Remove ${item.name} from favorites` : `Add ${item.name} to favorites`}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-soft backdrop-blur transition hover:scale-110"
        >
          <Heart className={cn('h-5 w-5 transition', favorite ? 'fill-tomato text-tomato' : 'text-charcoal')} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-olive">{category?.name}</span>
          <RatingStars rating={item.rating} reviewCount={item.reviewCount} compact />
        </div>
        <h3 className="text-xl font-bold leading-snug">
          <Link to={detailsHref} className="hover:text-tomato focus-visible:text-tomato">
            {item.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal-600">{item.description}</p>
        <DietaryBadges tags={item.dietaryTags} max={2} className="mt-3" />
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <p className="text-xl font-bold text-charcoal">
            {item.sizes && item.sizes.length > 1 && <span className="mr-1 text-xs font-medium text-charcoal-500">from</span>}
            {formatPrice(item.price)}
          </p>
          <AddToCartButton item={item} />
        </div>
      </div>
    </motion.article>
  );
}
