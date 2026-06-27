"use client";

import type { Metadata } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import AuthButton from '@/features/auth/AuthButton';
import { DepositModal } from '@/components/modals/DepositModal';

// export const metadata: Metadata = {
//   title: 'Trade',
//   description: 'Trade Solana tokens with real-time charts and lightning-fast swaps.',
// };

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const mockWalletAddress = '5aW1rMbCFtSdY53gn4VDJKQZsHPEYJ2L1YXE7neLDCGZ';

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#050505] text-white font-sans tabular-nums tracking-tight">
      {/* Sleek Terminal Top Nav */}
      <header className="h-[60px] shrink-0 border-b border-white/[0.04] flex items-center justify-between px-4 lg:px-6 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tighter drop-shadow-lg hover:opacity-80 transition-opacity">
            chad
          </Link>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold uppercase text-[#8F9BB3]">
            <span className="text-white">Trade</span>
            <span className="hover:text-white transition-colors cursor-pointer">Markets</span>
            <span className="hover:text-white transition-colors cursor-pointer">Portfolio</span>
          </div>
        </div>

        {/* Central Search Bar Placeholder */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-12 py-2 border border-white/[0.04] rounded-full leading-5 bg-[#0a0d14] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
            placeholder="Search for tokens or traders..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-white/[0.1]">/</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-white">$0.00 cash</span>
            <span 
              className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300"
              onClick={() => setIsDepositModalOpen(true)}
            >
              Deposit more
            </span>
          </div>
          <AuthButton />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>

      <DepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        walletAddress={mockWalletAddress} 
      />
    </div>
  );
}
