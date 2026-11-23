import Link from 'next/link';
import { PupStop } from '@/components/teddy/PupStop';
import { Photo } from '@/components/ui/Photo';
import { Scene } from '@/components/ui/Scene';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { availablePuppies } from '@/lib/data';

export function Homecoming() {
  const pup = availablePuppies[0];
  return (
    <Scene dark from="#2f1a10" to="#24130b" labelledBy="cta-title" className="tp-home">
      <div className="tp-home__copy gutter">
        <h2 id="cta-title" className="font-plush text-huge">
          Ready to meet your new best friend?
        </h2>
        <p className="tp-home__lede">
          Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match
          and ensure a smooth, safe delivery across the UAE.
        </p>
      </div>
      <div className="tp-house">
        <span aria-hidden className="tp-house__plant tp-house__plant--left" />
        <span aria-hidden className="tp-house__lamp" />
        <div className="tp-house__doorway">
          <span className="tp-house__inside">
            <Photo media={pup.cover} sizes="13rem" alt={`${pup.displayName}, waiting inside`} />
          </span>
          <span aria-hidden className="tp-house__door">
            <span className="tp-house__peep" />
            <span className="tp-house__knob" />
          </span>
        </div>
        <span aria-hidden className="tp-house__plant tp-house__plant--right" />
        <span aria-hidden className="tp-house__mat font-scrawl">
          welcome home
        </span>
        <PupStop pose="bow" className="tp-house__teddy" />
      </div>
      <div className="tp-home__actions gutter">
        <WhatsAppLink className="btn btn-whatsapp">Enquire on WhatsApp</WhatsAppLink>
        <Link className="btn btn-ghost tp-home__ghost" href="/contact">
          Visit &amp; contact
        </Link>
      </div>
    </Scene>
  );
}
