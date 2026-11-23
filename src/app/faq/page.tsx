import type { Metadata } from 'next';
import { NoticeBoard } from '@/components/faq/NoticeBoard';
import { Scene } from '@/components/ui/Scene';
import { faqs } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Questions & answers',
  description:
    'Answers about TeddyPups puppies: health checks and vaccinations, meeting local puppies, imported teacup breeds and delivery.',
};

export default function FaqPage() {
  return (
    <div data-page="faq" className="tp-page">
      <Scene dark from="#a95e32" to="#331c11" labelledBy="faq-title" className="tp-faqroom overflow-hidden">
        <div className="gutter relative mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="max-w-4xl">
            <h1 id="faq-title" className="font-plush text-giant">
              Questions &amp; answers
            </h1>
            <p className="text-lede mt-6 max-w-[52ch] text-[var(--ink-soft)]">
              Can&apos;t find what you&apos;re looking for? Message us on WhatsApp — our team is available 24/7.
            </p>
          </header>
          <div className="mt-12 md:mt-16">
            <NoticeBoard faqs={faqs} />
          </div>
        </div>
      </Scene>
    </div>
  );
}
