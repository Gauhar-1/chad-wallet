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
    <div className="p-4 border-b border-white/[0.04]">
      {/* Token header */}
      <div className="flex items-start gap-4 mb-4">
        <TokenIcon
          logoURI={token.logoURI}
          symbol={token.symbol || '?'}
          size={48}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">{token.name}</h1>
            <span className="text-sm text-gray-500">{token.symbol}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <PriceDisplay price={token.price || 0} size="lg" />
            <PercentChange value={token.priceChange24hPercent || 0} size="md" />
          </div>
        </div>
        <a
          href={`${SOLANA_EXPLORER}/token/${tokenAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
        >
          {truncateAddress(tokenAddress, 6)}
          <svg className="w-3 h-3 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Market Cap', value: `$${formatCompact(token.mc || 0)}` },
          { label: '24h Volume', value: `$${formatCompact(token.volume24hUSD || 0)}` },
          { label: 'Liquidity', value: `$${formatCompact(token.liquidity || 0)}` },
          { label: 'Holders', value: formatCompact(token.holder || 0) },
        ].map((stat) => (
          <div
            key={stat.label}
            className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              {stat.label}
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TokenDetail;
