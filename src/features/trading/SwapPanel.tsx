'use client';

// =============================================================================
// SwapPanel — Right panel: Buy/Sell tab container
// =============================================================================

import { useState, memo } from 'react';
import SwapForm from './SwapForm';
import PositionsList from './PositionsList';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/auth/AuthGuard';

interface SwapPanelProps {
  tokenAddress: string;
}

const SwapPanel = memo(function SwapPanel({ tokenAddress }: SwapPanelProps) {
  const [activeTab, setActiveTab] = useState<'swap' | 'positions'>('swap');

  return (
    <AuthGuard>
      <div className="flex flex-col h-full">
        {/* Tab switcher - Fomo Segmented Style */}
        <div className="p-4 border-b border-white/[0.04]">
          <div className="flex rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
            {(['swap', 'positions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex-1 py-2 text-[13px] font-semibold rounded-lg capitalize transition-all',
                  activeTab === tab
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {tab === 'swap' ? 'Swap' : 'Positions'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'swap' ? (
            <SwapForm tokenAddress={tokenAddress} />
          ) : (
            <PositionsList />
          )}
        </div>
      </div>
    </AuthGuard>
  );
});

export default SwapPanel;
