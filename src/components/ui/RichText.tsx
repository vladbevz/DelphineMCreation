import { PortableText, type PortableTextComponents } from '@portabletext/react';
import Link from 'next/link';
import type { BlockContent } from '@/sanity/types';
import { cn } from './cn';

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 text-2xl sm:text-3xl">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-2xl">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-5">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#';
      const className = 'text-cognac underline underline-offset-4 hover:text-cognac-hover';
      if (href.startsWith('/')) {
        return (
          <Link href={href} className={className}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} className={className} rel="noopener noreferrer" target="_blank">
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value, className }: { value: BlockContent | null; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={cn('space-y-4 leading-relaxed [&_strong]:font-medium', className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
