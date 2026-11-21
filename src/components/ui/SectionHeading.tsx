import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeadingProps = {
  label?: string;
  /**
   * Quicksand semibold, normal case. No accent word: an <em> reads as the rest of the title.
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
      {label && <p className="mb-3 label-caps text-gris">{label}</p>}
      <Tag
        className={cn(
          '[&_em]:word-accent',
          Tag === 'h1' ? 'text-3xl sm:text-[2.6rem]' : 'text-2xl sm:text-[2.1rem]',
        )}
      >
        {title}
      </Tag>
      {intro && (
        <div className="mt-4 measure leading-relaxed text-gris sm:text-[1.0625rem]">{intro}</div>
      )}
    </div>
  );
}
