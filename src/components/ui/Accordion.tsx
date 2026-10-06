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
    <details className="group border-b border-espresso/30" open={defaultOpen}>
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[0.7rem] font-medium tracking-[0.15em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0 transition-transform duration-300 group-open:rotate-90"
          aria-hidden
        >
          <path d="m9 6 6 6-6 6" />
        </svg>
      </summary>
      <div className="pb-5 text-sm text-muted">{children}</div>
    </details>
  );
}
