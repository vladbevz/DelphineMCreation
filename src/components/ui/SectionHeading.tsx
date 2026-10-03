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
      {label && <p className="mb-4 label-caps text-muted">{label}</p>}
      <Tag
        className={cn(
          '[&_em]:text-cognac [&_em]:italic',
          Tag === 'h1' ? 'text-5xl sm:text-6xl lg:text-7xl' : 'text-4xl sm:text-5xl',
        )}
      >
        {title}
      </Tag>
      {intro && <div className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{intro}</div>}
    </div>
  );
}
