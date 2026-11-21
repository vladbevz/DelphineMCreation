import Link from 'next/link';
import { InstagramIcon } from '@/components/brand/InstagramIcon';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/sanity/data';
import { legalNav, mainNav, site } from '@/lib/site';

// White on the charte dark grey: 15:1. Hover = underline.
const linkClass =
  'text-[0.7rem] font-medium tracking-label uppercase underline-offset-4 hover:underline';

function ColumnTitle({ children }: { children: string }) {
  return <p className="mb-4 display-caps text-sm">{children}</p>;
}

export async function Footer() {
  const settings = await getSettings();
  const instagram = settings?.instagram;

  return (
    <footer className="relative mt-16 overflow-hidden bg-graphite text-blanc [&_*:focus-visible]:outline-blanc">
      {/* Keyboard focus stays visible on dark grey: white outline instead of pink. */}
      <Container className="relative grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <BrandLogo
            variant="full"
            mono
            title="Delphine M, créations en cuir"
            className="h-36 w-auto text-blanc"
          />
          <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-blanc">
            Bijoux en cuir colorés et ultra légers, faits main à Clarensac, dans la Vaunage.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <ColumnTitle>Découvrez</ColumnTitle>
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
          <ColumnTitle>Informations</ColumnTitle>
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
          <ColumnTitle>Contact</ColumnTitle>
          <ul className="space-y-2.5">
            <li>
              {settings?.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm underline-offset-4 hover:underline"
                >
                  {settings.email}
                </a>
              ) : (
                <span className={linkClass}>[E-MAIL À FOURNIR]</span>
              )}
            </li>
            <li>
              {instagram ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${linkClass} inline-flex items-center gap-2`}
                >
                  <InstagramIcon className="size-4" />
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

      <div className="relative border-t border-blanc/20">
        <Container className="flex flex-col gap-1 py-5 text-center text-[0.7rem] text-blanc/90 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}, tous droits réservés
          </p>
          <p>Site réalisé par AtelierCode</p>
        </Container>
      </div>
    </footer>
  );
}
