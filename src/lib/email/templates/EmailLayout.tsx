import { Body, Container, Head, Hr, Html, Preview, Section, Text } from '@react-email/components';
import type { CSSProperties, ReactNode } from 'react';

// Brand tokens (CLAUDE.md §3), inlined: e-mail clients ignore external CSS.
export const colors = {
  linen: '#FBF7F1',
  cream: '#F4EDE3',
  sand: '#E3D3BE',
  border: '#D9C8B2',
  cognac: '#9C5A33',
  olive: '#5F6A4B',
  espresso: '#2B1D14',
  muted: '#6B5646',
};

export const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
export const sans = "'Jost', 'Helvetica Neue', Arial, sans-serif";

export const text: CSSProperties = {
  fontFamily: sans,
  fontSize: '15px',
  lineHeight: '24px',
  color: colors.espresso,
  margin: '0 0 12px',
};

export const heading: CSSProperties = {
  fontFamily: serif,
  fontWeight: 500,
  fontSize: '32px',
  lineHeight: '38px',
  color: colors.espresso,
  margin: '0 0 16px',
};

export const label: CSSProperties = {
  fontFamily: sans,
  fontSize: '11px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: colors.muted,
  margin: '0 0 8px',
};

export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: colors.linen, margin: 0, padding: '24px 0' }}>
        <Container style={{ maxWidth: '560px', padding: '0 20px' }}>
          <Section style={{ paddingBottom: '24px' }}>
            <Text
              style={{
                fontFamily: serif,
                fontSize: '26px',
                lineHeight: '28px',
                margin: 0,
                color: colors.espresso,
              }}
            >
              Delphine <em style={{ color: colors.cognac }}>M.</em>
            </Text>
            <Text style={{ ...label, letterSpacing: '0.45em', fontSize: '9px', margin: '4px 0 0' }}>
              Créations
            </Text>
          </Section>
          <Section
            style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px 28px' }}
          >
            {children}
          </Section>
          <Hr style={{ borderColor: colors.border, margin: '24px 0 12px' }} />
          <Text style={{ ...text, fontSize: '12px', lineHeight: '18px', color: colors.muted }}>
            Delphine M. Créations · Bijoux en cuir faits main dans la Vaunage (Gard)
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export const buttonStyle: CSSProperties = {
  backgroundColor: colors.cognac,
  color: '#ffffff',
  borderRadius: '999px',
  padding: '14px 28px',
  fontFamily: sans,
  fontSize: '14px',
};
