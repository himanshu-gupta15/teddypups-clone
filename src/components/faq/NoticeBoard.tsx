'use client';

import { Fragment, useId, useMemo, useState, type CSSProperties } from 'react';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { RevealScope } from '@/components/ui/RevealScope';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import type { Faq } from '@/lib/types';

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PINS = ['var(--color-toffee)', 'var(--color-sky-deep)', '#d9a13c', '#c45a6a'];

/** Wraps every match of the search in <mark>. */
function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim();
  if (!term) return text;
  const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : <Fragment key={i}>{part}</Fragment>));
}

export function NoticeBoard({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const searchId = useId();
  const term = query.trim().toLowerCase();
  const found = useMemo(() => faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(term)), [faqs, term]);

  return (
    <div className="tp-notes" data-open={open || term ? '' : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={searchId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden className="tp-notes__lens">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {term ? `${found.length} ${found.length === 1 ? 'note' : 'notes'} found` : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <PupBuddy curious label="Teddy, reading the notes" />
        </div>
        <WhatsAppLink className="btn btn-whatsapp tp-notes__ask">Ask your own question</WhatsAppLink>
      </aside>
      <RevealScope className="tp-notes__board">
        <ul className="tp-notes__list">
          {found.map((faq, i) => {
            // A note unfolds when clicked, or when the search matches its answer.
            const unfolded = open === faq.id || (!!term && faq.answer.toLowerCase().includes(term));
            return (
              <li
                key={faq.id}
                className="tp-note"
                data-reveal
                data-unfolded={unfolded || undefined}
                style={{ '--tilt': `${TILTS[i % TILTS.length]}deg`, '--pin': PINS[i % PINS.length], '--i': i } as CSSProperties}
              >
                <span aria-hidden className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button
                    type="button"
                    id={`q-${faq.id}`}
                    aria-expanded={unfolded}
                    aria-controls={`a-${faq.id}`}
                    onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  >
                    <span className="font-plush-text">
                      <Highlight text={faq.question} query={query} />
                    </span>
                    <span aria-hidden className="tp-note__chevron" />
                  </button>
                </h2>
                <div id={`a-${faq.id}`} role="region" aria-labelledby={`q-${faq.id}`} className="tp-note__answer" inert={!unfolded}>
                  <div className="tp-note__flap">
                    <p>
                      <Highlight text={faq.answer} query={query} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {!found.length && (
          <div className="tp-note tp-note--empty">
            <span aria-hidden className="tp-note__pin" />
            <p className="font-plush-text text-[1.2rem] font-bold">No note about “{query.trim()}” yet.</p>
            <p className="mt-2">
              <WhatsAppLink className="link-ink">Ask us on WhatsApp</WhatsAppLink> and we&apos;ll answer.
            </p>
          </div>
        )}
      </RevealScope>
    </div>
  );
}
