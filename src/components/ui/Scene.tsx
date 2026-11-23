import type { CSSProperties, ReactNode } from 'react';

type Props = {
  from: string;
  to: string;
  dark?: boolean;
  labelledBy: string;
  className?: string;
  style?: CSSProperties;
  pinned?: boolean;
  children: ReactNode;
};

/** A full-width band of sky. The home page blends from milk at dawn to cocoa at night, one scene at a time. */
export function Scene({ from, to, dark, labelledBy, className = '', style, pinned, children }: Props) {
  return (
    <section
      data-pup-scene
      data-tone={dark ? 'dark' : 'light'}
      data-pinned={pinned || undefined}
      className={`tp-scene ${className}`}
      style={{ '--sky-top': from, '--sky-bottom': to, ...style } as CSSProperties}
      aria-labelledby={labelledBy}
    >
      {children}
    </section>
  );
}
