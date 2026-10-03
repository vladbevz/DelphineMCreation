type EarringMotifProps = {
  className?: string;
  title?: string;
};

/** Teardrop earring outline with a dashed "stitch" inside. Inherits color via currentColor. */
export function EarringMotif({ className, title }: EarringMotifProps) {
  return (
    <svg
      viewBox="0 0 100 150"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <circle cx="50" cy="10" r="6" strokeWidth="1.5" />
      <path d="M50 18C50 18 88 72 88 104A38 38 0 0 1 12 104C12 72 50 18 50 18Z" strokeWidth="1.5" />
      <path
        d="M50 33C50 33 77 78 77 104A27 27 0 0 1 23 104C23 78 50 33 50 33Z"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
    </svg>
  );
}
