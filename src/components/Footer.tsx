import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '../data/menu';
import { restaurant } from '../data/restaurant';
import { Logo } from './Logo';

const socialIcons = { Instagram, Facebook, X: Twitter } as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            {restaurant.tagline} Seasonal ingredients, cooked with care and delivered warm to your door.
          </p>
          <ul className="mt-6 flex gap-3" aria-label="Social media">
            {restaurant.social.map((s) => {
              const Icon = socialIcons[s.name as keyof typeof socialIcons];
              return (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Savora on ${s.name}`}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-tomato hover:text-cream"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-cream">Explore</h2>
          <ul className="space-y-3 text-sm">
            {[
              ['/', 'Home'],
              ['/menu', 'Full Menu'],
              ['/about', 'Our Story'],
              ['/contact', 'Contact'],
              ['/cart', 'Your Cart'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to!} className="transition hover:text-tomato-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-cream">Menu</h2>
          <ul className="grid grid-cols-2 gap-3 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/menu?category=${c.id}`} className="transition hover:text-tomato-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-5 font-sans text-sm font-semibold uppercase tracking-widest text-cream">Visit Us</h2>
          <address className="space-y-3 text-sm not-italic">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tomato-300" aria-hidden="true" />
              {restaurant.address.full}
            </p>
            <p>
              <a href={restaurant.phoneHref} className="flex gap-3 transition hover:text-tomato-300">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-tomato-300" aria-hidden="true" />
                {restaurant.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${restaurant.email}`} className="flex gap-3 transition hover:text-tomato-300">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-tomato-300" aria-hidden="true" />
                {restaurant.email}
              </a>
            </p>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-tomato-300" aria-hidden="true" />
              <ul className="space-y-1">
                {restaurant.hours.map((h) => (
                  <li key={h.days}>
                    <span className="text-cream">{h.days}:</span> {h.time}
                  </li>
                ))}
              </ul>
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Savora. All rights reserved.</p>
          <p>Portfolio demo — menu, prices, reviews and checkout are sample content.</p>
        </div>
      </div>
    </footer>
  );
}
