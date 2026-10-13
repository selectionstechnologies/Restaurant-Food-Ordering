import { config } from '../utils/config';
import { unsplash } from './menu';

export const restaurant = {
  name: 'Savora',
  tagline: 'Good Food. Great Moments.',
  address: {
    line1: '128 Harvest Lane',
    city: 'Brooklyn, NY 11201',
    full: '128 Harvest Lane, Brooklyn, NY 11201',
  },
  phone: '+1 (555) 123-4567',
  phoneHref: 'tel:+15551234567',
  email: 'hello@savora.example',
  whatsappHref: `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    'Hi Savora! I have a question about my order.',
  )}`,
  mapQuery: 'Brooklyn Bridge Park, Brooklyn, NY',
  hours: [
    { days: 'Monday – Thursday', time: '11:00 AM – 10:00 PM' },
    { days: 'Friday – Saturday', time: '11:00 AM – 11:30 PM' },
    { days: 'Sunday', time: '12:00 PM – 9:00 PM' },
  ],
  /** Opening hours in minutes after midnight, indexed by day (0 = Sunday). Mirrors `hours`. */
  schedule: [
    [12 * 60, 21 * 60],
    [11 * 60, 22 * 60],
    [11 * 60, 22 * 60],
    [11 * 60, 22 * 60],
    [11 * 60, 22 * 60],
    [11 * 60, 23 * 60 + 30],
    [11 * 60, 23 * 60 + 30],
  ] as Array<[number, number]>,
  delivery: {
    radius: '5 miles',
    estimate: [30, 45] as [number, number],
    pickupEstimate: [15, 20] as [number, number],
  },
  social: [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'X', href: 'https://x.com' },
  ],
  images: {
    hero: unsplash('1568901346375-23c9450c58cd', 1400, 1400),
    interior: unsplash('1517248135467-4c7edcad34c4', 1400, 1000),
    dining: unsplash('1414235077428-338989a2e8c0', 1400, 1000),
    chef: unsplash('1577219491135-ce391730fb2c', 900, 1100),
    ingredients: unsplash('1498837167922-ddd27525d352', 1200, 900),
    kitchen: unsplash('1556910103-1c02745aae4d', 1200, 900),
  },
} as const;
