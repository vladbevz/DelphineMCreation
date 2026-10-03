import type { ReactNode } from 'react';

/** Native <details> accordion: accessible and works without JavaScript. */
export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group border-b border-sand-border" open={defaultOpen}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
          aria-hidden
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <div className="pb-6 text-muted">{children}</div>
    </details>
  );
}
