import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { restaurant } from '../data/restaurant';
import { SmartImage } from './SmartImage';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream pb-16 pt-8 sm:pt-12 lg:pb-24">
      {/* soft decorative blobs */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-beige blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-tomato-100/60 blur-3xl" aria-hidden="true" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium shadow-soft">
            <span className="h-2 w-2 rounded-full bg-olive" aria-hidden="true" />
            {restaurant.tagline}
          </p>
          <h1 className="text-5xl font-extrabold leading-[1.05] text-charcoal sm:text-6xl xl:text-7xl">
            Delicious Food, <span className="italic text-tomato">Delivered</span> to Your Door.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal-600">
            Fresh ingredients, bold flavors, and meals made with love.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="btn-primary px-8 py-4 text-base">
              Order Now <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <a href="#popular" className="btn-outline px-8 py-4 text-base">
              Explore Menu
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-charcoal/10 pt-8">
            <div>
              <dt className="flex items-center gap-1 text-xs uppercase tracking-wider text-charcoal-500">
                <Star className="h-3.5 w-3.5" aria-hidden="true" /> Rating
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">4.8/5</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs uppercase tracking-wider text-charcoal-500">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Delivery
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">30 min</dd>
            </div>
            <div>
              <dt className="flex items-center gap-1 text-xs uppercase tracking-wider text-charcoal-500">
                <Truck className="h-3.5 w-3.5" aria-hidden="true" /> Radius
              </dt>
              <dd className="mt-1 font-display text-2xl font-bold">5 mi</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div className="absolute inset-6 rotate-6 rounded-[3rem] bg-tomato" aria-hidden="true" />
          <SmartImage
            src={restaurant.images.hero}
            alt="A towering cheeseburger with melted cheddar, lettuce and tomato on a brioche bun"
            priority
            wrapperClassName="relative aspect-square rounded-[3rem] shadow-lift"
          />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -left-2 bottom-10 flex items-center gap-3 rounded-2xl bg-white/95 p-3 pr-5 shadow-lift backdrop-blur sm:-left-8"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-olive-100 text-2xl" aria-hidden="true">
              🥗
            </span>
            <div>
              <p className="text-sm font-bold">Fresh daily</p>
              <p className="text-xs text-charcoal-500">Locally sourced produce</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.75 }}
            className="absolute -right-2 top-10 rounded-2xl bg-charcoal p-4 text-cream shadow-lift sm:-right-6"
          >
            <p className="text-xs uppercase tracking-wider text-cream/70">Today’s pick</p>
            <p className="font-display text-lg font-bold">Double Smash</p>
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" /> 4.9
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
