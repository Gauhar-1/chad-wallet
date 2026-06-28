'use client';

import { memo, useState, useRef, useCallback, MouseEvent } from 'react';
import TokenIcon from '@/components/common/TokenIcon';
import PriceDisplay from '@/components/common/PriceDisplay';
import PercentChange from '@/components/common/PercentChange';
import Skeleton from '@/components/ui/Skeleton';
import { useTokenInfo } from '@/hooks/useTokenInfo';
import { formatCompact, truncateAddress, cn } from '@/lib/utils';
import { SOLANA_EXPLORER } from '@/lib/constants';

// =============================================================================
// Draggable Scroll Wrapper (Decoupled for clean architecture)
// =============================================================================
interface DraggableScrollProps {
  children: React.ReactNode;
  className?: string;
}

const DraggableScroll = ({ children, className }: DraggableScrollProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  }, []);

  const handleMouseLeave = useCallback(() => setIsDragging(false), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        "flex overflow-x-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      {children}
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

interface TokenDetailProps {
  tokenAddress: string;
}

const TokenDetail = memo(function TokenDetail({ tokenAddress }: TokenDetailProps) {
  const { data: token, isLoading } = useTokenInfo(tokenAddress);
  
  // UI State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(tokenAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [tokenAddress]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4 h-full bg-transparent">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <Skeleton width="30%" height={20} />
          <Skeleton width="50%" height={14} />
        </div>
      </div>
    );
  }

  if (!token) return <div className="p-4 text-center text-gray-500 text-sm">Token data unavailable</div>;

  return (
    <>
      <div className="flex items-center h-full px-4 w-full bg-transparent">
        
        {/* ----------------------------------------------------------------- */}
        {/* LEFT SIDE: Fixed Context (Icon, Name, Address, Socials)           */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex items-center gap-3 pr-6 border-r border-white/[0.04] shrink-0 h-full">
          
          

          {/* Clickable Token Avatar */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="relative group rounded-full overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition-all focus:outline-none"
          >
            <TokenIcon logoURI={token.logoURI} symbol={token.symbol || '?'} size={36} />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </div>
          </button>

          {/* Identity & Metadata Grid */}
          <div className="flex flex-col justify-center gap-0.5">
            {/* Top Row: Symbol & Socials */}
            <div className="flex items-center gap-2.5">
              <h1 className="text-[15px] font-bold text-white tracking-tight leading-none">{token.symbol}</h1>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
                {/* Website */}
                <a href={token.extensions?.website || '#'} target="_blank" rel="noopener noreferrer" className="text-[#8F9BB3] hover:text-white transition-colors" title="Website">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                </a>
                {/* X / Twitter */}
                <a href={token.extensions?.twitter || '#'} target="_blank" rel="noopener noreferrer" className="text-[#8F9BB3] hover:text-white transition-colors" title="X (Twitter)">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                {/* Telegram */}
                <a href={token.extensions?.telegram || '#'} target="_blank" rel="noopener noreferrer" className="text-[#8F9BB3] hover:text-white transition-colors" title="Telegram">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </a>
                {/* Search on X */}
                <a href={`https://twitter.com/search?q=${token.symbol}`} target="_blank" rel="noopener noreferrer" className="text-[#8F9BB3] hover:text-[#4ade80] transition-colors" title="Search on X">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </a>
                {/* Wishlist Star */}
          <button 
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-1 -ml-1 text-[#8F9BB3] hover:text-yellow-400 transition-colors focus:outline-none"
            aria-label="Toggle Wishlist"
          >
            <svg className={cn("w-4 h-4 transition-all duration-300", isWishlisted ? "fill-yellow-400 text-yellow-400" : "fill-transparent")} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
              </div>
            </div>

            {/* Bottom Row: Name, Explorer & Copy Address */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8F9BB3] font-medium truncate max-w-[80px]" title={token.name}>
                {token.name}
              </span>
              <span className="text-white/20 text-[10px]">•</span>
              <div className="flex items-center gap-1 group/addr cursor-pointer" onClick={handleCopy}>
                <a
                  href={`${SOLANA_EXPLORER}/token/${tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#8F9BB3] font-mono hover:text-white transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {truncateAddress(tokenAddress, 4)}
                </a>
                <button className="text-[#8F9BB3] opacity-0 group-hover/addr:opacity-100 transition-opacity" title="Copy Address">
                  {copied ? (
                    <svg className="w-3 h-3 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-3 h-3 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT SIDE: Draggable Scroll Stats                                */}
        {/* ----------------------------------------------------------------- */}
        <DraggableScroll className="flex-1 h-full items-center gap-8 pl-6">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">Market cap</span>
            <span className="text-[15px] font-bold text-white tabular-nums tracking-tight whitespace-nowrap">${formatCompact(token.mc || 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">Price</span>
            <span className="text-[15px] font-bold text-[#4ade80] tabular-nums tracking-tight whitespace-nowrap">${token.price ? formatCompact(token.price) : '0.00'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">24H change</span>
            <div className="text-[15px] font-bold tracking-tight whitespace-nowrap">
              <PercentChange value={token.priceChange24hPercent || 0} size="md" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">24H Vol.</span>
            <span className="text-[15px] font-bold text-white tabular-nums tracking-tight whitespace-nowrap">${formatCompact(token.volume24hUSD || 0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">Liquidity</span>
            <span className="text-[15px] font-bold text-white tabular-nums tracking-tight whitespace-nowrap">${formatCompact(token.liquidity || 0)}</span>
          </div>
          <div className="flex flex-col pr-4">
            <span className="text-[11px] text-[#8F9BB3] uppercase tracking-wide mb-0.5 whitespace-nowrap">Holders</span>
            <span className="text-[15px] font-bold text-white tabular-nums tracking-tight whitespace-nowrap">{formatCompact(token.holder || 0)}</span>
          </div>
        </DraggableScroll>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* IMAGE MODAL PORTAL                                                */}
      {/* ----------------------------------------------------------------- */}
      {isModalOpen && (
  <div 
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300"
    onClick={() => setIsModalOpen(false)}
  >
    {/* Card Container */}
    <div 
      className="relative w-full max-w-[400px] bg-[#0A0D14] rounded-[24px] border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200" 
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button (Safely inside the card) */}
      <button 
        onClick={() => setIsModalOpen(false)}
        className="absolute top-4 right-4 z-10 p-2 bg-white/5 hover:bg-white/15 text-[#8F9BB3] hover:text-white rounded-full backdrop-blur-md transition-all"
        aria-label="Close modal"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image Section with Spotlight Gradient */}
      <div className="pt-12 pb-6 px-6 flex justify-center bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="relative group">
          <img 
            src={token.logoURI || '/default-token.png'} 
            alt={`${token.name} Logo`} 
            className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.05)] ring-1 ring-white/10"
          />
        </div>
      </div>
      
      {/* Text & Metadata Section */}
      <div className="px-6 pb-8 flex flex-col items-center text-center space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          {token.name}
        </h2>
        
        {/* Formatted Address Pill */}
        <div className="flex items-center gap-2 bg-[#050505] border border-white/[0.04] py-2 px-3 rounded-xl w-full">
          <span className="text-xs text-[#8F9BB3] uppercase tracking-wider font-semibold">Contract</span>
          <p className="text-[13px] text-white/80 font-mono truncate flex-1 text-right">
            {tokenAddress}
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
});

export default TokenDetail;