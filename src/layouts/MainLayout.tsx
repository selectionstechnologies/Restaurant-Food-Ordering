import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CartDrawer } from '../components/CartDrawer';
import { Chatbot } from '../components/Chatbot';
import { FloatingCartButton } from '../components/FloatingCartButton';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { ToastNotification } from '../components/ToastNotification';

export function MainLayout() {
  const location = useLocation();
  const outlet = useOutlet();

  // Scroll to top on route change (but not when only the query string changes, e.g. menu filters).
  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex-1"
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
      <Chatbot />
      <ToastNotification />
    </div>
  );
}
