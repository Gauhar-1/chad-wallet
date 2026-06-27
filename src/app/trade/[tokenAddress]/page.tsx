import TokenDetail from '@/features/trading/TokenDetail';
import PriceChart from '@/features/trading/PriceChart';
import SwapPanel from '@/features/trading/SwapPanel';
import LeftSidebar from '@/features/trading/LeftSidebar';
import BottomDataTabs from '@/features/trading/BottomDataTabs';

interface TokenTradePageProps {
  params: Promise<{ tokenAddress: string }>;
}

export default async function TokenTradePage({ params }: TokenTradePageProps) {
  const { tokenAddress } = await params;

  return (
    <div className="flex h-full overflow-hidden">
      
      {/* Left Panel — Dynamic Split View Sidebar */}
      <LeftSidebar />

      {/* Center Panel — Chart & Data */}
      <div className="flex-1 flex flex-col bg-[#0A0D14] h-full overflow-hidden relative border-r border-white/[0.04] min-w-[400px]">
        {/* Top Stats Bar */}
        <div className="h-[60px] shrink-0 border-b border-white/[0.04] flex items-center overflow-x-auto scrollbar-hide bg-[#0A0D14]">
          <TokenDetail tokenAddress={tokenAddress} />
        </div>
        
        {/* Chart Area */}
        <div className="flex-1 relative min-h-[300px]">
          <PriceChart tokenAddress={tokenAddress} />
        </div>

        {/* Bottom Data Panel */}
        <div className="h-[250px] shrink-0 border-t border-white/[0.04] bg-[#0A0D14]">
          <BottomDataTabs tokenAddress={tokenAddress} />
        </div>
      </div>

      {/* Right Panel — Swap interface */}
      <aside className="hidden md:flex flex-col bg-[#050505] h-full overflow-y-auto scrollbar-thin">
        <SwapPanel tokenAddress={tokenAddress} />
      </aside>
    </div>
  );
}
