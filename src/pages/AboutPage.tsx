import { motion } from 'framer-motion';
import { Award, Heart, Leaf, Recycle, Sprout, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../components/SectionHeading';
import { SmartImage } from '../components/SmartImage';
import { TestimonialCard } from '../components/TestimonialCard';
import { restaurant } from '../data/restaurant';
import { testimonials } from '../data/testimonials';
import { usePageMeta } from '../hooks/usePageMeta';

const commitments = [
  { Icon: Sprout, title: 'Local farms first', text: 'Over 70% of our produce comes from farms within 150 miles, picked at peak season.' },
  { Icon: Leaf, title: 'Made from scratch', text: 'Doughs, sauces, dressings and desserts are made in our kitchen every single day.' },
  { Icon: Recycle, title: 'Planet-friendly', text: 'Compostable packaging, zero-waste prep and surplus food donated to local shelters.' },
];

const values = [
  { Icon: Heart, title: 'Hospitality', text: 'Every guest — at the table or at home — should feel genuinely looked after.' },
  { Icon: Award, title: 'Craft', text: 'We obsess over the details: the char on a crust, the crunch of a pickle.' },
  { Icon: Users, title: 'Community', text: 'We pay fair wages, support local makers and give back to our neighborhood.' },
];

const stats = [
  ['2016', 'Founded'],
  ['40+', 'Local suppliers'],
  ['120k', 'Meals served'],
  ['4.8', 'Average rating'],
];

export function AboutPage() {
  usePageMeta('About Us', 'The story behind Savora — fresh ingredients, honest cooking and great moments around the table.');

  return (
    <>
      {/* Story */}
      <section className="container-page grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Our story</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Good food is how we bring people <span className="italic text-tomato">together</span>.
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-charcoal-700">
            <p>
              Savora began in 2016 as a tiny twelve-seat kitchen with one wood-fired oven and a simple idea: cook honest,
              generous food from the best ingredients we could find, and serve it like we would to family.
            </p>
            <p>
              Today we cook for thousands of guests every week — in our Brooklyn dining room and at their doorsteps — but
              the philosophy hasn’t changed. Fresh over frozen. Seasonal over convenient. And always made with love.
            </p>
          </div>
        </div>
        <div className="relative">
          <SmartImage
            src={restaurant.images.dining}
            alt="Guests enjoying dinner in the Savora dining room"
            priority
            wrapperClassName="aspect-[4/3] rounded-[2.5rem] shadow-lift"
          />
          <SmartImage
            src={restaurant.images.kitchen}
            alt="Savora chefs preparing dishes in the open kitchen"
            wrapperClassName="absolute -bottom-10 -left-6 hidden aspect-square w-48 rounded-3xl border-8 border-cream shadow-lift sm:block"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="container-page pb-16 pt-10" aria-label="Savora in numbers">
        <dl className="grid grid-cols-2 gap-4 rounded-[2rem] bg-charcoal p-8 text-cream md:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-4xl font-bold text-tomato-300">{value}</dd>
              <dd className="mt-1 text-sm text-cream/70">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Ingredients commitment */}
      <section className="bg-beige/50 py-20" aria-labelledby="quality-heading">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <SmartImage
            src={restaurant.images.ingredients}
            alt="Freshly harvested vegetables and herbs"
            wrapperClassName="order-last aspect-[4/3] rounded-[2.5rem] lg:order-first"
          />
          <div>
            <SectionHeading
              eyebrow="Quality promise"
              title={<span id="quality-heading">Fresh ingredients, every single day</span>}
              description="Great cooking starts long before the kitchen. Here’s what we commit to on every plate."
              className="mb-8"
            />
            <ul className="space-y-5">
              {commitments.map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-olive text-cream">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-charcoal-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Chef */}
      <section className="container-page py-20" aria-labelledby="chef-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto w-full max-w-sm"
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-tomato" aria-hidden="true" />
            <SmartImage
              src={restaurant.images.chef}
              alt="Head chef Marco Bellini in his whites"
              wrapperClassName="relative aspect-[4/5] rounded-[2.5rem]"
            />
          </motion.div>
          <div>
            <p className="eyebrow mb-3">Meet the chef</p>
            <h2 id="chef-heading" className="text-4xl font-bold sm:text-5xl">
              Marco Bellini
            </h2>
            <p className="mt-1 text-lg text-olive">Founder &amp; Head Chef</p>
            <blockquote className="mt-6 border-l-4 border-tomato pl-6 font-display text-2xl italic leading-snug text-charcoal-800">
              “A great dish is just a few perfect ingredients that you’re brave enough to leave alone.”
            </blockquote>
            <p className="mt-6 leading-relaxed text-charcoal-700">
              Raised in his grandmother’s kitchen in Naples and trained in Lyon and New York, Marco spent fifteen years in
              fine dining before deciding the best food should be accessible every day. His menu blends Italian roots with
              the bold, global flavors of Brooklyn.
            </p>
            <Link to="/menu" className="btn-primary mt-8">
              Taste Marco’s menu
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-charcoal py-20" aria-labelledby="values-heading">
        <div className="container-page">
          <SectionHeading
            align="center"
            light
            eyebrow="What we believe"
            title={<span id="values-heading">Our values</span>}
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {values.map(({ Icon, title, text }) => (
              <li key={title} className="rounded-3xl bg-white/5 p-8 text-cream">
                <Icon className="h-8 w-8 text-tomato-300" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-cream/70">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="about-reviews-heading">
        <SectionHeading align="center" eyebrow="Kind words" title={<span id="about-reviews-heading">What guests say</span>} />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
