import { Text } from '@react-email/components';
import { EmailLayout, heading, label, text } from './EmailLayout';

/** To Delphine: a message from the contact form. Reply-To is the sender. */
export function ContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return (
    <EmailLayout preview={`Message de ${name}`}>
      <Text style={label}>Message du site</Text>
      <Text style={heading}>{name}</Text>
      <Text style={text}>{email}</Text>
      <Text style={{ ...text, whiteSpace: 'pre-line' }}>{message}</Text>
    </EmailLayout>
  );
}
