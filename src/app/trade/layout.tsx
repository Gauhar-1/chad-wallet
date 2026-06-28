"use client";

import type { Metadata } from 'next';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import AuthButton from '@/features/auth/AuthButton';
import { DepositModal } from '@/components/modals/DepositModal';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth/solana';

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

  const [balance, setBalance] = useState<{ usdBalance: number, solBalance: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { ready, authenticated } = usePrivy();
const { wallets } = useWallets();

const activeWallet = wallets.find((w: any) => w.walletClientType === 'privy') || wallets[0];
const activeWalletAddress = activeWallet?.address;

  useEffect(() => {

  // Don't run until Privy is fully initialized and we have an address
  if (!ready || !activeWalletAddress) return;
    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        const res = await fetch(`/api/wallet/balance?address=${activeWalletAddress}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setBalance(data);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, [activeWalletAddress]);

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-[#050505] text-white font-sans tabular-nums tracking-tight">
      {/* Sleek Terminal Top Nav */}
      <header className="h-[60px] shrink-0 border-b border-white/[0.04] flex items-center justify-between px-4 lg:px-6 z-20">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-extrabold text-xl text-white tracking-tighter drop-shadow-lg hover:opacity-80 transition-opacity">
            chad
          </Link>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold uppercase text-[#8F9BB3]">
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
            className="block w-full pl-10 pr-12 py-2 border border-white/[0.04] rounded-full leading-5 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
            placeholder="Search for tokens or traders..."
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-white/[0.1]">/</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            {isLoading ? (
              <span className="text-xs font-bold text-white/50 animate-pulse">--- cash</span>
            ) : isError ? (
              <span className="text-xs font-bold text-red-400/80 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                $0.00 cash
              </span>
            ) : (
              <>
                <span className="text-xs font-bold text-white">
                  ${balance?.usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cash
                </span>
                <span className="text-[10px] text-[#8F9BB3]">
                  {balance?.solBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL
                </span>
              </>
            )}
            <span 
              className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300 mt-0.5"
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
        walletAddress={activeWalletAddress} 
      />
    </div>
  );
}
