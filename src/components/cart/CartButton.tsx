// Placeholder until CartProvider / CartDrawer arrive in stage 3.
export function CartButton({ count = 0 }: { count?: number }) {
  return (
    <button
      type="button"
      className="relative inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-cream"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        aria-hidden
      >
        <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </svg>
      {/* Accessible name reads "Panier, N article(s)" and contains the visible count. */}
      <span className="sr-only">Panier, </span>
      <span className="absolute top-1 right-0.5 flex min-w-5 items-center justify-center rounded-full bg-cognac px-1 text-[0.65rem] leading-5 font-medium text-white">
        {count}
      </span>
      <span className="sr-only"> article{count > 1 ? 's' : ''}</span>
    </button>
  );
}
