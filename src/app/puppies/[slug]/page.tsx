import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PupNeighbour } from '@/components/puppies/PupNeighbour';
import { PuppyGallery } from '@/components/puppies/PuppyGallery';
import { StoryRibbon } from '@/components/puppies/StoryRibbon';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { Check } from '@/components/ui/icons';
import { Paw } from '@/components/ui/Paw';
import { RevealScope } from '@/components/ui/RevealScope';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { allPuppies, findPuppy, neighbours } from '@/lib/data';
import { site } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => allPuppies.map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pup = findPuppy((await params).slug);
  if (!pup) return {};
  const description = `${pup.displayName}, a ${[pup.genderLabel.toLowerCase(), pup.breed, 'puppy'].filter(Boolean).join(' ')} from ${site.name}.`;
  return { title: pup.displayName, description, openGraph: { title: pup.displayName, description } };
}

const PROMISES = [
  'Vaccinated',
  'Dewormed',
  'Verified health certificate from licensed vets',
  'Thoroughly checked before joining your family',
];
const WAY_HOME = {
  imported: {
    title: 'Coming home from abroad',
    steps: [
      ['Reserve your puppy', 'Tell us which puppy has captured your heart.'],
      ['Personalized consultation', "We finalize details with you and share updates on your puppy's journey."],
      ['Import and arrival', 'We manage health checks, travel arrangements, and documentation.'],
      ['Welcome home', 'We help your new puppy settle in and ensure a smooth transition into your home.'],
    ],
  },
  local: {
    title: 'Coming home in Dubai',
    steps: [
      ['Choose your puppy', 'Tell us which puppy has captured your heart.'],
      ['Meet before you choose', 'Spend time bonding in our Downtown Dubai showroom before making your decision.'],
      ['Pick-up or delivery', 'Take your puppy home the same day, or have them delivered within Dubai.'],
      ['Welcome home', 'We help your new puppy settle in and ensure a smooth transition into your home.'],
    ],
  },
};

function Chapter({ n, children }: { n: number; children: ReactNode }) {
  return (
    <p className="tp-chapter">
      <span aria-hidden className="tp-chapter__n font-plush">
        {n}
      </span>
      <span className="font-scrawl">{children}</span>
    </p>
  );
}

export default async function PuppyPage({ params }: Props) {
  const pup = findPuppy((await params).slug);
  if (!pup) notFound();

  const gone = pup.status === 'rehomed';
  const { previous, next } = neighbours(pup);
  const way = WAY_HOME[pup.origin];
  const nameOrThis = pup.name || 'this puppy';
  const facts = [
    ['Breed', pup.breed],
    ['Boy or girl', pup.genderLabel],
    ['Age', pup.age],
    ['Colour', pup.colour],
    ['Where', pup.origin === 'local' ? 'In Dubai' : 'Imported for you'],
  ].filter(([, value]) => value);

  return (
    <div data-page="pup" className="tp-page">
      <article
        className="tp-storybook"
        style={{
          background: `linear-gradient(180deg, color-mix(in oklab, ${pup.cover.color} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
        }}
      >
        <StoryRibbon />
        <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
          <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
            <Link className="link-ink" href={gone ? '/gone-home' : '/puppies'}>
              {gone ? 'Gone home' : 'Available puppies'}
            </Link>
            <span aria-hidden> / </span>
            <span aria-current="page">{pup.displayName}</span>
          </nav>
          <Chapter n={1}>{gone ? 'the day they went home' : "hello, it's me"}</Chapter>
          <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-7">
              <PuppyGallery name={pup.displayName} media={pup.media} />
            </div>
            <div className="min-w-0 lg:col-span-5">
              <RevealScope className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
                <div className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20" data-reveal>
                  <span aria-hidden className="tp-tag__ring" />
                  <PupBuddy
                    pose="peek"
                    className="absolute -top-[4.8rem] right-6 w-[9.5rem]"
                    label={`Teddy, peeking over ${pup.displayName}'s tag`}
                  />
                  <span className="chip">
                    {gone ? (
                      'Gone home ♥'
                    ) : (
                      <>
                        <Paw className="size-4 text-toffee" />
                        Available
                      </>
                    )}
                  </span>
                  <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{pup.displayName}</h1>
                  {pup.name && <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>}
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                    {facts.map(([label, value]) => (
                      <div key={label}>
                        <dt className="font-scrawl text-sm text-cocoa-soft">{label}</dt>
                        <dd className="mt-0.5 text-[1.05rem] font-semibold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-8 flex flex-col gap-3">
                    <WhatsAppLink className="btn btn-whatsapp">
                      {gone ? 'Ask about a puppy like this' : `Ask about ${nameOrThis} on WhatsApp`}
                    </WhatsAppLink>
                    <a href={`#enquire-${pup.slug}`} className="btn btn-ghost">
                      Send an enquiry
                    </a>
                  </div>
                </div>
                <div className="tp-paper mt-8 -rotate-1">
                  <Chapter n={2}>what comes with {nameOrThis}</Chapter>
                  <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                  <ul className="mt-4 space-y-2.5">
                    {PROMISES.map((promise) => (
                      <li key={promise} className="flex items-start gap-3 font-semibold">
                        <Check className="mt-0.5 size-6 shrink-0 text-toffee-deep" />
                        {promise}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealScope>
            </div>
          </div>
          {!gone && (
            <section aria-labelledby="way-home" className="mt-20">
              <Chapter n={3}>the way home</Chapter>
              <h2 id="way-home" className="font-plush text-big mt-3">
                {way.title}
              </h2>
              <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
                {way.steps.map(([title, text], i) => (
                  <li key={title}>
                    <span aria-hidden className="tp-trail__num font-plush">
                      {i + 1}
                    </span>
                    <h3 className="font-plush-text text-xl font-bold leading-tight">{title}</h3>
                    <p className="mt-2 max-w-[38ch] text-cocoa-soft">{text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <section id={`enquire-${pup.slug}`} aria-labelledby="enquire-title" className="tp-letter mt-20 grid gap-10 lg:grid-cols-12">
            <span aria-hidden className="tp-letter__stamp">
              <Paw className="size-9" />
            </span>
            <div className="lg:col-span-4">
              <Chapter n={gone ? 3 : 4}>dear TeddyPups…</Chapter>
              <h2 id="enquire-title" className="font-plush text-big mt-2">
                {gone ? 'Looking for a puppy like this?' : `Ask about ${nameOrThis}`}
              </h2>
              <p className="mt-4 text-cocoa-soft">
                Leave your details and our team will get back to you promptly — or message us on WhatsApp for the quickest reply.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <EnquiryForm puppyId={pup.id} puppyLabel={pup.name ? `${pup.displayName} (${pup.breed})` : pup.displayName} />
            </div>
          </section>
          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            <PupNeighbour pup={previous} label="Previous pup" />
            <PupNeighbour pup={next} label="Next pup" />
          </nav>
        </div>
      </article>
    </div>
  );
}
