'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Runner } from '@/components/teddy/Runner';
import { PAW_PATH } from '@/components/ui/Paw';
import { Scallops } from '@/components/ui/icons';
import { prefersReducedMotion } from '@/lib/hooks';
import { site } from '@/lib/site';
import { INTRO_LIFT, introElapsed } from './curtain-state';

type State = 'intro' | 'covering' | 'covered' | 'snap' | 'lifting' | 'idle';
const INTRO_END = 1080;
/** [left %, top px, heading °] of each paw print behind the runner. */
const PRINTS = [
  [18, 6, 14],
  [27, -4, 6],
  [36, 7, 18],
  [45, -3, 4],
  [54, 6, 16],
];

/**
 * The blanket that sweeps over the page between routes. It intercepts internal link
 * clicks, covers the page, navigates, then lifts once the new route has rendered.
 */
export function RouteCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const shownPath = useRef(pathname);
  const coveredAt = useRef(0);
  const lift = useRef(() => {});

  useEffect(() => {
    const curtain = ref.current!;
    const root = document.documentElement;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const after = (ms: number, run: () => void) => void timers.add(setTimeout(run, ms));
    const clear = () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
    const state = () => curtain.dataset.state as State;
    const set = (next: State) => {
      curtain.dataset.state = next;
      if (next === 'idle') delete root.dataset.curtain;
      else root.dataset.curtain = next;
    };
    let destination: string | null = null;
    let fromKeyboard = false;

    const raise = () => {
      if (state() === 'idle' || state() === 'lifting') return;
      clear();
      destination = null;
      set('lifting');
      dispatchEvent(new Event('tp:arrived'));
      if (fromKeyboard) document.getElementById('main')?.focus({ preventScroll: true });
      fromKeyboard = false;
      after(460, () => set('idle'));
    };
    const go = () => {
      const url = new URL(destination!, location.href);
      if (url.pathname === location.pathname && url.search === location.search) {
        scrollTo({ top: 0, behavior: 'instant' });
        return after(120, raise);
      }
      router.push(url.pathname + url.search + url.hash);
      after(6000, raise); // Never leave a visitor stuck behind the curtain.
    };
    const cover = () => {
      set('covered');
      coveredAt.current = performance.now();
      if (destination) go();
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest?.<HTMLAnchorElement>('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href, location.href);
      const samePage = url.pathname === location.pathname;
      if (url.origin !== location.origin || (samePage && (url.hash || url.search !== location.search))) return;
      if (prefersReducedMotion()) return;
      e.preventDefault();
      e.stopPropagation();
      fromKeyboard = e.detail === 0;
      router.prefetch(url.pathname + url.search);
      dispatchEvent(new Event('tp:navigate'));
      destination = url.href;
      if (state() === 'covering') return;
      if (state() === 'covered' || state() === 'snap') return go();
      const stillIntro = state() === 'intro' && introElapsed() < INTRO_LIFT;
      clear();
      if (stillIntro) return cover();
      set('covering');
      after(300, cover);
    };
    const onBack = () => {
      if (prefersReducedMotion() || location.pathname === shownPath.current) return;
      clear();
      set('snap');
      coveredAt.current = performance.now();
      after(1400, raise);
    };
    const onRestore = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      clear();
      set('idle');
    };

    if (prefersReducedMotion()) set('idle');
    else if (state() === 'intro') {
      const elapsed = introElapsed();
      after(Math.max(0, INTRO_LIFT - elapsed), () => dispatchEvent(new Event('tp:arrived')));
      after(Math.max(0, INTRO_END - elapsed), () => state() === 'intro' && set('idle'));
    }
    lift.current = raise;
    addEventListener('click', onClick, true);
    addEventListener('popstate', onBack);
    addEventListener('pageshow', onRestore);
    return () => {
      clear();
      delete root.dataset.curtain;
      removeEventListener('click', onClick, true);
      removeEventListener('popstate', onBack);
      removeEventListener('pageshow', onRestore);
    };
  }, [router]);

  useEffect(() => {
    if (pathname === shownPath.current) return;
    shownPath.current = pathname;
    const state = ref.current?.dataset.state;
    if (state !== 'covered' && state !== 'snap' && state !== 'covering') return;
    const wait = state === 'covering' ? 340 : Math.max(0, 140 - (performance.now() - coveredAt.current));
    const timer = setTimeout(() => requestAnimationFrame(() => lift.current()), wait);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div ref={ref} className="tp-curtain" data-state="intro" aria-hidden suppressHydrationWarning>
      <div className="tp-curtain__blanket">
        <Scallops id="curtain-top" className="tp-curtain__edge tp-curtain__edge--top" fill="#fbe3b4" />
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {PRINTS.map(([left, top, heading], i) => (
              <svg
                key={left}
                viewBox="0 0 64 64"
                className="tp-curtain__print"
                style={{ left: `${left}%`, top, rotate: `${heading}deg`, animationDelay: `${(0.16 + 0.12 * i).toFixed(2)}s` }}
              >
                <path d={PAW_PATH} />
              </svg>
            ))}
          </div>
          <div className="tp-curtain__runner">
            <Runner />
          </div>
          <p className="tp-curtain__note font-scrawl">{site.tagline}</p>
        </div>
        <Scallops id="curtain-bottom" className="tp-curtain__edge tp-curtain__edge--bottom" fill="#fbe3b4" />
      </div>
    </div>
  );
}
