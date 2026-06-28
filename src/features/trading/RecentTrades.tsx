'use client';

// =============================================================================
// RecentTrades — Live trade feed for a token
// =============================================================================

import { memo } from 'react';
import { useRecentTrades } from '@/hooks/useRecentTrades';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { truncateAddress, formatCompact, formatTimeAgo } from '@/lib/utils';
import { SOLANA_EXPLORER } from '@/lib/constants';

interface RecentTradesProps {
  tokenAddress: string;
  thesisOnly?: boolean;
  friendsOnly?: boolean;
}

const RecentTrades = memo(function RecentTrades({ tokenAddress, thesisOnly, friendsOnly }: RecentTradesProps) {
  const { data: trades, isLoading } = useRecentTrades(tokenAddress, { thesisOnly, friendsOnly });

  return (
    <div className="h-full flex flex-col">
      {/* Table header (Sticky) */}
      <div className="sticky top-0 z-10 bg-[#050505] grid grid-cols-[60px_50px_1fr_80px_70px] gap-2 px-4 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider border-b border-white/[0.04]">
        <span>Time</span>
        <span>Side</span>
        <span>Wallet</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Value</span>
      </div>

      {/* Trade list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <TableRowSkeleton key={i} cols={5} />
          ))
        ) : !trades || (trades as unknown[]).length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-gray-500">
            No trade data available
          </div>
        ) : (
          (trades as Array<{
            txHash: string;
            blockUnixTime: number;
            side: string;
            owner: string;
            from: { uiAmount: number; symbol: string };
            to: { uiAmount: number; symbol: string };
            volumeUSD: number;
          }>).slice(0, 30).map((trade, index) => (
            <div
              key={trade.txHash || index}
              className="grid grid-cols-[60px_50px_1fr_80px_70px] gap-2 px-4 py-2 hover:bg-white/[0.02] transition-colors text-xs items-center"
            >
              <span className="text-gray-500 tabular-nums text-[10px]">
                {formatTimeAgo(trade.blockUnixTime || 0)}
              </span>
              <span
                className={`font-medium uppercase text-[10px] ${
                  trade.side === 'buy'
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }`}
              >
                {trade.side || '—'}
              </span>
              <a
                href={`${SOLANA_EXPLORER}/tx/${trade.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-amber-400 font-mono transition-colors truncate text-[10px]"
              >
                {truncateAddress(trade.owner || '', 4)}
              </a>
              <span className="text-right text-gray-300 tabular-nums">
                {formatCompact(trade.to?.uiAmount || trade.from?.uiAmount || 0)}
              </span>
              <span className="text-right text-gray-400 tabular-nums">
                ${formatCompact(trade.volumeUSD || 0)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

export default RecentTrades;
