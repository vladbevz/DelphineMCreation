import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-start leading-none" title="Accueil">
      <span className="font-display text-[1.4rem] font-medium sm:text-2xl">
        Delphine <em className="text-cognac">M.</em>
      </span>
      <span className="mt-1 text-[0.6rem] font-medium tracking-[0.45em] text-muted uppercase">
        Créations
      </span>
    </Link>
  );
}
