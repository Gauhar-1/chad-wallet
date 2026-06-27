'use client';

// =============================================================================
// useRecentTrades — Fetch recent trades for a token
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchRecentTrades(address: string, signal?: AbortSignal) {
  const response = await fetch(`/api/tokens/${address}/trades`, { signal });
  if (!response.ok) throw new Error('Failed to fetch recent trades');
  const json = await response.json();
  return json.data?.items || json.data || [];
}

export function useRecentTrades(address: string | undefined) {
  return useQuery({
    queryKey: ['recent-trades', address],
    queryFn: ({ signal }) => fetchRecentTrades(address!, signal),
    enabled: !!address,
    staleTime: STALE_TIMES.recentTrades,
    refetchInterval: REFETCH_INTERVALS.recentTrades,
  });
}
