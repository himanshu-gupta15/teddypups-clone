'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { PAW_PATH } from '@/components/ui/Paw';
import { BARKS, type PupCue } from './cue';
import { PupEngine } from './engine';
import { FEET, LEDGE_Y, WIDTH, type PoseName } from './rig';
import { TeddySvg } from './TeddySvg';

type Stop = {
  el: HTMLElement;
  pose: PoseName;
  facing: 1 | -1;
  act: string;
  behind: boolean;
  /** On phones, Teddy peeks over the contact bar from this side of the screen. */
  lane?: 'left' | 'right';
  scene: HTMLElement | null;
  /** Scroll range in which Teddy rests here. */
  from: number;
  to: number;
};

const PRINTS = 24;
const PHONE = '(max-width: 767px), (pointer: coarse) and (max-height: 519px)';
/** The travelling Teddy is drawn slightly larger than the still it replaces. */
const PRESENCE = 1.12;
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Top edge of the sticky contact bar, or the bottom of the screen without one. */
function barTop() {
  const bar = document.querySelector('[data-whatsapp-bar]')?.getBoundingClientRect();
  return bar?.height ? bar.top : innerHeight - 6;
}

/** Phones have no room for seats, so between hero and basket Teddy peeks over the bar, once per scene. */
function addLane(stops: Stop[]) {
  const [first, last] = [stops[0], stops[stops.length - 1]];
  if (!first?.scene || first === last) return void (stops.length = 0);
  const scenes = [...document.querySelectorAll<HTMLElement>('#main [data-pup-scene]')].filter((s) => s !== first.scene);
  const lane = scenes.map((scene, i): Stop => {
    const box = scene.getBoundingClientRect();
    const left = i % 2 === 0;
    return {
      el: scene,
      scene,
      pose: 'peek',
      act: 'lane',
      behind: false,
      lane: left ? 'left' : 'right',
      facing: left ? 1 : -1,
      from: box.top + scrollY - 0.42 * innerHeight,
      to: box.bottom + scrollY - 0.58 * innerHeight,
    };
  });
  stops.splice(0, stops.length, first, ...lane, last);
}

/** Works out where in the scroll each stop should be occupied. */
function measure(): Stop[] {
  const vh = innerHeight;
  const bottom = document.documentElement.scrollHeight - vh;
  const stops = [...document.querySelectorAll<HTMLElement>('[data-pup-stop]')]
    .filter((el) => el.getClientRects().length)
    .map((el): Stop => {
      const scene = el.closest<HTMLElement>('[data-pup-scene]');
      const box = el.getBoundingClientRect();
      const pin = el.closest<HTMLElement>('[data-pin-range]');
      const pinBox = pin?.getBoundingClientRect();
      const centre = box.top + scrollY + box.height / 2;
      // Inside a pinned scene, rest for as long as it is pinned; otherwise while comfortably on screen.
      const pinned = pinBox && pinBox.height > vh * 1.2;
      const from = pinned ? pinBox.top + scrollY - vh * 0.15 : centre - vh * 0.78;
      const to = pinned ? pinBox.bottom + scrollY - vh * 1.05 : centre - vh * 0.42;
      return {
        el,
        scene,
        from,
        to,
        pose: (el.dataset.pose ?? 'sit') as PoseName,
        facing: el.dataset.facing === 'left' ? -1 : 1,
        act: el.dataset.act ?? '',
        behind: el.dataset.behind === 'true',
      };
    });
  if (matchMedia(PHONE).matches) addLane(stops);
  if (!stops.length) return stops;
  stops[0].from = -Infinity;
  const last = stops[stops.length - 1];
  last.from = Math.min(last.from, bottom - 40);
  last.to = Infinity;
  // Leave room to walk between neighbouring rests.
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, b] = [stops[i], stops[i + 1]];
    const missing = vh * (b.lane || a.lane ? 0.32 : 0.45) - (b.from - a.to);
    if (missing > 0) {
      a.to -= missing / 2;
      b.from += missing / 2;
    }
  }
  for (const s of stops) if (s.to < s.from) s.from = s.to = (s.from + s.to) / 2;
  return stops;
}

/** Walks a single Teddy through every [data-pup-stop] on the page as you scroll. */
export function PupJourney() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const actorRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const printsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const root = document.documentElement;
    const layer = layerRef.current!;
    const actor = actorRef.current!;
    const body = actor.firstElementChild as HTMLElement;
    const bubble = bubbleRef.current!;
    const prints = [...printsRef.current!.children] as SVGElement[];
    const engine = new PupEngine(body.querySelector('svg')!, 'sit', 1);

    let stops: Stop[] = [];
    let frame = 0;
    let last = 0;
    let previous: { x: number; y: number } | null = null;
    let lastScroll = scrollY;
    let treadmill = 0;
    let sincePrint = 0;
    let printIndex = 0;
    let side = 1;
    let current = -1;
    let lastReached = -1;
    let pointer: { x: number; y: number; at: number } | null = null;
    let look: { el: Element; until: number } | null = null;
    let bubbleUntil = 0;
    let barks = 0;

    const say = (text: string, seconds = 1.4) => {
      bubble.textContent = text;
      bubble.dataset.show = 'true';
      bubbleUntil = performance.now() + seconds * 1000;
    };

    const remeasure = () => {
      stops = measure();
      const active = stops.length > 1;
      layer.hidden = !active;
      if (active) root.dataset.pup = '';
      else delete root.dataset.pup;
    };

    const markScenes = (scene: HTMLElement | null, reached: number) => {
      stops.forEach((s, i) => {
        if (!s.scene) return;
        s.scene.dataset.here = String(s.scene === scene);
        s.scene.dataset.visited = String(i <= reached);
      });
    };

    /** Where Teddy's ground point is on screen when resting at a stop. */
    const place = (stop: Stop) => {
      if (stop.lane) {
        const scale = clamp(innerWidth / 650, 0.5, 0.62);
        const left = stop.lane === 'left' ? 12 - 148 * scale : innerWidth - 12 - 152 * scale;
        return { x: left + FEET.x * scale, y: barTop() + (FEET.y - LEDGE_Y) * scale, scale };
      }
      const box = stop.el.getBoundingClientRect();
      const still = box.width / WIDTH;
      const scale = stop.act === 'basket' || stops.some((s) => s.lane) ? still : still * PRESENCE;
      // Grow from the point that touches something: the ledge when peeking, otherwise the feet.
      const anchor = stop.pose === 'peek' ? LEDGE_Y : FEET.y;
      return { x: box.left + FEET.x * still, y: box.top + anchor * still + (FEET.y - anchor) * scale, scale };
    };

    const dropPrint = (x: number, y: number, angle: number) => {
      const print = prints[printIndex++ % PRINTS];
      const host = printsRef.current!.getBoundingClientRect();
      side = -side;
      print.style.transform = `translate(${x - host.left - 7 + Math.cos(angle) * 6 * side}px, ${y - host.top - 7 + Math.sin(angle) * 6 * side}px) rotate(${angle}rad)`;
      print.animate([{ opacity: 0.5 }, { opacity: 0.5, offset: 0.5 }, { opacity: 0 }], { duration: 3200 });
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      if (stops.length < 2) return;

      const y = scrollY;
      let k = 0;
      while (k < stops.length - 1 && y >= stops[k + 1].from) k++;
      const here = stops[k];
      const next = stops[k + 1];
      const raw = next && y > here.to ? clamp((y - here.to) / Math.max(1, next.from - here.to)) : 0;
      const t = smooth(raw);

      const a = place(here);
      let { x, y: top, scale } = a;
      if (raw > 0) {
        const b = place(next);
        x = a.x + (b.x - a.x) * t;
        scale = a.scale + (b.scale - a.scale) * t;
        top = a.y + (b.y - a.y) * t;
        // Hop up and out of, or down into, a hiding place.
        if (here.behind && raw < 0.36) top -= Math.sin((raw / 0.36) * Math.PI) * Math.min(64 * a.scale, 72);
        if (next.behind && raw > 0.68) top -= Math.sin(((raw - 0.68) / 0.32) * Math.PI) * Math.min(56 * b.scale, 60);
        // On the phone lane, climb onto the bar, walk along it, then duck behind it again.
        if (here.lane || next.lane) {
          const bar = barTop();
          const sink = (FEET.y - LEDGE_Y) * scale;
          if (here.lane && next.lane) top = bar + sink * (1 - smooth(clamp(raw / 0.22)) + smooth(clamp((raw - 0.78) / 0.22)));
          else top = Math.min(top, bar + sink * (here.lane ? 1 - smooth(clamp(raw / 0.22)) : smooth(clamp((raw - 0.78) / 0.22))));
        }
        // Stay on screen while walking.
        const header = 96;
        const margin = (here.lane || next.lane ? 70 : 120) * scale;
        x = clamp(x, margin, innerWidth - margin);
        const floor = here.lane || next.lane ? Math.max(top, barTop()) : innerHeight - 24;
        const visible = clamp(top, header + 200 * scale, floor);
        top += (visible - top) * clamp(Math.min(raw, 1 - raw) * 6);
      }

      // Ease toward the target so fast scrolling reads as a run rather than a teleport.
      const distanceScrolled = Math.abs(y - lastScroll);
      const jumped = previous && distanceScrolled > innerHeight;
      if (!previous || jumped) previous = { x, y: top };
      else {
        const follow = raw > 0 ? 1 - Math.exp(-dt / 0.09) : 1 - Math.exp(-dt / 0.045);
        const px = previous.x + (x - previous.x) * follow;
        const dx = px - previous.x;
        // Vertical follows the page exactly at rest, so Teddy never drifts off a seat.
        const py = raw > 0 ? previous.y + (top - previous.y) * follow : top;
        const ground = Math.hypot(dx, raw > 0 ? (y - lastScroll) * 0.35 : 0);
        if (raw > 0.04 && raw < 0.96 && Math.abs(dx) > 0.15) engine.face(dx > 0 ? 1 : -1);
        let walked = raw > 0 ? ground : 0;
        if (here.act === 'treadmill' && raw === 0) {
          const track = here.scene?.querySelector('[data-treadmill]');
          const left = track ? track.getBoundingClientRect().left : 0;
          const moved = treadmill - left;
          treadmill = left;
          walked = Math.abs(moved);
          if (walked > 0.5) engine.face(moved > 0 ? 1 : -1);
        }
        engine.walk(walked);
        if (raw > 0.05 && raw < 0.95 && !here.lane && !next.lane) {
          sincePrint += walked;
          if (sincePrint > 42) {
            sincePrint = 0;
            dropPrint(px, py, Math.atan2(py - previous.y + (y - lastScroll), dx) + Math.PI / 2);
          }
        }
        previous = { x: px, y: py };
      }
      lastScroll = y;

      const resting = raw < 0.06 ? here : raw > 0.94 ? next : null;
      if (resting) {
        engine.setPose(resting.pose);
        if (resting.act !== 'treadmill') engine.face(resting.facing);
        engine.cock(resting.act === 'tilt' && Math.sin(now / 1500) > 0.2 ? 13 : 0);
      } else {
        engine.setPose('walk');
        engine.cock(0);
      }
      engine.wag(resting ? 0.35 : 0.7);

      const index = resting ? stops.indexOf(resting) : -1;
      const reached = raw > 0.6 ? k + 1 : k;
      if (index !== current || reached !== lastReached) {
        current = index;
        lastReached = reached;
        markScenes(resting?.scene ?? null, reached);
      }

      if (look && now < look.until) {
        const box = look.el.getBoundingClientRect();
        engine.lookAt({ x: box.left + box.width / 2, y: box.top + box.height / 2 });
      } else engine.lookAt(pointer && now - pointer.at < 2500 ? pointer : null);

      engine.tick(dt);
      const inFront = !((here.behind && raw < 0.12) || (next?.behind && raw > 0.92));
      layer.dataset.front = String(inFront);
      actor.style.transform = `translate(${previous.x.toFixed(1)}px, ${previous.y.toFixed(1)}px)`;
      body.style.transform = `scale(${scale.toFixed(4)}) translate(${-FEET.x}px, ${-FEET.y}px)`;
      bubble.parentElement!.style.transform = `translate(${(70 * scale).toFixed(0)}px, ${(-190 * scale).toFixed(0)}px)`;
      if (bubbleUntil && now > bubbleUntil) {
        bubble.dataset.show = 'false';
        bubbleUntil = 0;
      }
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointer = { x: e.clientX, y: e.clientY, at: performance.now() };
    };
    const onFocus = (e: FocusEvent) => {
      if (e.target instanceof Element && e.target.matches('a, button, input, textarea, select'))
        look = { el: e.target, until: performance.now() + 1400 };
    };
    const onCue = (e: Event) => {
      const cue = (e as CustomEvent<PupCue>).detail;
      const scene = current >= 0 ? stops[current].scene : null;
      if (!scene || (cue.look && !scene.contains(cue.look))) return;
      if (cue.look) look = { el: cue.look, until: performance.now() + (cue.seconds ?? 1.6) * 1000 };
      if (cue.say) say(cue.say, cue.seconds);
    };
    const onClick = () => {
      engine.woof();
      say(BARKS[barks++ % BARKS.length]);
    };

    remeasure();
    if (stops[0]) engine.jumpTo(stops[0].pose);
    frame = requestAnimationFrame(loop);
    const resize = new ResizeObserver(remeasure);
    resize.observe(document.body);
    addEventListener('resize', remeasure);
    addEventListener('pointermove', onPointer, { passive: true });
    addEventListener('focusin', onFocus);
    addEventListener('tp:pup', onCue);
    body.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener('resize', remeasure);
      removeEventListener('pointermove', onPointer);
      removeEventListener('focusin', onFocus);
      removeEventListener('tp:pup', onCue);
      body.removeEventListener('click', onClick);
      for (const s of stops) {
        delete s.scene?.dataset.here;
        delete s.scene?.dataset.visited;
      }
      delete root.dataset.pup;
      layer.hidden = true;
    };
  }, [pathname, reduced]);

  return (
    <>
      <div ref={printsRef} aria-hidden className="pup-prints">
        {Array.from({ length: PRINTS }, (_, i) => (
          <svg key={i} viewBox="0 0 64 64">
            <path d={PAW_PATH} />
          </svg>
        ))}
      </div>
      <div ref={layerRef} aria-hidden className="pup-layer" hidden data-front="true">
        <div ref={actorRef} className="pup-actor">
          <div className="pup-actor__body">
            <TeddySvg />
          </div>
          <span className="pup-bubble-at">
            <span ref={bubbleRef} className="pup-bubble" data-show="false" />
          </span>
        </div>
      </div>
    </>
  );
}
