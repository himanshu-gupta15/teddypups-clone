import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { allPuppies, availablePuppies, gonePuppies, homePhotos, neighbours, puppyLabel, showroomPhotos, wallPhotos } from '@/lib/data';
import { filterPuppies, readFilters, toggleFilter } from '@/lib/filters';
import { makeSketch } from '@/lib/sketch';

const filter = (query: string) => filterPuppies(availablePuppies, readFilters(new URLSearchParams(query)));

describe('data', () => {
  it('has every puppy, with unique slugs', () => {
    expect([availablePuppies.length, gonePuppies.length]).toEqual([15, 27]);
    expect(new Set(allPuppies.map((p) => p.slug)).size).toBe(42);
  });
  it('only references media that exists', () => {
    const media = [...allPuppies.flatMap((p) => [p.cover, ...p.media]), ...homePhotos, ...wallPhotos, ...showroomPhotos];
    const missing = media.flatMap((m) => [m.src, m.poster?.src ?? m.src]).filter((src) => !fs.existsSync(`public${src}`));
    expect(missing).toEqual([]);
  });
  it('labels named and unnamed puppies', () => {
    expect(puppyLabel(availablePuppies[0])).toBe('Max (Maltipoo, boy)');
    expect(puppyLabel(availablePuppies[1])).toBe('Korean Teacup Maltipoo (girl)');
  });
  it('wraps previous and next within a group', () => {
    expect(neighbours(availablePuppies[0]).previous).toBe(availablePuppies.at(-1));
    expect(neighbours(gonePuppies.at(-1)!).next).toBe(gonePuppies[0]);
  });
});

describe('filters', () => {
  it('returns everything by default', () => expect(filter('')).toHaveLength(15));
  it('filters by breed', () => expect(filter('breed=shih-tzu').map((p) => p.slug)).toEqual(['shitzu-female', 'shitzu-male']));
  it('shows mixed litters under both genders', () => {
    for (const gender of ['male', 'female']) expect(filter(`gender=${gender}`).some((p) => p.slug === 'toy-poodle-male-female')).toBe(true);
  });
  it('combines filters', () => expect(filter('breed=shih-tzu&gender=male')).toHaveLength(1));
  it('can match nothing', () => expect(filter('origin=local')).toHaveLength(0));
  it('toggles a chip on and off, keeping the others', () => {
    expect(toggleFilter('gender=male', 'breed', 'poodle')).toBe('gender=male&breed=poodle');
    expect(toggleFilter('gender=male&breed=poodle', 'breed', 'poodle')).toBe('gender=male');
  });
});

describe('sketches', () => {
  it('draws the same puppy the same way every time', () => expect(makeSketch('max')).toEqual(makeSketch('max')));
  it('draws different puppies differently', () => expect(makeSketch('max').outline).not.toBe(makeSketch('mia').outline));
});
