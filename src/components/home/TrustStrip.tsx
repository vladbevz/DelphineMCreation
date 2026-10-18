import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { formatPrice } from '@/lib/format';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'size-6 shrink-0',
  'aria-hidden': true,
};

const icons: Record<string, ReactNode> = {
  hand: (
    <svg {...iconProps}>
      <path d="M8 13V6.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M11 11V5a1.5 1.5 0 0 1 3 0v6" />
      <path d="M14 11.5V7a1.5 1.5 0 0 1 3 0v6.5c0 4-2.5 7-6.5 7S5 18 4.2 15.6L3 12.3a1.4 1.4 0 0 1 2.5-1.2L8 14" />
    </svg>
  ),
  lock: (
    <svg {...iconProps}>
      <rect x="5" y="10.5" width="14" height="10" rx="1.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2.5" />
    </svg>
  ),
  returns: (
    <svg {...iconProps}>
      <path d="M4 9h11a5 5 0 0 1 0 10H8" />
      <path d="m8 5-4 4 4 4" />
    </svg>
  ),
  truck: (
    <svg {...iconProps}>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.5" />
      <circle cx="17" cy="17.5" r="1.5" />
    </svg>
  ),
};

/** Reassurance band under the hero (as on the reference shops). Text is espresso on soleil. */
export function TrustStrip({ freeShippingThreshold }: { freeShippingThreshold: number | null }) {
  const items = [
    { icon: 'hand', label: 'Fait main à Clarensac' },
    { icon: 'lock', label: 'Paiement sécurisé' },
    { icon: 'returns', label: 'Retours sous 14 jours' },
    ...(typeof freeShippingThreshold === 'number'
      ? [{ icon: 'truck', label: `Livraison offerte dès ${formatPrice(freeShippingThreshold)}` }]
      : []),
  ];

  return (
    <section aria-label="Nos engagements" className="bg-soleil text-espresso">
      <Container>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3 py-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-10">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2.5 text-[0.65rem] font-medium tracking-[0.12em] uppercase sm:text-[0.7rem]"
            >
              {icons[item.icon]}
              {item.label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
