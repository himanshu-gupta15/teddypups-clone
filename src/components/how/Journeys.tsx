'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { PupBuddy } from '@/components/teddy/PupBuddy';
import { Plane, Skyline } from '@/components/ui/icons';
import type { Journey } from '@/lib/content';

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const TINTS = ['#fbe3b4', '#fde6de', '#e3f0fb', '#e6f2df'];

const ICONS: Record<Journey['key'], ReactNode[]> = {
  local: [
    <>
      <circle cx="21" cy="21" r="12" {...line} />
      <path d="m30 30 10 10" {...line} />
      <path d="M21 27c-3-2-4.4-3.6-4.4-5.2a2.2 2.2 0 0 1 4.4-.4 2.2 2.2 0 0 1 4.4.4c0 1.6-1.4 3.2-4.4 5.2z" fill="currentColor" />
    </>,
    <>
      <path
        d="M24 40C11 31 6 24.5 6 17.8 6 12.4 10.2 8 15.4 8c3.7 0 6.8 2.1 8.6 5.3C25.8 10.1 28.9 8 32.6 8 37.8 8 42 12.4 42 17.8 42 24.5 37 31 24 40z"
        {...line}
      />
      <path d="m17 22 5 5 9-10" {...line} />
    </>,
    <>
      <path d="M14 18c-3-6-1-10 3-10s5 4 4 8M34 18c3-6 1-10-3-10s-5 4-4 8" {...line} />
      <ellipse cx="24" cy="27" rx="13" ry="12" {...line} />
      <circle cx="19.5" cy="25" r="1.6" fill="currentColor" />
      <circle cx="28.5" cy="25" r="1.6" fill="currentColor" />
      <path d="M22 31h4l-2 2z" {...line} fill="currentColor" strokeWidth={1.6} />
    </>,
    <>
      <path d="M5 30V18h22v12M27 22h8l6 6v2H27" {...line} />
      <path d="M5 30h36" {...line} />
      <circle cx="13" cy="33" r="3.4" {...line} />
      <circle cx="34" cy="33" r="3.4" {...line} />
      <path d="M16 26c-2.3-1.6-3.4-2.8-3.4-4a1.7 1.7 0 0 1 3.4-.4 1.7 1.7 0 0 1 3.4.4c0 1.2-1.1 2.4-3.4 4z" fill="currentColor" />
    </>,
  ],
  imported: [
    <>
      <rect x="7" y="10" width="34" height="30" rx="5" {...line} />
      <path d="M7 19h34M16 6v8M32 6v8" {...line} />
      <path d="m17 29 5 5 9-9" {...line} />
    </>,
    <>
      <path d="M6 12a5 5 0 0 1 5-5h16a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-9l-6 5v-5h-1a5 5 0 0 1-5-5z" {...line} />
      <path d="M36 17h1a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-1v5l-6-5h-6a5 5 0 0 1-4-2" {...line} />
    </>,
    <path
      key="fly"
      transform="matrix(-1 0 0 1 48 0)"
      d="M4 27l13-1.5 8-10h4l-4 9.5 9-.8 4-4.7h3l-2 6.6 2 6.6h-3l-4-4.7-9-.8 4 9.5h-4l-8-10L4 29z"
      {...line}
    />,
    <>
      <path d="M6 23 24 8l18 15M11 19v21h26V19" {...line} />
      <path d="M24 35c-4.6-3.2-6.8-5.7-6.8-8.2a3.4 3.4 0 0 1 6.8-.8 3.4 3.4 0 0 1 6.8.8c0 2.5-2.2 5-6.8 8.2z" fill="currentColor" />
    </>,
  ],
};

function Postcard({ kind }: { kind: Journey['key'] }) {
  if (kind === 'imported')
    return (
      <div aria-hidden className="tp-postcard tp-postcard--sky">
        <svg viewBox="0 0 320 150" className="tp-postcard__route" preserveAspectRatio="none">
          <path d="M28 128C90 20 230 20 292 118" />
        </svg>
        <Plane className="tp-postcard__plane" />
        <span className="font-scrawl tp-postcard__from">Europe · Korea</span>
        <span className="font-scrawl tp-postcard__to">Dubai</span>
      </div>
    );
  return (
    <div aria-hidden className="tp-postcard">
      <span className="tp-postcard__sun" />
      <Skyline className="tp-postcard__city" />
      <span className="font-scrawl tp-postcard__to tp-postcard__to--left">Downtown Dubai</span>
    </div>
  );
}

/** Accessible tabs (arrow keys included) that swap between the local and imported journeys. */
export function Journeys({ journeys }: { journeys: Journey[] }) {
  const [at, setAt] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent) => {
    const by = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!by) return;
    const next = (at + by + journeys.length) % journeys.length;
    setAt(next);
    tabs.current[next]?.focus();
  };

  return (
    <section className="tp-journeys" aria-labelledby="two-ways-title" data-ready>
      <div className="tp-journeys__top">
        <div>
          <p className="font-scrawl tp-journeys__kicker">choose your way</p>
          <h2 id="two-ways-title" className="font-plush text-big">
            Two ways home
          </h2>
        </div>
        <div className="tp-journeys__pick">
          <div
            role="tablist"
            aria-label="Ways to bring your puppy home"
            className="tp-switch"
            style={{ '--at': at, '--n': journeys.length } as CSSProperties}
          >
            <span aria-hidden className="tp-switch__thumb" />
            {journeys.map((journey, i) => (
              <button
                key={journey.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${journey.key}`}
                aria-selected={i === at}
                aria-controls={`panel-${journey.key}`}
                tabIndex={i === at ? 0 : -1}
                onClick={() => setAt(i)}
                onKeyDown={onKeyDown}
                className="tp-switch__tab"
              >
                <span className="font-plush tp-switch__label">{journey.label}</span>
                <span className="tp-switch__hint">{journey.hint}</span>
              </button>
            ))}
          </div>
          <PupBuddy curious className="tp-journeys__teddy" label="Teddy, waiting to see which way you pick" />
        </div>
      </div>
      {journeys.map((journey, i) => (
        <div
          key={journey.key}
          role="tabpanel"
          id={`panel-${journey.key}`}
          aria-labelledby={`tab-${journey.key}`}
          hidden={i !== at}
          className="tp-journey"
        >
          <div className="tp-journey__head">
            <div>
              <h3 className="font-plush tp-journey__title">{journey.heading}</h3>
              <p className="text-lede mt-4 text-[var(--ink-soft)]">{journey.body}</p>
              {journey.note && <p className="font-scrawl mt-4 text-toffee-ink">{journey.note}</p>}
            </div>
            <Postcard kind={journey.key} />
          </div>
          <ol className="tp-steps">
            {journey.steps.map((step, s) => (
              <li key={step.title} className="tp-step" style={{ '--i': s, '--tint': TINTS[s] } as CSSProperties}>
                <span aria-hidden className="tp-step__icon">
                  <svg viewBox="0 0 48 48">{ICONS[journey.key][s]}</svg>
                </span>
                <span className="tp-step__num font-plush">Step {s + 1}</span>
                <h4 className="font-plush-text tp-step__title">{step.title}</h4>
                <p className="tp-step__text">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
