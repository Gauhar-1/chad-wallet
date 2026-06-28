'use client';

// =============================================================================
// useRecentTrades — Fetch recent trades for a token
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

interface RecentTradesOptions {
  thesisOnly?: boolean;
  friendsOnly?: boolean;
}

async function fetchRecentTrades(address: string, options?: RecentTradesOptions, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (options?.thesisOnly) params.append('thesisOnly', 'true');
  if (options?.friendsOnly) params.append('friendsOnly', 'true');
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/tokens/${address}/trades${queryString}`, { signal });
  if (!response.ok) throw new Error('Failed to fetch recent trades');
  const json = await response.json();
  return json.data?.items || json.data || [];
}

export function useRecentTrades(address: string | undefined, options?: RecentTradesOptions) {
  return useQuery({
    queryKey: ['recent-trades', address, options?.thesisOnly, options?.friendsOnly],
    queryFn: ({ signal }) => fetchRecentTrades(address!, options, signal),
    enabled: !!address,
    staleTime: STALE_TIMES.recentTrades,
    refetchInterval: REFETCH_INTERVALS.recentTrades,
  });
}
