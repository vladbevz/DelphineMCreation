'use client';

import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/components/ui/cn';

/**
 * Hero photo. It is the LCP element, so it renders immediately and untouched; the slow Ken Burns
 * zoom and the light parallax only start once the image has been painted.
 */
export function HeroMedia({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduced ? 0 : 120]);

  return (
    <m.div className="absolute inset-x-0 -top-[120px] bottom-0" style={loaded ? { y } : undefined}>
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={cn('object-cover', loaded && 'animate-ken-burns')}
      />
    </m.div>
  );
}
