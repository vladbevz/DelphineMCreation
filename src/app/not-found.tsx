import { Blob } from '@/components/brand/Blob';
import { EarringMotif } from '@/components/brand/EarringMotif';
import { FloatingMotifs } from '@/components/brand/FloatingMotifs';
import { SiteShell } from '@/components/layout/SiteShell';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <FloatingMotifs
          className="hidden sm:block"
          motifs={[
            { className: 'top-16 left-[10%] h-16', color: 'text-turquoise', speed: 1.2 },
            { className: 'right-[12%] bottom-20 h-12', color: 'text-mandarine', speed: 0.8 },
          ]}
        />
        <Container className="relative flex flex-col items-center py-16 text-center sm:py-24">
          {/* The lost earring, on a soleil patch. */}
          <div className="relative mb-8 flex size-28 items-center justify-center">
            <Blob className="inset-0 h-full w-full text-soleil" />
            <EarringMotif className="relative h-20 w-auto -rotate-12 text-fuchsia-deep" />
          </div>
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
      </section>
    </SiteShell>
  );
}
