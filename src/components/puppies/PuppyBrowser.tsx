'use client';

import { AnimatePresence, motion } from 'motion/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, type ReactNode } from 'react';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { RevealScope } from '@/components/ui/RevealScope';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { FILTER_KEYS, filterPuppies, readFilters, toggleFilter, type FilterKey } from '@/lib/filters';
import type { Puppy } from '@/lib/types';
import { SketchCard } from './SketchCard';

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className="tp-sticker-chip">
      {children}
    </button>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

/** Filters live in the URL, so a filtered view can be linked to and survives a refresh. */
export function PuppyBrowser({ puppies, breeds }: { puppies: Puppy[]; breeds: { slug: string; name: string }[] }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const query = params.toString();
  const filters = useMemo(() => readFilters(new URLSearchParams(query)), [query]);
  const matches = useMemo(() => filterPuppies(puppies, filters), [puppies, filters]);
  const filtering = FILTER_KEYS.some((key) => filters[key]);

  const show = (next: string) => window.history.replaceState(null, '', next ? `${pathname}?${next}` : pathname);
  const toggle = (key: FilterKey, value: string) => show(toggleFilter(query, key, value));
  const clear = () => show('');
  const chip = (key: FilterKey, value: string, label: string) => (
    <Chip key={value} active={filters[key] === value} onClick={() => toggle(key, value)}>
      {label}
    </Chip>
  );

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <Row label="where">
          <Chip active={!filters.origin && !filters.collection} onClick={clear}>
            Everywhere
          </Chip>
          {puppies.some((p) => p.origin === 'local') && chip('origin', 'local', 'In Dubai')}
          {chip('origin', 'imported', 'Imported')}
          {puppies.some((p) => p.collections.includes('korean-teacup')) && chip('collection', 'korean-teacup', 'Korean Teacup')}
        </Row>
        <Row label="breed">
          {breeds.filter((b) => puppies.some((p) => p.breeds.includes(b.slug))).map((b) => chip('breed', b.slug, b.name))}
        </Row>
        <Row label="boy or girl">
          {chip('gender', 'male', 'Boys')}
          {chip('gender', 'female', 'Girls')}
          {filtering && (
            <button type="button" onClick={clear} className="link-ink ml-auto text-[0.95rem] font-semibold">
              Clear filters
            </button>
          )}
        </Row>
      </div>
      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {matches.length === 1 ? '1 puppy' : `${matches.length} puppies`} {filtering ? 'match' : 'looking for a home'}
      </p>
      {matches.length ? (
        <RevealScope>
          <motion.ul layout className="tp-sketches mt-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {matches.map((pup, i) => (
                <motion.li
                  key={pup.id}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <SketchCard pup={pup} index={i} preload={i < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </RevealScope>
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <PupBuddy curious className="mx-auto w-44 md:w-52" label="Teddy, with a tilted head" />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppLink className="btn btn-whatsapp">Ask on WhatsApp</WhatsAppLink>
              <button type="button" onClick={clear} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
