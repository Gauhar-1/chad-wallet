// =============================================================================
// Validators — Zod schemas for all API input validation
// =============================================================================

import { z } from 'zod';

/** Validates a Solana base58 address (32-44 chars) */
export const solanaAddressSchema = z
  .string()
  .min(32, 'Address too short')
  .max(44, 'Address too long')
  .regex(/^[1-9A-HJ-NP-Za-km-z]+$/, 'Invalid Solana address format');

/** Validates pagination parameters */
export const paginationSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** Validates chart timeframe */
export const timeframeSchema = z.enum(['1m', '5m', '15m', '1H', '4H', '1D']);

/** Validates trade type filter */
export const tradeTypeSchema = z.enum(['swap', 'add', 'remove', 'all']).default('swap');

/** Validates top traders sort field */
export const topTradersSortSchema = z.enum([
  'total_pnl',
  'unrealized_pnl',
  'realized_pnl',
  'volume_usd',
]).default('volume_usd');

/** Validates time frame for top traders */
export const timeFrameSchema = z.enum(['30m', '1h', '2h', '4h', '6h', '8h', '12h', '24h', '2d', '3d', '7d', '14d', '30d', '90d']).default('24h');

/** Validates swap quote request */
export const swapQuoteSchema = z.object({
  inputMint: solanaAddressSchema,
  outputMint: solanaAddressSchema,
  amount: z.string().regex(/^\d+$/, 'Amount must be a numeric string (in base units)'),
  slippageBps: z.coerce.number().int().min(1).max(5000).default(100),
});

/** Validates swap execute request */
export const swapExecuteSchema = z.object({
  quoteResponse: z.record(z.string(), z.unknown()),
  userPublicKey: solanaAddressSchema,
  csrfToken: z.string().min(1, 'CSRF token required'),
});

/** Validates token price batch request (comma-separated addresses) */
export const tokenPriceBatchSchema = z.object({
  addresses: z
    .string()
    .min(1)
    .transform((val) => val.split(','))
    .pipe(z.array(solanaAddressSchema).min(1).max(100)),
});

/** Validates trending tokens sort */
export const trendingSortSchema = z.enum([
  'rank',
  'liquidity',
  'volume24hUSD',
  'priceChange24hPercent',
]).default('rank');
