'use client';

// =============================================================================
// useRecentTrades — Fetch recent trades for a token
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchRecentTrades(address: string) {
  const response = await fetch(`/api/tokens/${address}/trades`);
  if (!response.ok) throw new Error('Failed to fetch recent trades');
  const json = await response.json();
  return json.data?.items || json.data || [];
}

export function useRecentTrades(address: string | undefined) {
  return useQuery({
    queryKey: ['recent-trades', address],
    queryFn: () => fetchRecentTrades(address!),
    enabled: !!address,
    staleTime: STALE_TIMES.recentTrades,
    refetchInterval: REFETCH_INTERVALS.recentTrades,
  });
}
