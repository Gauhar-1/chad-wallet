'use client';

// =============================================================================
// AuthGuard — Route protection wrapper
// =============================================================================

import { type ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Spinner from '@/components/ui/Spinner';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  let ready = true;
  let authenticated = false;
  let login: (() => void) | undefined;

  try {
    const privy = usePrivy();
    ready = privy.ready;
    authenticated = privy.authenticated;
    login = privy.login;
  } catch {
    // Privy not available, render children anyway in dev
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!authenticated) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Connect to Continue
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in with Apple or Google to start trading
          </p>
        </div>
        <button
          onClick={login}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
