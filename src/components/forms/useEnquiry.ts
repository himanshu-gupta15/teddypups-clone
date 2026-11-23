'use client';

import { useActionState, useTransition, type FormEvent } from 'react';
import { sendEnquiry } from '@/app/actions';
import type { EnquiryState } from '@/lib/enquiry';

/** Submits through the server action without React resetting the fields when validation fails. */
export function useEnquiry() {
  const [state, dispatch, sending] = useActionState<EnquiryState, FormData>(sendEnquiry, { ok: false });
  const [pending, start] = useTransition();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(() => dispatch(data));
  };
  return { state, pending: pending || sending, onSubmit };
}
