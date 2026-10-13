import { motion } from 'framer-motion';
import { ArrowRight, ChefHat, Leaf, MousePointerClick, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FoodCard } from '../components/FoodCard';
import { FoodCategories } from '../components/FoodCategories';
import { HeroSection } from '../components/HeroSection';
import { Newsletter } from '../components/Newsletter';
import { SectionHeading } from '../components/SectionHeading';
import { SmartImage } from '../components/SmartImage';
import { TestimonialCard } from '../components/TestimonialCard';
import { menuItems } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { testimonials } from '../data/testimonials';
import { usePageMeta } from '../hooks/usePageMeta';
import { formatPrice } from '../utils/format';

const benefits = [
  {
    Icon: Leaf,
    title: 'Fresh Ingredients',
    text: 'Produce from local farms delivered every morning. Dough, sauces and dressings made in-house daily.',
  },
  {
    Icon: Truck,
    title: 'Fast Delivery',
    text: 'Hot and fresh to your door in around 30–45 minutes, packed in heat-sealed, eco-friendly packaging.',
  },
  {
    Icon: MousePointerClick,
    title: 'Easy Ordering',
    text: 'Browse, customize and check out in a few taps — or let our food assistant help you choose.',
  },
];

export function HomePage() {
  usePageMeta('', 'Savora — fresh burgers, stone-baked pizza, handmade pasta and more. Order online for delivery or pickup.');

  const popular = [...menuItems].filter((i) => i.available).sort((a, b) => b.popularity - a.popularity).slice(0, 6);
  const bestsellers = menuItems.filter((i) => i.bestseller && i.available).slice(0, 4);
  const chefSpecials = menuItems.filter((i) => i.chefSpecial && i.available);
  const spotlight = chefSpecials[0];

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <section className="container-page py-20" aria-labelledby="categories-heading">
        <SectionHeading
          eyebrow="Explore"
          title={<span id="categories-heading">Something for every craving</span>}
          description="From smashed burgers to cold-brew coffee — pick a category and dive in."
          action={
            <Link to="/menu" className="btn-outline">
              Full menu <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <FoodCategories />
      </section>

      {/* Popular dishes */}
      <section id="popular" className="scroll-mt-24 bg-beige/50 py-20" aria-labelledby="popular-heading">
        <div className="container-page">
          <SectionHeading
            eyebrow="Popular dishes"
            title={<span id="popular-heading">What everyone’s ordering</span>}
            description="Our most-loved plates this week, ranked by orders from guests like you."
            action={
              <Link to="/menu?sort=popular" className="btn-dark">
                See all dishes <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((item, i) => (
              <FoodCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Chef's special spotlight + bestsellers */}
      {spotlight && (
        <section className="bg-charcoal py-20 text-cream" aria-labelledby="specials-heading">
          <div className="container-page grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <SmartImage
                src={spotlight.gallery[0] ?? spotlight.image}
                alt={spotlight.name}
                wrapperClassName="aspect-[4/3] rounded-[2.5rem]"
              />
              <span className="absolute -bottom-5 right-6 rounded-2xl bg-tomato px-5 py-3 font-display text-2xl font-bold shadow-lift">
                {formatPrice(spotlight.price)}
              </span>
            </motion.div>
            <div>
              <p className="eyebrow inline-flex items-center gap-2 text-tomato-300">
                <ChefHat className="h-4 w-4" aria-hidden="true" /> Chef’s specials
              </p>
              <h2 id="specials-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
                {spotlight.name}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-cream/75">{spotlight.longDescription}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={`/menu/${spotlight.slug}`} className="btn-primary">
                  View dish <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {chefSpecials.slice(1).map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/menu/${item.slug}`}
                      className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 transition hover:bg-white/10"
                    >
                      <SmartImage src={item.image} alt="" wrapperClassName="h-14 w-14 shrink-0 rounded-xl" />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold">{item.name}</span>
                        <span className="text-sm text-cream/60">{formatPrice(item.price)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-20" aria-labelledby="bestsellers-heading">
        <SectionHeading
          eyebrow="Bestsellers"
          title={<span id="bestsellers-heading">The classics that never miss</span>}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((item, i) => (
            <FoodCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-beige/50 py-20" aria-labelledby="benefits-heading">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why Savora"
              title={<span id="benefits-heading">Made with care, delivered with speed</span>}
              className="mb-8"
            />
            <ul className="space-y-6">
              {benefits.map(({ Icon, title, text }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 rounded-3xl bg-white p-6 shadow-soft"
                >
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-tomato-50 text-tomato">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="mt-1.5 text-charcoal-600">{text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SmartImage
              src={restaurant.images.ingredients}
              alt="Fresh vegetables and herbs on a wooden table"
              wrapperClassName="aspect-[3/4] rounded-[2rem]"
            />
            <SmartImage
              src={restaurant.images.interior}
              alt="Warmly lit Savora dining room"
              wrapperClassName="mt-12 aspect-[3/4] rounded-[2rem]"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-page py-20" aria-labelledby="reviews-heading">
        <SectionHeading
          align="center"
          eyebrow="Reviews"
          title={<span id="reviews-heading">Loved by our guests</span>}
          description="Sample reviews shown for demonstration."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
