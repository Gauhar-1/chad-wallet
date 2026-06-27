'use client';

// =============================================================================
// PrivyAuthProvider — Privy authentication with Apple/Google + embedded wallets
// =============================================================================

import { PrivyProvider } from '@privy-io/react-auth';
// 1. Import the Solana wallet connectors module
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { type ReactNode } from 'react';

// 2. Initialize the connectors using a global singleton to prevent re-renders
// and the "WalletConnect Core is already initialized" error during Fast Refresh.
const globalForSolana = globalThis as unknown as { solanaConnectors?: any };
const solanaConnectors = globalForSolana.solanaConnectors ?? toSolanaWalletConnectors();
if (process.env.NODE_ENV !== 'production') {
  globalForSolana.solanaConnectors = solanaConnectors;
}

export default function PrivyAuthProvider({ children }: { children: ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    // Render children without auth if no app ID is set (prevents build crash)
    console.warn('NEXT_PUBLIC_PRIVY_APP_ID is missing. Auth will be disabled.');
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['google', 'apple', 'email', 'wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#f59e0b', // Amber/gold to match ChadWallet branding
          logo: '/logo/dark.png',
          showWalletLoginFirst: false,
        },
        embeddedWallets: {
          solana: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // 3. Inject the external Solana connectors here to silence the warning
        // and enable native Phantom/Solflare support in the modal
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}