'use client';

import { useCallback, useSyncExternalStore } from 'react';

const REDUCED = '(prefers-reduced-motion: reduce)';

export const prefersReducedMotion = () => matchMedia(REDUCED).matches;

export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const list = matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => serverValue,
  );
}

/** Assumes reduced motion on the server so nothing animates before hydration. */
export const useReducedMotion = () => useMediaQuery(REDUCED, true);
