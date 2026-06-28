'use client';

// =============================================================================
// useTopHolders — Fetch top traders/holders for a token
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

interface TopHoldersOptions {
  thesisOnly?: boolean;
  friendsOnly?: boolean;
}

async function fetchTopHolders(address: string, options?: TopHoldersOptions, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (options?.thesisOnly) params.append('thesisOnly', 'true');
  if (options?.friendsOnly) params.append('friendsOnly', 'true');
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/tokens/${address}/holders${queryString}`, { signal });
  if (!response.ok) throw new Error('Failed to fetch top holders');
  const json = await response.json();
  return json.data?.items || json.data || [];
}

export function useTopHolders(address: string | undefined, options?: TopHoldersOptions) {
  return useQuery({
    queryKey: ['top-holders', address, options?.thesisOnly, options?.friendsOnly],
    queryFn: ({ signal }) => fetchTopHolders(address!, options, signal),
    enabled: !!address,
    staleTime: STALE_TIMES.topHolders,
    refetchInterval: REFETCH_INTERVALS.topHolders,
  });
}
