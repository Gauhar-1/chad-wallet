'use client';

// =============================================================================
// PriceDisplay — Formatted price with appropriate precision
// =============================================================================

import { memo } from 'react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const PriceDisplay = memo(function PriceDisplay({
  price,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg font-semibold',
    xl: 'text-2xl font-bold',
  };

  return (
    <span className={cn('text-white tabular-nums', sizes[size], className)}>
      {formatPrice(price)}
    </span>
  );
});

export default PriceDisplay;
