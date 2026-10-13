import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '../utils/format';
import { EMAIL_PATTERN, hasEnoughDigits, PHONE_PATTERN } from '../utils/validation';
import { FormField } from './FormField';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const MESSAGE_MAX = 600;

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ mode: 'onTouched' });
  const messageLength = watch('message')?.length ?? 0;

  const onSubmit = async (values: ContactFormValues) => {
    // Simulated send — connect to a form backend or email service in production.
    await new Promise((r) => setTimeout(r, 900));
    setSentTo(values.name.split(' ')[0] ?? values.name);
    reset();
  };

  if (sentTo) {
    return (
      <div role="status" className="card flex flex-col items-center p-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-olive-100 text-olive">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-2xl font-bold">Thanks, {sentTo}!</h2>
        <p className="mt-2 max-w-sm text-charcoal-600">
          Your message is on its way. We usually reply within one business day. (Demo — no message was actually sent.)
        </p>
        <button type="button" onClick={() => setSentTo(null)} className="btn-outline mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Send us a message</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Name" error={errors.name?.message}>
          <input
            id="contact-name"
            autoComplete="name"
            className={cn('input', errors.name && 'input-error')}
            aria-invalid={!!errors.name}
            aria-describedby="contact-name-msg"
            {...register('name', {
              required: 'Please enter your name.',
              minLength: { value: 2, message: 'Name must be at least 2 characters.' },
            })}
          />
        </FormField>
        <FormField id="contact-email" label="Email" error={errors.email?.message}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            className={cn('input', errors.email && 'input-error')}
            aria-invalid={!!errors.email}
            aria-describedby="contact-email-msg"
            {...register('email', {
              required: 'Please enter your email.',
              pattern: { value: EMAIL_PATTERN, message: 'Please enter a valid email address.' },
            })}
          />
        </FormField>
      </div>
      <FormField id="contact-phone" label="Phone" optional error={errors.phone?.message}>
        <input
          id="contact-phone"
          type="tel"
          autoComplete="tel"
          className={cn('input', errors.phone && 'input-error')}
          aria-invalid={!!errors.phone}
          aria-describedby="contact-phone-msg"
          {...register('phone', {
            validate: (v) =>
              !v || (PHONE_PATTERN.test(v) && hasEnoughDigits(v)) || 'Please enter a valid phone number.',
          })}
        />
      </FormField>
      <FormField
        id="contact-message"
        label="Message"
        error={errors.message?.message}
        hint={`${messageLength}/${MESSAGE_MAX} characters`}
      >
        <textarea
          id="contact-message"
          rows={5}
          maxLength={MESSAGE_MAX}
          className={cn('input resize-none', errors.message && 'input-error')}
          aria-invalid={!!errors.message}
          aria-describedby="contact-message-msg"
          placeholder="Questions, feedback, catering or private events…"
          {...register('message', {
            required: 'Please enter a message.',
            minLength: { value: 10, message: 'Please write at least 10 characters.' },
          })}
        />
      </FormField>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" /> Send message
          </>
        )}
      </button>
    </form>
  );
}
