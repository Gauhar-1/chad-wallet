'use client';

import { useEffect, useState, useRef, memo } from 'react';

// =============================================================================
// Custom Hook for smooth number counting
// =============================================================================
function useCountUp(end: number, duration = 2000, enabled = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, enabled]);

  return count;
}

// =============================================================================
// Premium StatsBar Component
// =============================================================================
const StatsBar = memo(function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      // Trigger slightly earlier so the animation starts right as it enters the viewport
      { threshold: 0.2 } 
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const volume = useCountUp(2400, 2500, isVisible);
  const traders = useCountUp(50000, 2500, isVisible);
  const tokens = useCountUp(10000, 2500, isVisible);

  return (
    // Added a subtle dark gradient backdrop to separate it from the main sections
    <section 
      ref={ref} 
      className="relative z-30 w-full py-16 md:py-24 px-4 sm:px-6 border-y border-white/10 bg-gradient-to-b from-black via-white/[0.02] to-black overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 relative z-10">
        
        {/* STAT 1: Total Volume */}
        {/* Staggered entrance: delay-100 */}
        <div 
          className={`group flex flex-col items-center justify-center p-8 rounded-3xl border border-transparent transition-all duration-700 delay-100 hover:bg-white/5 hover:border-white/10 hover:shadow-[0_0_40px_rgba(74,222,128,0.05)] hover:-translate-y-1 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-[#4ade80] transition-all duration-500">
            ${volume.toLocaleString()}M+
          </div>
          <div className="text-sm md:text-base text-gray-500 font-medium tracking-wide uppercase mt-3 group-hover:text-gray-300 transition-colors">
            Total Volume
          </div>
        </div>

        {/* STAT 2: Active Traders */}
        {/* Staggered entrance: delay-200 */}
        <div 
          className={`group flex flex-col items-center justify-center p-8 rounded-3xl border border-transparent transition-all duration-700 delay-200 hover:bg-white/5 hover:border-white/10 hover:shadow-[0_0_40px_rgba(74,222,128,0.05)] hover:-translate-y-1 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-[#4ade80] transition-all duration-500">
            {traders.toLocaleString()}+
          </div>
          <div className="text-sm md:text-base text-gray-500 font-medium tracking-wide uppercase mt-3 group-hover:text-gray-300 transition-colors">
            Active Traders
          </div>
        </div>

        {/* STAT 3: Tokens Tracked */}
        {/* Staggered entrance: delay-300 */}
        <div 
          className={`group flex flex-col items-center justify-center p-8 rounded-3xl border border-transparent transition-all duration-700 delay-300 hover:bg-white/5 hover:border-white/10 hover:shadow-[0_0_40px_rgba(74,222,128,0.05)] hover:-translate-y-1 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}
        >
          <div className="text-4xl md:text-5xl lg:text-6xl font-black tabular-nums tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-[#4ade80] transition-all duration-500">
            {tokens.toLocaleString()}+
          </div>
          <div className="text-sm md:text-base text-gray-500 font-medium tracking-wide uppercase mt-3 group-hover:text-gray-300 transition-colors">
            Tokens Tracked
          </div>
        </div>

      </div>
    </section>
  );
});

export default StatsBar;