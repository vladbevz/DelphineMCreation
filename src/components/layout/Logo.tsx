import Link from 'next/link';

/** Text logo (Cormorant capitals, kept as is until Delphine provides her SVG). */
export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none" title="Accueil">
      <span className="logo-caps text-[1.35rem] leading-none sm:text-[1.6rem]">
        Delphine <span className="font-medium">M.</span>
      </span>
      <span className="mt-1 text-[0.55rem] font-medium tracking-[0.5em] text-espresso/80 uppercase">
        Créations
      </span>
    </Link>
  );
}
