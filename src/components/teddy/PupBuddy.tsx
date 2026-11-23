'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';
import { BARKS } from './cue';
import { PupEngine } from './engine';
import { TeddySvg } from './TeddySvg';
import type { PoseName } from './rig';

type Props = {
  pose?: PoseName;
  facing?: 'left' | 'right';
  className?: string;
  label?: string;
  /** Tilt the head now and then, as if listening. */
  curious?: boolean;
  /** False when the travelling companion takes over this spot. */
  live?: boolean;
};

/** A Teddy who stays in one place: breathes, blinks, follows the pointer and woofs when clicked. */
export function PupBuddy({ pose = 'sit', facing = 'right', className = '', label, curious, live = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [bark, setBark] = useState({ text: '', show: false });

  useEffect(() => {
    const root = ref.current!;
    if (!live || prefersReducedMotion()) return;
    const svg = root.querySelector('svg')!;
    const engine = new PupEngine(svg, pose, facing === 'left' ? -1 : 1);
    let frame = 0;
    let last = 0;
    let hideBark: ReturnType<typeof setTimeout>;
    let count = 0;

    const loop = (now: number) => {
      engine.tick(last ? (now - last) / 1000 : 0);
      last = now;
      if (curious) engine.cock(Math.sin(now / 1700) > 0.45 ? 13 : 0);
      frame = requestAnimationFrame(loop);
    };
    // Only spend frames on Teddies that are on screen.
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      last = 0;
      if (entry.isIntersecting) frame = requestAnimationFrame(loop);
    });
    const follow = (e: PointerEvent) => e.pointerType === 'mouse' && engine.lookAt({ x: e.clientX, y: e.clientY });
    const woof = () => {
      engine.woof();
      engine.wag(1);
      setBark({ text: BARKS[count++ % BARKS.length], show: true });
      clearTimeout(hideBark);
      hideBark = setTimeout(() => {
        setBark((b) => ({ ...b, show: false }));
        engine.wag(0.35);
      }, 1400);
    };

    root.dataset.live = '';
    observer.observe(root);
    addEventListener('pointermove', follow, { passive: true });
    svg.addEventListener('click', woof);
    return () => {
      delete root.dataset.live;
      cancelAnimationFrame(frame);
      clearTimeout(hideBark);
      observer.disconnect();
      removeEventListener('pointermove', follow);
      svg.removeEventListener('click', woof);
    };
  }, [pose, facing, curious, live]);

  return (
    <div ref={ref} className={`pup-buddy ${className}`} data-facing={facing}>
      <TeddySvg pose={pose} facing={facing} label={label} />
      <span aria-hidden className="pup-bubble" data-show={bark.show}>
        {bark.text}
      </span>
    </div>
  );
}
