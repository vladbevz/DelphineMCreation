import type { ReactNode } from 'react';
import { cn } from './cn';

type SectionHeadingProps = {
  label?: string;
  /**
   * Instrument Serif, normal case. No accent word: an <em> reads as the rest of the title.
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
          Tag === 'h1' ? 'text-[2.8rem] sm:text-6xl' : 'text-[2.3rem] sm:text-5xl',
        )}
      >
        {title}
      </Tag>
      {intro && (
        <div
          className={cn(
            'mt-4 measure leading-relaxed text-gris sm:text-[1.0625rem]',
            align === 'center' && 'mx-auto',
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );
}
