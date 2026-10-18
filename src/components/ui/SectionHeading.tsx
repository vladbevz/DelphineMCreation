import type { ReactNode } from 'react';
import { MaskReveal } from '@/components/motion/MaskReveal';
import { cn } from './cn';

type SectionHeadingProps = {
  label?: string;
  /**
   * Rendered in thin capitals. An <em> inside becomes the accent word (same capitals, heavier weight),
   * e.g. <>Les dernières <em>créations</em></>.
   */
  title: ReactNode;
  intro?: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  label,
  title,
  intro,
  as: Tag = 'h2',
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {label && <p className="mb-3 label-caps text-muted">{label}</p>}
      <Tag
        className={cn(
          'display-caps leading-[1.15] [&_em]:heading-accent',
          Tag === 'h1' ? 'text-3xl sm:text-[2.6rem]' : 'text-2xl sm:text-[2rem]',
        )}
      >
        {/* h1 can be the LCP element: it renders as-is; section titles slide up from a mask. */}
        {Tag === 'h1' ? title : <MaskReveal>{title}</MaskReveal>}
      </Tag>
      {intro && <div className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{intro}</div>}
    </div>
  );
}
