'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/** Smooth wheel scrolling, for mouse users who haven't asked for reduced motion. */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
      wheelMultiplier: 0.85,
      prevent: (node) => !!node.closest?.('dialog, [data-lenis-prevent]'),
    });
    return () => lenis.destroy();
  }, [reduced]);
  return null;
}
