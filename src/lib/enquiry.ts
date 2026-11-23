export type EnquiryState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<'name' | 'phone' | 'email' | 'area' | 'message', string>>;
};

const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();

/** Pure validation, shared by the server action and the unit tests. */
export function validateEnquiry(form: FormData): EnquiryState {
  // Honeypot: people never see this field, so a filled one is a bot. Answer as if it worked.
  if (text(form, 'website')) return { ok: true };

  const errors: EnquiryState['errors'] = {};
  const name = text(form, 'name');
  const phone = text(form, 'phone');
  const email = text(form, 'email');

  if (name.length < 2 || name.length > 80) errors.name = 'Please tell us your name.';
  if (!/^\+?[\d\s().-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g, '')))
    errors.phone = 'Please add a phone number with country code, e.g. +971 50 123 4567.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email address does not look right.';
  if (text(form, 'area').length > 80) errors.area = 'Please shorten your area.';
  if (text(form, 'message').length > 2000) errors.message = 'Please keep your message under 2,000 characters.';

  return Object.keys(errors).length ? { ok: false, message: 'Please check the highlighted fields.', errors } : { ok: true };
}
