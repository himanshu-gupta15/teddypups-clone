import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { Heart } from '@/components/ui/icons';
import { Photo } from '@/components/ui/Photo';
import { RevealScope } from '@/components/ui/RevealScope';
import { gonePuppies } from '@/lib/data';

export const metadata: Metadata = { title: 'Gone home', description: 'TeddyPups puppies who have already joined their families.' };

const TILTS = [-1.4, 1.1, -0.6, 1.6, -1.1, 0.8];

export default function GoneHomePage() {
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <Heart className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them? Tell us — we&apos;ll help you find your
              match.
            </p>
            <Link className="btn btn-primary mt-8" href="/puppies">
              See available puppies
            </Link>
          </div>
          <div aria-hidden className="tp-booth">
            <PupBuddy pose="peek" className="tp-booth__teddy" />
            <div className="tp-booth__counter">
              <span className="font-plush">tickets home</span>
            </div>
          </div>
        </header>
        <RevealScope>
          <ul className="tp-tickets" aria-label="Puppies who have gone home">
            {gonePuppies.map((pup, i) => (
              <li
                key={pup.id}
                className="tp-ticket"
                data-reveal
                style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--i': i % TILTS.length } as CSSProperties}
              >
                <Link className="tp-ticket__link" href={`/puppies/${pup.slug}`}>
                  <span className="tp-ticket__main">
                    <span className="tp-ticket__photo">
                      <Photo media={pup.cover} sizes="(min-width: 640px) 9rem, 30vw" />
                    </span>
                    <span className="tp-ticket__body">
                      <span className="font-scrawl tp-ticket__kicker">one ticket home</span>
                      <span className="font-plush tp-ticket__name">{pup.displayName}</span>
                      <span className="tp-ticket__meta">
                        {pup.name ? `${pup.breed}, ${pup.genderLabel.toLowerCase()}` : pup.genderLabel}
                      </span>
                      <span className="tp-ticket__route">
                        <span>{pup.origin === 'local' ? 'Dubai showroom' : 'TeddyPups'}</span>
                        <svg viewBox="0 0 60 12" aria-hidden>
                          <path d="M2 6h46" />
                          <path d="M44 2l6 4-6 4" />
                        </svg>
                        <span>home ♥</span>
                      </span>
                    </span>
                  </span>
                  <span aria-hidden className="tp-ticket__stub">
                    <span className="font-plush">admit one</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RevealScope>
      </div>
    </div>
  );
}
