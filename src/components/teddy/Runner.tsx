import { Collar, HAPPY_EYES, Leg, Skull, Tail, Torso } from './TeddySvg';
import { FUR, FUR_FAR, HEIGHT, INK, JOINTS, LEGS, SHAPES, WIDTH } from './rig';

const outline = { stroke: INK, strokeWidth: 3.4, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
const origin = ([x, y]: [number, number]) => ({ transformOrigin: `${x}px ${y}px` });

function RunnerLeg({ name, at, d, length, fill }: { name: string; at: [number, number]; d: string; length: number; fill: string }) {
  return (
    <g className={`tp-runner__leg tp-runner__leg--${name}`} style={origin(at)}>
      <g transform={`translate(${at[0]} ${at[1]})`}>
        <Leg d={d} fill={fill} length={length} />
      </g>
    </g>
  );
}

/** Teddy mid-sprint, animated purely in CSS for the page-transition curtain. */
export function Runner() {
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="tp-runner" aria-hidden focusable="false" style={{ overflow: 'visible' }}>
      <ellipse cx={150} cy={230} rx={86} ry={7} fill={INK} opacity={0.12} className="tp-runner__shadow" />
      <g className="tp-runner__body">
        <RunnerLeg name="bf" at={JOINTS.hipFar} d={LEGS.backFar} length={36} fill={FUR_FAR} />
        <RunnerLeg name="ff" at={JOINTS.shoulderFar} d={LEGS.frontFar} length={36} fill={FUR_FAR} />
        <g className="tp-runner__tail" style={origin(JOINTS.tail)}>
          <Tail />
        </g>
        <RunnerLeg name="bn" at={JOINTS.hipNear} d={LEGS.backNear} length={34} fill={FUR} />
        <Torso />
        <RunnerLeg name="fn" at={JOINTS.shoulderNear} d={LEGS.frontNear} length={34} fill={FUR} />
        <g className="tp-runner__head">
          <Collar />
          <path d={SHAPES.earL} fill={FUR_FAR} {...outline} className="tp-runner__ear" style={origin(JOINTS.earL)} />
          <path d={SHAPES.earR} fill={FUR_FAR} {...outline} className="tp-runner__ear tp-runner__ear--r" style={origin(JOINTS.earR)} />
          <Skull />
          <path d={HAPPY_EYES} {...outline} fill="none" />
          <path d={SHAPES.nose} fill={INK} />
          <path d={SHAPES.mouth} {...outline} fill="none" strokeWidth={3} />
          <path d={SHAPES.tongue} fill="#e98c8c" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}
