import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PupStop } from '@/components/teddy/PupStop';
import { Scallops } from '@/components/ui/icons';
import { Scene } from '@/components/ui/Scene';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { availablePuppies } from '@/lib/data';
import { site } from '@/lib/site';
import { HeroLineup } from './HeroLineup';

export function Hero() {
  return (
    <Scene from="#fffdf8" to="#fff1d8" labelledBy="hero-title" className="tp-hero" style={{ '--quilt': '#fff1d8' } as CSSProperties}>
      <span aria-hidden className="tp-hero__sun" />
      <div className="tp-hero__copy gutter">
        <p className="tp-hero__note font-scrawl">
          {site.tagline}
          <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-toffee" aria-hidden>
            <path
              d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <h1 id="hero-title" className="tp-hero__title font-plush">
          <span className="tp-hero__line">Premium teacup</span> <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
        </h1>
        <p className="tp-hero__lede">
          Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
        </p>
        <div className="tp-hero__actions">
          <Link className="btn btn-primary" href="/puppies">
            View available puppies
          </Link>
          <WhatsAppLink className="btn btn-ghost">Enquire on WhatsApp</WhatsAppLink>
        </div>
      </div>
      <div className="tp-hero__stage">
        <HeroLineup friends={availablePuppies} />
        <PupStop
          pose="peek"
          act="peekaboo"
          behind
          lane
          className="tp-hero__teddy"
          label="Teddy, the TeddyPups puppy, peeking over the quilt"
        />
        <div aria-hidden className="tp-quilt">
          <Scallops id="tp-scallop" className="tp-quilt__edge" fill="var(--quilt)" />
        </div>
      </div>
    </Scene>
  );
}
