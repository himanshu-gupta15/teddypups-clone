import type { Puppy } from './types';

export const FILTER_KEYS = ['origin', 'breed', 'gender', 'collection'] as const;
export type FilterKey = (typeof FILTER_KEYS)[number];
export type Filters = Record<FilterKey, string>;

export const readFilters = (params: { get(key: string): string | null }) =>
  Object.fromEntries(FILTER_KEYS.map((key) => [key, params.get(key) ?? ''])) as Filters;

export function filterPuppies(puppies: Puppy[], f: Filters) {
  return puppies.filter(
    (p) =>
      (!f.origin || p.origin === f.origin) &&
      (!f.breed || p.breeds.includes(f.breed)) &&
      (!f.gender || p.gender === f.gender || p.gender === 'male-female') &&
      (!f.collection || p.collections.includes(f.collection)),
  );
}

/** The query string after clicking a chip: selects it, or clears it if already selected. */
export function toggleFilter(query: string, key: FilterKey, value: string) {
  const params = new URLSearchParams(query);
  if (params.get(key) === value) params.delete(key);
  else params.set(key, value);
  return params.toString();
}
