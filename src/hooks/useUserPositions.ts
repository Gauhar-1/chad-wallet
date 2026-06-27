'use client';

// =============================================================================
// useUserPositions — Fetch user's SPL token balances
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';

async function fetchUserPositions(walletAddress: string, signal?: AbortSignal) {
  const response = await fetch(`/api/user/positions?address=${walletAddress}`, { signal });
  if (!response.ok) return [];
  const json = await response.json();
  return json.data || [];
}

export function useUserPositions(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['user-positions', walletAddress],
    queryFn: ({ signal }) => fetchUserPositions(walletAddress!, signal),
    enabled: !!walletAddress,
    staleTime: STALE_TIMES.positions,
    refetchInterval: REFETCH_INTERVALS.positions,
  });
}
