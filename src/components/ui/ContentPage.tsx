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
      <PageHeader label={label} title={title} />
      <Container>
        <div className="max-w-2xl">
          {body?.length ? (
            <RichText value={body} className="text-lg [&_p]:text-espresso/90" />
          ) : (
            <p className="text-muted">[TEXTE À FOURNIR]</p>
          )}
        </div>
      </Container>
    </>
  );
}
