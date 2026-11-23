import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { MemoryWall } from '@/components/families/MemoryWall';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { Heart } from '@/components/ui/icons';
import { RevealScope } from '@/components/ui/RevealScope';
import { testimonial } from '@/lib/content';
import { wallPhotos } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Happy families',
  description: 'Real photos shared by TeddyPups families after welcoming their new puppy home.',
};

export default function HappyFamiliesPage() {
  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <RevealScope className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal>
                our wall of happy endings
              </p>
              <h1 id="families-title" className="font-plush text-giant tp-memories__title" data-reveal>
                Happy families
                <Heart className="tp-memories__heart" />
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal>
                Nothing makes us happier than seeing our puppies in loving homes! Here are some beautiful moments shared by our amazing
                clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal>
                {wallPhotos.length} moments and counting
              </p>
            </div>
            <figure className="tp-memories__note" data-reveal>
              <span aria-hidden className="tp-tape tp-tape--center" style={{ '--tape': '#cfe5f6' } as CSSProperties} />
              <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
              <figcaption className="font-scrawl">
                {testimonial.author}, {testimonial.location}
              </figcaption>
            </figure>
          </RevealScope>
          <div className="mt-16 md:mt-20">
            <MemoryWall photos={wallPhotos} />
          </div>
          <div className="tp-memories__foot">
            <PupBuddy facing="left" className="w-36 md:w-44" label="Teddy, admiring the wall" />
            <p className="font-scrawl text-lg text-cocoa-soft">every one of them was a Teddy Pup once</p>
          </div>
        </div>
      </section>
    </div>
  );
}
