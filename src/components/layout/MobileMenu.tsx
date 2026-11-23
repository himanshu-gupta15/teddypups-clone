'use client';

import { useEffect, useRef } from 'react';
import { Paw } from '@/components/ui/Paw';
import { WhatsAppLink } from '@/components/ui/WhatsAppLink';
import { prefersReducedMotion } from '@/lib/hooks';
import { navLinks, site } from '@/lib/site';
import { NavLink } from './NavLink';

export function MobileMenu() {
  const ref = useRef<HTMLDialogElement>(null);

  /** Plays the closing animation, then closes (or gives up waiting after 600 ms). */
  const close = () => {
    const menu = ref.current;
    if (!menu?.open || menu.dataset.closing) return;
    if (prefersReducedMotion()) return menu.close();
    menu.dataset.closing = 'true';
    const finish = () => {
      clearTimeout(timer);
      menu.removeEventListener('animationend', onEnd);
      menu.close();
    };
    const onEnd = (e: AnimationEvent) => e.target === menu && finish();
    const timer = setTimeout(finish, 600);
    menu.addEventListener('animationend', onEnd);
  };

  useEffect(() => {
    const onNavigate = () => ref.current?.close();
    addEventListener('tp:navigate', onNavigate);
    return () => removeEventListener('tp:navigate', onNavigate);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <Paw className="size-4" />
        Menu
      </button>
      <dialog
        ref={ref}
        aria-label="Site menu"
        className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
        onClick={(e) => e.target === ref.current && close()}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={(e) => delete e.currentTarget.dataset.closing}
      >
        <div className="gutter flex h-full flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
          <div className="flex items-center justify-between">
            <span className="font-scrawl text-lg">where to, friend?</span>
            <button type="button" onClick={close} className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk">
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-10 flex-1">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink {...link} onNavigate={close} className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]" />
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3">
            <WhatsAppLink className="btn btn-whatsapp w-full">WhatsApp us</WhatsAppLink>
            <p className="text-center text-sm font-medium">{site.phoneDisplay}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
