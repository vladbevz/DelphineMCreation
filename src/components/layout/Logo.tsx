import Link from 'next/link';
import { BrandLogo } from '@/components/brand/BrandLogo';

/** « Delphine M » + « Créations en cuir », from the client's logo (never re-drawn or re-coloured). */
export function Logo() {
  return (
    <Link href="/" className="block" title="Accueil">
      <BrandLogo
        variant="name"
        title="Delphine M, créations en cuir"
        className="h-11 w-auto sm:h-12"
      />
    </Link>
  );
}
