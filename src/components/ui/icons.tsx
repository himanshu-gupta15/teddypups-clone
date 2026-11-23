import type { CSSProperties } from 'react';

const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

type Props = { className?: string; style?: CSSProperties };

export const HealthIcon = ({ className }: Props) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z" {...line} />
    <path d="M22 30h7l3-7 4 13 3-6h7" {...line} />
  </svg>
);

export const FlightIcon = ({ className }: Props) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z" {...line} />
    <path d="M8 50c10 4 20 4 30 0" {...line} strokeDasharray="2 7" />
  </svg>
);

export const ChatIcon = ({ className }: Props) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <path d="M10 14h44v28H30l-12 10v-10h-8z" {...line} />
    <path d="M22 28h0M32 28h0M42 28h0" {...line} strokeWidth={5} />
  </svg>
);

export const GlobeIcon = ({ className }: Props) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden>
    <circle cx="32" cy="32" r="22" {...line} />
    <path d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44" {...line} />
  </svg>
);

export const Skyline = ({ className }: Props) => (
  <svg viewBox="0 0 300 120" className={className} aria-hidden>
    <path
      d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28"
      {...line}
      strokeWidth={2.6}
    />
  </svg>
);

export const Plane = ({ className }: Props) => (
  <svg viewBox="0 0 64 40" className={className} aria-hidden>
    <path d="M4 22l20-2 12-14h6l-6 14 14-1 6-7h4l-3 10 3 10h-4l-6-7-14-1 6 14h-6L24 24 4 22z" {...line} fill="#fffdf8" strokeWidth={2.6} />
  </svg>
);

export const Heart = ({ className }: Props) => (
  <svg viewBox="0 0 48 44" className={className} aria-hidden>
    <path
      d="M24 40C10 30 4 22 4 14.5 4 8.7 8.6 4 14.3 4c4.1 0 7.6 2.4 9.7 6 2.1-3.6 5.6-6 9.7-6C39.4 4 44 8.7 44 14.5 44 22 38 30 24 40z"
      {...line}
    />
  </svg>
);

export const Check = ({ className }: Props) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <path d="M5 17l7 7L27 8" {...line} strokeWidth={3.4} />
  </svg>
);

export const Star = ({ className, style }: Props) => (
  <svg viewBox="0 0 40 40" className={className} style={style} aria-hidden>
    <path d="M20 3c1.6 9.4 7.6 15.4 17 17-9.4 1.6-15.4 7.6-17 17-1.6-9.4-7.6-15.4-17-17 9.4-1.6 15.4-7.6 17-17z" fill="currentColor" />
  </svg>
);

/** A field of twinkling stars. Each entry is [left %, top %, size px]. */
export function Stars({ points }: { points: [number, number, number][] }) {
  return points.map(([left, top, size], i) => (
    <Star
      key={i}
      className="tp-twinkle absolute text-honey"
      style={{ left: `${left}%`, top: `${top}%`, width: size, animationDelay: `${(i * 0.4).toFixed(2)}s` }}
    />
  ));
}

/** Scalloped, stitched blanket edge, shared by the hero quilt and the page curtain. */
export function Scallops({ id, className, fill }: { id: string; className: string; fill: string }) {
  return (
    <svg className={className} width="100%" height="40" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id={id} width="76" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill }} />
          <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
          <path
            d="M11 33A27 19 0 0 1 65 33"
            fill="none"
            stroke="#2a170e"
            strokeWidth="1.6"
            strokeDasharray="3.5 5.5"
            strokeLinecap="round"
            opacity=".42"
          />
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${id})`} />
    </svg>
  );
}
