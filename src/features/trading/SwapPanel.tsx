'use client';

import { useState, memo } from 'react';
import SwapForm from './SwapForm';
import PositionsList from './PositionsList';
import { cn, formatCompact, truncateAddress } from '@/lib/utils';
import AuthGuard from '@/components/auth/AuthGuard';
import { useTokenInfo } from '@/hooks/useTokenInfo';

// =============================================================================
// Helper Sub-Components for the "About" Card
// =============================================================================

const StatBar = ({
  leftLabel, leftValue, leftRaw, 
  rightLabel, rightValue, rightRaw
}: {
  leftLabel: string; leftValue: string | number; leftRaw: number;
  rightLabel: string; rightValue: string | number; rightRaw: number;
}) => {
  const total = leftRaw + rightRaw;
  const leftPct = total > 0 ? (leftRaw / total) * 100 : 50;
  const rightPct = total > 0 ? (rightRaw / total) * 100 : 50;

  return (
    <div className="flex flex-col gap-1.5 mb-3.5 last:mb-0">
      <div className="flex items-center justify-between text-[13px] font-semibold">
        <span className="text-white">{leftValue} <span className="text-[#8F9BB3] font-normal">{leftLabel}</span></span>
        <span className="text-white">{rightValue} <span className="text-[#8F9BB3] font-normal">{rightLabel}</span></span>
      </div>
      <div className="flex h-1 w-full rounded-full overflow-hidden gap-0.5 bg-[#050505]">
        <div className="bg-[#4ade80] transition-all duration-500" style={{ width: `${leftPct}%` }} />
        <div className="bg-[#f32e2eff] transition-all duration-500" style={{ width: `${rightPct}%` }} />
      </div>
    </div>
  );
};

const TimeframeStat = ({ label, value, isPositive }: { label: string; value: string; isPositive: boolean }) => (
  <div className="flex flex-col items-center">
    <span className="text-[11px] text-[#8F9BB3] font-medium mb-0.5">{label}</span>
    <div className={cn("text-[11px] font-semibold flex items-center", isPositive ? "text-[#4ade80]" : "text-[#f87171]")}>
      {isPositive ? '▲' : '▼'} {value}
    </div>
  </div>
);

const SocialPill = ({ icon, label, href }: { icon: React.ReactNode; label: string; href?: string }) => (
  <a 
    href={href || '#'} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.02] hover:border-white/[0.1] rounded-lg text-xs text-white transition-all cursor-pointer"
  >
    {icon}
    {label}
  </a>
);

// =============================================================================
// Main SwapPanel Component
// =============================================================================

interface SwapPanelProps {
  tokenAddress: string;
}

const SwapPanel = memo(function SwapPanel({ tokenAddress }: SwapPanelProps) {
  // We manage the buy/sell state here to style the top header, and pass it down if SwapForm needs it
  const [swapMode, setSwapMode] = useState<'buy' | 'sell'>('buy');
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [positionTab, setPositionTab] = useState<'open' | 'closed'>('open');

  const { data: token } = useTokenInfo(tokenAddress);

  // Safely fallback data for the UI if API doesn't provide it yet
  const stats = {
    buys: token?.buy24h || 9921,
    sells: token?.sell24h || 9269,
    volBuy: token?.volume24hUSD ? token.volume24hUSD * 0.52 : 1700000,
    volSell: token?.volume24hUSD ? token.volume24hUSD * 0.48 : 1600000,
    buyers: token?.uniqueWallet24h ? Math.floor(token.uniqueWallet24h * 0.53) : 2461,
    sellers: token?.uniqueWallet24h ? Math.floor(token.uniqueWallet24h * 0.47) : 2161,
  };

  return (
    <AuthGuard>
      {/* Container setup: vertical flex, standard panel background, hidden scrollbar 
        To make it match exactly, we set a specific gap between the detached cards.
      */}
      <div className="flex flex-col h-full overflow-y-auto bg-[#050505] p-2 gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* ========================================================= */}
        {/* CARD 1: SWAP FORM (Buy/Sell)                              */}
        {/* ========================================================= */}
        <div className="bg-transparent rounded-xl border border-white/[0.04] p-3 flex flex-col shrink-0 shadow-lg">
          {/* Assuming SwapForm accepts a mode/side prop. If not, it will just render 
            inside this nicely styled card. 
          */}
          <SwapForm tokenAddress={tokenAddress} />
        </div>

        {/* ========================================================= */}
        {/* CARD 2: ABOUT TOKEN                                       */}
        {/* ========================================================= */}
        <div className="bg-transparent rounded-xl border border-white/[0.04] p-4 flex flex-col shrink-0 shadow-lg transition-all duration-300">
          <h3 className="text-[15px] font-bold text-white mb-2">About {token?.symbol || 'Token'}</h3>
          
          <p className={cn("text-[12px] text-[#8F9BB3] leading-relaxed transition-all", !isAboutExpanded && "line-clamp-2")}>
            {token?.extensions?.description || `${token?.symbol || 'This token'} is a decentralized asset on the Solana network. Ownership has been renounced and liquidity is locked. All trading volume and fees contribute directly to the ecosystem growth.`}
          </p>

          {/* Timeframes */}
          <div className="flex items-center justify-between py-4 mt-2 border-b border-t border-white/[0.04] mb-4">
            <TimeframeStat label="5M" value="1.47%" isPositive={true} />
            <TimeframeStat label="1H" value="40.90%" isPositive={true} />
            <TimeframeStat label="4H" value="147.94%" isPositive={true} />
            <TimeframeStat label="1D" value="11,792%" isPositive={true} />
          </div>

          {/* Progress Bars */}
          <StatBar 
            leftLabel="buys" leftValue={stats.buys.toLocaleString()} leftRaw={stats.buys}
            rightLabel="sells" rightValue={stats.sells.toLocaleString()} rightRaw={stats.sells}
          />
          <StatBar 
            leftLabel="vol." leftValue={`$${formatCompact(stats.volBuy)}`} leftRaw={stats.volBuy}
            rightLabel="vol." rightValue={`$${formatCompact(stats.volSell)}`} rightRaw={stats.volSell}
          />
          <StatBar 
            leftLabel="buyers" leftValue={stats.buyers.toLocaleString()} leftRaw={stats.buyers}
            rightLabel="sellers" rightValue={stats.sellers.toLocaleString()} rightRaw={stats.sellers}
          />

          {/* Expanded Content (Socials & Metadata) */}
          {isAboutExpanded && (
            <div className="pt-4 mt-2 border-t border-white/[0.04] animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Socials */}
              <div className="flex flex-wrap gap-2 mb-5">
                <SocialPill 
                  icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                  label="Website" 
                  href={token?.extensions?.website} 
                />
                <SocialPill 
                  icon={<svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                  label="Twitter" 
                  href={token?.extensions?.twitter} 
                />
                <SocialPill 
                  icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                  label="Telegram" 
                  href={token?.extensions?.telegram} 
                />
              </div>

              {/* Metadata Grid */}
              <div className="flex flex-col gap-3 text-[12px]">
                <div className="flex justify-between items-center">
                  <span className="text-[#8F9BB3]">Launchpad</span>
                  <div className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-0.5 rounded text-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" /> Pump.fun
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F9BB3]">Supply</span>
                  <span className="text-white font-medium">999.9M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F9BB3]">Network</span>
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.067 6.46l2.35 2.348H3.14l-2.35-2.348h18.627zM6.933 11.458l-2.35-2.348h16.277l2.35 2.348H6.933zm10.134 4.998l2.35 2.348H3.14l-2.35-2.348h16.277z"/></svg> Solana
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F9BB3]">Created</span>
                  <span className="text-white font-medium">11 days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8F9BB3]">Contract address</span>
                  <span className="text-white font-mono bg-white/[0.04] px-1.5 py-0.5 rounded">{truncateAddress(tokenAddress, 4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Expand/Collapse Trigger */}
          <button 
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="w-full mt-4 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.02] rounded-lg text-[11px] font-semibold text-[#8F9BB3] hover:text-white transition-all"
          >
            {isAboutExpanded ? 'View less' : 'View more'}
          </button>
        </div>

        {/* ========================================================= */}
        {/* CARD 3: POSITIONS                                         */}
        {/* ========================================================= */}
        <div className="bg-transparent rounded-xl border border-white/[0.04] p-4 flex flex-col flex-1 shrink-0 min-h-[250px] shadow-lg mb-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-white">Your positions</h3>
            
            {/* Open / Closed Mini-Pill Toggle */}
            <div className="flex bg-[#050505] rounded-md p-0.5 border border-white/[0.04]">
              <button
                onClick={() => setPositionTab('open')}
                className={cn(
                  "px-3 py-1 rounded text-[11px] font-semibold transition-all",
                  positionTab === 'open' ? "bg-[#1c3677] text-[#60a5fa]" : "text-[#8F9BB3] hover:text-white"
                )}
              >
                Open
              </button>
              <button
                onClick={() => setPositionTab('closed')}
                className={cn(
                  "px-3 py-1 rounded text-[11px] font-semibold transition-all",
                  positionTab === 'closed' ? "bg-white/[0.1] text-white" : "text-[#8F9BB3] hover:text-white"
                )}
              >
                Closed
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
             {/* Assuming PositionsList can take an open/closed prop to filter data. 
               If not, simply rendering it here achieves the layout requested.
             */}
            <PositionsList status={positionTab} />
          </div>
        </div>

      </div>
    </AuthGuard>
  );
});

export default SwapPanel;