'use client';

// =============================================================================
// AuthButton — Login/Logout toggle using Privy
// =============================================================================

import { usePrivy } from '@privy-io/react-auth';
import Button from '@/components/ui/Button';
import { memo } from 'react';

const AuthButton = memo(function AuthButton() {
  let privyAvailable = true;
  let authenticated = false;
  let ready = false;
  let login: (() => void) | undefined;
  let logout: (() => void) | undefined;
  let userDisplay = '';

  try {
    const privy = usePrivy();
    authenticated = privy.authenticated;
    ready = privy.ready;
    login = privy.login;
    logout = privy.logout;

    if (privy.user) {
      const googleAccount = privy.user.linkedAccounts?.find(
        (a: { type: string }) => a.type === 'google_oauth'
      );
      const appleAccount = privy.user.linkedAccounts?.find(
        (a: { type: string }) => a.type === 'apple_oauth'
      );
      userDisplay =
        (googleAccount as { name?: string })?.name ||
        (appleAccount as { email?: string })?.email ||
        privy.user.email?.address ||
        'Chad';
    }
  } catch {
    privyAvailable = false;
  }

  if (!privyAvailable) {
    return (
      <Button variant="primary" size="sm" disabled>
        Connect
      </Button>
    );
  }

  if (!ready) {
    return (
      <Button variant="secondary" size="sm" isLoading>
        Loading...
      </Button>
    );
  }

  if (authenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 hidden sm:inline">
          {userDisplay}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button variant="primary" size="sm" onClick={login}>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Connect
    </Button>
  );
});

export default AuthButton;
