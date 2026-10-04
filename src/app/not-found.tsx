import { EarringMotif } from '@/components/brand/EarringMotif';
import { SiteShell } from '@/components/layout/SiteShell';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function NotFound() {
  return (
    <SiteShell>
      <Container className="flex flex-col items-center py-16 text-center sm:py-24">
        <EarringMotif className="mb-8 h-20 w-auto text-cognac" />
        <SectionHeading
          as="h1"
          align="center"
          label="Erreur 404"
          title={
            <>
              Cette page s&apos;est <em>égarée</em>
            </>
          }
          intro={<p>La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>}
        />
        <ButtonLink href="/boutique" className="mt-10">
          Retour à la boutique
        </ButtonLink>
      </Container>
    </SiteShell>
  );
}
