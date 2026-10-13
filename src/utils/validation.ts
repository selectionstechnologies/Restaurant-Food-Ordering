export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Accepts common international formats: +1 (555) 123-4567, 0300 1234567, etc. */
export const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

export function hasEnoughDigits(value: string, min = 7): boolean {
  return value.replace(/\D/g, '').length >= min;
}
