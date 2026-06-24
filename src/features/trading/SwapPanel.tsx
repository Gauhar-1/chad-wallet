'use client';

// =============================================================================
// SwapPanel — Right panel: Buy/Sell tab container
// =============================================================================

import { useState, memo } from 'react';
import SwapForm from './SwapForm';
import PositionsList from './PositionsList';
import { cn } from '@/lib/utils';
import AuthGuard from '@/features/auth/AuthGuard';

interface SwapPanelProps {
  tokenAddress: string;
}

const SwapPanel = memo(function SwapPanel({ tokenAddress }: SwapPanelProps) {
  const [activeTab, setActiveTab] = useState<'swap' | 'positions'>('swap');

  return (
    <AuthGuard>
      <div className="flex flex-col h-full">
        {/* Tab switcher */}
        <div className="flex border-b border-white/[0.04]">
          {(['swap', 'positions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-3 text-sm font-medium capitalize transition-all relative',
                activeTab === tab
                  ? 'text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              )}
            >
              {tab === 'swap' ? 'Buy / Sell' : 'Positions'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
              )}
            </button>
          ))}
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
