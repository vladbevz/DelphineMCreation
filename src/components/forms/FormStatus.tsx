import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand/BrandLogo';

export function FormSuccess({ message, action }: { message?: string; action?: ReactNode }) {
  return (
    <div role="status" className="bg-rose-pale px-6 py-12 text-center">
      <BrandLogo variant="mark" className="mx-auto h-16 w-auto" />
      <p className="mt-6 heading text-3xl">Message envoyé</p>
      {message && <p className="mx-auto mt-3 max-w-md text-gris">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-rose-pale p-4 text-sm">
      {message}
    </p>
  );
}
