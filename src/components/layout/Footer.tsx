import Link from 'next/link';
import { ColorRule } from '@/components/brand/ColorRule';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/sanity/data';
import { legalNav, mainNav, site } from '@/lib/site';

// Soleil on espresso: 10.05:1 (CLAUDE.md §3).
const linkClass =
  'text-[0.7rem] font-medium tracking-[0.12em] uppercase underline-offset-4 transition-colors hover:text-soleil hover:underline';

/** Column title with a small colour mark, like the category colours on the site. */
function ColumnTitle({ children, color }: { children: string; color: string }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 display-caps text-lg">
      <span aria-hidden className={`size-2 rounded-full ${color}`} />
      {children}
    </p>
  );
}

export async function Footer() {
  const settings = await getSettings();
  const instagram = settings?.instagram;

  return (
    <footer className="relative mt-16 overflow-hidden bg-espresso text-linen">
      {/* The five colours across the top edge, solid segments (no gradient). */}
      <ColorRule className="h-1.5 w-full" />
      <EarringMotif className="pointer-events-none absolute -right-12 -bottom-24 h-72 w-auto -rotate-12 text-fuchsia/25" />
      <Container className="relative grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <p className="display-caps text-2xl leading-tight">
            Delphine <span className="font-medium">M.</span> Créations
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-linen/75">
            Bijoux en cuir colorés et ultra légers, faits main à Clarensac, dans la Vaunage.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <ColumnTitle color="bg-fuchsia">Découvrez</ColumnTitle>
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
          <ColumnTitle color="bg-turquoise">Informations</ColumnTitle>
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
          <ColumnTitle color="bg-soleil">Contact</ColumnTitle>
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

      <div className="relative border-t border-linen/15">
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
