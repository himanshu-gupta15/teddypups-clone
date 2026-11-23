'use server';

import { validateEnquiry, type EnquiryState } from '@/lib/enquiry';

/**
 * Validates an enquiry. This demo has no database or inbox, so nothing is stored
 * and personal details are never logged. Connect a mailer or CRM here to go live.
 */
export async function sendEnquiry(_previous: EnquiryState, form: FormData): Promise<EnquiryState> {
  return validateEnquiry(form);
}
