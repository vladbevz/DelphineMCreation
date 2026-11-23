import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'inverse';

// Pill buttons, sentence case. Size and shape live in the variants so the ghost link does not
// fight them (no tailwind-merge here).
const pill = 'min-h-12 rounded-full px-7';
const base =
  'inline-flex items-center justify-center gap-2 text-[0.9375rem] font-semibold transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  /** rose-texte: white text 5.8:1 (the charte pink #ED0A90 is 4.2, too low for button text). */
  primary: `${pill} border border-rose-texte bg-rose-texte text-blanc hover:border-rose-hover hover:bg-rose-hover`,
  secondary: `${pill} border border-rose-texte text-rose-texte hover:bg-rose-texte hover:text-blanc`,
  /** On dark photos or dark sections. */
  light: `${pill} border border-blanc text-blanc hover:bg-blanc hover:text-graphite`,
  /** On the flash-pink hero: white pill, rose-texte text (5.8:1). */
  inverse: `${pill} border border-blanc bg-blanc text-rose-texte hover:bg-graphite hover:border-graphite hover:text-blanc`,
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
