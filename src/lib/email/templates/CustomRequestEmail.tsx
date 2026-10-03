import { Button, Text } from '@react-email/components';
import { buttonStyle, colors, EmailLayout, heading, label, text } from './EmailLayout';

export type CustomRequestEmailData = {
  name: string;
  email: string;
  phone?: string;
  type?: string;
  colors?: string;
  budget?: string;
  message: string;
  imageCount: number;
};

/** To Delphine: a new sur-mesure request from the form. */
export function CustomRequestEmail({
  request,
  studioUrl,
}: {
  request: CustomRequestEmailData;
  studioUrl: string;
}) {
  const rows: [string, string | undefined][] = [
    ['Type de bijou', request.type],
    ['Couleurs', request.colors],
    ['Budget', request.budget],
    ['Téléphone', request.phone],
  ];
  return (
    <EmailLayout preview={`Demande sur-mesure de ${request.name}`}>
      <Text style={label}>Demande sur-mesure</Text>
      <Text style={heading}>{request.name}</Text>
      <Text style={text}>{request.email}</Text>
      {rows
        .filter(([, value]) => value)
        .map(([key, value]) => (
          <Text key={key} style={text}>
            <strong>{key} :</strong> {value}
          </Text>
        ))}
      <Text style={{ ...text, whiteSpace: 'pre-line' }}>{request.message}</Text>
      {request.imageCount > 0 && (
        <Text style={{ ...text, color: colors.muted }}>
          {request.imageCount} photo(s) jointe(s), visibles dans le Studio.
        </Text>
      )}
      <Button href={studioUrl} style={buttonStyle}>
        Ouvrir la demande
      </Button>
    </EmailLayout>
  );
}
