'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cuePup } from '@/components/teddy/cue';
import { PupStop } from '@/components/teddy/PupStop';
import { PAW_PATH } from '@/components/ui/Paw';
import { Photo } from '@/components/ui/Photo';
import { Scene } from '@/components/ui/Scene';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { breeds, showroomPhotos, showroomVideo } from '@/lib/data';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';
import { site } from '@/lib/site';
import type { Media } from '@/lib/types';

const STEPS = [
  {
    title: 'Choose your breed',
    text: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
  },
  {
    title: 'Get photos & details',
    text: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.',
  },
  {
    title: 'Secure & safe delivery',
    text: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.',
  },
];
const REACTIONS = [undefined, 'ooh, photos!', 'home soon!'];

function Clip({ media }: { media: Media }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    const video = ref.current!;
    if (video.paused)
      video
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    else {
      video.pause();
      setPlaying(false);
    }
  };
  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video
          ref={ref}
          src={media.src}
          poster={media.poster?.src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.alt || 'A puppy video'}
        />
        <button
          type="button"
          className="tp-clip__play"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d={playing ? 'M7 5h3v14H7zM14 5h3v14h-3z' : 'M8 5v14l11-7z'} />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Route() {
  return (
    <svg viewBox="0 0 220 70" className="tp-route" aria-hidden>
      <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
      <circle cx="14" cy="52" r="5" className="tp-route__dot" />
      <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
      <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
      <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
      <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
    </svg>
  );
}

/** Three steps on the left; as each becomes active, the next messages arrive in the pinned phone. */
export function Chat() {
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const showAll = reduced || !desktop;
  const [step, setStep] = useState(-1);
  const [typing, setTyping] = useState(false);
  const stepsRef = useRef<HTMLOListElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const lastStep = useRef(-1);
  const active = showAll ? STEPS.length - 1 : step;

  useEffect(() => {
    if (showAll) return;
    const items = [...stepsRef.current!.children];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setStep(items.indexOf(entry.target));
      },
      { rootMargin: '-28% 0px -62% 0px' },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [showAll]);

  useEffect(() => {
    if (showAll) return;
    const forward = step > lastStep.current;
    lastStep.current = step;
    if (!forward || step < 0) return;
    const start = setTimeout(() => setTyping(true), 0);
    const finish = setTimeout(() => {
      setTyping(false);
      const group = screenRef.current?.querySelector(`[data-step="${step}"]`);
      if (group) cuePup({ look: group, seconds: 1.4, say: REACTIONS[step] });
    }, 750);
    return () => {
      clearTimeout(start);
      clearTimeout(finish);
      setTyping(false);
    };
  }, [step, showAll]);

  const isTyping = typing && !showAll;
  const shown = (i: number) => i < active || (i === active && !isTyping);

  return (
    <Scene from="#f7d18d" to="#f0b866" labelledBy="journey-title" className="tp-chat">
      <div className="tp-chat__grid gutter" data-pin-range>
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">
            Your puppy journey
          </h2>
          <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">
            A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
          </p>
          <ol ref={stepsRef} className="tp-chat__steps">
            {STEPS.map((item, i) => (
              <li key={item.title} className="tp-chat__step" data-active={i === active || undefined} data-done={i < active || undefined}>
                <span className="tp-chat__num font-plush" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{item.title}</h3>
                <p className="tp-chat__text">{item.text}</p>
              </li>
            ))}
          </ol>
          <Link className="btn btn-ghost tp-chat__cta" href="/how-it-works">
            How it works
          </Link>
        </div>
        <div className="tp-chat__side">
          <div className="tp-phone" aria-label={`A WhatsApp conversation with ${site.name}`} role="group">
            <div className="tp-phone__bar">
              <Image src="/brand/logo.png" alt="" width={40} height={40} className="tp-phone__avatar" />
              <span>
                <span className="tp-phone__name">{site.name}</span>
                <span className="tp-phone__status">{isTyping ? 'typing…' : 'online'}</span>
              </span>
            </div>
            <div ref={screenRef} className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">{site.greeting}</p>
              <div className="tp-msg-group" data-step={0} data-show={shown(0)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[0].text}</p>
                  <ul className="tp-chips" aria-label="Breeds we have now">
                    {breeds.map((breed) => (
                      <li key={breed.slug}>
                        <Link href={`/puppies?breed=${breed.slug}`}>{breed.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="tp-msg-group" data-step={1} data-show={shown(1)}>
                <div className="tp-msg tp-msg--them tp-msg--media">
                  <div className="tp-snaps">
                    {showroomPhotos.map((photo) => (
                      <span key={photo.id} className="tp-snaps__one">
                        <Photo media={photo} sizes="9rem" />
                      </span>
                    ))}
                  </div>
                </div>
                {showroomVideo && <Clip media={showroomVideo} />}
                <p className="tp-msg tp-msg--them">{STEPS[1].text}</p>
              </div>
              <div className="tp-msg-group" data-step={2} data-show={shown(2)}>
                <div className="tp-msg tp-msg--them">
                  <p>{STEPS[2].text}</p>
                  <Route />
                </div>
              </div>
              <p className="tp-typing" data-show={isTyping} aria-hidden>
                <span />
                <span />
                <span />
              </p>
            </div>
            <WhatsAppLink className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </WhatsAppLink>
          </div>
          <PupStop className="tp-chat__teddy" />
        </div>
      </div>
    </Scene>
  );
}
