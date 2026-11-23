import { Chat } from '@/components/home/Chat';
import { Dusk } from '@/components/home/Dusk';
import { Hero } from '@/components/home/Hero';
import { Homecoming } from '@/components/home/Homecoming';
import { Meet } from '@/components/home/Meet';
import { Night } from '@/components/home/Night';
import { Passport } from '@/components/home/Passport';
import { Paths } from '@/components/home/Paths';
import { testimonial } from '@/lib/content';
import { availablePuppies, homePhotos } from '@/lib/data';

export default function HomePage() {
  return (
    <div data-page="home" className="tp-page">
      <Hero />
      <Meet puppies={availablePuppies} />
      <Paths />
      <Chat />
      <Passport />
      <Dusk photos={homePhotos} testimonial={testimonial} />
      <Night />
      <Homecoming />
    </div>
  );
}
