'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { navLinks, site } from '@/lib/site';
import { MobileMenu } from './MobileMenu';
import { NavLink } from './NavLink';

export function Header() {
  const ref = useRef<HTMLElement>(null);
  const home = usePathname() === '/';

  useEffect(() => {
    const header = ref.current!;
    let last = scrollY;
    let queued = false;
    const update = () => {
      queued = false;
      header.dataset.scrolled = String(scrollY > 8);
      if (Math.abs(scrollY - last) <= 6) return;
      // Hide going down, return going up.
      header.dataset.hidden = String(scrollY > last && scrollY > 220);
      last = scrollY;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    const show = () => (header.dataset.hidden = 'false');
    update();
    addEventListener('scroll', onScroll, { passive: true });
    header.addEventListener('focusin', show);
    return () => {
      removeEventListener('scroll', onScroll);
      header.removeEventListener('focusin', show);
    };
  }, []);

  return (
    <header
      ref={ref}
      id="site-header"
      data-scrolled="false"
      data-hidden="false"
      data-home={home || undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link className="tp-header__brand" aria-label={`${site.name} — home`} href="/">
          <Image src="/brand/logo.png" alt="" width={56} height={56} preload className="tp-header__logo" />
          <span className="font-plush tp-header__name">{site.shortName}</span>
        </Link>
        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink {...link} className="tp-nav-link" />
              </li>
            ))}
          </ul>
        </nav>
        <div className="tp-header__end">
          <WhatsAppLink className="btn btn-whatsapp tp-header__wa">WhatsApp us</WhatsAppLink>
          <MobileMenu />
        </div>
      </div>
      <svg aria-hidden className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
