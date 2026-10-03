import Link from 'next/link';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Container } from '@/components/ui/Container';
import { getSettings } from '@/lib/sanity/data';
import { legalNav, mainNav, site } from '@/lib/site';

export async function Footer() {
  const settings = await getSettings();
  const instagram = settings?.instagram;

  return (
    <footer className="mt-24 bg-espresso text-linen">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <EarringMotif className="mb-6 h-14 w-auto text-sand" />
          <p className="font-display text-3xl">
            Bijoux en <em className="text-sand">cuir</em>, faits main
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-sand">
            Pièces uniques créées dans la Vaunage, Gard.
          </p>
        </div>

        <nav aria-label="Pied de page">
          <p className="mb-5 label-caps text-sand">Explorer</p>
          <ul className="space-y-3 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-5 label-caps text-sand">Informations</p>
          <ul className="space-y-3 text-sm">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-sand hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton className="text-left hover:text-sand hover:underline" />
            </li>
            <li>
              {instagram ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sand hover:underline"
                >
                  Instagram
                </a>
              ) : (
                <span>Instagram [LIEN À FOURNIR]</span>
              )}
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-white/15 py-6 text-xs text-sand sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>
          Site réalisé par <span className="text-linen">AtelierCode</span>
        </p>
      </Container>
    </footer>
  );
}
