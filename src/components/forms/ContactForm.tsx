'use client';

import { useActionState, useState } from 'react';
import { submitContact, type FormState } from '@/app/actions/forms';
import { Button } from '@/components/ui/Button';
import { Honeypot, TextArea, TextField } from '@/components/ui/Field';
import { FormError, FormSuccess } from './FormStatus';
import { Turnstile } from './Turnstile';

const initial: FormState = { status: 'idle' };

function Form({ onReset }: { onReset: () => void }) {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.status === 'success') {
    return (
      <FormSuccess
        message={state.message}
        action={
          <Button variant="ghost" onClick={onReset}>
            Envoyer un autre message
          </Button>
        }
      />
    );
  }

  return (
    <form action={action} className="relative space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="Nom"
          autoComplete="name"
          defaultValue={state.values?.name}
          error={state.errors?.name}
        />
        <TextField
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={state.errors?.email}
        />
      </div>
      <TextArea
        name="message"
        label="Message"
        defaultValue={state.values?.message}
        error={state.errors?.message}
      />
      <Honeypot />
      <Turnstile resetKey={state} />
      <FormError message={state.message} />
      <Button type="submit" disabled={pending}>
        {pending ? 'Envoi…' : 'Envoyer'}
      </Button>
      <p className="text-xs text-muted">Vos informations servent uniquement à vous répondre.</p>
    </form>
  );
}

export function ContactForm() {
  // Remounting the form gives a clean slate after a successful send.
  const [round, setRound] = useState(0);
  return <Form key={round} onReset={() => setRound((r) => r + 1)} />;
}
