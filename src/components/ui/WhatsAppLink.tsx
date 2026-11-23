import type { ReactNode } from 'react';
import { site } from '@/lib/site';

export function WhatsAppLink({ className, children }: { className: string; children: ReactNode }) {
  return (
    <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
