import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';

// Thin pill buttons with small spaced capitals. Size and shape live in the variants so the
// ghost link does not fight them (no tailwind-merge here).
const pill = 'min-h-11 rounded-full px-7';
const base =
  'inline-flex items-center justify-center gap-2 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<Variant, string> = {
  /** fuchsia-deep: the pink that passes 4.5:1 with linen text. */
  primary: `${pill} border border-fuchsia-deep bg-fuchsia-deep text-linen hover:bg-transparent hover:text-fuchsia-deep`,
  secondary: `${pill} border border-espresso text-espresso hover:bg-espresso hover:text-linen`,
  /** On dark photos or dark sections. */
  light: `${pill} border border-linen text-linen hover:bg-linen hover:text-espresso`,
  ghost:
    'pb-1 text-espresso underline decoration-espresso/40 underline-offset-[6px] hover:decoration-espresso',
};

type ButtonProps = ComponentProps<'button'> & { variant?: Variant };

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant };

export function ButtonLink({ variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
