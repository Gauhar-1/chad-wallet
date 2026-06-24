'use client';

// =============================================================================
// PercentChange — Colored percentage change badge
// =============================================================================

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { formatPercent } from '@/lib/utils';

interface PercentChangeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const PercentChange = memo(function PercentChange({
  value,
  size = 'sm',
  showIcon = true,
  className,
}: PercentChangeProps) {
  const isPositive = value >= 0;

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 font-medium rounded-md tabular-nums',
        isPositive
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-red-500/15 text-red-400',
        sizes[size],
        className
      )}
    >
      {showIcon && (
        <span className="text-[0.7em]">{isPositive ? '▲' : '▼'}</span>
      )}
      {formatPercent(value)}
    </span>
  );
});

export default PercentChange;
