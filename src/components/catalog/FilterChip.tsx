import Link from 'next/link';
import { cn } from '@/components/ui/cn';

export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'inline-flex min-h-10 shrink-0 items-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors',
        active
          ? 'border-espresso bg-espresso text-linen'
          : 'border-sand-border text-espresso hover:border-espresso',
      )}
    >
      {children}
    </Link>
  );
}
