'use client';

import { useRouter } from 'next/navigation';

/** Sort dropdown. Each option carries its full URL, built on the server. */
export function SortSelect({
  options,
  current,
}: {
  options: readonly { value: string; label: string; href: string }[];
  current: string;
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-muted">Trier par</span>
      <select
        value={current}
        onChange={(e) => {
          const option = options.find((o) => o.value === e.currentTarget.value);
          if (option) router.push(option.href, { scroll: false });
        }}
        className="border border-sand-border bg-white py-2 pr-8 pl-3 text-sm text-espresso focus:border-espresso focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
