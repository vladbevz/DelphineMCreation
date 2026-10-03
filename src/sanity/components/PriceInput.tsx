'use client';

import { TextInput } from '@sanity/ui';
import { useCallback, useState, type ChangeEvent } from 'react';
import { set, unset, type NumberInputProps } from 'sanity';

const toEuros = (cents: number | undefined) =>
  cents === undefined ? '' : (cents / 100).toFixed(2).replace('.', ',');

/**
 * Prices are stored as integer cents, but Delphine types euros ("45" or "45,50").
 */
export function PriceInput({ value, onChange, readOnly, elementProps }: NumberInputProps) {
  const [draft, setDraft] = useState(() => toEuros(value));
  const [lastValue, setLastValue] = useState(value);

  // Sync when the value changes from outside (another editor, a server write).
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(toEuros(value));
  }

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const raw = event.currentTarget.value;
      setDraft(raw);
      const normalized = raw.replace(/\s|€/g, '').replace(',', '.');
      if (normalized === '') {
        onChange(unset());
        return;
      }
      const euros = Number(normalized);
      if (Number.isFinite(euros)) {
        const cents = Math.round(euros * 100);
        setLastValue(cents);
        onChange(set(cents));
      }
    },
    [onChange],
  );

  return (
    <TextInput
      {...elementProps}
      inputMode="decimal"
      value={draft}
      onChange={handleChange}
      readOnly={readOnly}
      suffix={
        <span style={{ padding: '0 12px', alignSelf: 'center', opacity: 0.6 }} aria-hidden>
          €
        </span>
      }
    />
  );
}
