import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeadingProps = {
  label?: string;
  /** Use <em> inside the title for italic accent words. */
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
          '[&_em]:text-cognac [&_em]:italic',
          Tag === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl',
        )}
      >
        {title}
      </Tag>
      {intro && <div className="mt-4 text-base leading-relaxed text-muted">{intro}</div>}
    </div>
  );
}
