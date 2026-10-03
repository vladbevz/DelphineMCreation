'use client';

/* eslint-disable @next/next/no-img-element -- local blob: previews, not optimizable */
import { useActionState, useEffect, useRef, useState } from 'react';
import { submitCustomRequest, type FormState } from '@/app/actions/forms';
import { Button } from '@/components/ui/Button';
import { FieldShell, Honeypot, SelectField, TextArea, TextField } from '@/components/ui/Field';
import { categories } from '@/lib/catalog';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_REQUEST_IMAGES } from '@/lib/formLimits';
import { compressImage } from './compressImage';
import { FormError, FormSuccess } from './FormStatus';
import { Turnstile } from './Turnstile';

const initial: FormState = { status: 'idle' };
type Photo = { file: File; url: string };

function Form({ onReset }: { onReset: () => void }) {
  const [state, dispatch, pending] = useActionState(submitCustomRequest, initial);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Preview URLs, tracked in event handlers and freed when the form unmounts.
  const previewUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const addFiles = async (list: FileList | null) => {
    if (!list) return;
    setPhotoError(null);
    const incoming = [...list];
    if (photos.length + incoming.length > MAX_REQUEST_IMAGES) {
      setPhotoError(`${MAX_REQUEST_IMAGES} photos maximum.`);
    }
    const accepted = incoming.slice(0, MAX_REQUEST_IMAGES - photos.length).filter((f) => {
      if (!ALLOWED_IMAGE_TYPES.includes(f.type)) {
        setPhotoError('Formats acceptés : JPEG, PNG ou WebP.');
        return false;
      }
      if (f.size > MAX_IMAGE_BYTES) {
        setPhotoError('Chaque photo doit faire moins de 5 Mo.');
        return false;
      }
      return true;
    });
    setProcessing(true);
    const compressed = await Promise.all(accepted.map(compressImage));
    setProcessing(false);
    const added = compressed.map((file) => ({ file, url: URL.createObjectURL(file) }));
    added.forEach((p) => previewUrls.current.add(p.url));
    setPhotos((prev) => [...prev, ...added]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const photo = photos[index];
    if (photo) {
      URL.revokeObjectURL(photo.url);
      previewUrls.current.delete(photo.url);
    }
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit the resized photos kept in state instead of the raw file input.
  const submit = (formData: FormData) => {
    formData.delete('images');
    photos.forEach((p) => formData.append('images', p.file));
    dispatch(formData);
  };

  if (state.status === 'success') {
    return (
      <FormSuccess
        message={state.message}
        action={
          <Button variant="ghost" onClick={onReset}>
            Faire une autre demande
          </Button>
        }
      />
    );
  }

  const v = state.values;
  const e = state.errors;

  return (
    <form action={submit} className="relative space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="Nom"
          autoComplete="name"
          defaultValue={v?.name}
          error={e?.name}
        />
        <TextField
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          defaultValue={v?.email}
          error={e?.email}
        />
        <TextField
          name="phone"
          type="tel"
          label="Téléphone"
          autoComplete="tel"
          optional
          defaultValue={v?.phone}
          error={e?.phone}
        />
        <SelectField
          name="type"
          label="Type de bijou"
          optional
          options={categories}
          defaultValue={v?.type}
          error={e?.type}
        />
        <TextField
          name="colors"
          label="Couleurs souhaitées"
          optional
          defaultValue={v?.colors}
          error={e?.colors}
        />
        <TextField
          name="budget"
          label="Budget"
          optional
          placeholder="ex. 50 à 80 €"
          defaultValue={v?.budget}
          error={e?.budget}
        />
      </div>
      <TextArea
        name="message"
        label="Votre idée"
        hint="L’occasion, la forme, les finitions… Tout ce qui peut m’aider à imaginer votre bijou."
        defaultValue={v?.message}
        error={e?.message}
      />

      <FieldShell
        name="images"
        label="Photos d’inspiration"
        optional
        hint={`Jusqu’à ${MAX_REQUEST_IMAGES} photos (JPEG, PNG ou WebP, 5 Mo maximum chacune).`}
        error={photoError ?? e?.images}
      >
        {(a11y) => (
          <div>
            {photos.length > 0 && (
              <ul className="mb-3 flex gap-3">
                {photos.map((p, i) => (
                  <li key={p.url} className="relative">
                    <img
                      src={p.url}
                      alt={`Photo ${i + 1}`}
                      className="size-20 rounded-xl object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={`Retirer la photo ${i + 1}`}
                      className="absolute -top-2 -right-2 inline-flex size-7 items-center justify-center rounded-full bg-espresso text-linen"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="size-3.5"
                        aria-hidden
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {photos.length < MAX_REQUEST_IMAGES && (
              <input
                ref={inputRef}
                type="file"
                name="images"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                multiple
                onChange={(event) => void addFiles(event.currentTarget.files)}
                className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-sand file:px-5 file:py-2.5 file:text-sm file:text-espresso hover:file:bg-sand-border"
                {...a11y}
              />
            )}
          </div>
        )}
      </FieldShell>

      <Honeypot />
      <Turnstile resetKey={state} />
      <FormError message={state.message} />
      <Button type="submit" disabled={pending || processing}>
        {pending ? 'Envoi…' : processing ? 'Préparation des photos…' : 'Envoyer ma demande'}
      </Button>
      <p className="text-xs text-muted">
        Vos informations et photos servent uniquement à étudier votre demande.
      </p>
    </form>
  );
}

export function CustomRequestForm() {
  const [round, setRound] = useState(0);
  return <Form key={round} onReset={() => setRound((r) => r + 1)} />;
}
