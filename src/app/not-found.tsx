import Link from 'next/link';
import { PupBuddy } from '@/components/teddy/PupBuddy';

export default function NotFound() {
  return (
    <div className="gutter mx-auto grid min-h-[70vh] max-w-[70rem] place-content-center justify-items-center gap-6 py-20 text-center">
      <PupBuddy curious className="w-48" label="Teddy, looking puzzled" />
      <h1 className="font-plush text-huge">This page wandered off</h1>
      <p className="text-lede text-cocoa-soft">We sniffed everywhere, but couldn&apos;t find it.</p>
      <Link className="btn btn-primary" href="/puppies">
        See available puppies
      </Link>
    </div>
  );
}
