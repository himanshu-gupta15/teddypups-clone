import { CHEEK, COLLAR, CREAM, EYE_Y, FUR, FUR_FAR, HEIGHT, INK, LEGS, POSES, SHAPES, WIDTH, solve, toes, type PoseName } from './rig';

const outline = { stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
const line = { ...outline, fill: 'none' } as const;

export function Leg({ d, fill, length }: { d: string; fill: string; length: number }) {
  return (
    <>
      <path d={`${d}Z`} fill={fill} />
      <path d={d} {...line} />
      <path d={toes(length)} {...line} strokeWidth={2.4} />
    </>
  );
}

export function Tail() {
  return (
    <>
      <path d={SHAPES.tailStem} {...line} strokeWidth={9} />
      <path d={SHAPES.tailStem} stroke={FUR} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d={SHAPES.tail} fill={FUR} {...outline} />
    </>
  );
}

export function Torso() {
  return (
    <>
      <path d={SHAPES.body} fill={FUR} {...outline} />
      <path d={SHAPES.chest} fill={FUR} {...outline} />
    </>
  );
}

export function Collar() {
  return (
    <>
      <path d={SHAPES.collar} fill={COLLAR} {...outline} strokeWidth={3} />
      <path d={SHAPES.tag} fill={CREAM} {...outline} strokeWidth={2.4} />
    </>
  );
}

export function Skull() {
  return (
    <>
      <path d={SHAPES.head} fill={FUR} {...outline} />
      <path d={SHAPES.topknot} fill={FUR} {...outline} strokeWidth={3} />
      <path d={SHAPES.muzzle} fill={CREAM} />
      <circle cx={181} cy={116} r={7} fill={CHEEK} opacity={0.85} />
      <circle cx={243} cy={116} r={7} fill={CHEEK} opacity={0.85} />
    </>
  );
}

export const HAPPY_EYES = 'M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101';

const eye = (x: number) => (
  <>
    <ellipse cx={x} cy={EYE_Y} rx={7.4} ry={8.6} fill={INK} />
    <circle cx={x + 2.6} cy={EYE_Y - 3.4} r={2.7} fill="#fff" />
    <circle cx={x - 2} cy={EYE_Y + 3.2} r={1.2} fill="#fff" />
  </>
);

type Props = { pose?: PoseName; facing?: 'left' | 'right'; label?: string };

/** Teddy, drawn in a pose. Groups marked data-p are the joints PupEngine animates. */
export function TeddySvg({ pose = 'sit', facing = 'right', label }: Props) {
  const { transform, opacity } = solve(POSES[pose]);
  const part = (name: string) => ({ 'data-p': name, transform: transform[name], opacity: opacity[name] });

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ overflow: 'visible' }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g data-p="root" transform={facing === 'left' ? `translate(${WIDTH} 0) scale(-1 1)` : undefined}>
        <ellipse {...part('shadow')} cx={150} cy={230} rx={92} ry={7} fill={INK} />
        <g {...part('body')}>
          <g {...part('backFar')}>
            <Leg d={LEGS.backFar} fill={FUR_FAR} length={36} />
          </g>
          <g {...part('frontFar')}>
            <Leg d={LEGS.frontFar} fill={FUR_FAR} length={36} />
          </g>
          <g {...part('tail')}>
            <Tail />
          </g>
          <g {...part('backNear')}>
            <Leg d={LEGS.backNear} fill={FUR} length={34} />
          </g>
          <Torso />
          <g {...part('frontNear')}>
            <Leg d={LEGS.frontNear} fill={FUR} length={34} />
          </g>
        </g>
        <g {...part('haunch')}>
          <path d={SHAPES.haunch} fill={FUR} {...outline} />
          <path d={SHAPES.haunchPaw} fill={FUR} {...outline} />
          <path d="M132 222v5M139 222v5" {...line} strokeWidth={2.4} />
        </g>
        <g {...part('head')}>
          <Collar />
          <path {...part('earL')} d={SHAPES.earL} fill={FUR_FAR} {...outline} />
          <path {...part('earR')} d={SHAPES.earR} fill={FUR_FAR} {...outline} />
          <Skull />
          <g {...part('eyes')}>
            <g {...part('open')}>
              <g {...part('blink')}>
                {eye(194)}
                {eye(230)}
              </g>
            </g>
          </g>
          <path {...part('happy')} d={HAPPY_EYES} {...line} />
          <path d={SHAPES.nose} fill={INK} />
          <path d={SHAPES.mouth} {...line} strokeWidth={3} />
          <path {...part('tongue')} d={SHAPES.tongue} fill="#e98c8c" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
          <g {...part('mouth')}>
            <path d={SHAPES.mouthOpen} fill="#6b2a1c" {...outline} strokeWidth={2.6} />
            <path d="M206.5 133.5 Q212 130 217.5 133.5 Q215 138 212 138 Q209 138 206.5 133.5 Z" fill="#e98c8c" />
          </g>
        </g>
        <g {...part('ledge')}>
          <path d={SHAPES.ledgePaws} fill={FUR} {...outline} />
          <path d={SHAPES.ledgeToes} {...line} strokeWidth={2.4} />
        </g>
      </g>
    </svg>
  );
}
