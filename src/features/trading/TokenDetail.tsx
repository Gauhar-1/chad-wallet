'use client';

// =============================================================================
// TokenDetail — Token metadata header with price, market cap, volume
// =============================================================================

import { memo } from 'react';
import TokenIcon from '@/components/common/TokenIcon';
import PriceDisplay from '@/components/common/PriceDisplay';
import PercentChange from '@/components/common/PercentChange';
import Skeleton from '@/components/ui/Skeleton';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { formatCompact, truncateAddress } from '@/lib/utils';
import { SOLANA_EXPLORER } from '@/lib/constants';

interface TokenDetailProps {
  tokenAddress: string;
}

const TokenDetail = memo(function TokenDetail({ tokenAddress }: TokenDetailProps) {
  const { data: token, isLoading } = useTokenInfo(tokenAddress);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton width="30%" height={20} />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-4 text-center text-gray-500">
        Token data unavailable
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6 h-full px-4 min-w-max">
      {/* Token header (Icon, Name, Symbol) */}
      <div className="flex items-center gap-3 pr-6 border-r border-white/[0.04] shrink-0">
        <TokenIcon
          logoURI={token.logoURI}
          symbol={token.symbol || '?'}
          size={32}
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-white tracking-tight">{token.symbol}</h1>
            <a
              href={`${SOLANA_EXPLORER}/token/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#8F9BB3] hover:text-gray-300 transition-colors"
            >
              {token.name}
            </a>
          </div>
          <div className="text-[11px] text-[#8F9BB3] font-mono mt-0.5">
            {truncateAddress(tokenAddress, 6)}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="flex items-center gap-8 shrink-0">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            Market cap
          </span>
          <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
            ${formatCompact(token.mc || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            Price
          </span>
          <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
            ${token.price ? formatCompact(token.price) : '0.00'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            24H change
          </span>
          <div className="text-[15px] font-bold tracking-tight">
            <PercentChange value={token.priceChange24hPercent || 0} size="md" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            24H Vol.
          </span>
          <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
            ${formatCompact(token.volume24hUSD || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            Liquidity
          </span>
          <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
            ${formatCompact(token.liquidity || 0)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5">
            Holders
          </span>
          <span className="text-[15px] font-bold text-white tabular-nums tracking-tight">
            {formatCompact(token.holder || 0)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default TokenDetail;
