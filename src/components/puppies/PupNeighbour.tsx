import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import type { Puppy } from '@/lib/types';

export function PupNeighbour({ pup, label }: { pup: Puppy; label: string }) {
  return (
    <Link
      href={`/puppies/${pup.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        <Photo media={pup.cover} sizes="80px" />
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.displayName}</span>
      </span>
    </Link>
  );
}
