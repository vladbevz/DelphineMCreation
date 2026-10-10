import Link from 'next/link';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/sanity/data';
import { legalNav, mainNav, site } from '@/lib/site';

const linkClass =
  'text-[0.7rem] font-medium tracking-[0.12em] uppercase underline-offset-4 hover:underline';

export async function Footer() {
  const settings = await getSettings();
  const instagram = settings?.instagram;

  return (
    <footer className="mt-16 bg-espresso text-linen">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <p className="font-display text-3xl leading-none font-light">
            <em>Delphine M.</em> Créations
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-linen/75">
            Bijoux en cuir faits main, pièces uniques créées dans la Vaunage, Gard.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <p className="mb-4 display-caps text-lg">Découvrez</p>
          <ul className="space-y-2.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 display-caps text-lg">Informations</p>
          <ul className="space-y-2.5">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className={`${linkClass} text-left`} />
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 display-caps text-lg">Contact</p>
          <ul className="space-y-2.5">
            <li>
              {settings?.email ? (
                <a href={`mailto:${settings.email}`} className={linkClass}>
                  {settings.email}
                </a>
              ) : (
                <span className={linkClass}>[E-MAIL À FOURNIR]</span>
              )}
            </li>
            <li>
              {instagram ? (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                </a>
              ) : (
                <span className={linkClass}>Instagram [LIEN À FOURNIR]</span>
              )}
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                Écrire un message
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-linen/15">
        <Container className="flex flex-col gap-1 py-5 text-center text-[0.7rem] text-linen/75 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}, tous droits réservés
          </p>
          <p>Site réalisé par AtelierCode</p>
        </Container>
      </div>
    </footer>
  );
}
