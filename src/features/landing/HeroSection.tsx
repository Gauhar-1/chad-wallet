'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  // Use mounted state to ensure animations only trigger after hydration, preventing flicker
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative w-full h-[120vh] min-h-[850px] md:min-h-[1000px] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      
      {/* 1. HARDWARE ACCELERATED ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slowZoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom { animation: slowZoom 25s ease-in-out infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in-up { 
          opacity: 0; 
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}} />

      {/* 2. THE SUN BACKGROUND (Z-index 0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/assets/sun.jpg" 
          alt="Blazing Sun Background" 
          // Added slow-zoom for a "breathing" background effect
          className="w-full h-full object-cover object-left opacity-90 animate-slow-zoom origin-center will-change-transform"
        />
      </div>

      {/* 3. THE BLUR & SHADOW GRADIENTS (Z-index 10) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b md:bg-gradient-to-r from-black/50 via-black/30 to-black/90 md:from-transparent md:via-black/40 md:to-black/90 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none" />

      {/* 4. THE FOREGROUND CHARACTER (Z-index 20) */}
      <div className={`absolute bottom-0 right-0 md:-right-60 md:-bottom-5 z-20 w-[110%] sm:w-[85%] md:w-[65%] max-w-[1000px] pointer-events-none flex justify-end translate-y-[5%] md:translate-y-0 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Wrapped in a float animation container to separate movement from structural positioning */}
        <div className="w-full h-full animate-float will-change-transform">
          <img 
            src="/assets/hero-character.png" 
            alt="Chad cooking on spaceship balcony" 
            className="w-full h-auto object-contain drop-shadow-[0_-20px_40px_rgba(0,0,0,0.9)]"
          />
        </div>
      </div>

      {/* 5. THE TYPOGRAPHY & BUTTONS (Z-index 30) */}
      <div className="relative z-30 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-[-20vh] md:mt-[-10vh]">
        
        {/* Main Logo Text - Stagger 1 */}
        <h1 
          className="text-[4.5rem] sm:text-[7rem] md:text-[10rem] font-extrabold tracking-tighter leading-none mb-2 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          chad
        </h1>

        {/* Primary Subtitle - Stagger 2 */}
        <h2 
          className="text-xl sm:text-3xl md:text-4xl font-medium tracking-tight text-gray-200 mb-3 drop-shadow-md animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          where traders become legends.
        </h2>

        {/* Secondary Subtitle - Stagger 3 */}
        <p 
          className="text-sm sm:text-lg text-gray-400 font-normal max-w-xl md:max-w-2xl mb-8 drop-shadow animate-fade-in-up"
          style={{ animationDelay: '500ms' }}
        >
          From memecoins to viral tokens, trade any crypto in seconds.
        </p>

        {/* CTA Buttons - Stagger 4 */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto px-6 sm:px-0 animate-fade-in-up"
          style={{ animationDelay: '700ms' }}
        >
          <Link href="/trade" className="w-full sm:w-auto group">
            {/* Added active:scale-95 for tactile click feedback and an inner shadow glow */}
            <button className="relative overflow-hidden flex items-center justify-center w-full sm:min-w-[200px] px-8 py-4 bg-[#4ade80] text-black text-base font-bold rounded-2xl transition-all duration-300 hover:bg-[#3ac16d] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_30px_rgba(74,222,128,0.4)]">
              <span className="relative z-10">Start trading</span>
              {/* Subtle sweeping shine effect on hover */}
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>
          </Link>
          <a href="#download" className="w-full sm:w-auto">
            {/* Added active:scale-95 and refined border transitions */}
            <button className="flex items-center justify-center w-full sm:min-w-[200px] px-8 py-4 bg-white/5 text-white text-base font-medium rounded-2xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              Download app
            </button>
          </a>
        </div>
      </div>

      {/* Button Shine Keyframe (Scoped globally if preferred, but defined here for portability) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}