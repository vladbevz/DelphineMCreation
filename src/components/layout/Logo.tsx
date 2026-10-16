import Link from 'next/link';

/** Name in display capitals + spaced small capitals, centred in the header. */
export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none" title="Accueil">
      <span className="display-caps text-[1.35rem] leading-none sm:text-[1.6rem]">
        Delphine <span className="font-medium">M.</span>
      </span>
      <span className="mt-1 text-[0.55rem] font-medium tracking-[0.5em] text-espresso/80 uppercase">
        Créations
      </span>
    </Link>
  );
}
