'use client';

// =============================================================================
// TopHolders — Table of top traders/holders for a token
// =============================================================================

import { memo } from 'react';
import { useTopHolders } from '@/hooks/useTopHolders';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { truncateAddress, formatCompact, formatPrice } from '@/lib/utils';
import { SOLANA_EXPLORER } from '@/lib/constants';

interface TopHoldersProps {
  tokenAddress: string;
}

const TopHolders = memo(function TopHolders({ tokenAddress }: TopHoldersProps) {
  const { data: holders, isLoading } = useTopHolders(tokenAddress);

  return (
    <div className="border-b border-white/[0.04]">
      <div className="px-4 py-2 border-b border-white/[0.04]">
        <h3 className="text-sm font-semibold text-white">Top Traders (24h)</h3>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 px-4 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider border-b border-white/[0.04]">
        <span>Wallet</span>
        <span className="text-right">Volume</span>
        <span className="text-right">Trades</span>
        <span className="text-right">PnL</span>
      </div>

      {/* Table body */}
      <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} cols={4} />
          ))
        ) : !holders || (holders as unknown[]).length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-gray-500">
            No trader data available
          </div>
        ) : (
          (holders as Array<{
            owner: string;
            volume_usd: number;
            trade_count: number;
            total_pnl: number;
          }>).slice(0, 15).map((holder, index) => (
            <div
              key={holder.owner || index}
              className="grid grid-cols-[1fr_80px_80px_80px] gap-2 px-4 py-2.5 hover:bg-white/[0.02] transition-colors text-xs"
            >
              <a
                href={`${SOLANA_EXPLORER}/account/${holder.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 font-mono transition-colors truncate"
              >
                {truncateAddress(holder.owner || '', 4)}
              </a>
              <span className="text-right text-gray-300 tabular-nums">
                ${formatCompact(holder.volume_usd || 0)}
              </span>
              <span className="text-right text-gray-400 tabular-nums">
                {holder.trade_count || 0}
              </span>
              <span
                className={`text-right tabular-nums ${
                  (holder.total_pnl || 0) >= 0
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {formatPrice(Math.abs(holder.total_pnl || 0))}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default TopHolders;
