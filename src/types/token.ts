// =============================================================================
// Token Types — BirdEye API response shapes and internal token representations
// =============================================================================

/** Raw token data from Codex trending endpoint */
export interface CodexTrendingToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string | null;
  liquidity: number;
  price: number;
  priceChange24hPercent: number;
  volume24hUSD: number;
  mc: number; // market cap
  rank: number;
}

/** Raw token price from Codex price endpoint */
export interface CodexTokenPrice {
  value: number;
  updateUnixTime: number;
  updateHumanTime: string;
  priceChange24h: number;
}

/** Raw token overview from Codex */
export interface CodexTokenOverview {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string | null;
  price: number;
  priceChange24hPercent: number;
  priceChange1hPercent: number;
  liquidity: number;
  mc: number;
  supply: number;
  holder: number;
  volume24hUSD: number;
  trade24h: number;
  buy24h: number;
  sell24h: number;
  uniqueWallet24h: number;
  extensions?: {
    website?: string;
    twitter?: string;
    telegram?: string;
    discord?: string;
    description?: string;
  };
}

/** OHLCV candle data from Codex */
export interface CodexOHLCV {
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
  unixTime: number;
  address: string;
  type: string;
}

/** Normalized token for internal use */
export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string | null;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
}

/** Token for banner display */
export interface BannerToken {
  address: string;
  symbol: string;
  logoURI: string | null;
  price: number;
  priceChange24h: number;
}

/** OHLCV candle for TradingView chart */
export interface ChartCandle {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Chart timeframe options */
export type ChartTimeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D';

/** Token search result */
export interface TokenSearchResult {
  address: string;
  symbol: string;
  name: string;
  logoURI: string | null;
  price: number;
  priceChange24h: number;
  volume24h: number;
}
