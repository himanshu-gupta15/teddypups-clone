'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Polaroid } from '@/components/families/Polaroid';
import { usePhotoViewer } from '@/components/families/PhotoViewer';
import { PupStop } from '@/components/teddy/PupStop';
import { RevealScope } from '@/components/ui/RevealScope';
import { Scene } from '@/components/ui/Scene';
import type { Media, Testimonial } from '@/lib/types';

const SIZES = '(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw';
/** Prints appear in this order, as if someone is hanging them one by one. */
const HANG_ORDER = [3, 0, 5, 1, 6, 2, 7, 4];

export function Dusk({ photos, testimonial }: { photos: Media[]; testimonial: Testimonial }) {
  const { open, viewer } = usePhotoViewer(photos);
  return (
    <Scene dark from="#a65a30" to="#4d2b19" labelledBy="dusk-title" className="tp-dusk">
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">
            Happy families &amp; puppies
          </h2>
          <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">
            We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared
            by our valued clients who welcomed a Teddy Pup into their homes and hearts.
          </p>
        </div>
        <figure className="tp-dusk__note">
          <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
          <figcaption className="font-scrawl">
            {testimonial.author}, {testimonial.location}
          </figcaption>
        </figure>
      </div>
      <div className="tp-photowall">
        <RevealScope className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {photos.slice(0, 8).map((photo, i) => (
              <li key={photo.id} data-reveal style={{ '--d': `${110 * HANG_ORDER[i]}ms` } as CSSProperties}>
                <button
                  type="button"
                  className="tp-photowall__print"
                  onClick={() => open(i)}
                  aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
                >
                  <Polaroid media={photo} order={i} sizes={SIZES} />
                </button>
              </li>
            ))}
          </ul>
          <div className="tp-facade__ground">
            <span aria-hidden className="tp-facade__door" />
            <span aria-hidden className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            <Link className="btn btn-primary tp-facade__cta" href="/happy-families">
              See every happy family
            </Link>
            <PupStop className="tp-dusk__teddy" />
          </div>
        </RevealScope>
        <div aria-hidden className="tp-street__pavement" />
      </div>
      {viewer}
    </Scene>
  );
}
