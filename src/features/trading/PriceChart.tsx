'use client';

// =============================================================================
// PriceChart — TradingView Lightweight Charts candlestick chart
// =============================================================================

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import { createChart, type IChartApi, ColorType, CrosshairMode, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { useTokenOHLCV } from '@/hooks/useTokenOHLCV';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { CHART_TIMEFRAMES } from '@/lib/constants';
import type { ChartTimeframe } from '@/types/token';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  tokenAddress: string;
}

const PriceChart = memo(function PriceChart({ tokenAddress }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1H');

  const { data: candles, isLoading } = useTokenOHLCV(tokenAddress, timeframe);

  const handleTimeframeChange = useCallback((tf: ChartTimeframe) => {
    setTimeframe(tf);
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current || !candles || candles.length === 0) return;

    // Remove previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: '#0A0D14' },
        textColor: '#8F9BB3',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.02)' },
        horzLines: { color: 'rgba(255,255,255,0.02)' },
      },
      crosshair: {
        mode: 1, // CrosshairMode.Normal
        vertLine: {
          color: '#4ade80',
          width: 1,
          style: 3,
        },
        horzLine: {
          color: '#4ade80',
          width: 1,
          style: 3,
        },
      },
      timeScale: {
        borderColor: 'rgba(255,255,255,0.06)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255,255,255,0.06)',
      },
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',
      downColor: '#ef4444',
      borderUpColor: '#4ade80',
      borderDownColor: '#ef4444',
      wickUpColor: '#4ade80',
      wickDownColor: '#ef4444',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // Sort candles by time and deduplicate
    const sortedCandles = [...candles]
      .sort((a, b) => a.time - b.time)
      .filter((c, i, arr) => i === 0 || c.time !== arr[i - 1].time);

    // Map to CandlestickData
    const candleData = sortedCandles.map(c => ({
      ...c,
      time: c.time as import('lightweight-charts').UTCTimestamp,
    }));

    // Map to HistogramData for Volume
    const volumeData = sortedCandles.map(c => ({
      time: c.time as import('lightweight-charts').UTCTimestamp,
      value: c.volume || 0,
      color: c.close >= c.open ? 'rgba(74, 222, 128, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));

    candlestickSeries.setData(candleData);
    volumeSeries.setData(volumeData);
    
    chart.timeScale().fitContent();

    chartRef.current = chart;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [candles]);

  return (
    <div className="border-b border-white/[0.04]">
      {/* Timeframe selector */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.04]">
        {CHART_TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => handleTimeframeChange(tf.value as ChartTimeframe)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-lg transition-all',
              timeframe === tf.value
                ? 'bg-amber-500/15 text-amber-400'
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="px-4 py-2">
        {isLoading ? (
          <ChartSkeleton />
        ) : !candles || candles.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center text-gray-500 text-sm">
            No chart data available for this token
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full" />
        )}
      </div>
    </div>
  );
});

export default PriceChart;
