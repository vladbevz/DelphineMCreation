import type { Metadata } from 'next';
import { InstagramIcon } from '@/components/brand/InstagramIcon';
import { ContactForm } from '@/components/forms/ContactForm';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { getSettings } from '@/lib/sanity/data';
import { seo } from '@/lib/seo';

export const metadata: Metadata = {
  title: seo.contact.title,
  description: seo.contact.description,
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        size="medium"
        title={<>Écrivez-moi</>}
        intro={
          <p>
            Une question sur un bijou, une commande ou un sur-mesure ? Écrivez-moi, je vous réponds
            avec plaisir. Vous pouvez aussi me retrouver sur les marchés du Gard et de l’Hérault.
          </p>
        }
      />
      <Container
        size="medium"
        className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <dl className="space-y-6 self-start bg-rose-pale p-6 sm:p-8">
          <div>
            <dt className="label-caps text-gris">E-mail</dt>
            <dd className="mt-2 text-base whitespace-nowrap sm:text-lg">
              {settings?.email ? (
                <a href={`mailto:${settings.email}`} className="hover:text-rose-texte">
                  {settings.email}
                </a>
              ) : (
                '[E-MAIL À FOURNIR]'
              )}
            </dd>
          </div>
          <div>
            <dt className="label-caps text-gris">Instagram</dt>
            <dd className="mt-2 text-lg">
              {settings?.instagram ? (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-rose-texte"
                >
                  <InstagramIcon />
                  @delphinemcreations
                </a>
              ) : (
                '[LIEN À FOURNIR]'
              )}
            </dd>
          </div>
        </dl>
        <ContactForm />
      </Container>
    </>
  );
}
