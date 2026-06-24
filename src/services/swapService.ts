// =============================================================================
// Jupiter Service — Server-side API client for Solana token swaps (v1)
// =============================================================================

import { JUPITER_API_BASE } from '@/lib/constants';
import type { JupiterQuoteResponse, JupiterSwapResponse } from '@/types/trade';

const API_KEY = process.env.JUPITER_API_KEY || '';

const headers: HeadersInit = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

/**
 * Get a swap quote from Jupiter.
 */
export async function getSwapQuote(params: {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
}): Promise<JupiterQuoteResponse> {
  const url = new URL(`${JUPITER_API_BASE}/quote`);
  url.searchParams.set('inputMint', params.inputMint);
  url.searchParams.set('outputMint', params.outputMint);
  url.searchParams.set('amount', params.amount);
  url.searchParams.set('slippageBps', params.slippageBps.toString());

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jupiter quote error: ${response.status} — ${errorText}`);
  }

  return response.json();
}

/**
 * Build a swap transaction from a quote response.
 * Returns a serialized versioned transaction for client-side signing.
 */
export async function buildSwapTransaction(params: {
  quoteResponse: JupiterQuoteResponse;
  userPublicKey: string;
  wrapUnwrapSOL?: boolean;
  dynamicComputeUnitLimit?: boolean;
  prioritizationFeeLamports?: number | 'auto';
}): Promise<JupiterSwapResponse> {
  const response = await fetch(`${JUPITER_API_BASE}/swap`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      quoteResponse: params.quoteResponse,
      userPublicKey: params.userPublicKey,
      wrapAndUnwrapSol: params.wrapUnwrapSOL ?? true,
      dynamicComputeUnitLimit: params.dynamicComputeUnitLimit ?? true,
      prioritizationFeeLamports: params.prioritizationFeeLamports ?? 'auto',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Jupiter swap error: ${response.status} — ${errorText}`);
  }

  return response.json();
}
