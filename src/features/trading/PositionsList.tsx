'use client';

// =============================================================================
// PositionsList — User's current token holdings
// =============================================================================

import { memo } from 'react';
import TokenIcon from '@/components/common/TokenIcon';
import { formatPrice, formatCompact } from '@/lib/utils';

const PositionsList = memo(function PositionsList() {
  // In a real implementation, this would use useUserPositions with the wallet address
  // from Privy's embedded wallet. For now, show a connect prompt.

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-white">No Positions</h3>
        <p className="text-xs text-gray-500 max-w-[200px]">
          Connect your wallet to view your token balances and positions
        </p>
      </div>
    </div>
  );
});

export default PositionsList;
