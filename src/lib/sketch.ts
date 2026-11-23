/**
 * Hand-drawn blobs for the sketchbook cards. Every shape is seeded by the puppy's slug,
 * so a puppy always gets the same drawing on the server and in the browser.
 */
type Random = () => number;
type Point = [number, number];

export type DoodleKind = 'sparkle' | 'heart' | 'dashes' | 'swirl' | 'dots' | 'paw';
export type Doodle = { kind: DoodleKind; x: number; y: number; rotate: number; scale: number; ink: string };

const WASHES = ['#f2be6b', '#f9cdbf', '#bfddf5', '#fbe3b4', '#e8c39a'];
const INKS = ['#c2622b', '#a24a1a', '#2a170e', '#d4893f'];
const DOODLES: DoodleKind[] = ['sparkle', 'heart', 'dashes', 'swirl', 'dots', 'paw'];

/** FNV-1a hash of the seed, fed into a mulberry32 generator. */
function seeded(seed: string): Random {
  let hash = 0x811c9dc5;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 0x1000193);
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

/** Points around a circle whose radius wobbles on three sine waves. */
function wobble(random: Random, radius: number, amount: number, count = 40, from = 0, sweep = Math.PI * 2): Point[] {
  const phase = [random() * 6.28, random() * 6.28, random() * 6.28];
  const squash = 1 + (random() - 0.5) * 0.05;
  const steps = sweep >= Math.PI * 2 ? count : count - 1;
  return Array.from({ length: count }, (_, i) => {
    const a = from + (i / steps) * sweep;
    const wave = 0.55 * Math.sin(2 * a + phase[0]) + 0.3 * Math.sin(3 * a + phase[1]) + 0.15 * Math.sin(5 * a + phase[2]);
    const r = radius + amount * wave;
    return [50 + Math.cos(a) * r * squash, 50 + (Math.sin(a) * r) / squash];
  });
}

/** Catmull-Rom spline through the points, written as cubic béziers. */
function smoothPath(points: Point[], closed: boolean) {
  const n = points.length;
  const at = (i: number) => points[closed ? (i + n) % n : Math.min(n - 1, Math.max(0, i))];
  const f = (v: number) => v.toFixed(2);
  let d = `M${f(points[0][0])} ${f(points[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} `;
    d += `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

export function makeSketch(slug: string) {
  const random = seeded(slug);
  const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)];

  const mask = smoothPath(wobble(random, 45.5, 2.6), true);
  const outline = smoothPath(wobble(random, 47.8, 3.1), true);
  const start = random() * Math.PI * 2;
  const retrace = smoothPath(wobble(random, 49, 3.4, 30, start, Math.PI * (1.15 + 0.5 * random())), false);
  const wash = {
    d: smoothPath(wobble(random, 46.5, 3.6), true),
    dx: (random() - 0.5) * 9,
    dy: 3 + 4 * random(),
    color: pick(WASHES),
  };
  const tilt = (random() - 0.5) * 5;

  // Doodles sit in arcs of the circle (in units of π) that avoid the status sticker.
  const arcs = [
    [0.86, 1.08],
    [1.16, 1.42],
    [-0.08, 0.16],
  ]
    .map((arc) => ({ arc, order: random() }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.arc);
  const used = new Set<DoodleKind>();
  const doodles: Doodle[] = [];
  const total = 2 + Math.floor(2 * random());
  for (let i = 0; i < total; i++) {
    let kind = pick(DOODLES);
    if (used.has(kind)) kind = DOODLES.find((k) => !used.has(k))!;
    used.add(kind);
    const [from, to] = arcs[i];
    const angle = Math.PI * (from + random() * (to - from));
    const distance = 55 + 4 * random();
    doodles.push({
      kind,
      x: 50 + Math.cos(angle) * distance,
      y: 50 + Math.sin(angle) * distance,
      rotate: (random() - 0.5) * 50,
      scale: 0.85 + 0.35 * random(),
      ink: pick(INKS),
    });
  }
  return { mask, outline, retrace, wash, tilt, doodles };
}

/** A CSS mask-image that clips a photo to a blob path. */
export function maskUrl(d: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
