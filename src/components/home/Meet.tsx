'use client';

import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState, useEffect, type CSSProperties } from 'react';
import { cuePup } from '@/components/teddy/cue';
import { PupStop } from '@/components/teddy/PupStop';
import { Paw } from '@/components/ui/Paw';
import { Photo } from '@/components/ui/Photo';
import { Scene } from '@/components/ui/Scene';
import { statusLabels } from '@/lib/data';
import { useReducedMotion } from '@/lib/hooks';
import type { Puppy } from '@/lib/types';

const DOORS = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e'];
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function Door({ pup, index }: { pup: Puppy; index: number }) {
  const meta = [pup.name && pup.breed, pup.genderLabel.toLowerCase(), pup.age, pup.media.some((m) => m.kind === 'video') && 'with video'];
  return (
    <Link href={`/puppies/${pup.slug}`} className="tp-door__link" style={{ '--door': DOORS[index % DOORS.length] } as CSSProperties}>
      <span className="tp-door__plate">
        <span className="font-plush tp-door__name">{pup.displayName}</span>
        <span className="tp-door__meta">{meta.filter(Boolean).join(', ')}</span>
      </span>
      <span className="tp-door__frame">
        <span className="tp-door__room">
          <Photo media={pup.cover} sizes="(min-width: 1024px) 15rem, 44vw" />
        </span>
        <span aria-hidden className="tp-door__way">
          <span className="tp-door__leaf">
            <Paw className="tp-door__peephole" />
            <span className="tp-door__knob" />
          </span>
        </span>
        <span className="tp-door__tag font-scrawl">{statusLabels[pup.status]}</span>
      </span>
    </Link>
  );
}

/**
 * On desktop the section pins and vertical scroll slides a hallway of doors sideways;
 * each door opens as it reaches Teddy. On small screens it is a plain grid.
 */
export function Meet({ puppies }: { puppies: Puppy[] }) {
  const reduced = useReducedMotion();
  const rangeRef = useRef<HTMLDivElement>(null);
  const hallRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [overflow, setOverflow] = useState(0);
  const [pinned, setPinned] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current!;
    const hall = hallRef.current!;
    const stage = hall.parentElement!;
    const measure = () => {
      const pin = matchMedia('(min-width: 1024px)').matches && !reduced;
      setPinned(pin);
      if (pin) {
        // Size doors to fit between the heading and the floor at any window height.
        const head = stage.querySelector<HTMLElement>('.tp-meet__head')!;
        const plates = [...track.querySelectorAll<HTMLElement>('.tp-door__plate')].map((p) => p.offsetHeight);
        const floor = stage.querySelector<HTMLElement>('.tp-meet__floor')?.offsetHeight ?? 0;
        const room = stage.clientHeight - (head.offsetTop + head.offsetHeight) - floor - Math.max(64, ...plates) - 40;
        hall.style.setProperty('--door-w', `${Math.max(128, Math.min(256, 0.15 * innerWidth, room / 1.3)).toFixed(0)}px`);
      } else hall.style.removeProperty('--door-w');
      setOverflow(Math.max(0, track.scrollWidth - innerWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(stage);
    addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      removeEventListener('resize', measure);
    };
  }, [reduced]);

  const { scrollYProgress } = useScroll({ target: rangeRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });
  const x = useTransform(progress, [0, 1], [0, -overflow]);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const update = (offset: number, announce: boolean) => {
      hallRef.current?.style.setProperty('--floor-x', `${offset.toFixed(1)}px`);
      for (const door of track.children as HTMLCollectionOf<HTMLElement>) {
        const open = door.offsetLeft + offset < 0.36 * innerWidth;
        if ((door.dataset.open === 'true') === open) continue;
        door.dataset.open = String(open);
        if (open && announce) cuePup({ look: door, seconds: 0.9 });
      }
    };
    update(x.get(), false);
    return x.on('change', (value) => update(value, true));
  }, [pinned, x]);

  return (
    <Scene from="#fff1d8" to="#fbe3b4" labelledBy="meet-title" className="tp-meet" pinned={pinned}>
      <div
        ref={rangeRef}
        data-pin-range
        style={
          { height: pinned ? `calc(100vh + ${Math.round(0.8 * overflow)}px)` : undefined, '--pinned': pinned ? 1 : 0 } as CSSProperties
        }
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                Meet the pups
              </h2>
              <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">
                Real puppies, real photos, looking for their families right now.
              </p>
            </div>
            <Link className="btn btn-primary shrink-0" href="/puppies">
              See all available puppies
            </Link>
          </header>
          <div ref={hallRef} className="tp-meet__hall">
            <motion.ol
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className="tp-meet__track"
              data-treadmill
              aria-label="Puppies looking for a family"
            >
              {puppies.map((pup, i) => (
                <li key={pup.id} className="tp-door" data-open={pinned ? 'false' : 'true'}>
                  <Door pup={pup} index={i} />
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <Link href="/puppies" className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </motion.ol>
            <div aria-hidden className="tp-meet__floor" />
            <PupStop pose={pinned ? 'walk' : 'sit'} act={pinned ? 'treadmill' : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </Scene>
  );
}
