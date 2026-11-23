'use client';

import { motion, useScroll } from 'motion/react';
import { useRef } from 'react';

/** A bookmark ribbon that unrolls down the margin as you read. */
export function StoryRibbon() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 30%', 'end end'] });
  return (
    <div ref={ref} aria-hidden className="tp-ribbon">
      <div className="tp-ribbon__track">
        <motion.span className="tp-ribbon__band" style={{ scaleY: scrollYProgress }} />
      </div>
    </div>
  );
}
