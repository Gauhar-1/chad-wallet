// =============================================================================
// Trade Types — Swap, trade history, and position representations
// =============================================================================

/** Raw trade from Codex txs/token endpoint */
export interface CodexTrade {
  txHash: string;
  blockUnixTime: number;
  source: string;
  owner: string;
  from: {
    address: string;
    symbol: string;
    decimals: number;
    amount: number;
    uiAmount: number;
    price: number | null;
    nearestPrice: number;
  };
  to: {
    address: string;
    symbol: string;
    decimals: number;
    amount: number;
    uiAmount: number;
    price: number | null;
    nearestPrice: number;
  };
  side: 'buy' | 'sell';
  volumeUSD: number;
}

/** Raw top trader from Codex */
export interface CodexTopTrader {
  owner: string;
  tags?: string[];
  volume_usd: number;
  trade_count: number;
  total_pnl: number;
  unrealized_pnl: number;
  realized_pnl: number;
}

/** Normalized trade for display */
export interface Trade {
  txHash: string;
  timestamp: number;
  side: 'buy' | 'sell';
  tokenSymbol: string;
  amount: number;
  priceUSD: number;
  volumeUSD: number;
  wallet: string;
  source: string;
}

/** Normalized top holder/trader for display */
export interface TopTrader {
  wallet: string;
  tags: string[];
  volumeUSD: number;
  tradeCount: number;
  totalPnL: number;
  unrealizedPnL: number;
  realizedPnL: number;
}

/** Jupiter swap quote response */
export interface JupiterQuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
      feeAmount: string;
      feeMint: string;
    };
    percent: number;
  }>;
  contextSlot: number;
  timeTaken: number;
}

/** Jupiter swap transaction response */
export interface JupiterSwapResponse {
  swapTransaction: string; // base64 encoded versioned transaction
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

/** Swap request params */
export interface SwapParams {
  inputMint: string;
  outputMint: string;
  amount: string; // in lamports/base units
  slippageBps: number;
  userPublicKey: string;
}

/** User token position */
export interface TokenPosition {
  mint: string;
  symbol: string;
  name: string;
  logoURI: string | null;
  balance: number;
  uiBalance: number;
  decimals: number;
  priceUSD: number;
  valueUSD: number;
}
