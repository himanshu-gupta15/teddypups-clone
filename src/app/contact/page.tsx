import type { Metadata } from 'next';
import { LetterForm } from '@/components/forms/LetterForm';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { Skyline } from '@/components/ui/icons';
import { Paw } from '@/components/ui/Paw';
import { Photo } from '@/components/ui/Photo';
import { Scene } from '@/components/ui/Scene';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { availablePuppies, puppyLabel, showroomPhotos } from '@/lib/data';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Visit & contact',
  description: 'Visit TeddyPups in Downtown Dubai or get in touch on WhatsApp, by phone or email.',
};

export default function ContactPage() {
  return (
    <div data-page="contact" className="tp-page">
      <Scene from="#fff9ee" to="#f9dca4" labelledBy="contact-title">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team will get back to you promptly. Whether
              ready to adopt or just seeking info, we&apos;d love to hear from you!
            </p>
          </header>
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm puppies={availablePuppies.map((p) => ({ id: p.id, label: puppyLabel(p) }))} />
              <PupBuddy facing="left" className="-mt-3 ml-auto mr-6 w-36 md:w-40" label="Teddy, waiting for your letter" />
            </div>
            <div className="lg:col-span-5 lg:row-start-1">
              <WhatsAppLink className="btn btn-whatsapp w-full sm:w-auto">WhatsApp {site.phoneDisplay}</WhatsAppLink>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={site.phoneHref}>
                      {site.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href={`mailto:${site.email}`}>
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <Skyline className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <Paw className="size-5 shrink-0 text-toffee-deep" />
                      {site.address}
                    </p>
                    <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-6 !bg-milk">
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <Photo media={showroomPhotos[3]} sizes="(min-width: 640px) 12rem, 80vw" />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Scene>
    </div>
  );
}
