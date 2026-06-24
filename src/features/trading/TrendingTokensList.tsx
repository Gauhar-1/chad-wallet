'use client';

// =============================================================================
// TrendingTokensList — Left panel: scrollable list of trending tokens
// =============================================================================

import { useState, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import TokenIcon from '@/components/common/TokenIcon';
import PriceDisplay from '@/components/common/PriceDisplay';
import PercentChange from '@/components/common/PercentChange';
import { TokenListSkeleton } from '@/components/ui/Skeleton';
import Input from '@/components/ui/Input';
import { useTrendingTokens } from '@/hooks/useTrendingTokens';
import { formatCompact } from '@/lib/utils';

interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string | null;
  price: number;
  priceChange24hPercent: number;
  volume24hUSD: number;
}

const TrendingTokensList = memo(function TrendingTokensList() {
  const [search, setSearch] = useState('');
  const params = useParams();
  const activeAddress = params?.tokenAddress as string;
  const { data, isLoading } = useTrendingTokens();

  const tokens: TrendingToken[] = useMemo(() => {
    const items = (data as TrendingToken[]) || [];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(
      (t) =>
        t.symbol?.toLowerCase().includes(q) ||
        t.name?.toLowerCase().includes(q) ||
        t.address?.toLowerCase().includes(q)
    );
  }, [data, search]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-white/[0.04]">
        <Input
          placeholder="Search tokens..."
          value={search}
          onChange={handleSearchChange}
          className="h-9 text-xs"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider border-b border-white/[0.04]">
        <span>Token</span>
        <span>Price / 24h</span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <TokenListSkeleton key={i} />
          ))
        ) : tokens.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-500">
            No tokens found
          </div>
        ) : (
          tokens.map((token) => (
            <Link
              key={token.address}
              href={`/trade/${token.address}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-l-2 ${
                activeAddress === token.address
                  ? 'border-l-amber-500 bg-amber-500/[0.03]'
                  : 'border-l-transparent'
              }`}
            >
              <TokenIcon
                logoURI={token.logoURI}
                symbol={token.symbol || '?'}
                size={32}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {token.symbol}
                </div>
                <div className="text-[10px] text-gray-500 truncate">
                  Vol: ${formatCompact(token.volume24hUSD || 0)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <PriceDisplay price={token.price || 0} size="sm" />
                <div className="mt-0.5">
                  <PercentChange
                    value={token.priceChange24hPercent || 0}
                    size="sm"
                    showIcon={false}
                  />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
});

export default TrendingTokensList;
