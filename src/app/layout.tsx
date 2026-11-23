import type { Metadata, Viewport } from 'next';
import { Figtree, Fraunces, Shantell_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { PawTrail } from '@/components/layout/PawTrail';
import { RouteCurtain } from '@/components/layout/RouteCurtain';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { WhatsAppBar } from '@/components/layout/WhatsAppBar';
import { PupJourney } from '@/components/teddy/PupJourney';
import { site } from '@/lib/site';
import './globals.css';

const fraunces = Fraunces({ subsets: ['latin'], axes: ['SOFT', 'WONK', 'opsz'], variable: '--font-fraunces' });
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' });
const shantell = Shantell_Sans({ subsets: ['latin'], axes: ['BNCE', 'INFM', 'SPAC'], variable: '--font-shantell' });

export const metadata: Metadata = {
  title: { default: `${site.name} — Premium teacup puppies in Dubai`, template: `%s | ${site.name}` },
  description: site.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#fffdf8', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${figtree.variable} ${shantell.variable}`}>
      <body>
        <RouteCurtain />
        <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-cocoa px-5 py-3 font-semibold text-milk">
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
          {children}
          <PupJourney />
        </main>
        <Footer />
        <WhatsAppBar />
        <PawTrail />
      </body>
    </html>
  );
}
