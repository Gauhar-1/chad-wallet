'use client';

// =============================================================================
// useTokenInfo — Fetch detailed token overview from Codex
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES } from '@/lib/constants';
import type { CodexTokenOverview } from '@/types/token';

async function fetchTokenInfo(address: string): Promise<CodexTokenOverview> {
  const response = await fetch(`/api/tokens/${address}/info`);
  if (!response.ok) throw new Error('Failed to fetch token info');
  const json = await response.json();
  return json.data;
}

export function useTokenInfo(address: string | undefined) {
  return useQuery({
    queryKey: ['token-info', address],
    queryFn: () => fetchTokenInfo(address!),
    enabled: !!address,
    staleTime: STALE_TIMES.tokenInfo,
  });
}
