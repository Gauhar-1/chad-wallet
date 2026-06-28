import TradingLayoutClient from '@/features/trading/TradingLayoutClient';

interface TokenTradePageProps {
  params: Promise<{ tokenAddress: string }>;
}

export default async function TokenTradePage({ params }: TokenTradePageProps) {
  const { tokenAddress } = await params;

  // We offload the UI rendering to a Client Component so we can use state and animations
  return <TradingLayoutClient tokenAddress={tokenAddress} />;
}