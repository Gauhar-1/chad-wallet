'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] font-sans overflow-hidden selection:bg-[#4ade80] selection:text-black">
      
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatError {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-float-error {
          animation: floatError 8s ease-in-out infinite;
          will-change: transform;
        }
      `}} />

      {/* Ambient Deep-Red Error Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-red-500/[0.03] blur-[100px] pointer-events-none rounded-full" />
      
      {/* Subtle Grid overlay for depth */}
      <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-[0.02] mix-blend-screen pointer-events-none" />

      <div className={`relative z-10 flex flex-col items-center text-center transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Massive Floating 404 */}
        <div className="relative mb-2 animate-float-error">
          <h1 className="text-[10rem] md:text-[16rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent tracking-tighter leading-none select-none">
            404
          </h1>
        </div>

        {/* Thematic Typography */}
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight lowercase mb-4 drop-shadow-md">
          you got liquidated.
        </h2>
        
        <p className="text-[#a1a1aa] text-base md:text-lg font-medium tracking-tight lowercase max-w-sm mb-10">
          the page you're looking for doesn't exist in the trenches. it may have been moved or rugged.
        </p>

        {/* Premium CTA Button matching the Hero section */}
        <Link href="/" className="group inline-block">
          <button className="relative overflow-hidden flex items-center justify-center px-8 py-4 bg-[#4ade80] text-black text-[15px] font-bold rounded-2xl transition-all duration-300 hover:bg-[#3ac16d] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              retreat to base
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </Link>
      </div>

    </div>
  );
}