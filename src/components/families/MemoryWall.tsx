'use client';

import type { CSSProperties } from 'react';
import { Paw } from '@/components/ui/Paw';
import { RevealScope } from '@/components/ui/RevealScope';
import type { Media } from '@/lib/types';
import { Polaroid } from './Polaroid';
import { usePhotoViewer } from './PhotoViewer';

const SIZES = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw';

export function MemoryWall({ photos }: { photos: Media[] }) {
  const { open, viewer } = usePhotoViewer(photos);
  return (
    <>
      <RevealScope>
        <ul className="tp-wall" aria-label="Photos from TeddyPups families">
          {photos.map((photo, i) => (
            <li key={photo.id} className="tp-wall__item" data-reveal style={{ '--d': `${(i % 4) * 60}ms` } as CSSProperties}>
              <button
                type="button"
                className="tp-wall__print"
                onClick={() => open(i)}
                aria-label={`Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
              >
                <Polaroid media={photo} order={i} sizes={SIZES} preload={i < 2} />
                <Paw className="tp-wall__paw" />
              </button>
            </li>
          ))}
        </ul>
      </RevealScope>
      {viewer}
    </>
  );
}
