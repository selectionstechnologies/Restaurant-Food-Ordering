# Savora — Premium Restaurant & Food Ordering

> **Good Food. Great Moments.**

A responsive restaurant website with a working front-end ordering flow, built with React, TypeScript, Tailwind CSS, React Router, Framer Motion and React Hook Form.

This is a portfolio demo. The menu, prices, ratings and reviews are sample content, and checkout is simulated: no payment is processed and no card details are ever collected.

## Features

- **Pages:** Home, Menu, Food Details (`/menu/:slug`), About, Contact, Cart, Checkout and Order Confirmation, plus a 404 page.
- **Menu:** search by name, description or ingredient; filter by category, vegetarian and max price; sort by popularity, rating or price. Filter state lives in the URL, so it can be shared. Includes skeleton loading, empty and error states (add `?simulateError=1` to preview the error state).
- **Food details:** image gallery, ingredients, allergens, size options, add-ons, quantity, special instructions and related dishes.
- **Cart:** one typed data source; line items keyed by options; quantity controls; clear cart; demo promo codes (`SAVORA10`, `WELCOME5`, `FREESHIP`); free-delivery progress bar. The cart persists in `localStorage` and syncs across tabs. It also has a slide-in drawer and a floating cart button.
- **Checkout:** validated customer details; delivery or pickup with conditional address fields; Cash on Delivery or a configurable online-payment placeholder; generates a demo order number.
- **Savora Food Assistant:** a floating chatbot on every page. It is rule-based and does not use an AI model. It:
  - recommends dishes by budget, diet, spice and category, using the real menu data;
  - answers FAQs about hours (including whether the restaurant is open now), delivery, contact, payment, promos and allergens;
  - adds an item to the cart only after the user confirms;
  - asks for an order number before looking up a demo order, and explains that live tracking needs a backend.
- **UX and accessibility:** page transitions; respects reduced-motion settings; skip link; focus-visible rings; ARIA live regions for toasts and chat; keyboard-operable drawer and menus; lazy images with a branded fallback; per-page title and meta description.

## Getting started

```bash
npm install
cp .env.example .env   # optional — defaults are built in
npm run dev
```

Other scripts: `npm run build`, `npm run preview`, `npm run typecheck`.

> The npm scripts call `node node_modules/...` directly. npm's Windows `.cmd` shims break when the project path contains `&`.

## Configuration

All settings are public and non-secret, and are set in `.env` (see `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_CURRENCY` / `VITE_LOCALE` | `USD` / `en-US` | Price formatting |
| `VITE_DELIVERY_FEE` | `3.99` | Delivery fee |
| `VITE_FREE_DELIVERY_THRESHOLD` | `40` | Subtotal for free delivery |
| `VITE_TAX_RATE` | `0.08` | Tax rate |
| `VITE_ONLINE_PAYMENT_ENABLED` | `false` | Show the online payment option (demo placeholder) |
| `VITE_ONLINE_PAYMENT_LABEL` | `Pay Online (Stripe)` | Label for that option |
| `VITE_WHATSAPP_NUMBER` | `15551234567` | WhatsApp contact link |

Never put secret keys in `VITE_` variables, because Vite bundles them into the client.

## Project structure

```
src/
  components/   Reusable UI (Navbar, FoodCard, MenuFilters, CartSummary, Chatbot, …)
  context/      CartContext, FavoritesContext, ToastContext
  data/         menu.ts (single source of truth), restaurant, testimonials, promos
  hooks/        useMenu, useAddToCart, usePageMeta
  layouts/      MainLayout (navbar, footer, drawer, chatbot, toasts, page transitions)
  pages/        Route components
  types/        Shared TypeScript types
  utils/        cart totals, order helpers, chatbot engine, config, formatting, validation
```

## Connecting a backend

- Replace the simulated delay in `hooks/useMenu.ts` with an API fetch.
- Replace `placeOrder` in `pages/CheckoutPage.tsx` with a server call. The server should recalculate totals and handle payment through a hosted provider page.
- Implement real order tracking against your order service in `utils/order.ts`, and point the chatbot at it.

Photos are from [Unsplash](https://unsplash.com).
