'use client';

// =============================================================================
// TokenIcon — Token logo with fallback to letter avatar
// =============================================================================

import { useState, useMemo, memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TokenIconProps {
  logoURI: string | null | undefined;
  symbol: string;
  size?: number;
  className?: string;
}

const TokenIcon = memo(function TokenIcon({
  logoURI,
  symbol,
  size = 32,
  className,
}: TokenIconProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackColor = useMemo(() => {
    // Generate a consistent color from the symbol
    let hash = 0;
    for (let i = 0; i < symbol.length; i++) {
      hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 60%, 45%)`;
  }, [symbol]);

  if (!logoURI || hasError) {
    return (
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-bold text-white shrink-0',
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: fallbackColor,
          fontSize: size * 0.4,
        }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <Image
      src={logoURI}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className={cn('rounded-full shrink-0', className)}
      onError={() => setHasError(true)}
      unoptimized // External URLs may not be in remotePatterns
    />
  );
});

export default TokenIcon;
