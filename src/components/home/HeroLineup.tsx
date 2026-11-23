'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Photo } from '@/components/ui/Photo';
import { prefersReducedMotion } from '@/lib/hooks';
import type { Puppy } from '@/lib/types';

/** Each seat behind the quilt: [left %, width rem, how much peeks out, tilt °]. */
const SEATS = [
  [9, 8.6, 0.62, -5],
  [22.5, 10.4, 0.8, 3],
  [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3],
  [77.5, 10.6, 0.82, -3],
  [91, 8.4, 0.6, 4],
];
const PAUSES = [1900, 2500, 1700, 2300, 2000, 2800, 1800];

const seatStyle = (i: number) =>
  ({
    '--x': `${SEATS[i][0]}%`,
    '--w': `${SEATS[i][1]}rem`,
    '--peek': SEATS[i][2],
    '--tilt': `${SEATS[i][3]}deg`,
    '--i': i,
  }) as CSSProperties;

function shuffle<T>(list: T[]) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Puppies popping up behind the quilt. Every couple of seconds one ducks down and another takes its place. */
export function HeroLineup({ friends }: { friends: Puppy[] }) {
  const [seated, setSeated] = useState(() => SEATS.map((_, i) => i));
  const [states, setStates] = useState<Record<number, 'duck' | 'pop' | undefined>>({});
  const [introduced, setIntroduced] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [onDeck, setOnDeck] = useState<number>(SEATS.length);
  const listRef = useRef<HTMLUListElement>(null);
  const wingsRef = useRef<HTMLSpanElement>(null);
  const seatedRef = useRef(seated);

  useEffect(() => {
    seatedRef.current = seated;
  }, [seated]);

  useEffect(() => {
    const list = listRef.current!;
    if (prefersReducedMotion() || friends.length <= SEATS.length) return;
    const scene = list.closest<HTMLElement>('[data-pup-scene]');
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const after = (ms: number, run: () => void) => void timers.add(setTimeout(run, ms));
    let visible = true;
    let quietUntil = 0;
    let turn = 0;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.35 });
    observer.observe(list);
    // Hold still while the visitor is scrolling, clicking or hovering.
    const hush = () => (quietUntil = performance.now() + 1200);
    addEventListener('scroll', hush, { passive: true });
    addEventListener('pointerdown', hush, { passive: true });
    list.addEventListener('pointerover', hush, { passive: true });

    let queue = friends.map((_, i) => i).slice(SEATS.length);
    let seats: number[] = [];
    let lastSeat = -1;

    const step = () => {
      if (document.hidden || !visible || performance.now() < quietUntil || scene?.dataset.here === 'false') return after(900, step);
      // The next puppy waits in the wings until its photo is decoded, so it never pops up blank.
      const image = wingsRef.current?.querySelector('img');
      if (!image?.complete || !image.naturalWidth) return after(400, step);
      if (!seats.length)
        seats = shuffle(SEATS.map((_, i) => i).filter((i) => list.children[i]?.getClientRects().length)).filter((i) => i !== lastSeat);
      const seat = seats.shift();
      if (seat === undefined) return after(2000, step);
      lastSeat = seat;
      const incoming = queue.shift()!;
      setStates((s) => ({ ...s, [seat]: 'duck' }));
      after(360, () => {
        queue.push(seatedRef.current[seat]);
        setSeated((all) => all.map((p, i) => (i === seat ? incoming : p)));
        setOnDeck(queue[0]);
        setStates((s) => ({ ...s, [seat]: 'pop' }));
        setIntroduced(seat);
        after(1800, () => setIntroduced((i) => (i === seat ? null : i)));
        after(700, () => setStates((s) => ({ ...s, [seat]: undefined })));
      });
      after(PAUSES[turn++ % PAUSES.length], step);
    };
    queue = [queue[0], ...shuffle(queue.slice(1))];
    after(2600, step);
    return () => {
      timers.forEach(clearTimeout);
      observer.disconnect();
      removeEventListener('scroll', hush);
      removeEventListener('pointerdown', hush);
      list.removeEventListener('pointerover', hush);
    };
  }, [friends]);

  const leave = (i: number) => () => setHovered((h) => (h === i ? null : h));

  return (
    <>
      <ul ref={listRef} className="tp-lineup" aria-label="Some of the puppies in our showroom">
        {seated.map((index, i) => {
          const pup = friends[index];
          return (
            <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
              <Link
                href={`/puppies/${pup.slug}`}
                className="tp-lineup__pup"
                data-state={states[i]}
                aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={leave(i)}
                onFocus={() => setHovered(i)}
                onBlur={leave(i)}
              >
                <span className="tp-lineup__photo">
                  <Photo key={pup.id} media={pup.cover} sizes="11rem" preload={i < 2} eager />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul aria-hidden className="tp-lineup tp-lineup--tags">
        {seated.map((index, i) => (
          <li key={i} className="tp-lineup__seat" style={seatStyle(i)}>
            <span className="tp-lineup__ghost" data-state={states[i]} data-tag={introduced === i || hovered === i ? 'show' : undefined}>
              <span className="tp-lineup__name font-scrawl">{friends[index].displayName}</span>
            </span>
          </li>
        ))}
      </ul>
      {friends[onDeck] && (
        <span ref={wingsRef} aria-hidden className="tp-lineup__wings">
          <Photo media={friends[onDeck].cover} sizes="11rem" alt="" eager />
        </span>
      )}
    </>
  );
}
