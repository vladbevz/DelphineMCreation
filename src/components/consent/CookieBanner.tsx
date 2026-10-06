'use client';

import Link from 'next/link';
import { useEffect, useId, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/Button';
import { consentStore, OPEN_SETTINGS_EVENT } from './consentStore';

/**
 * Consent banner (CNIL): refusing is as easy as accepting, nothing optional loads before
 * a choice, and the choice can be changed from the footer at any time.
 */
export function CookieBanner() {
  const consent = useSyncExternalStore(
    consentStore.subscribe,
    consentStore.getSnapshot,
    consentStore.getServerSnapshot,
  );
  const [reopened, setReopened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();

  useEffect(() => {
    const open = () => {
      const current = consentStore.getSnapshot();
      setAnalytics(Boolean(current?.analytics));
      setMarketing(Boolean(current?.marketing));
      setCustomizing(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // undefined: server render / before hydration. A stored choice hides the banner.
  if (consent === undefined || (consent && !reopened)) return null;

  const save = (choice: { analytics: boolean; marketing: boolean }) => {
    consentStore.save(choice);
    setReopened(false);
    setCustomizing(false);
  };

  return (
    <section
      role="dialog"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-xl border border-sand-border bg-linen p-5 sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <h2 id={titleId} className="display-caps text-xl">
        Un petit mot sur les <em className="script-accent">cookies</em>
      </h2>
      <p className="mt-2 text-sm text-muted">
        Le panier fonctionne sans cookie. Avec votre accord, j’utilise aussi une mesure d’audience
        et le pixel Meta pour comprendre d’où viennent les visites.{' '}
        <Link href="/confidentialite" className="text-cognac underline underline-offset-4">
          En savoir plus
        </Link>
      </p>

      {customizing && (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Choisir les cookies</legend>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked disabled className="mt-1 size-4 accent-espresso" />
            <span>
              <strong className="font-medium">Nécessaires</strong> — panier, sécurité des
              formulaires. Toujours actifs.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.currentTarget.checked)}
              className="mt-1 size-4 accent-cognac"
            />
            <span>
              <strong className="font-medium">Mesure d’audience</strong> — statistiques de visite
              anonymes.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.currentTarget.checked)}
              className="mt-1 size-4 accent-cognac"
            />
            <span>
              <strong className="font-medium">Publicité</strong> — pixel Meta (Instagram, Facebook).
            </span>
          </label>
        </fieldset>
      )}

      {/* Refuse and accept look the same: neither choice is nudged (CNIL). */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button
          variant="secondary"
          className="min-h-11 px-4"
          onClick={() => save({ analytics: false, marketing: false })}
        >
          Tout refuser
        </Button>
        <Button
          variant="secondary"
          className="min-h-11 px-4"
          onClick={() => save({ analytics: true, marketing: true })}
        >
          Tout accepter
        </Button>
      </div>
      {customizing ? (
        <Button className="mt-3 min-h-11 w-full" onClick={() => save({ analytics, marketing })}>
          Enregistrer mes choix
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setCustomizing(true)}
          className="mt-3 min-h-11 w-full text-sm underline underline-offset-4 hover:text-cognac"
        >
          Personnaliser
        </button>
      )}
    </section>
  );
}
