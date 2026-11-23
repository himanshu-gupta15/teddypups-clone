'use client';

import { AnimatePresence, motion, type Variants } from 'motion/react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media } from '@/lib/types';

const slide: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: 70 * direction, rotate: 5 * direction, scale: 0.92 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 26 } },
  exit: (direction: number) => ({ opacity: 0, x: -70 * direction, rotate: -5 * direction, scale: 0.92, transition: { duration: 0.22 } }),
};

/** Full-screen lightbox with arrow keys, buttons and swipe. Returns `open(index)` and the dialog to render. */
export function usePhotoViewer(items: Media[], label = 'Photo viewer', describe?: (i: number) => string) {
  const ref = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const total = items.length;

  const move = useCallback(
    (by: 1 | -1) => {
      setDirection(by);
      setAt((i) => (i === null ? i : (i + by + total) % total));
    },
    [total],
  );

  const isOpen = at !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [isOpen, move]);

  const open = (index: number) => {
    setDirection(1);
    setAt(index);
    ref.current?.showModal();
  };

  const media = at === null ? null : items[at];
  const viewer = (
    <dialog
      ref={ref}
      aria-label={label}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onClose={() => setAt(null)}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      data-lenis-prevent
    >
      {media && at !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg" aria-live="polite">
              {describe ? describe(at) : `${at + 1} / ${total}${media.caption ? ` — ${media.caption}` : ''}`}
            </p>
            <button type="button" onClick={() => ref.current?.close()} className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa">
              Close
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={media.id}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) move(1);
                  else if (info.offset.x > 80) move(-1);
                }}
              >
                {media.kind === 'video' ? (
                  <video src={media.src} poster={media.poster?.src} controls autoPlay playsInline className="size-full object-contain" />
                ) : (
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    sizes="100vw"
                    quality={85}
                    draggable={false}
                    loading="eager"
                    className="object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          {total > 1 && (
            <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
              <button type="button" onClick={() => move(-1)} className="h-12 rounded-full border-2 border-milk px-6 font-semibold">
                Previous
              </button>
              <button type="button" onClick={() => move(1)} className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa">
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
  return { open, viewer };
}
