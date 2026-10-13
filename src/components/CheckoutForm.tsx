import { Banknote, CreditCard, Info, Store, Truck } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CheckoutDetails, FulfillmentMethod, PaymentMethod } from '../types';
import { config } from '../utils/config';
import { cn } from '../utils/format';
import { EMAIL_PATTERN, hasEnoughDigits, PHONE_PATTERN } from '../utils/validation';
import { FormField } from './FormField';

export const CHECKOUT_FORM_ID = 'checkout-form';

interface CheckoutFormProps {
  onSubmit: (details: CheckoutDetails) => Promise<void> | void;
  onFulfillmentChange: (method: FulfillmentMethod) => void;
}

function OptionCard({
  checked,
  disabled,
  icon: Icon,
  title,
  description,
  children,
}: {
  checked: boolean;
  disabled?: boolean;
  icon: typeof Truck;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        'relative flex gap-4 rounded-2xl border-2 bg-white p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-tomato',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        checked ? 'border-tomato' : 'border-charcoal/10 hover:border-charcoal/30',
      )}
    >
      {children}
      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl', checked ? 'bg-tomato text-cream' : 'bg-beige')}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="block text-sm text-charcoal-500">{description}</span>
      </span>
    </label>
  );
}

export function CheckoutForm({ onSubmit, onFulfillmentChange }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setFocus,
    formState: { errors, submitCount },
  } = useForm<CheckoutDetails>({
    defaultValues: { fulfillment: 'delivery', paymentMethod: 'cod' },
    mode: 'onTouched',
  });

  const fulfillment = watch('fulfillment');
  const paymentMethod = watch('paymentMethod');
  const isDelivery = fulfillment === 'delivery';

  useEffect(() => onFulfillmentChange(fulfillment), [fulfillment, onFulfillmentChange]);

  // Move focus to the first invalid field after a failed submit.
  useEffect(() => {
    const first = Object.keys(errors)[0] as keyof CheckoutDetails | undefined;
    if (submitCount > 0 && first) setFocus(first);
  }, [submitCount, errors, setFocus]);

  const describedBy = (name: keyof CheckoutDetails) => `${name}-msg`;

  return (
    <form id={CHECKOUT_FORM_ID} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
      {/* Contact */}
      <section className="card p-6 sm:p-8" aria-labelledby="contact-details-heading">
        <h2 id="contact-details-heading" className="text-2xl font-bold">
          1. Your details
        </h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField id="fullName" label="Full name" error={errors.fullName?.message} className="sm:col-span-2">
            <input
              id="fullName"
              autoComplete="name"
              className={cn('input', errors.fullName && 'input-error')}
              aria-invalid={!!errors.fullName}
              aria-describedby={describedBy('fullName')}
              {...register('fullName', {
                required: 'Please enter your full name.',
                minLength: { value: 2, message: 'Name must be at least 2 characters.' },
                maxLength: { value: 80, message: 'Name is too long.' },
              })}
            />
          </FormField>
          <FormField id="email" label="Email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={cn('input', errors.email && 'input-error')}
              aria-invalid={!!errors.email}
              aria-describedby={describedBy('email')}
              {...register('email', {
                required: 'Please enter your email.',
                pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
              })}
            />
          </FormField>
          <FormField id="phone" label="Phone" error={errors.phone?.message} hint="We’ll only call about this order.">
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              className={cn('input', errors.phone && 'input-error')}
              aria-invalid={!!errors.phone}
              aria-describedby={describedBy('phone')}
              {...register('phone', {
                required: 'Please enter your phone number.',
                pattern: { value: PHONE_PATTERN, message: 'Please enter a valid phone number.' },
                validate: (v) => hasEnoughDigits(v) || 'Phone number needs at least 7 digits.',
              })}
            />
          </FormField>
        </div>
      </section>

      {/* Fulfillment */}
      <section className="card p-6 sm:p-8" aria-labelledby="fulfillment-heading">
        <h2 id="fulfillment-heading" className="text-2xl font-bold">
          2. Delivery or pickup
        </h2>
        <fieldset className="mt-6">
          <legend className="sr-only">Choose delivery or pickup</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard checked={isDelivery} icon={Truck} title="Delivery" description="30–45 min (estimate)">
              <input type="radio" value="delivery" className="sr-only" {...register('fulfillment')} />
            </OptionCard>
            <OptionCard checked={!isDelivery} icon={Store} title="Pickup" description="Ready in 15–20 min (estimate)">
              <input type="radio" value="pickup" className="sr-only" {...register('fulfillment')} />
            </OptionCard>
          </div>
        </fieldset>

        {isDelivery ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-6">
            <FormField id="address" label="Street address" error={errors.address?.message} className="sm:col-span-6">
              <input
                id="address"
                autoComplete="street-address"
                className={cn('input', errors.address && 'input-error')}
                aria-invalid={!!errors.address}
                aria-describedby={describedBy('address')}
                {...register('address', {
                  validate: (v, values) =>
                    values.fulfillment !== 'delivery' || (v?.trim().length ?? 0) >= 5 || 'Please enter your delivery address.',
                })}
              />
            </FormField>
            <FormField id="city" label="City" error={errors.city?.message} className="sm:col-span-4">
              <input
                id="city"
                autoComplete="address-level2"
                className={cn('input', errors.city && 'input-error')}
                aria-invalid={!!errors.city}
                aria-describedby={describedBy('city')}
                {...register('city', {
                  validate: (v, values) =>
                    values.fulfillment !== 'delivery' || (v?.trim().length ?? 0) >= 2 || 'Please enter your city.',
                })}
              />
            </FormField>
            <FormField id="postalCode" label="Postal code" error={errors.postalCode?.message} className="sm:col-span-2">
              <input
                id="postalCode"
                autoComplete="postal-code"
                className={cn('input', errors.postalCode && 'input-error')}
                aria-invalid={!!errors.postalCode}
                aria-describedby={describedBy('postalCode')}
                {...register('postalCode', {
                  validate: (v, values) =>
                    values.fulfillment !== 'delivery' ||
                    /^[A-Za-z0-9][A-Za-z0-9\s-]{2,9}$/.test(v?.trim() ?? '') ||
                    'Enter a valid postal code.',
                })}
              />
            </FormField>
            <FormField
              id="deliveryInstructions"
              label="Delivery instructions"
              optional
              error={errors.deliveryInstructions?.message}
              hint="Gate code, floor, landmarks…"
              className="sm:col-span-6"
            >
              <textarea
                id="deliveryInstructions"
                rows={3}
                className={cn('input resize-none', errors.deliveryInstructions && 'input-error')}
                aria-describedby={describedBy('deliveryInstructions')}
                {...register('deliveryInstructions', {
                  maxLength: { value: 200, message: 'Please keep instructions under 200 characters.' },
                })}
              />
            </FormField>
          </div>
        ) : (
          <p className="mt-6 flex items-start gap-3 rounded-2xl bg-olive-50 p-4 text-sm text-olive-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Pick up from Savora, 128 Harvest Lane, Brooklyn. Bring your order number to the counter.
          </p>
        )}
      </section>

      {/* Payment */}
      <section className="card p-6 sm:p-8" aria-labelledby="payment-heading">
        <h2 id="payment-heading" className="text-2xl font-bold">
          3. Payment
        </h2>
        <fieldset className="mt-6">
          <legend className="sr-only">Choose a payment method</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <OptionCard
              checked={paymentMethod === 'cod'}
              icon={Banknote}
              title={isDelivery ? 'Cash on Delivery' : 'Pay at Pickup'}
              description="Pay with cash when you receive your food"
            >
              <input type="radio" value="cod" className="sr-only" {...register('paymentMethod')} />
            </OptionCard>
            <OptionCard
              checked={paymentMethod === 'online'}
              disabled={!config.onlinePaymentEnabled}
              icon={CreditCard}
              title={config.onlinePaymentLabel}
              description={config.onlinePaymentEnabled ? 'Secure hosted payment (demo)' : 'Not configured in this demo'}
            >
              <input
                type="radio"
                value="online"
                className="sr-only"
                disabled={!config.onlinePaymentEnabled}
                {...register('paymentMethod', {
                  validate: (v: PaymentMethod) =>
                    v !== 'online' || config.onlinePaymentEnabled || 'Online payment is not available.',
                })}
              />
            </OptionCard>
          </div>
        </fieldset>
        <p className="mt-5 flex items-start gap-3 rounded-2xl bg-beige/60 p-4 text-sm text-charcoal-700">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-tomato" aria-hidden="true" />
          <span>
            <strong>Demo checkout.</strong> No payment is processed and no card details are ever collected on this site.
            {config.onlinePaymentEnabled &&
              ' In production, online payment would redirect to the provider’s secure hosted page.'}
          </span>
        </p>
      </section>
    </form>
  );
}
