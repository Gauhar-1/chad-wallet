'use client';

// =============================================================================
// useTokenInfo — Fetch detailed token overview from Codex
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES } from '@/lib/constants';
import type { CodexTokenOverview } from '@/types/token';

async function fetchTokenInfo(address: string, signal?: AbortSignal): Promise<CodexTokenOverview> {
  const response = await fetch(`/api/tokens/${address}/info`, { signal });
  if (!response.ok) throw new Error('Failed to fetch token info');
  const json = await response.json();
  return json.data;
}

export function useTokenInfo(address: string | undefined) {
  return useQuery({
    queryKey: ['token-info', address],
    queryFn: ({ signal }) => fetchTokenInfo(address!, signal),
    enabled: !!address,
    staleTime: STALE_TIMES.tokenInfo,
  });
}
