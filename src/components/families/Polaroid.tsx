import type { CSSProperties } from 'react';
import { Photo } from '@/components/ui/Photo';
import type { Media } from '@/lib/types';

const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ['center', 'left', 'right', 'corners', 'center', 'right', 'left', 'center'];
const TAPE_COLOURS = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4'];

/** A taped-up print. Tilt and tape are picked from the photo's position so the wall looks hand-hung. */
export function Polaroid({ media, order, sizes, preload }: { media: Media; order: number; sizes: string; preload?: boolean }) {
  const tape = TAPES[order % TAPES.length];
  return (
    <span
      className="tp-polaroid"
      style={
        {
          '--tilt': `${TILTS[order % TILTS.length]}deg`,
          '--tape': TAPE_COLOURS[order % TAPE_COLOURS.length],
          '--i': order,
        } as CSSProperties
      }
    >
      {(tape === 'corners' ? ['tl', 'tr'] : [tape]).map((t) => (
        <span key={t} aria-hidden className={`tp-tape tp-tape--${t}`} />
      ))}
      <span className="tp-polaroid__photo">
        <Photo media={media} layout="natural" sizes={sizes} preload={preload} />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{media.caption}</span>
    </span>
  );
}
