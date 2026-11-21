import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';

// Thin pill buttons with small spaced capitals. Size and shape live in the variants so the
// ghost link does not fight them (no tailwind-merge here).
const pill = 'min-h-11 rounded-full px-7';
const base =
  'inline-flex items-center justify-center gap-2 text-[0.7rem] font-medium tracking-label uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  /** Bordeaux, as the seal: ivoire text 12:1. */
  primary: `${pill} border border-rose-texte bg-rose-texte text-blanc hover:border-rose-hover hover:bg-rose-hover`,
  secondary: `${pill} border border-rose-texte text-rose-texte hover:bg-rose-texte hover:text-blanc`,
  /** On dark photos or dark sections. */
  light: `${pill} border border-blanc text-blanc hover:bg-blanc hover:text-graphite`,
  ghost:
    'pb-1 text-rose-texte underline decoration-rose-texte/40 underline-offset-[6px] hover:decoration-rose-texte',
};

type ButtonProps = ComponentProps<'button'> & { variant?: Variant };

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
