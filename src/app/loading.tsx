'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loading() {
  // Prevent hydration mismatches on initial render
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-screen bg-[#050505] font-sans">
      
      {/* High-Performance 3D CSS Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        .coin-container {
          perspective: 1000px;
        }
        .coin-inner {
          transform-style: preserve-3d;
          /* Custom cubic-bezier for a natural "toss and hang" physical physics feel */
          animation: coinSpin 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        .coin-front, .coin-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .coin-back {
          transform: rotateY(180deg);
        }
        @keyframes coinSpin {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(1.15); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(0.6); opacity: 0.1; }
        }
        .animate-shadow {
          animation: shadowPulse 2.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
      `}} />

      {/* 1. The 3D Spinning Coin Container */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 mb-12 coin-container">
        
        {/* The Rotational Axis */}
        <div className="relative w-full h-full coin-inner">
          
          {/* Front Face: Dark Logo */}
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden coin-front shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 bg-black">
            <Image 
              src="/logo/dark.png" 
              alt="Loading..." 
              fill
              priority
              className="object-contain p-2"
            />
          </div>
          
          {/* Back Face: Light Logo */}
          <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden coin-back shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-black/10 bg-white">
            <Image 
              src="/logo/light.png" 
              alt="Loading..." 
              fill
              priority
              className="object-contain p-2"
            />
          </div>

        </div>

        {/* Dynamic Ground Shadow (Shrinks as the coin "floats" up) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-2 bg-black rounded-[100%] blur-[4px] animate-shadow" />
      </div>

      {/* 2. Fomo-Styled Typography */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {/* Subtle neon network activity indicator */}
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ade80]"></span>
          </div>
          
          {/* Lowercase, tight tracking text */}
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight lowercase">
            syncing trenches.
          </h2>
        </div>
        
        <p className="text-[#a1a1aa] text-sm md:text-base font-medium tracking-tight lowercase">
          establishing secure connection...
        </p>
      </div>

    </div>
  );
}