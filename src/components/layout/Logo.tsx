import Link from 'next/link';

/** Handwritten name + spaced capitals, centred in the header. */
export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none" title="Accueil">
      <span className="font-script text-[2rem] leading-[0.9] sm:text-[2.4rem]">Delphine M.</span>
      <span className="mt-0.5 text-[0.55rem] font-medium tracking-[0.5em] text-espresso/80 uppercase">
        Créations
      </span>
    </Link>
  );
}
