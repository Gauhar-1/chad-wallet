// =============================================================================
// Sentry Client Config — Browser-side initialization
// =============================================================================

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session replay (optional)
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter out noisy errors
  ignoreErrors: [
    'ResizeObserver loop',
    'ChunkLoadError',
    'Loading chunk',
    'Network request failed',
    'AbortError',
  ],

  // Environment
  environment: process.env.NODE_ENV,
});
