'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Loading from '@/app/loading';
import AuthModal from '@/components/auth/AuthModal';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { ready, authenticated } = usePrivy();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!ready) {
    // Show premium 3D coin-flip loading component
    return <Loading />;
  }

  if (!authenticated) {
    return (
      <div className="relative w-full h-full min-h-screen">
        {/* Render children with blur to maintain background context */}
        <div className="blur-md opacity-50 pointer-events-none transition-all duration-500 h-full w-full">
          {children}
        </div>
        {/* Modal Overlay */}
        <AuthModal />
      </div>
    );
  }

  // Authenticated
  return <>{children}</>;
}
