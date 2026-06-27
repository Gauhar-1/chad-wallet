'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-screen bg-[#050505] font-sans">
      
      {/* 1. The Elegant Spinner: Thin, sophisticated, and steady */}
      <div className="relative mb-8">
        <div className="w-8 h-8 border-[1.5px] border-white/10 border-t-[#4ade80] rounded-full animate-spin" />
      </div>

      {/* 2. Brand Identity: Focused, clean, and spaced */}
      <div className="flex flex-col items-center space-y-2 animate-pulse">
        <h2 className="text-2xl font-bold text-white tracking-tight lowercase">
          chadwallet.
        </h2>
        <p className="text-[13px] text-gray-500 font-medium tracking-[0.05em] uppercase">
          initializing
        </p>
      </div>

      {/* Fade-in wrapper for the whole screen */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .loading-container {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
      
      <div className="loading-container" />
    </div>
  );
}