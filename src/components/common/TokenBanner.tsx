'use client';

// =============================================================================
// TokenBanner — High-performance, GPU-accelerated infinite ticker
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

  // 1. Bulletproof Array Sizing
  const safeTokens: BannerToken[] = useMemo(() => {
    let baseTokens = [];
    if (data && Array.isArray(data) && data.length > 0) {
      baseTokens = data.slice(0, 20).map((t: Record<string, unknown>) => ({
        address: t.address as string,
        symbol: t.symbol as string,
        logoURI: (t.logoURI as string) || null,
        price: t.price as number,
        priceChange24h: t.priceChange24hPercent as number,
      }));
    } else {
      baseTokens = DEFAULT_BANNER_TOKENS.map((t) => ({
        ...t,
        logoURI: null,
        price: 0,
        priceChange24h: 0,
      }));
    }
    
    // To guarantee the track is wider than a 5K ultrawide monitor, 
    // we triple the array. This prevents the "disappearing" bug entirely.
    return [...baseTokens, ...baseTokens, ...baseTokens];
  }, [data]);

  // Tuned for that cinematic, continuous flow
  const speedMap = {
    slow: '60s',
    normal: '40s',
    fast: '20s', 
  };

  if (isLoading) {
    return (
      <div className={cn('w-full h-12 bg-[#050505]/80 backdrop-blur-md border-y border-white/[0.02] flex items-center overflow-hidden', className)}>
        <div className="flex gap-8 px-4 animate-pulse w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 opacity-40">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-white/[0.08] to-white/[0.02]" />
              <div className="w-16 h-3 rounded bg-gradient-to-r from-white/[0.08] to-white/[0.02]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const animationDuration = speedMap[speed];
  const animationName = direction === 'right' ? 'marquee-reverse' : 'marquee';

  return (
    <>
      {/* The Ultimate CSS Marquee fix:
        Both blocks translate from 0 to -100%. Because they sit side-by-side,
        Block 2 seamlessly follows Block 1. When Block 1 hits -100%, 
        it instantly resets, creating a zero-frame-drop loop.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes marquee-reverse {
          0% { transform: translate3d(-100%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee {
          animation: var(--marquee-anim) var(--marquee-duration) linear infinite;
          will-change: transform;
        }
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />

      <div
        className={cn(
          'marquee-container relative w-full h-12 bg-[#050505]/90 backdrop-blur-xl border-y border-white/[0.02] flex items-center overflow-hidden font-sans group',
          className
        )}
      >
        {/* Edge Gradients (pointer-events-none ensures links underneath remain clickable) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        {/* Track 1: Primary 
          pr-8 (padding-right) exactly matches the gap-8. This guarantees the 
          spacing between Track 1 and Track 2 is identical to the spacing between tokens.
        */}
        <div 
          className="flex shrink-0 items-center justify-around gap-8 pr-8 animate-marquee z-10"
          style={{
            '--marquee-duration': animationDuration,
            '--marquee-anim': animationName,
          } as React.CSSProperties}
        >
          {safeTokens.map((token, index) => (
            <TokenCard key={`primary-${token.address}-${index}`} token={token} />
          ))}
        </div>

        {/* Track 2: The Loop Follower (ARIA-hidden for screen readers)
        */}
        <div 
          className="flex shrink-0 items-center justify-around gap-8 pr-8 animate-marquee z-10"
          aria-hidden="true"
          style={{
            '--marquee-duration': animationDuration,
            '--marquee-anim': animationName,
          } as React.CSSProperties}
        >
          {safeTokens.map((token, index) => (
            <TokenCard key={`duplicate-${token.address}-${index}`} token={token} />
          ))}
        </div>

      </div>
    </>
  );
});

// =============================================================================
// Sub-component for individual tokens
// =============================================================================
const TokenCard = memo(function TokenCard({ token }: { token: BannerToken }) {
  return (
    <Link
      href={`/trade/${token.address}`}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-transparent transition-all duration-300 hover:bg-white/[0.03] hover:border-white/[0.08] hover:shadow-[0_0_15px_rgba(74,222,128,0.05)] cursor-pointer"
    >
      <TokenIcon logoURI={token.logoURI} symbol={token.symbol} size={20} />
      
      <span className="text-[13px] font-bold text-[#e4e4e7] tracking-tight lowercase">
        {token.symbol}
      </span>
      
      {token.price > 0 && (
        <div className="flex items-center gap-2 ml-1">
          <div className="text-[13px] font-medium text-[#a1a1aa] tracking-tight tabular-nums">
            <PriceDisplay price={token.price} size="sm" />
          </div>
          <div className="text-[12px] font-semibold tracking-tight">
            <PercentChange value={token.priceChange24h} size="sm" showIcon={false} />
          </div>
        </div>
      )}
    </Link>
  );
});

export default TokenBanner;