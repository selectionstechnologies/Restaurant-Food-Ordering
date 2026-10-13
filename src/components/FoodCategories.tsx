import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories, menuItems } from '../data/menu';
import { SmartImage } from './SmartImage';

export function FoodCategories() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {categories.map((category, i) => {
        const count = menuItems.filter((m) => m.category === category.id).length;
        return (
          <motion.li
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <Link
              to={`/menu?category=${category.id}`}
              className="group relative block overflow-hidden rounded-3xl shadow-soft"
            >
              <SmartImage
                src={category.image}
                alt=""
                wrapperClassName="aspect-[4/5]"
                className="transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-cream">
                <h3 className="text-lg font-bold">{category.name}</h3>
                <p className="text-xs text-cream/80">{count} dishes</p>
              </div>
              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-cream/90 text-charcoal opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
