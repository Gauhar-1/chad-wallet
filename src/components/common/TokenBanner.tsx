'use client';

// =============================================================================
// TokenBanner — Infinite scrolling marquee of live token prices
// =============================================================================

import { useMemo, memo } from 'react';
import Link from 'next/link';
import TokenIcon from './TokenIcon';
import PriceDisplay from './PriceDisplay';
import PercentChange from './PercentChange';
import { cn } from '@/lib/utils';
import { useTrendingTokens } from '@/hooks/useTrendingTokens';
import type { BannerToken } from '@/types/token';
import { DEFAULT_BANNER_TOKENS } from '@/lib/constants';

interface TokenBannerProps {
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const TokenBanner = memo(function TokenBanner({
  direction = 'left',
  speed = 'normal',
  className,
}: TokenBannerProps) {
  const { data, isLoading } = useTrendingTokens();

  const tokens: BannerToken[] = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data.slice(0, 20).map((t: Record<string, unknown>) => ({
        address: t.address as string,
        symbol: t.symbol as string,
        logoURI: (t.logoURI as string) || null,
        price: t.price as number,
        priceChange24h: t.priceChange24hPercent as number,
      }));
    }
    // Fallback tokens
    return DEFAULT_BANNER_TOKENS.map((t) => ({
      ...t,
      logoURI: null,
      price: 0,
      priceChange24h: 0,
    }));
  }, [data]);

  const speeds = {
    slow: '60s',
    normal: '40s',
    fast: '25s',
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full h-10 bg-black/40 border-y border-white/[0.04] flex items-center overflow-hidden',
          className
        )}
      >
        <div className="flex gap-8 px-4 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/[0.06]" />
              <div className="w-16 h-3 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Duplicate the list for seamless loop
  const duplicatedTokens = [...tokens, ...tokens];

  return (
    <div
      className={cn(
        'w-full h-10 bg-black/40 border-y border-white/[0.04] overflow-hidden relative',
        className
      )}
    >
      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0a0e1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0a0e1a] to-transparent z-10 pointer-events-none" />

      <div
        className="flex items-center h-full gap-6 whitespace-nowrap"
        style={{
          animation: `marquee-${direction} ${speeds[speed]} linear infinite`,
        }}
      >
        {duplicatedTokens.map((token, index) => (
          <Link
            key={`${token.address}-${index}`}
            href={`/trade/${token.address}`}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors shrink-0"
          >
            <TokenIcon logoURI={token.logoURI} symbol={token.symbol} size={20} />
            <span className="text-xs font-medium text-gray-300">
              {token.symbol}
            </span>
            {token.price > 0 && (
              <>
                <PriceDisplay price={token.price} size="sm" />
                <PercentChange value={token.priceChange24h} size="sm" showIcon={false} />
              </>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
});

export default TokenBanner;
