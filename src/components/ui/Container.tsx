import type { ElementType, ReactNode } from 'react';
import { cn } from './cn';

const widths = {
  /** Grids and full layouts. */
  default: 'max-w-7xl',
  /** Product page, forms with a side column. */
  medium: 'max-w-5xl',
  /** Reading pages: legal texts, care guide, confirmation. */
  narrow: 'max-w-3xl',
};

export type ContainerSize = keyof typeof widths;

export function Container({
  as: Tag = 'div',
  size = 'default',
  className,
  children,
}: {
  as?: ElementType;
  size?: ContainerSize;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', widths[size], className)}>
      {children}
    </Tag>
  );
}
