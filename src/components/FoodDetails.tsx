import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Flame, Heart, Leaf } from 'lucide-react';
import { useId, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { getCategory } from '../data/menu';
import type { FoodItem } from '../types';
import { getUnitPrice } from '../utils/cart';
import { capitalize, cn, formatPrice } from '../utils/format';
import { AddToCartButton } from './AddToCartButton';
import { DietaryBadges } from './DietaryBadges';
import { QuantitySelector } from './QuantitySelector';
import { RatingStars } from './RatingStars';
import { SmartImage } from './SmartImage';

const INSTRUCTIONS_MAX = 160;

export function FoodDetails({ item }: { item: FoodItem }) {
  const [activeImage, setActiveImage] = useState(0);
  const [sizeId, setSizeId] = useState(item.sizes?.[0]?.id);
  const [addOnIds, setAddOnIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const { isFavorite, toggleFavorite } = useFavorites();
  const ids = { instructions: useId(), size: useId(), addons: useId() };
  const category = getCategory(item.category);
  const favorite = isFavorite(item.id);
  const images = item.gallery.length ? item.gallery : [item.image];
  const unitPrice = getUnitPrice(item, sizeId, addOnIds);

  const toggleAddOn = (id: string) =>
    setAddOnIds((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]));

  const resetOptions = () => {
    setQuantity(1);
    setAddOnIds([]);
    setInstructions('');
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="relative overflow-hidden rounded-[2.5rem] shadow-lift">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SmartImage
                src={images[activeImage] ?? item.image}
                alt={`${item.name}${activeImage > 0 ? ` — photo ${activeImage + 1}` : ''}`}
                priority={activeImage === 0}
                wrapperClassName="aspect-[4/3]"
              />
            </motion.div>
          </AnimatePresence>
          {!item.available && (
            <span className="chip absolute left-5 top-5 bg-white px-4 py-2 text-sm text-charcoal">Sold out today</span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3" role="tablist" aria-label="Dish photos">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === activeImage}
                aria-label={`Show photo ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={cn(
                  'overflow-hidden rounded-2xl ring-2 ring-offset-2 ring-offset-cream transition',
                  i === activeImage ? 'ring-tomato' : 'ring-transparent opacity-70 hover:opacity-100',
                )}
              >
                <SmartImage src={src} alt="" wrapperClassName="h-20 w-24 sm:h-24 sm:w-32" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">{category?.name}</p>
            <h1 className="mt-2 text-4xl font-bold leading-tight sm:text-5xl">{item.name}</h1>
          </div>
          <button
            type="button"
            onClick={() => toggleFavorite(item.id)}
            aria-pressed={favorite}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white shadow-soft transition hover:scale-105"
          >
            <Heart className={cn('h-5 w-5', favorite ? 'fill-tomato text-tomato' : 'text-charcoal')} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <RatingStars rating={item.rating} reviewCount={item.reviewCount} />
          {item.calories && <span className="text-sm text-charcoal-500">{item.calories} kcal</span>}
        </div>

        <p className="mt-6 font-display text-4xl font-bold text-tomato">{formatPrice(item.price)}</p>
        <p className="mt-6 text-lg leading-relaxed text-charcoal-700">{item.longDescription}</p>

        <DietaryBadges tags={item.dietaryTags} className="mt-6" />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wider">
              <Leaf className="h-4 w-4 text-olive" aria-hidden="true" /> Ingredients
            </h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {item.ingredients.map((ing) => (
                <li key={ing} className="chip bg-beige/70 font-medium text-charcoal-700">
                  {ing}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wider">
              <AlertTriangle className="h-4 w-4 text-tomato" aria-hidden="true" /> Allergens
            </h2>
            <p className="mt-3 text-sm text-charcoal-700">
              {item.allergens.length
                ? `Contains: ${item.allergens.map(capitalize).join(', ')}.`
                : 'No major allergens in the recipe.'}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
              Prepared in a kitchen that handles gluten, dairy, eggs, nuts, soy and sesame. Please tell us about severe
              allergies.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="mt-10 space-y-8 border-t border-charcoal/10 pt-8">
          {item.sizes && item.sizes.length > 1 && (
            <fieldset>
              <legend id={ids.size} className="mb-3 text-lg font-bold">
                Choose a size
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {item.sizes.map((size) => (
                  <label
                    key={size.id}
                    className={cn(
                      'flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tomato',
                      sizeId === size.id ? 'border-tomato' : 'border-transparent shadow-soft hover:border-charcoal/20',
                    )}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={size.id}
                      checked={sizeId === size.id}
                      onChange={() => setSizeId(size.id)}
                      className="sr-only"
                    />
                    <span className="font-semibold">{size.label}</span>
                    <span className="text-sm text-charcoal-500">
                      {size.priceDelta ? `+${formatPrice(size.priceDelta)}` : 'Included'}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {item.addOns && item.addOns.length > 0 && (
            <fieldset>
              <legend id={ids.addons} className="mb-3 text-lg font-bold">
                Add extras <span className="text-sm font-normal text-charcoal-500">(optional)</span>
              </legend>
              <div className="space-y-2">
                {item.addOns.map((addOn) => {
                  const checked = addOnIds.includes(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      className={cn(
                        'flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 bg-white px-4 py-3 transition',
                        checked ? 'border-olive' : 'border-transparent shadow-soft hover:border-charcoal/20',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddOn(addOn.id)}
                          className="h-5 w-5 rounded accent-olive"
                        />
                        <span className="font-medium">{addOn.name}</span>
                      </span>
                      <span className="text-sm font-semibold text-charcoal-600">+{formatPrice(addOn.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor={ids.instructions} className="mb-3 block text-lg font-bold">
              Special instructions <span className="text-sm font-normal text-charcoal-500">(optional)</span>
            </label>
            <textarea
              id={ids.instructions}
              rows={3}
              maxLength={INSTRUCTIONS_MAX}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. No onions, sauce on the side…"
              className="input resize-none"
              aria-describedby={`${ids.instructions}-count`}
            />
            <p id={`${ids.instructions}-count`} className="mt-1 text-right text-xs text-charcoal-500">
              {instructions.length}/{INSTRUCTIONS_MAX}
            </p>
          </div>

          {item.dietaryTags.includes('spicy') && (
            <p className="flex items-center gap-2 text-sm text-tomato-700">
              <Flame className="h-4 w-4" aria-hidden="true" /> This dish has a noticeable kick.
            </p>
          )}

          <div className="flex flex-col gap-4 rounded-3xl bg-charcoal p-5 text-cream sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} className="text-charcoal" />
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/60">Total</p>
                <p className="font-display text-2xl font-bold tabular-nums">{formatPrice(unitPrice * quantity)}</p>
              </div>
            </div>
            <AddToCartButton
              item={item}
              mode="button"
              quantity={quantity}
              sizeId={sizeId}
              addOnIds={addOnIds}
              instructions={instructions}
              onAdded={resetOptions}
              className="w-full py-4 sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
