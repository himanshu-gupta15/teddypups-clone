import Link from 'next/link';
import { PupStop } from '@/components/teddy/PupStop';
import { Flight } from '@/components/ui/Flight';
import { Skyline } from '@/components/ui/icons';
import { Photo } from '@/components/ui/Photo';
import { Scene } from '@/components/ui/Scene';
import { availablePuppies, showroomPhotos } from '@/lib/data';

export function Paths() {
  return (
    <Scene from="#fbe3b4" to="#f7d18d" labelledBy="paths-title" className="tp-paths">
      <div className="gutter mx-auto max-w-[110rem]">
        <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
          Two ways to meet your puppy
        </h2>
        <div className="tp-fork">
          <div aria-hidden className="tp-fork__post" />
          <article className="tp-way tp-way--left" aria-labelledby="way-local">
            <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
              Puppies in Dubai
            </h3>
            <div className="tp-way__scene">
              <Skyline className="tp-way__skyline" />
              <figure className="tp-window">
                <span className="tp-window__glass">
                  <Photo media={showroomPhotos[0]} sizes="14rem" />
                </span>
                <figcaption className="font-scrawl">In our showroom</figcaption>
              </figure>
            </div>
            <p className="tp-way__text">See them, love them, take them home. Come meet our locally available puppies before you decide.</p>
            <Link className="btn btn-primary" href="/puppies?origin=local">
              Meet local puppies
            </Link>
          </article>
          <article className="tp-way tp-way--right" aria-labelledby="way-imported">
            <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
              Imported for you
            </h3>
            <div className="tp-way__scene">
              <Flight photo={availablePuppies[1].cover.src} label="A plane bringing a Korean Teacup Maltipoo puppy from Korea to Dubai" />
            </div>
            <p className="tp-way__text">
              Exclusive Korean teacup puppies, delivered. Order from the world&apos;s most reputable breeders and let us handle the import.
            </p>
            <Link className="btn btn-primary" href="/puppies?origin=imported">
              See imported puppies
            </Link>
          </article>
          <PupStop className="tp-fork__teddy" />
        </div>
      </div>
    </Scene>
  );
}
