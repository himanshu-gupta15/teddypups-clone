'use client';

import { useEffect, useRef } from 'react';
import { PAW_PATH } from '@/components/ui/Paw';
import { useReducedMotion } from '@/lib/hooks';

const LIFE = 1000;
const STEP = 46;

/** Paw prints that follow the mouse, drawn on a single canvas that sleeps when idle. */
export function PawTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const paw = new Path2D(PAW_PATH);
    const prints: { x: number; y: number; angle: number; born: number }[] = [];
    let ratio = 1;
    let frame = 0;
    let running = false;
    let last: { x: number; y: number } | null = null;
    let travelled = 0;
    let side = 1;

    const fit = () => {
      ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
    };
    const draw = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = prints.length - 1; i >= 0; i--) {
        const print = prints[i];
        const age = now - print.born;
        if (age > LIFE) {
          prints.splice(i, 1);
          continue;
        }
        const fade = age < 600 ? 1 : 1 - (age - 600) / 400;
        ctx.globalAlpha = 0.42 * fade * fade;
        ctx.setTransform(0.27 * ratio, 0, 0, 0.27 * ratio, print.x * ratio, print.y * ratio);
        ctx.rotate(print.angle);
        ctx.translate(-32, -34);
        ctx.fillStyle = '#c2622b';
        ctx.fill(paw);
      }
      running = prints.length > 0;
      if (running) frame = requestAnimationFrame(draw);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (last) {
        const dx = e.clientX - last.x;
        const dy = e.clientY - last.y;
        travelled += Math.hypot(dx, dy);
        if (travelled >= STEP) {
          travelled = 0;
          side = -side;
          const angle = Math.atan2(dy, dx) + Math.PI / 2;
          prints.push({
            x: e.clientX + Math.cos(angle) * 7 * side + 14,
            y: e.clientY + Math.sin(angle) * 7 * side + 16,
            angle,
            born: performance.now(),
          });
          if (prints.length > 14) prints.shift();
          if (!running) {
            running = true;
            frame = requestAnimationFrame(draw);
          }
        }
      }
      last = { x: e.clientX, y: e.clientY };
    };

    fit();
    addEventListener('pointermove', move, { passive: true });
    addEventListener('resize', fit);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('pointermove', move);
      removeEventListener('resize', fit);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
