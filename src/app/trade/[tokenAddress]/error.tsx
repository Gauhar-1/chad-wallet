'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function TradeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('Trade route error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#050505] p-6 text-center">
      <div className="max-w-md w-full rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.03)] p-8">
        
        {/* Glowing warning icon */}
        <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
          <svg className="w-8 h-8 text-red-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white tracking-tight lowercase mb-2">
          connection lost.
        </h2>
        <p className="text-sm text-white/50 tracking-tight lowercase mb-8">
          we encountered an error establishing a secure link to the exchange. please try again.
        </p>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white text-black hover:bg-gray-100 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] lowercase tracking-tight"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          reconnect
        </button>
      </div>
    </div>
  );
}
