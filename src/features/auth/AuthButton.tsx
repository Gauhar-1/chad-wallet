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
    <Button 
  variant="primary" 
  size="md" 
  onClick={login}
  className="tracking-tight lowercase text-[15px]"
>
  <svg
    className="w-[18px] h-[18px] mb-[1px]" 
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
    />
  </svg>
  login
</Button>
  );
});

export default AuthButton;
