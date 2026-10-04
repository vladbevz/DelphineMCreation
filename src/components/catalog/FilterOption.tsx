import Link from 'next/link';
import { cn } from '@/components/ui/cn';

/** Filter row styled as a checkbox. It is a link: filters work without JavaScript. */
export function FilterOption({
  href,
  active,
  count,
  children,
}: {
  href: string;
  active: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? 'true' : undefined}
      className="group flex min-h-9 items-center gap-3 text-sm text-espresso/80 hover:text-espresso aria-[current=true]:text-espresso"
    >
      <span
        aria-hidden
        className={cn(
          'flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
          active
            ? 'border-cognac bg-cognac text-white'
            : 'border-sand-border bg-white group-hover:border-espresso',
        )}
      >
        {active && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-3"
          >
            <path d="m3.5 8.5 3 3 6-7" />
          </svg>
        )}
      </span>
      <span className="flex-1">{children}</span>
      {count !== undefined && <span className="text-xs text-muted">{count}</span>}
    </Link>
  );
}
