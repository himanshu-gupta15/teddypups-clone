import { PupStop } from '@/components/teddy/PupStop';
import { ChatIcon, FlightIcon, GlobeIcon, HealthIcon } from '@/components/ui/icons';
import { Scene } from '@/components/ui/Scene';
import { Stamps } from '@/components/ui/Stamps';

const ENTRIES = [
  {
    title: 'Vet-checked & healthy',
    text: 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.',
    icon: <HealthIcon className="tp-stamp__icon" />,
  },
  {
    title: 'Korea to Dubai, safely',
    text: 'Trusted breeders, safe travel, and premium care from start to finish.',
    icon: <FlightIcon className="tp-stamp__icon" />,
  },
  {
    title: 'Support 24/7',
    text: 'Always here to help, from choosing your puppy to post-delivery support.',
    icon: <ChatIcon className="tp-stamp__icon" />,
  },
  {
    title: 'Trusted by families worldwide',
    text: 'Puppies delivered to loving homes all around the world.',
    icon: <GlobeIcon className="tp-stamp__icon" />,
  },
];

export function Passport() {
  return (
    <Scene from="#f0b866" to="#a65a30" labelledBy="trust-title" className="tp-passport">
      <div className="gutter mx-auto max-w-[96rem]">
        <div className="tp-book">
          <div className="tp-book__page tp-book__page--left">
            <p aria-hidden className="tp-book__kicker font-scrawl">
              puppy passport
            </p>
            <h2 id="trust-title" className="font-plush tp-book__title">
              Why families trust TeddyPups
            </h2>
            <PupStop className="tp-book__teddy" />
          </div>
          <Stamps items={ENTRIES} className="tp-book__page tp-book__page--right" />
        </div>
      </div>
      <div aria-hidden className="tp-horizon">
        <span className="tp-horizon__sun" />
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="tp-horizon__city">
          <path d="M0 160V118h34v-14h22v-22h30v34h18V96h26v30h22v-18h16v-30h34v40h20V70h28v56h24V98h18v-26h30v54h20v-38h26v-40l14-6 14 6v40h22v46h18V84h26v-30h22v50h24V76h36v50h20V96h18v-58h30v44h14V96h22v-30h16v22h26v-52l6-8v-24l4-6v-30l3-18 3 18v30l4 6v24l6 8v52h26v30h22V82h30v-20h24v48h20V90h28v-36h26v56h18V74h30v36h22V94h26v-24h30v62h20V102h26v20h34v38z" />
        </svg>
      </div>
    </Scene>
  );
}
