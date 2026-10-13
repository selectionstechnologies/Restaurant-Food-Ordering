import { CheckCircle2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '../utils/format';
import { EMAIL_PATTERN } from '../utils/validation';

interface NewsletterForm {
  email: string;
}

export function Newsletter() {
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterForm>();

  const onSubmit = async ({ email }: NewsletterForm) => {
    await new Promise((r) => setTimeout(r, 600));
    setSubscribed(email);
    reset();
  };

  return (
    <section className="container-page py-20" aria-labelledby="newsletter-heading">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-olive px-6 py-14 text-cream sm:px-12 lg:px-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-olive-500/50 blur-2xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-tomato/30 blur-3xl" aria-hidden="true" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">Newsletter</p>
            <h2 id="newsletter-heading" className="mt-3 text-3xl font-bold sm:text-4xl">
              Get first bites of new dishes &amp; exclusive offers
            </h2>
            <p className="mt-4 text-cream/80">
              One delicious email a week. Seasonal menus, chef’s notes and member-only deals. Unsubscribe anytime.
            </p>
          </div>

          {subscribed ? (
            <div role="status" className="flex items-start gap-4 rounded-3xl bg-cream/10 p-6 backdrop-blur">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-cream" aria-hidden="true" />
              <div>
                <p className="font-semibold">You’re on the list!</p>
                <p className="mt-1 text-sm text-cream/80">
                  We’ll send the next issue to {subscribed}. (Demo — no email is actually sent.)
                </p>
                <button type="button" onClick={() => setSubscribed(null)} className="mt-3 text-sm font-semibold underline">
                  Subscribe another email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal-400" aria-hidden="true" />
                  <input
                    id="newsletter-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'newsletter-error' : undefined}
                    className={cn('input rounded-full py-4 pl-12', errors.email && 'input-error')}
                    {...register('email', {
                      required: 'Please enter your email address.',
                      pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
                    })}
                  />
                </div>
                <button type="submit" disabled={isSubmitting} className="btn-primary py-4">
                  {isSubmitting ? 'Subscribing…' : 'Subscribe'}
                </button>
              </div>
              {errors.email && (
                <p id="newsletter-error" role="alert" className="mt-2 text-sm font-medium text-cream">
                  {errors.email.message}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
