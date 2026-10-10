import Link from 'next/link';

/** Italic name + spaced capitals, centred in the header. */
export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none" title="Accueil">
      <span className="font-display text-[1.55rem] leading-none italic sm:text-[1.8rem]">
        Delphine M.
      </span>
      <span className="mt-1 text-[0.55rem] font-medium tracking-[0.5em] text-espresso/80 uppercase">
        Créations
      </span>
    </Link>
  );
}
