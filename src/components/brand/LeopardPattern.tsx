import { useId } from 'react';
import { cn } from '@/components/ui/cn';

/**
 * Hand-drawn leopard rosettes as an inline SVG pattern (no raster file). Colour comes from
 * currentColor; keep it subtle (low opacity) and use it on one or two places only.
 */
export function LeopardPattern({ className, scale = 1 }: { className?: string; scale?: number }) {
  const id = useId().replace(/:/g, '');
  const size = 72 * scale;
  return (
    <svg
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g fill="currentColor" transform={`scale(${scale})`}>
            {/* Rosettes: broken rings around a lighter centre. */}
            <path d="M10 8c4-3 10-2 12 2-3-1-7-1-9 1-2 1-3 4-2 7-4-2-5-7-1-10Z" />
            <path d="M22 14c2 3 1 7-2 9 0-3-1-5-3-6 2 0 4-1 5-3Z" />
            <path d="M44 6c5-2 10 1 11 5-3-2-7-2-10 0-1-2-1-3-1-5Z" />
            <path d="M57 14c1 4-1 8-5 9 2-2 3-5 2-8l3-1Z" />
            <path d="M42 15c0 3 2 6 5 7-4 1-8-2-8-6l3-1Z" />
            <path d="M14 40c4-4 11-3 13 2-3-1-6-1-9 1-1 1-2 3-2 5-3-2-4-5-2-8Z" />
            <path d="M28 46c1 4-2 7-6 8 2-2 3-4 3-7l3-1Z" />
            <path d="M48 38c4-1 9 2 9 6-3-1-6-1-8 1-1-2-2-4-1-7Z" />
            <path d="M60 47c0 4-3 7-7 7 2-2 3-4 3-6l4-1Z" />
            <path d="M46 49c1 3 3 5 6 6-4 1-8-1-9-5l3-1Z" />
            <path d="M30 26c2-2 5-2 7 0-2 0-4 1-5 3l-2-3Z" />
            <path d="M64 28c2-1 4 0 5 2-2 0-3 1-4 2l-1-4Z" />
            <path d="M4 26c2-1 4 0 5 2-2 0-3 1-4 2l-1-4Z" />
            <path d="M34 62c2-2 5-1 6 1-2 0-4 1-5 2l-1-3Z" />
            <path d="M6 60c2-1 4 0 5 2-2 0-3 1-4 2l-1-4Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
