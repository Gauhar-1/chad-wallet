'use client';

import { useState } from 'react';
import RecentTrades from './RecentTrades';
import TopHolders from './TopHolders';
import { cn } from '@/lib/utils';

export default function BottomDataTabs({ tokenAddress }: { tokenAddress: string }) {
  const [activeTab, setActiveTab] = useState<'trades' | 'holders'>('trades');

  return (
    <div className="flex flex-col h-full bg-[#0A0D14]">
      {/* Tabs Header */}
      <div className="h-[44px] shrink-0 border-b border-white/[0.04] flex items-center px-4 gap-6 text-[13px] font-semibold text-[#8F9BB3]">
        <button
          onClick={() => setActiveTab('trades')}
          className={cn(
            'relative h-full transition-colors hover:text-gray-300',
            activeTab === 'trades' && 'text-white'
          )}
        >
          Recent Trades
          {activeTab === 'trades' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ade80]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('holders')}
          className={cn(
            'relative h-full transition-colors hover:text-gray-300',
            activeTab === 'holders' && 'text-white'
          )}
        >
          Holders
          {activeTab === 'holders' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4ade80]" />
          )}
        </button>
      </div>

      {/* Content Area - internally scrolling */}
      <div className="flex-1 overflow-y-auto scrollbar-thin relative">
        {activeTab === 'trades' ? (
          <RecentTrades tokenAddress={tokenAddress} />
        ) : (
          <TopHolders tokenAddress={tokenAddress} />
        )}
      </div>
    </div>
  );
}
