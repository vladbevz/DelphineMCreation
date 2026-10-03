const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

// The browser SDK is heavy, so it is loaded lazily once the page is idle to keep
// it off the critical path (Lighthouse mobile >= 90). Errors thrown before that are not captured.
if (dsn) {
  const load = () =>
    import('@sentry/nextjs').then((Sentry) => Sentry.init({ dsn, tracesSampleRate: 0.1 }));

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(load, { timeout: 4000 });
  } else {
    setTimeout(load, 2000);
  }
}
