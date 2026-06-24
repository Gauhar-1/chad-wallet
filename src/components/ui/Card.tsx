'use client';

// =============================================================================
// Card — Glassmorphism card with optional glow border
// =============================================================================

import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glow';
  noPadding?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', noPadding = false, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/[0.03] border border-white/[0.06]',
      elevated:
        'bg-white/[0.05] border border-white/[0.08] shadow-xl shadow-black/20',
      outlined: 'bg-transparent border border-white/[0.1]',
      glow: 'bg-white/[0.03] border border-amber-500/20 shadow-lg shadow-amber-500/5',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl backdrop-blur-sm transition-all duration-300',
          variants[variant],
          !noPadding && 'p-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
export default Card;
