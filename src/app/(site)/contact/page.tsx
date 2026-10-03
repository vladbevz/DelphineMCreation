import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { getSettings } from '@/lib/sanity/data';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Une question sur un bijou, une commande ou une création sur-mesure ? Écrivez-moi.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        label="Contact"
        title={
          <>
            Écrivez-<em>moi</em>
          </>
        }
        intro={<p>[TEXTE À FOURNIR]</p>}
      />
      <Container className="grid gap-12 lg:grid-cols-[1fr_2fr]">
        <dl className="space-y-6">
          <div>
            <dt className="label-caps text-muted">E-mail</dt>
            <dd className="mt-2 text-lg">
              {settings?.email ? (
                <a href={`mailto:${settings.email}`} className="hover:text-cognac">
                  {settings.email}
                </a>
              ) : (
                '[E-MAIL À FOURNIR]'
              )}
            </dd>
          </div>
          <div>
            <dt className="label-caps text-muted">Instagram</dt>
            <dd className="mt-2 text-lg">
              {settings?.instagram ? (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cognac"
                >
                  Suivre l’atelier
                </a>
              ) : (
                '[LIEN À FOURNIR]'
              )}
            </dd>
          </div>
        </dl>
        {/* Stage 5: contact form (Server Action + Zod + Turnstile). */}
        <p className="rounded-3xl border border-dashed border-sand-border p-8 text-muted">
          Le formulaire de contact arrive très bientôt.
        </p>
      </Container>
    </>
  );
}
