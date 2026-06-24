import TokenDetail from '@/features/trading/TokenDetail';
import PriceChart from '@/features/trading/PriceChart';
import TopHolders from '@/features/trading/TopHolders';
import RecentTrades from '@/features/trading/RecentTrades';
import SwapPanel from '@/features/trading/SwapPanel';

interface TokenTradePageProps {
  params: Promise<{ tokenAddress: string }>;
}

export default async function TokenTradePage({ params }: TokenTradePageProps) {
  const { tokenAddress } = await params;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Middle Panel — Token detail, chart, holders, trades */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <TokenDetail tokenAddress={tokenAddress} />
        <PriceChart tokenAddress={tokenAddress} />
        <TopHolders tokenAddress={tokenAddress} />
        <RecentTrades tokenAddress={tokenAddress} />
      </div>

      {/* Right Panel — Swap interface (hidden on mobile) */}
      <aside className="hidden md:flex w-[360px] shrink-0 border-l border-white/[0.04] bg-[#0a0e1a] flex-col">
        <SwapPanel tokenAddress={tokenAddress} />
      </aside>
    </div>
  );
}
