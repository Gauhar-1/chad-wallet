'use client';

// =============================================================================
// Skeleton — Shimmer loading placeholder
// =============================================================================

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-white/[0.06]',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
}

/** Pre-built skeleton for a token list item */
export function TokenListSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton variant="circular" width={36} height={36} />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={10} />
      </div>
      <div className="text-right space-y-2">
        <Skeleton width={60} height={14} />
        <Skeleton width={40} height={10} />
      </div>
    </div>
  );
}

/** Pre-built skeleton for a chart area */
export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] rounded-xl bg-white/[0.02] flex items-center justify-center">
      <div className="text-gray-600 animate-pulse">Loading chart...</div>
    </div>
  );
}

/** Pre-built skeleton for a table row */
export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  const [mounted, setMounted] = useState(false);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    setWidths(Array.from({ length: cols }).map(() => Math.random() * 40 + 40));
    setMounted(true);
  }, [cols]);

  if (!mounted) {
    // Return placeholder with safe default widths during SSR
    return (
      <div className="flex items-center gap-4 p-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} width="60%" height={14} className="flex-1" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3">
      {widths.map((w, i) => (
        <Skeleton key={i} width={`${w}%`} height={14} className="flex-1" />
      ))}
    </div>
  );
}
