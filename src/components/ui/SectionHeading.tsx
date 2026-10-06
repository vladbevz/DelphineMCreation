import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeadingProps = {
  label?: string;
  /**
   * Rendered in thin capitals. An <em> inside becomes the handwritten accent word,
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
          'display-caps leading-[1.15] [&_em]:px-1 [&_em]:script-accent',
          Tag === 'h1' ? 'text-3xl sm:text-[2.6rem]' : 'text-2xl sm:text-[2rem]',
        )}
      >
        {title}
      </Tag>
      {intro && <div className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{intro}</div>}
    </div>
  );
}
