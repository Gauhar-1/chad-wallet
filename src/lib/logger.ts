// =============================================================================
// Logger — Centralized logging utility
// =============================================================================

const isDevelopment = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  error: (message: string, error?: unknown, ...args: unknown[]) => {
    // We always want to log critical errors, but in production we could format 
    // them differently or send them to a service like Sentry instead of console spam.
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error, ...args);
    } else {
      // Production: In a real app, this would be Sentry.captureException(error)
      // For now, we still log it, but could limit details.
      console.error(`[ERROR] ${message}`, error);
    }
  },
};
