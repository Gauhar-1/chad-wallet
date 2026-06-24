'use client';

// =============================================================================
// useTokenPrice — Fetch a single token's price
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchTokenPrice(address: string) {
  const response = await fetch(`/api/tokens/price?addresses=${address}`);
  if (!response.ok) throw new Error('Failed to fetch token price');
  const json = await response.json();
  return json.data;
}

export function useTokenPrice(address: string | undefined) {
  return useQuery({
    queryKey: ['token-price', address],
    queryFn: () => fetchTokenPrice(address!),
    enabled: !!address,
    staleTime: STALE_TIMES.price,
    refetchInterval: REFETCH_INTERVALS.price,
  });
}
