'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { curtainIsDown } from '@/components/layout/curtain-state';
import { prefersReducedMotion } from '@/lib/hooks';

/**
 * Reveals every [data-reveal] descendant when it scrolls into view. Elements are only
 * "armed" (hidden) from JavaScript, so the content is visible without it.
 */
export function RevealScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = ref.current!;
    const reduced = prefersReducedMotion();
    const waiting = new Set<HTMLElement>();
    const reveal = (el: HTMLElement) => {
      el.dataset.revealed = 'true';
      observer.unobserve(el);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          // Hold reveals until the page-transition curtain has lifted.
          if (curtainIsDown()) waiting.add(el);
          else reveal(el);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    const arm = (el: HTMLElement) => {
      if (reduced) return void (el.dataset.revealed = 'true');
      if (!el.dataset.armed) {
        const box = el.getBoundingClientRect();
        if (box.top < innerHeight && box.bottom > 0 && !curtainIsDown()) return void (el.dataset.revealed = 'true');
        el.dataset.armed = 'true';
      }
      observer.observe(el);
    };
    const armAll = () => scope.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach(arm);
    const arrived = () => {
      waiting.forEach(reveal);
      waiting.clear();
    };

    armAll();
    const mutations = new MutationObserver(armAll);
    mutations.observe(scope, { childList: true, subtree: true });
    addEventListener('tp:arrived', arrived);
    const fallback = setTimeout(arrived, 2000);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
      mutations.disconnect();
      removeEventListener('tp:arrived', arrived);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
