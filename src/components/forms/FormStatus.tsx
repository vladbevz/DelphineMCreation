import type { ReactNode } from 'react';
import { EarringMotif } from '@/components/brand/EarringMotif';

export function FormSuccess({ message, action }: { message?: string; action?: ReactNode }) {
  return (
    <div role="status" className="bg-cream px-6 py-12 text-center">
      <EarringMotif className="mx-auto h-16 w-auto text-cognac" />
      <p className="mt-6 font-display text-3xl">Message envoyé</p>
      {message && <p className="mx-auto mt-3 max-w-md text-muted">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-cream p-4 text-sm">
      {message}
    </p>
  );
}
