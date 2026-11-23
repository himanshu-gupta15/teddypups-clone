import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PAW_PATH } from '@/components/ui/Paw';
import { Photo } from '@/components/ui/Photo';
import { statusLabels } from '@/lib/data';
import { makeSketch, maskUrl, type Doodle } from '@/lib/sketch';
import type { Puppy } from '@/lib/types';

const SIZES = '(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw';

function DoodleMark({ doodle: { kind, x, y, rotate, scale, ink } }: { doodle: Doodle }) {
  const stroke = { fill: 'none', stroke: ink, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(0)}) scale(${scale.toFixed(2)})`}>
      <g className="tp-sketch__doodle">
        {kind === 'sparkle' && <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={ink} />}
        {kind === 'heart' && (
          <path
            d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z"
            {...stroke}
          />
        )}
        {kind === 'dashes' && <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...stroke} />}
        {kind === 'swirl' && <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...stroke} />}
        {kind === 'dots' && (
          <g fill={ink}>
            <circle cx="-4" cy="1" r="1.2" />
            <circle cx="0" cy="-2" r="1.2" />
            <circle cx="4" cy="1" r="1.2" />
          </g>
        )}
        {kind === 'paw' && <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={ink} opacity={0.85} />}
      </g>
    </g>
  );
}

type Props = { pup: Puppy; index?: number; preload?: boolean; small?: boolean; sizes?: string };

export function SketchCard({ pup, index = 0, preload, small, sizes = SIZES }: Props) {
  const sketch = makeSketch(pup.slug);
  const gender = pup.genderLabel.toLowerCase();
  const label = [pup.displayName, pup.name && pup.breed, gender, pup.age, statusLabels[pup.status].toLowerCase()]
    .filter(Boolean)
    .join(', ');
  const mask = maskUrl(sketch.mask);
  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className={`tp-sketch${small ? ' tp-sketch--small' : ''}`}
      data-reveal
      style={{ '--tilt': `${sketch.tilt.toFixed(2)}deg`, '--d': `${(index % 8) * 70}ms`, '--wash': sketch.wash.color } as CSSProperties}
      aria-label={label}
    >
      <span className="tp-sketch__frame">
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="tp-sketch__wash"
          style={{ translate: `${sketch.wash.dx.toFixed(1)}% ${sketch.wash.dy.toFixed(1)}%` }}
        >
          <path d={sketch.wash.d} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: mask, WebkitMaskImage: mask }}>
          <Photo media={pup.cover} sizes={sizes} preload={preload} alt="" />
        </span>
        <svg aria-hidden viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={sketch.outline} pathLength={1} className="tp-sketch__line" />
          <path d={sketch.retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {sketch.doodles.map((doodle) => (
            <DoodleMark key={doodle.kind} doodle={doodle} />
          ))}
        </svg>
        {small ? (
          <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>
        ) : (
          <span className="tp-sketch__sticker font-scrawl">{statusLabels[pup.status]}</span>
        )}
        {!small && pup.media.some((m) => m.kind === 'video') && <span className="tp-sketch__video">▶ video</span>}
      </span>
      <span className="tp-sketch__name font-plush">{pup.displayName}</span>
      {!small && <span className="tp-sketch__meta">{[pup.name && pup.breed, gender, pup.age].filter(Boolean).join(' · ')}</span>}
    </Link>
  );
}
