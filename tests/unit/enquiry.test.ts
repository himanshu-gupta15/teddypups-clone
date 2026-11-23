import { describe, expect, it } from 'vitest';
import { validateEnquiry } from '@/lib/enquiry';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};
const valid = { name: 'Aisha', phone: '+971 50 123 4567' };

describe('validateEnquiry', () => {
  it('accepts a name and phone number', () => expect(validateEnquiry(form(valid)).ok).toBe(true));
  it('requires a name and phone number', () => {
    const { ok, errors } = validateEnquiry(form({}));
    expect(ok).toBe(false);
    expect(Object.keys(errors!)).toEqual(['name', 'phone']);
  });
  it.each(['12', 'call me', '+971 50 12 34 56 78 90 12 34'])('rejects the phone number %s', (phone) =>
    expect(validateEnquiry(form({ ...valid, phone })).errors?.phone).toBeTruthy(),
  );
  it('checks email only when given', () => {
    expect(validateEnquiry(form({ ...valid, email: 'nope' })).errors?.email).toBeTruthy();
    expect(validateEnquiry(form({ ...valid, email: 'a@b.co' })).ok).toBe(true);
  });
  it('limits the message length', () =>
    expect(validateEnquiry(form({ ...valid, message: 'x'.repeat(2001) })).errors?.message).toBeTruthy());
  it('quietly accepts bots that fill the honeypot', () => expect(validateEnquiry(form({ website: 'spam.example' }))).toEqual({ ok: true }));
});
