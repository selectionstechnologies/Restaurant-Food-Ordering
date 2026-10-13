import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '../types';
import { RatingStars } from './RatingStars';
import { SmartImage } from './SmartImage';

export function TestimonialCard({ testimonial, index = 0 }: { testimonial: Testimonial; index?: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="card relative flex h-full flex-col p-7"
    >
      <Quote className="absolute right-6 top-6 h-10 w-10 text-beige" aria-hidden="true" />
      <RatingStars rating={testimonial.rating} />
      <blockquote className="mt-5 flex-1 text-base leading-relaxed text-charcoal-700">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-charcoal/5 pt-5">
        <SmartImage src={testimonial.avatar} alt="" wrapperClassName="h-12 w-12 shrink-0 rounded-full" />
        <div>
          <p className="font-semibold text-charcoal">{testimonial.name}</p>
          <p className="text-sm text-charcoal-500">{testimonial.role}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
