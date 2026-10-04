import type { ComponentProps, ReactNode } from 'react';
import { cn } from './cn';

const control =
  'w-full rounded-xl border border-sand-border bg-white px-4 py-2.5 text-base text-espresso transition-colors placeholder:text-muted/70 focus:border-espresso focus:outline-none aria-[invalid=true]:border-cognac';

type FieldShellProps = {
  name: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  children: (props: {
    id: string;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
  }) => ReactNode;
};

/** Label + control + hint/error, wired for screen readers. */
export function FieldShell({ name, label, error, hint, optional, children }: FieldShellProps) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ');
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (facultatif)</span>}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy || undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-cognac">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { name: string; label: string; error?: string; hint?: ReactNode; optional?: boolean };

export function TextField({
  name,
  label,
  error,
  hint,
  optional,
  className,
  ...props
}: Common & ComponentProps<'input'>) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={optional}>
      {(a11y) => (
        <input
          name={name}
          required={!optional}
          className={cn(control, className)}
          {...a11y}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function TextArea({
  name,
  label,
  error,
  hint,
  optional,
  className,
  ...props
}: Common & ComponentProps<'textarea'>) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={optional}>
      {(a11y) => (
        <textarea
          name={name}
          required={!optional}
          rows={5}
          className={cn(control, 'resize-y', className)}
          {...a11y}
          {...props}
        />
      )}
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  error,
  hint,
  optional,
  options,
  className,
  ...props
}: Common & ComponentProps<'select'> & { options: readonly { value: string; title: string }[] }) {
  return (
    <FieldShell name={name} label={label} error={error} hint={hint} optional={optional}>
      {(a11y) => (
        <select
          name={name}
          required={!optional}
          className={cn(control, 'appearance-none', className)}
          {...a11y}
          {...props}
        >
          <option value="">Choisir…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.title}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

/** Off-screen field that only bots fill in. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Ne pas remplir
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
