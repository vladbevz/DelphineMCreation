// Cookie consent, stored in the visitor's browser only. Re-asked after 6 months (CNIL).

const KEY = 'dmc-consent';
const CHANGE_EVENT = 'dmc-consent-change';
export const OPEN_SETTINGS_EVENT = 'dmc-consent-open';
const MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

export type Consent = { v: 1; analytics: boolean; marketing: boolean; at: string };

/** `undefined` = not read yet (server render), `null` = no valid choice yet. */
export type ConsentSnapshot = Consent | null | undefined;

let cache: { raw: string | null; value: Consent | null } | null = null;
/** Fallback for this page view when localStorage is unavailable (private mode). */
let memory: Consent | null = null;

function read(): Consent | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return memory;
  }
  if (raw === null) return memory;
  if (cache && cache.raw === raw) return cache.value;
  let value: Consent | null = null;
  try {
    const parsed = raw ? (JSON.parse(raw) as Consent) : null;
    if (parsed?.v === 1 && Date.now() - new Date(parsed.at).getTime() < MAX_AGE_MS) value = parsed;
  } catch {
    value = null;
  }
  cache = { raw, value };
  return value;
}

export const consentStore = {
  subscribe(listener: () => void) {
    window.addEventListener(CHANGE_EVENT, listener);
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener(CHANGE_EVENT, listener);
      window.removeEventListener('storage', listener);
    };
  },
  getSnapshot: (): ConsentSnapshot => read(),
  getServerSnapshot: (): ConsentSnapshot => undefined,
  save(choice: { analytics: boolean; marketing: boolean }) {
    const consent: Consent = { v: 1, ...choice, at: new Date().toISOString() };
    memory = consent;
    try {
      localStorage.setItem(KEY, JSON.stringify(consent));
    } catch {
      // Without storage the banner simply shows again on the next page.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  },
};

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
