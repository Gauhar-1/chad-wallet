'use client';

// =============================================================================
// useTokenOHLCV — Fetch OHLCV chart data for TradingView
// =============================================================================

import { useQuery } from '@tanstack/react-query';
import { STALE_TIMES, REFETCH_INTERVALS } from '@/lib/constants';
import type { ChartCandle, ChartTimeframe } from '@/types/token';

async function fetchOHLCV(
  address: string,
  timeframe: ChartTimeframe
): Promise<ChartCandle[]> {
  const response = await fetch(
    `/api/tokens/${address}/ohlcv?timeframe=${timeframe}`
  );
  if (!response.ok) throw new Error('Failed to fetch OHLCV data');
  const json = await response.json();
  const items = json.data?.items || json.data || [];

  return items.map((item: Record<string, number>) => ({
    time: item.unixTime || item.time,
    open: item.o || item.open,
    high: item.h || item.high,
    low: item.l || item.low,
    close: item.c || item.close,
  }));
}

export function useTokenOHLCV(
  address: string | undefined,
  timeframe: ChartTimeframe = '1H'
) {
  return useQuery({
    queryKey: ['ohlcv', address, timeframe],
    queryFn: () => fetchOHLCV(address!, timeframe),
    enabled: !!address,
    staleTime: STALE_TIMES.ohlcv,
    refetchInterval: REFETCH_INTERVALS.ohlcv,
  });
}
