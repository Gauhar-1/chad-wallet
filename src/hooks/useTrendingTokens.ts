'use client';

// =============================================================================
// useTrendingTokens — Fetch trending tokens from BirdEye via our API proxy
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchTrendingTokens() {
  const response = await fetch('/api/tokens/trending');
  if (!response.ok) throw new Error('Failed to fetch trending tokens');
  const json = await response.json();
  return json.data?.tokens || json.data?.items || json.data || [];
}

export function useTrendingTokens() {
  return useQuery({
    queryKey: ['trending-tokens'],
    queryFn: fetchTrendingTokens,
    staleTime: STALE_TIMES.trending,
    refetchInterval: REFETCH_INTERVALS.trending,
  });
}
