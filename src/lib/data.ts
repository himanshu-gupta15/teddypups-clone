import families from '@/data/families.json';
import puppies from '@/data/puppies.json';
import showroom from '@/data/showroom.json';
import type { Media, Puppy } from './types';

export const allPuppies = puppies as unknown as Puppy[];
export const availablePuppies = allPuppies.filter((p) => p.status !== 'rehomed');
export const gonePuppies = allPuppies.filter((p) => p.status === 'rehomed');

export const homePhotos = families.home as Media[];
export const wallPhotos = families.wall as Media[];
export const showroomPhotos = showroom.photos as Media[];
export const showroomVideo = showroom.video as Media | null;

export const breeds = [
  { slug: 'maltipoo', name: 'Maltipoo' },
  { slug: 'pomeranian', name: 'Pomeranian' },
  { slug: 'poodle', name: 'Poodle' },
  { slug: 'cavapoo', name: 'Cavapoo' },
  { slug: 'shih-tzu', name: 'Shih Tzu' },
];

export const statusLabels = { available: 'Available', reserved: 'Reserved', rehomed: 'Gone home' } as const;

export const findPuppy = (slug: string) => allPuppies.find((p) => p.slug === slug);

/** "Max (Maltipoo, boy)" — how a puppy appears in form selects. */
export function puppyLabel(p: Puppy) {
  const gender = p.genderLabel.toLowerCase();
  return `${p.displayName} (${p.name ? `${p.breed}, ` : ''}${gender})`;
}

/** Previous and next puppy within the same group, wrapping at both ends. */
export function neighbours(p: Puppy) {
  const group = p.status === 'rehomed' ? gonePuppies : availablePuppies;
  const i = group.findIndex((q) => q.slug === p.slug);
  return { previous: group[(i - 1 + group.length) % group.length], next: group[(i + 1) % group.length] };
}
