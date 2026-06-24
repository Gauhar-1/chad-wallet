'use client';

// =============================================================================
// useSwapQuote — Debounced Jupiter swap quote
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface SwapQuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
}

async function fetchSwapQuote(params: SwapQuoteParams) {
  const queryParams = new URLSearchParams({
    inputMint: params.inputMint,
    outputMint: params.outputMint,
    amount: params.amount,
    slippageBps: params.slippageBps.toString(),
  });

  const response = await fetch(`/api/swap/quote?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch swap quote');
  return response.json();
}

export function useSwapQuote(params: SwapQuoteParams | null) {
  const debouncedParams = useDebounce(params, 500);

  return useQuery({
    queryKey: ['swap-quote', debouncedParams],
    queryFn: () => fetchSwapQuote(debouncedParams!),
    enabled:
      !!debouncedParams &&
      !!debouncedParams.inputMint &&
      !!debouncedParams.outputMint &&
      !!debouncedParams.amount &&
      debouncedParams.amount !== '0',
    staleTime: 0, // Always fresh quotes
    gcTime: 30_000,
    retry: 1,
  });
}
