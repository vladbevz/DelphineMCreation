import type { BlockContent } from '@/sanity/types';
import { Container } from './Container';
import { PageHeader } from './PageHeader';
import { RichText } from './RichText';

/** Text page from a Sanity `page` document (legal pages, care guide). */
export function ContentPage({
  label,
  title,
  body,
}: {
  label?: string;
  title: string;
  body: BlockContent | null;
}) {
  return (
    <>
      <PageHeader size="narrow" label={label} title={title} />
      <Container size="narrow">
        {body?.length ? (
          <RichText value={body} className="[&_p]:text-espresso/90" />
        ) : (
          <p className="text-muted">[TEXTE À FOURNIR]</p>
        )}
      </Container>
    </>
  );
}
