'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { usePhotoViewer } from '@/components/families/PhotoViewer';
import { Photo } from '@/components/ui/Photo';
import type { Media } from '@/lib/types';

const ARROW = 'grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold';

/** A storybook page that turns between photos, with thumbnails and a full-screen viewer. */
export function PuppyGallery({ name, media }: { name: string; media: Media[] }) {
  const [at, setAt] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = media.length;
  const describe = (i: number) => `${name}, ${media[i].kind === 'video' ? 'video' : 'photo'} ${i + 1} of ${total}`;
  const { open, viewer } = usePhotoViewer(media, `${name} photos`, describe);
  const turnTo = (i: number) => {
    setDirection(i > at ? 1 : -1);
    setAt((i + total) % total);
  };
  const current = media[at];

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.button
            key={current.id}
            type="button"
            className="absolute inset-0 block size-full"
            initial={{
              clipPath: direction > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)',
              rotateY: -14 * direction,
              transformPerspective: 1400,
            }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', rotateY: 0 }}
            exit={{ opacity: 0.4, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: direction > 0 ? '0% 50%' : '100% 50%' }}
            onClick={() => open(at)}
            aria-label={`Open ${describe(at)} full screen`}
          >
            {current.kind === 'video' ? (
              <video
                src={current.src}
                poster={current.poster?.src}
                className="size-full object-cover"
                muted
                loop
                playsInline
                autoPlay
                aria-label={current.alt}
              />
            ) : (
              <Photo media={current} sizes="(min-width: 1024px) 55vw, 92vw" preload={at === 0} quality={85} />
            )}
          </motion.button>
        </AnimatePresence>
        {total > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex justify-between">
            <button type="button" onClick={() => turnTo(at - 1)} className={ARROW} aria-label="Previous photo">
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {at + 1} / {total}
            </span>
            <button type="button" onClick={() => turnTo(at + 1)} className={ARROW} aria-label="Next photo">
              ›
            </button>
          </div>
        )}
      </div>
      {total > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]" aria-label={`All photos of ${name}`}>
          {media.map((item, i) => {
            const thumb = item.kind === 'video' ? item.poster : item;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => turnTo(i)}
                  aria-label={describe(i)}
                  aria-current={i === at}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    i === at ? '-rotate-3 -translate-y-1 border-toffee-deep' : 'border-cocoa/30 hover:-rotate-2 hover:border-cocoa'
                  }`}
                >
                  {thumb && <Photo media={thumb} sizes="96px" alt="" />}
                  {item.kind === 'video' && (
                    <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {viewer}
    </div>
  );
}
