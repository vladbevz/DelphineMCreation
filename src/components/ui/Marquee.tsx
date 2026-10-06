import type { ReactNode } from 'react';
import { cn } from './cn';

/**
 * Endless horizontal text band. The content is rendered twice and shifted by 50%, so the
 * loop is seamless; it stands still when the visitor prefers reduced motion.
 */
export function Marquee({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-hidden whitespace-nowrap', className)} aria-hidden>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="px-4">
                {children}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
