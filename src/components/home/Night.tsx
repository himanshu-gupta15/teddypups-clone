import Link from 'next/link';
import { PupStop } from '@/components/teddy/PupStop';
import { Star, Stars } from '@/components/ui/icons';
import { Scene } from '@/components/ui/Scene';
import { faqs } from '@/lib/content';

const STARS: [number, number, number][] = [
  [8, 12, 16.2],
  [22, 30, 9],
  [41, 8, 12.6],
  [57, 22, 8.1],
  [72, 6, 14.4],
  [88, 18, 10.8],
  [95, 42, 9],
  [4, 58, 10.8],
  [34, 70, 7.2],
  [63, 84, 9.9],
  [83, 66, 12.6],
];

export function Night() {
  return (
    <Scene dark from="#4d2b19" to="#2f1a10" labelledBy="questions-title" className="tp-night">
      <div aria-hidden className="tp-night__stars pointer-events-none">
        <Stars points={STARS} />
      </div>
      <div className="tp-night__grid gutter">
        <div className="tp-night__intro">
          <h2 id="questions-title" className="font-plush text-huge">
            Questions, answered
          </h2>
          <Link className="btn btn-ghost tp-night__cta" href="/faq">
            Read all questions
          </Link>
          <div className="tp-night__pup">
            <span aria-hidden className="tp-night__wonder font-plush">
              ?
            </span>
            <PupStop act="tilt" className="tp-night__teddy" />
          </div>
        </div>
        <dl className="tp-night__list">
          {faqs.slice(0, 3).map((faq) => (
            <div key={faq.id} className="tp-qa">
              <dt className="font-plush tp-qa__q">
                <Star className="tp-qa__star" />
                {faq.question}
              </dt>
              <dd className="tp-qa__a">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Scene>
  );
}
