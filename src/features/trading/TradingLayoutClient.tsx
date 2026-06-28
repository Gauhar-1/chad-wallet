"use client";

import React, { useState } from 'react';
import TokenDetail from '@/features/trading/TokenDetail';
import PriceChart from '@/features/trading/PriceChart';
import SwapPanel from '@/features/trading/SwapPanel';
import LeftSidebar from '@/features/trading/LeftSidebar';
import BottomDataTabs from '@/features/trading/BottomDataTabs';

interface TradingLayoutClientProps {
  tokenAddress: string;
}

export default function TradingLayoutClient({ tokenAddress }: TradingLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#050505] text-white font-sans tabular-nums selection:bg-white/10">
      
      {/* LEFT PANEL: 
        We removed the hardcoded w-[320px] wrapper. 
        LeftSidebar now fully controls its own dynamic expanding/collapsing width.
      */}
      <LeftSidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      {/* CENTER PANEL: Dynamic Elastic Container */}
      <div className="flex-1 min-w-0 flex flex-col bg-transparent h-full transition-all overflow-y-auto duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
        
        {/* Top Stats Bar */}
        <div className="h-[60px] shrink-0 flex items-center px-6 overflow-x-auto scrollbar-hide bg-transparent">
          <TokenDetail tokenAddress={tokenAddress} />
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 relative w-full h-full min-h-[500px] px-2">
          <PriceChart tokenAddress={tokenAddress} />
        </div>

        {/* Bottom Data Panel */}
        <div className="h-[280px] shrink-0 bg-transparent overflow-hidden px-4 pb-4">
          <BottomDataTabs tokenAddress={tokenAddress} />
        </div>
      </div>

      {/* RIGHT PANEL: Integrated Swap Interface */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 w-[340px] xl:w-[380px] bg-[#050505] h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/[0.05] scrollbar-track-transparent px-2">
        <SwapPanel tokenAddress={tokenAddress} />
      </aside>
    </div>
  );
}