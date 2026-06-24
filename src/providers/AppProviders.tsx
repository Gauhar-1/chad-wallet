'use client';

// =============================================================================
// AppProviders — Composed provider tree in correct nesting order
// =============================================================================

import { type ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import PrivyAuthProvider from './PrivyProvider';

/**
 * Single provider component that wraps the entire app.
 * Order matters:
 * 1. QueryProvider (outermost — no auth dependency)
 * 2. PrivyAuthProvider (needs to be inside QueryProvider)
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <PrivyAuthProvider>
        {children}
      </PrivyAuthProvider>
    </QueryProvider>
  );
}
