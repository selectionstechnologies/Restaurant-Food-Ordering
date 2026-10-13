import type { Testimonial } from '../types';

/** Sample demo reviews. */
const avatar = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=160&h=160&q=80&crop=faces`;

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amelia Hart',
    role: 'Regular since 2021',
    avatar: avatar('1494790108377-be9c29b29330'),
    quote:
      'The Double Smash Burger is genuinely the best I have had in the city. Delivery was hot, fast and beautifully packed.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Food blogger',
    avatar: avatar('1507003211169-0a1dd7228f2d'),
    quote:
      'You can taste the 48-hour dough in every bite of their Margherita. Savora gets the simple things exactly right.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Priya Raman',
    role: 'Vegetarian foodie',
    avatar: avatar('1438761681033-6461ffad8d80'),
    quote:
      'So many great vegetarian options that feel like a first choice, not an afterthought. The veggie pad thai is a staple.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'Daniel Okafor',
    role: 'Office lunch organizer',
    avatar: avatar('1500648767791-00dcc994a43e'),
    quote:
      'Ordering for a team of twelve was effortless. Everything arrived on time and the brownies disappeared in minutes.',
    rating: 4,
  },
];
