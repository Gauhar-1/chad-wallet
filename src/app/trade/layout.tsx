import type { Metadata } from 'next';
import TrendingTokensList from '@/features/trading/TrendingTokensList';

export const metadata: Metadata = {
  title: 'Trade',
  description: 'Trade Solana tokens with real-time charts and lightning-fast swaps.',
};

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden">
      {/* Left Panel — Trending Tokens (hidden on mobile) */}
      <aside className="hidden lg:flex w-[280px] shrink-0 border-r border-white/[0.04] bg-[#0a0e1a] flex-col">
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Trending
          </h2>
        </div>
        <TrendingTokensList />
      </aside>

      {/* Main content area (middle + right panels) */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
