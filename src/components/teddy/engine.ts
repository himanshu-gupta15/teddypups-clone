import { EYE_Y, HEIGHT, POSES, STILL, WIDTH, mix, solve, type Pose, type PoseName } from './rig';

/** How far to move toward a target in `dt` seconds, with time constant `tau`. Frame-rate independent. */
const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

/** Animates one TeddySvg: pose blending, walking, blinking, gaze, wagging and barking. */
export class PupEngine {
  private parts = new Map<string, Element>();
  private written = new Map<string, string>();
  private pose: Pose;
  private target: Pose;
  private motion = { ...STILL };
  private facing: number;
  private facingTarget: number;
  private walking = false;
  private wagTarget = 0.35;
  private gaze = { x: 0, y: 0 };
  private tilt = 0;
  private tiltTarget = 0;
  private earSpeed = 0;
  private hop = 0;
  private hopSpeed = 0;
  private nextBlink = 1.2;
  private woofUntil = 0;

  constructor(
    private svg: SVGSVGElement,
    pose: PoseName,
    facing: 1 | -1,
  ) {
    svg.querySelectorAll('[data-p]').forEach((el) => this.parts.set(el.getAttribute('data-p')!, el));
    this.pose = { ...POSES[pose] };
    this.target = POSES[pose];
    this.facing = this.facingTarget = facing;
  }

  setPose(name: PoseName) {
    this.target = POSES[name];
  }
  jumpTo(name: PoseName) {
    this.pose = { ...POSES[name] };
    this.target = POSES[name];
  }
  face(direction: 1 | -1) {
    this.facingTarget = direction;
  }
  wag(amount: number) {
    this.wagTarget = amount;
  }
  cock(degrees: number) {
    this.tiltTarget = degrees;
  }

  /** Walk by `distance` pixels of ground, so the feet match the travel. */
  walk(distance: number) {
    this.walking = distance > 0.2;
    this.motion.phase += (distance / 46) * Math.PI;
  }

  lookAt(point: { x: number; y: number } | null) {
    if (!point) return void (this.gaze = { x: 0, y: 0 });
    const box = this.svg.getBoundingClientRect();
    const headX = this.facingTarget > 0 ? 212 : WIDTH - 212;
    const dx = point.x - (box.left + (headX / WIDTH) * box.width);
    const dy = point.y - (box.top + (EYE_Y / HEIGHT) * box.height);
    const distance = Math.hypot(dx, dy) || 1;
    const pull = Math.min(1, distance / 160);
    this.gaze = { x: (dx / distance) * pull * this.facingTarget, y: (dy / distance) * pull };
  }

  woof() {
    this.woofUntil = this.motion.time + 0.34;
    this.hopSpeed = -150;
    this.earSpeed += 260;
  }

  tick(dt: number) {
    const m = this.motion;
    dt = Math.min(dt, 0.05);
    m.time += dt;
    this.pose = mix(this.pose, this.target, ease(dt, 0.16));
    this.facing += (this.facingTarget - this.facing) * ease(dt, 0.07);
    m.stride += ((this.walking ? 1 : 0) - m.stride) * ease(dt, 0.12);
    m.wag += (this.wagTarget - m.wag) * ease(dt, 0.4);
    m.gazeX += (this.gaze.x - m.gazeX) * ease(dt, 0.07);
    m.gazeY += (this.gaze.y - m.gazeY) * ease(dt, 0.07);
    this.tilt += (this.tiltTarget + 3 * m.gazeX - this.tilt) * ease(dt, 0.18);

    // Ears and hops are damped springs.
    this.earSpeed += (-150 * m.ear - 10 * this.earSpeed) * dt;
    m.ear = Math.max(-28, Math.min(28, m.ear + this.earSpeed * dt));
    this.hopSpeed += (-260 * this.hop - 16 * this.hopSpeed) * dt;
    this.hop += this.hopSpeed * dt;

    if (m.time > this.nextBlink + 0.16) this.nextBlink = m.time + 1.8 + Math.random() * 3.2;
    const sinceBlink = m.time - this.nextBlink;
    m.blink = sinceBlink > 0 ? Math.sin(Math.min(1, sinceBlink / 0.16) * Math.PI) : 0;

    const woofing = m.time < this.woofUntil ? 1 : 0;
    const { transform, opacity } = solve(
      { ...this.pose, headRot: this.pose.headRot + this.tilt, mouth: woofing, headY: this.pose.headY - 4 * woofing },
      m,
    );
    for (const [part, value] of Object.entries(transform)) this.write(part, 'transform', value);
    for (const [part, value] of Object.entries(opacity)) this.write(part, 'opacity', String(value));
    const flip = this.facing.toFixed(3);
    this.write('root', 'transform', `translate(${WIDTH / 2} ${this.hop.toFixed(1)}) scale(${flip} 1) translate(${-WIDTH / 2} 0)`);
  }

  /** Only touch the DOM when a value actually changed. */
  private write(part: string, attribute: string, value: string) {
    const key = part + attribute;
    if (this.written.get(key) === value) return;
    this.written.set(key, value);
    this.parts.get(part)?.setAttribute(attribute, value);
  }
}
