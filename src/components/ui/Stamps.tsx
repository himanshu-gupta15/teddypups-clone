import type { CSSProperties, ReactNode } from 'react';

type Stamp = { title: string; text: string; icon: ReactNode };
const SHAPES = [
  ['round', '#a24a1a', -8],
  ['ticket', '#1f6b45', 5],
  ['oval', '#5a3a28', -4],
  ['scallop', '#c2622b', 7],
] as const;

/** Passport stamps: one inked shape per promise. */
export function Stamps({ items, className }: { items: Stamp[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((item, i) => {
        const [shape, ink, tilt] = SHAPES[i % SHAPES.length];
        return (
          <li key={item.title} className="tp-entry" style={{ '--ink-stamp': ink, '--tilt': `${tilt}deg`, '--i': i } as CSSProperties}>
            <span className={`tp-stamp tp-stamp--${shape}`}>
              {item.icon}
              <span className="tp-stamp__title font-plush">{item.title}</span>
            </span>
            <p className="tp-entry__text">{item.text}</p>
          </li>
        );
      })}
    </ul>
  );
}
