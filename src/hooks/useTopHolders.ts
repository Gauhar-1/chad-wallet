'use client';

// =============================================================================
// useTopHolders — Fetch top traders/holders for a token
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchTopHolders(address: string, signal?: AbortSignal) {
  const response = await fetch(`/api/tokens/${address}/holders`, { signal });
  if (!response.ok) throw new Error('Failed to fetch top holders');
  const json = await response.json();
  return json.data?.items || json.data || [];
}

export function useTopHolders(address: string | undefined) {
  return useQuery({
    queryKey: ['top-holders', address],
    queryFn: ({ signal }) => fetchTopHolders(address!, signal),
    enabled: !!address,
    staleTime: STALE_TIMES.topHolders,
    refetchInterval: REFETCH_INTERVALS.topHolders,
  });
}
