// =============================================================================
// Constants — App-wide configuration values
// =============================================================================

/** Solana native SOL mint address */
export const SOL_MINT = 'So11111111111111111111111111111111111111112';

/** USDC on Solana */
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

/** USDT on Solana */
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

/** Default tokens to show in banners when API hasn't loaded */
export const DEFAULT_BANNER_TOKENS = [
  { address: SOL_MINT, symbol: 'SOL', name: 'Solana' },
  { address: USDC_MINT, symbol: 'USDC', name: 'USD Coin' },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', symbol: 'JUP', name: 'Jupiter' },
  { address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', symbol: 'WIF', name: 'dogwifhat' },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', symbol: 'BONK', name: 'Bonk' },
  { address: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof', symbol: 'RNDR', name: 'Render' },
];

/** Codex GraphQL API base URL */
export const CODEX_API_BASE = 'https://graph.codex.io/graphql';

/** Codex Solana Network ID */
export const SOLANA_NETWORK_ID = 1399811149;

/** Jupiter API v1 base URL */
export const JUPITER_API_BASE = 'https://api.jup.ag/swap/v1';

/** App store links */
export const APP_LINKS = {
  ios: 'https://apps.apple.com/us/app/chadwallet/id6757367474',
  android: 'https://play.google.com/store/apps/details?id=xyz.chadwallet.www',
} as const;

/** Solana explorer base URL */
export const SOLANA_EXPLORER = 'https://solscan.io';

/** Default slippage basis points */
export const DEFAULT_SLIPPAGE_BPS = 100; // 1%

/** Max slippage basis points */
export const MAX_SLIPPAGE_BPS = 5000; // 50%

/** React Query stale times (ms) */
export const STALE_TIMES = {
  trending: 60_000,       // 60s
  price: 15_000,          // 15s
  tokenInfo: 300_000,     // 5min
  topHolders: 120_000,    // 2min
  recentTrades: 10_000,   // 10s
  ohlcv: 30_000,          // 30s
  positions: 30_000,      // 30s
} as const;

/** React Query refetch intervals (ms) */
export const REFETCH_INTERVALS = {
  trending: 60_000,
  price: 15_000,
  topHolders: 120_000,
  recentTrades: 15_000,
  ohlcv: 30_000,
  positions: 30_000,
} as const;

/** Chart timeframe labels */
export const CHART_TIMEFRAMES = [
  { value: '1m', label: '1M' },
  { value: '5m', label: '5M' },
  { value: '15m', label: '15M' },
  { value: '1H', label: '1H' },
  { value: '4H', label: '4H' },
  { value: '1D', label: '1D' },
] as const;

/** Breakpoints matching Tailwind defaults */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
