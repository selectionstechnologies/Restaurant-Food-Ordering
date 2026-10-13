import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { SectionHeading } from '../components/SectionHeading';
import { restaurant } from '../data/restaurant';
import { usePageMeta } from '../hooks/usePageMeta';

export function ContactPage() {
  usePageMeta('Contact', 'Get in touch with Savora — address, phone, email, opening hours and WhatsApp.');
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapQuery)}&output=embed`;

  const details = [
    { Icon: MapPin, label: 'Address', value: restaurant.address.full, href: `https://maps.google.com/?q=${encodeURIComponent(restaurant.mapQuery)}` },
    { Icon: Phone, label: 'Phone', value: restaurant.phone, href: restaurant.phoneHref },
    { Icon: Mail, label: 'Email', value: restaurant.email, href: `mailto:${restaurant.email}` },
  ];

  return (
    <div className="container-page py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="We’d love to hear from you"
        description="Questions about an order, catering or private dining? Drop us a line or come say hello."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <ContactForm />

        <aside className="space-y-6" aria-label="Restaurant contact information">
          <div className="card space-y-5 p-6 sm:p-8">
            {details.map(({ Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-start gap-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-tomato-50 text-tomato transition group-hover:bg-tomato group-hover:text-cream">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-charcoal-500">{label}</span>
                  <span className="font-semibold group-hover:text-tomato">{value}</span>
                </span>
              </a>
            ))}

            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-olive-50 text-olive">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <span className="block text-sm text-charcoal-500">Opening hours</span>
                <dl className="mt-1 space-y-1 text-sm">
                  {restaurant.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="font-medium">{h.days}</dt>
                      <dd className="text-charcoal-600">{h.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <a
              href={restaurant.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn w-full bg-[#25D366] py-4 text-white hover:bg-[#1ebe5b]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" /> Chat on WhatsApp
            </a>
          </div>
        </aside>
      </div>

      <section className="mt-12" aria-label="Map">
        <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-soft">
          <iframe
            title={`Map showing Savora at ${restaurant.address.full}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 sm:h-96"
          />
          <p className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-medium shadow-soft">
            Map location is approximate (demo address)
          </p>
        </div>
      </section>
    </div>
  );
}
