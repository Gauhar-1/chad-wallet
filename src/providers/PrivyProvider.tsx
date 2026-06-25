'use client';

// =============================================================================
// PrivyAuthProvider — Privy authentication with Apple/Google + embedded wallets
// =============================================================================

import { PrivyProvider } from '@privy-io/react-auth';
// 1. Import the Solana wallet connectors module
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { type ReactNode } from 'react';

// 2. Initialize the connectors outside the component to prevent re-renders
const solanaConnectors = toSolanaWalletConnectors();

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