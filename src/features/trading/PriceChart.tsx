'use client';

import { useEffect, useRef, useState, memo, useCallback } from 'react';
import {
  createChart,
  type IChartApi,
  ColorType,
  CrosshairMode,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  AreaSeries,
  ISeriesApi,
  createTextWatermark
} from 'lightweight-charts';
import { useTokenOHLCV } from '@/hooks/useTokenOHLCV';
import { ChartSkeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
import type { ChartTimeframe } from '@/types/token';

// =============================================================================
// SVG Icons (Zero Dependency)
// =============================================================================
const Icons = {
  Candles: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l-2 2m4-2l-2-2m6 15V4l-2 2m4-2l-2-2" /></svg>,
  Line: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16" /></svg>,
  Fx: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7h6M8 7l4-4" /></svg>,
  Undo: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>,
  Redo: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" /></svg>,
  Settings: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Fullscreen: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>,
  Camera: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  ChevronDown: () => <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
};

// =============================================================================
// Main Component
// =============================================================================

interface PriceChartProps {
  tokenAddress: string;
}

type ChartType = 'candles' | 'line' | 'area';

const PriceChart = memo(function PriceChart({ tokenAddress }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  // State
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1m');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [isTimeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [isTypeDropdownOpen, setTypeDropdownOpen] = useState(false);

  // Data
  const { data: candles, isLoading } = useTokenOHLCV(tokenAddress, timeframe);

  // ---------------------------------------------------------------------------
  // Chart Initialization & Resizing (ResizeObserver is critical here)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 1. Instantiate Chart
   const chart = createChart(chartContainerRef.current, {
  layout: {
    background: { type: ColorType.Solid, color: '#050505' }, // Matches the surrounding card exactly
    textColor: '#8F9BB3', // Muted blue/gray for axes
    fontSize: 11,
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  grid: {
    vertLines: { 
      color: 'rgba(255, 255, 255, 0.02)', // Ultra-subtle grid
      style: 0, // 0 = Solid (Looks cleaner than dotted in premium dark UIs)
    },
    horzLines: { 
      color: 'rgba(255, 255, 255, 0.02)', 
      style: 0, 
    },
  },
  crosshair: {
    mode: CrosshairMode.Normal,
    vertLine: { 
      color: 'rgba(255, 255, 255, 0.15)', // Slightly brighter for tracking
      width: 1, 
      style: 2, // 2 = Dashed
      labelBackgroundColor: '#1E222D', // Distinct dark panel for the floating time label
    },
    horzLine: { 
      color: 'rgba(255, 255, 255, 0.15)', 
      width: 1, 
      style: 2, 
      labelBackgroundColor: '#1E222D', // Distinct dark panel for the floating price label
    },
  },
  timeScale: {
    borderColor: 'rgba(255, 255, 255, 0.06)',
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true, // Prevents awkward scrolling past the first candle
    fixRightEdge: true, 
    tickMarkFormatter: (time: number) => {
      const date = new Date(time * 1000);
      // Ensures exact "HH:MM" formatting
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },
  },
  rightPriceScale: {
    borderColor: 'rgba(255, 255, 255, 0.06)',
    autoScale: true,
    entireTextOnly: true, // Prevents half-cut price labels at the top/bottom
  },
});


    chartRef.current = chart;

    // 2. ResizeObserver for precise container tracking (handles split panes correctly)
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || entries[0].target !== chartContainerRef.current) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Data Syncing & Series Swapping
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!chartRef.current || !candles || candles.length === 0) return;
    const chart = chartRef.current;

    // 1. DEFENSIVE SANITIZATION: Filter out any malformed candles from the API
    const validCandles = candles.filter(
      c => c && typeof c.time === 'number' && typeof c.close === 'number'
    );

    if (validCandles.length === 0) return;

    // 2. Sort and deduplicate safely
    const sortedCandles = [...validCandles]
      .sort((a, b) => a.time - b.time)
      .filter((c, i, arr) => i === 0 || c.time !== arr[i - 1].time);

    // 3. Map formats with aggressive fallbacks to prevent undefined crashes
    const candleData = sortedCandles.map(c => ({ 
      time: c.time as import('lightweight-charts').UTCTimestamp,
      open: c.open ?? c.close,
      high: c.high ?? c.close,
      low: c.low ?? c.close,
      close: c.close 
    }));
    
    const lineData = sortedCandles.map(c => ({ 
      time: c.time as import('lightweight-charts').UTCTimestamp, 
      value: c.close 
    }));
    
    const volumeData = sortedCandles.map(c => ({
      time: c.time as import('lightweight-charts').UTCTimestamp,
      value: c.volume ?? 0,
      color: (c.close >= (c.open ?? c.close)) ? 'rgba(74, 222, 128, 0.4)' : 'rgba(239, 68, 68, 0.4)',
    }));

    let currentMainSeries: ISeriesApi<any> | null = null;

    // Add selected chart type
    if (chartType === 'candles') {
      currentMainSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#4ade80', downColor: '#f32e2eff', borderVisible: false,
        wickUpColor: '#4ade80', wickDownColor: '#f32e2eff',
      });
      currentMainSeries.setData(candleData);
    } else if (chartType === 'line') {
      currentMainSeries = chart.addSeries(LineSeries, { color: '#3b82f6', lineWidth: 2 });
      currentMainSeries.setData(lineData);
    } else if (chartType === 'area') {
      currentMainSeries = chart.addSeries(AreaSeries, {
        lineColor: '#3b82f6', topColor: 'rgba(59, 130, 246, 0.4)', bottomColor: 'rgba(59, 130, 246, 0.0)', lineWidth: 2,
      });
      currentMainSeries.setData(lineData);
    }

    // Handle Volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: '', 
    });
    volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    // 4. SAFE CLEANUP: Ensure both series are removed before next effect runs (e.g. on token change)
    return () => {
      if (chartRef.current) {
        if (currentMainSeries) {
          try { chartRef.current.removeSeries(currentMainSeries); } catch (e) {}
        }
        try { chartRef.current.removeSeries(volumeSeries); } catch (e) {}
      }
    };
  }, [candles, chartType]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div ref={containerRef} className="flex flex-col w-full h-full bg-transparent min-h-0 relative select-none">

      {/* --- Top Toolbar (TradingView Clone) --- */}
      <div className="flex items-center justify-between px-3 h-10 shrink-0 border-b border-white/[0.04]">

        {/* Left Actions */}
        <div className="flex items-center gap-1">
          {/* Timeframe Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setTimeDropdownOpen(!isTimeDropdownOpen)}
              onBlur={() => setTimeout(() => setTimeDropdownOpen(false), 150)}
              className="flex items-center justify-center px-2 py-1 h-7 text-[12px] font-semibold text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"
            >
              {timeframe} <Icons.ChevronDown />
            </button>
            {isTimeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-24 bg-[#1E222D] border border-white/10 rounded shadow-xl z-50 py-1">
                {['1m', '5m', '15m', '1H', '4H', '1D'].map(tf => (
                  <div key={tf} onClick={() => setTimeframe(tf as ChartTimeframe)} className="px-3 py-1.5 text-xs text-[#8F9BB3] hover:text-white hover:bg-[#2A2E39] cursor-pointer">
                    {tf}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-white/[0.08] mx-1" />

          {/* Chart Type Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setTypeDropdownOpen(!isTypeDropdownOpen)}
              onBlur={() => setTimeout(() => setTypeDropdownOpen(false), 150)}
              className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"
            >
              {chartType === 'candles' ? <Icons.Candles /> : <Icons.Line />}
            </button>
            {isTypeDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-[#1E222D] border border-white/10 rounded shadow-xl z-50 py-1">
                <div onClick={() => setChartType('candles')} className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#8F9BB3] hover:text-white hover:bg-[#2A2E39] cursor-pointer"><Icons.Candles /> Candles</div>
                <div onClick={() => setChartType('line')} className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#8F9BB3] hover:text-white hover:bg-[#2A2E39] cursor-pointer"><Icons.Line /> Line</div>
                <div onClick={() => setChartType('area')} className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#8F9BB3] hover:text-white hover:bg-[#2A2E39] cursor-pointer"><Icons.Line /> Area</div>
              </div>
            )}
          </div>

          {/* Indicators Button */}
          <button className="flex items-center gap-1.5 px-2 py-1 h-7 text-[12px] font-medium text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors">
            <Icons.Fx /> Indicators
          </button>

          <button className="flex items-center px-2 py-1 h-7 text-[12px] font-medium text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors">
            Price / MCap
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"><Icons.Undo /></button>
          <button className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"><Icons.Redo /></button>
          <div className="w-px h-4 bg-white/[0.08] mx-1" />
          <button className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"><Icons.Settings /></button>
          <button className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"><Icons.Fullscreen /></button>
          <button className="flex items-center justify-center w-8 h-7 text-[#8F9BB3] hover:text-white hover:bg-white/[0.05] rounded transition-colors"><Icons.Camera /></button>
        </div>
      </div>

      {/* --- Main Chart Area --- */}
      <div className="flex-1 relative min-h-0 w-full bg-transparent">

        {/* Placeholder Legend (Static representation of OHLC values) */}
        <div className="absolute top-2 left-3 z-10 text-[11px] font-mono pointer-events-none flex items-center gap-2">
          <span className="text-[#4ade80]">O<span className="text-white ml-0.5">$343.8K</span></span>
          <span className="text-[#4ade80]">H<span className="text-white ml-0.5">$347.7K</span></span>
          <span className="text-[#4ade80]">L<span className="text-white ml-0.5">$341.9K</span></span>
          <span className="text-[#4ade80]">C<span className="text-white ml-0.5">$347.7K</span></span>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 z-20 bg-transparent"><ChartSkeleton /></div>
        ) : !candles || candles.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-[#8F9BB3] text-sm z-20 pointer-events-none">
            No chart data available for this timeframe
          </div>
        ) : null}

        <div ref={chartContainerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* --- Bottom Toolbar (Overlays) --- */}
      <div className="flex items-center gap-4 px-3 h-10 shrink-0 border-t border-white/[0.04] bg-[#050505]">
        <span className="text-[11px] font-semibold text-[#8F9BB3]">Chart overlays</span>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded-sm bg-transparent border-[#4ade80] text-[#3b82f6] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
            <span className="text-[11px] text-[#8F9BB3] group-hover:text-white transition-colors">My swaps</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded-sm bg-transparent border-[#4ade80] text-[#3b82f6] focus:ring-0 focus:ring-offset-0 cursor-pointer" />
            <span className="text-[11px] text-[#8F9BB3] group-hover:text-white transition-colors">Thesis</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input type="checkbox" className="w-3.5 h-3.5 rounded-sm bg-transparent border-white/20 focus:ring-0 focus:ring-offset-0 cursor-pointer" />
            <span className="text-[11px] text-[#8F9BB3] group-hover:text-white transition-colors">Friends only</span>
          </label>
        </div>

        <div className="w-px h-4 bg-white/[0.08]" />

        <label className="flex items-center gap-1.5 cursor-pointer group">
          <svg className="w-3.5 h-3.5 text-[#8F9BB3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <span className="text-[11px] text-[#8F9BB3] group-hover:text-white transition-colors">Min size (&gt;$1K)</span>
        </label>
      </div>

    </div>
  );
});

export default PriceChart;