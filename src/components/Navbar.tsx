import { AnimatePresence, motion } from 'framer-motion';
import { Menu as MenuIcon, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../utils/format';
import { Logo } from './Logo';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/menu', label: 'Menu', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

export function Navbar() {
  const { totals, addPulse, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
      isActive ? 'text-charcoal' : 'text-charcoal-600 hover:text-charcoal',
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled || mobileOpen ? 'bg-cream/90 shadow-soft backdrop-blur-lg' : 'bg-cream',
      )}
    >
      <nav className="container-page flex h-20 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-tomato"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openDrawer}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:scale-105"
            aria-label={`Open cart, ${totals.itemCount} ${totals.itemCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            <AnimatePresence>
              {totals.itemCount > 0 && (
                <motion.span
                  key={addPulse}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: [1.35, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-tomato px-1 text-[11px] font-bold text-cream"
                  aria-hidden="true"
                >
                  {totals.itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <NavLink to="/menu" className="btn-primary hidden py-2.5 lg:inline-flex">
            Order Now
          </NavLink>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-beige md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-charcoal/5 md:hidden"
          >
            <ul className="container-page space-y-1 py-4">
              {[...links, { to: '/cart', label: 'Cart', end: false }].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-medium',
                        isActive ? 'bg-white text-tomato shadow-soft' : 'text-charcoal hover:bg-white/70',
                      )
                    }
                  >
                    {link.label}
                    {link.to === '/cart' && totals.itemCount > 0 && (
                      <span className="chip bg-tomato text-cream">{totals.itemCount}</span>
                    )}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <NavLink to="/menu" className="btn-primary w-full py-3.5">
                  Order Now
                </NavLink>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
