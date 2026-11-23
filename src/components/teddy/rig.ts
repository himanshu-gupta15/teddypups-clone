/**
 * Teddy's skeleton. A pose is a set of joint angles; `solve` turns a pose plus the
 * current motion (walking phase, wag, gaze…) into SVG transforms.
 */
export const INK = '#2a170e';
export const FUR = '#f2be6b';
export const FUR_FAR = '#e4a352';
export const CREAM = '#fbe3b4';
export const COLLAR = '#a24a1a';
export const CHEEK = '#f9b9a6';

export const WIDTH = 300;
export const HEIGHT = 240;
/** Where Teddy's feet touch the ground. */
export const FEET = { x: 150, y: 228 };
/** The ledge Teddy rests paws on when peeking. */
export const LEDGE_Y = 159;
export const EYE_Y = 98;

type Point = [number, number];
const BODY: Point = [196, 206];
const HEAD: Point = [212, 100];
export const JOINTS = {
  shoulderNear: [186, 194] as Point,
  shoulderFar: [168, 192] as Point,
  hipNear: [110, 194] as Point,
  hipFar: [94, 192] as Point,
  tail: [84, 150] as Point,
  earL: [174, 82] as Point,
  earR: [250, 82] as Point,
};

/** A fluffy, curly-edged ellipse made of `n` bumps. */
function fluff(cx: number, cy: number, rx: number, ry: number, n: number, bump: number, start = -Math.PI / 2, tilt = 0) {
  const t = (tilt * Math.PI) / 180;
  const at = (angle: number, push: number) => {
    const x = Math.cos(angle) * (rx + push);
    const y = Math.sin(angle) * (ry + (ry / rx) * push);
    return `${(cx + x * Math.cos(t) - y * Math.sin(t)).toFixed(1)} ${(cy + x * Math.sin(t) + y * Math.cos(t)).toFixed(1)}`;
  };
  let d = `M${at(start, 0)}`;
  for (let i = 0; i < n; i++) {
    const from = start + (i / n) * Math.PI * 2;
    const to = start + ((i + 1) / n) * Math.PI * 2;
    d += `Q${at((from + to) / 2, 2.1 * bump)} ${at(to, 0)}`;
  }
  return `${d}Z`;
}

function leg(width: number, length: number) {
  const w = width / 2;
  return `M${-w} -14 C${-w} 4 -12 ${length - 18} -12 ${length - 9} C-12 ${length - 2} -7 ${length} 0 ${length} C9 ${length} 13 ${length - 3} 13 ${length - 9} C13 ${length - 18} ${w} 4 ${w} -14`;
}
export const toes = (length: number) => `M-3.5 ${length - 7} v5 M4.5 ${length - 7} v5`;

export const LEGS = {
  frontNear: leg(24, 228 - 194),
  frontFar: leg(22, 228 - 192),
  backNear: leg(30, 228 - 194),
  backFar: leg(28, 228 - 192),
};

export const SHAPES = {
  body: fluff(140, 170, 64, 36, 15, 3.4, 0.95 * Math.PI),
  chest: fluff(192, 166, 30, 32, 9, 3.2, 0.6 * Math.PI),
  tail: fluff(70, 126, 17, 16, 9, 3.2),
  tailStem: 'M86 152 C80 146 76 140 74 136',
  haunch: fluff(110, 204, 30, 24, 10, 3.2, Math.PI),
  haunchPaw: 'M112 214 C126 212 142 214 146 221 C148 226 144 229 136 229 L116 229 C108 229 104 224 106 219 Z',
  head: fluff(212, 100, 51, 46, 16, 3.6),
  topknot: fluff(212, 52, 17, 12, 8, 2.9, Math.PI),
  earL: fluff(170, 112, 19, 34, 10, 3.2, -Math.PI / 2, 12),
  earR: fluff(254, 112, 19, 34, 10, 3.2, -Math.PI / 2, -12),
  muzzle: 'M188 120 C188 106 200 100 212 100 C224 100 236 106 236 120 C236 133 225 140 212 140 C199 140 188 133 188 120 Z',
  nose: 'M204.5 111.5 Q212 107.2 219.5 111.5 Q218.2 118.4 212 120 Q205.8 118.4 204.5 111.5 Z',
  mouth: 'M212 120 V124.5 M212 124.5 Q207.2 129.6 202.8 125.2 M212 124.5 Q216.8 129.6 221.2 125.2',
  mouthOpen: 'M203 126 Q212 122 221 126 Q219 138 212 139 Q205 138 203 126 Z',
  tongue: 'M207.6 127.4 Q212 136.6 216.4 127.4 Z',
  collar: 'M178 146 Q212 162 246 146 L246 154 Q212 170 178 154 Z',
  tag: 'M212 160 C212 156 206 155 206 159.4 C206 163 212 166.6 212 168.4 C212 166.6 218 163 218 159.4 C218 155 212 156 212 160 Z',
  ledgePaws: 'M175 159 C175 148 181 142 190 142 C199 142 205 148 205 159 Z M219 159 C219 148 225 142 234 142 C243 142 249 148 249 159 Z',
  ledgeToes: 'M186 153 v-4.5 M194 153 v-4.5 M230 153 v-4.5 M238 153 v-4.5',
};

const REST = {
  bodyRot: 0,
  bodyY: 0,
  headX: 0,
  headY: 0,
  headRot: 0,
  earL: 0,
  earR: 0,
  tail: 0,
  frontNear: 0,
  frontFar: 0,
  backNear: 0,
  backFar: 0,
  /** 0–1 blends: sitting haunch, happy eyes, tongue out, open mouth, front-only (peeking). */
  sit: 0,
  happy: 0,
  tongue: 0,
  mouth: 0,
  front: 0,
};
export type Pose = typeof REST;

export const POSES = {
  walk: { ...REST, tail: -6, tongue: 1 },
  sit: { ...REST, bodyRot: -24, bodyY: -2, headX: -10, headY: -6, tail: 34, sit: 1, tongue: 1 },
  peek: { ...REST, headY: 4, earL: -6, earR: 6, tail: -20, front: 1, tongue: 1 },
  snug: { ...REST, headY: 9, headRot: 4, earL: 3, earR: -3, tail: -20, front: 1 },
  bow: { ...REST, bodyRot: 15, bodyY: 2, headX: 14, headY: 30, frontNear: -58, frontFar: -52, tail: -32, happy: 1, tongue: 1 },
} satisfies Record<string, Pose>;
export type PoseName = keyof typeof POSES;

export function mix(a: Pose, b: Pose, t: number): Pose {
  const out = { ...a };
  for (const key of Object.keys(REST) as (keyof Pose)[]) out[key] = a[key] + (b[key] - a[key]) * t;
  return out;
}

/** Living movement layered on top of the pose. */
export type Motion = {
  phase: number;
  stride: number;
  time: number;
  wag: number;
  gazeX: number;
  gazeY: number;
  blink: number;
  ear: number;
};
export const STILL: Motion = { phase: 0, stride: 0, time: 0, wag: 0, gazeX: 0, gazeY: 0, blink: 0, ear: 0 };

const r2 = (v: number) => Math.round(v * 100) / 100;
const rotate = (deg: number, [x, y]: Point) => `rotate(${r2(deg)} ${x} ${y})`;

/** Attributes for each [data-p] group, as [part, transform, opacity]. */
export function solve(pose: Pose, m: Motion = STILL) {
  const walking = m.stride > 0.01 ? 1 : 0;
  const swingA = Math.sin(m.phase) * walking;
  const swingB = -swingA;
  const reach = 20 + 10 * m.stride;
  const bob = ((1 - Math.cos(2 * m.phase)) / 2) * walking;
  const breath = Math.sin(2.4 * m.time) * (1 - walking);
  const bodyRot = pose.bodyRot + 1.6 * swingA;
  const wag = pose.tail + Math.sin(m.time * (1.2 + 2.6 * m.wag) * Math.PI * 2) * (5 + 17 * m.wag);
  const J = JOINTS;
  // Front legs hang off the body, so they counter-rotate to stay planted.
  const hang = ([x, y]: Point, deg: number) => `translate(${x} ${y}) rotate(${r2(deg)})`;

  const transform: Record<string, string> = {
    body: `translate(0 ${r2(pose.bodyY - bob * (2.5 + 4 * m.stride) + 0.6 * breath)}) ${rotate(bodyRot, BODY)}`,
    frontNear: hang(J.shoulderNear, pose.frontNear - pose.bodyRot + swingA * reach),
    frontFar: hang(J.shoulderFar, pose.frontFar - pose.bodyRot + swingB * reach),
    backNear: hang(J.hipNear, pose.backNear + swingB * reach),
    backFar: hang(J.hipFar, pose.backFar + swingA * reach),
    tail: rotate(wag, J.tail),
    haunch: `translate(0 ${r2(-0.06 * pose.bodyRot)})`,
    head: `translate(${r2(pose.headX)} ${r2(pose.headY - bob * (2 + 3 * m.stride) + 0.9 * breath)}) ${rotate(pose.headRot + 1.4 * swingA, HEAD)}`,
    earL: rotate(pose.earL + m.ear, J.earL),
    earR: rotate(pose.earR - m.ear, J.earR),
    eyes: `translate(${r2(3.4 * m.gazeX)} ${r2(2.6 * m.gazeY)})`,
    blink: `translate(0 ${r2(EYE_Y * m.blink * 0.92)}) scale(1 ${r2(1 - 0.92 * m.blink)})`,
  };
  const opacity: Record<string, number> = {
    body: r2(1 - pose.front),
    backNear: r2(1 - pose.sit),
    backFar: r2(1 - pose.sit),
    haunch: r2(pose.sit * (1 - pose.front)),
    open: r2(1 - pose.happy),
    happy: r2(pose.happy),
    tongue: r2(pose.tongue * (1 - pose.mouth)),
    mouth: r2(pose.mouth),
    ledge: r2(pose.front),
    shadow: r2(0.12 * (1 - pose.front)),
  };
  return { transform, opacity };
}
