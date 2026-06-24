'use client';

// =============================================================================
// PrivyAuthProvider — Privy authentication with Apple/Google + embedded wallets
// =============================================================================

import { PrivyProvider } from '@privy-io/react-auth';
import { type ReactNode } from 'react';

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
      }}
    >
      {children}
    </PrivyProvider>
  );
}
