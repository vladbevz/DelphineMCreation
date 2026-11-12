import Link from 'next/link';
import { ColorRule } from '@/components/brand/ColorRule';
import { InstagramIcon } from '@/components/brand/InstagramIcon';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/sanity/data';
import { legalNav, mainNav, site } from '@/lib/site';

// Linen on fuchsia-deep: 5.61:1 (CLAUDE.md §3). Hover = underline only: soleil would be 4:1.
const linkClass =
  'text-[0.7rem] font-medium tracking-[0.12em] uppercase underline-offset-4 hover:underline';

function ColumnTitle({ children }: { children: string }) {
  return <p className="mb-4 display-caps text-lg">{children}</p>;
}

export async function Footer() {
  const settings = await getSettings();
  const instagram = settings?.instagram;

  return (
    <footer className="relative mt-16 overflow-hidden bg-fuchsia-deep text-linen [&_*:focus-visible]:outline-linen">
      {/* Keyboard focus stays visible on pink: linen outline instead of cognac. */}
      {/* The five colours across the top edge, solid segments (no gradient). */}
      <ColorRule className="h-1.5 w-full" />
      <Container className="relative grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <p className="display-caps text-2xl leading-tight">
            Delphine <span className="font-medium">M.</span> Créations
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-linen">
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
                  className={`${linkClass} text-xs tracking-normal normal-case`}
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

      <div className="relative border-t border-linen/20">
        <Container className="flex flex-col gap-1 py-5 text-center text-[0.7rem] text-linen/90 sm:flex-row sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {site.name}, tous droits réservés
          </p>
          <p>Site réalisé par AtelierCode</p>
        </Container>
      </div>
    </footer>
  );
}
