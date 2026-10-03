'use client';

import { openConsentSettings } from './consentStore';

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      Gérer les cookies
    </button>
  );
}
