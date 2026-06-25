'use client';

import { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    quote: "finally a trading app that doesn't look like it was built in 2019. the charts are crispy and swaps are instant.",
    name: 'defi degen',
    handle: 'DEFIDEGEN',
    avatar: '🚀',
  },
  {
    quote: "switched from three different apps to just chadwallet. live trending, charts, and swaps all in one place. absolute game changer.",
    name: 'sol maxi',
    handle: 'SOLMAXI',
    avatar: '☀️',
  },
  {
    quote: "the top holders feed gives me alpha i can't get anywhere else. seeing what whales are doing in real-time is incredible.",
    name: 'alpha hunter',
    handle: 'ALPHAHUNTER',
    avatar: '🐺',
  },
];

export default function SocialProof() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance the carousel
  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section className="py-24 px-4 sm:px-6 border-t border-white/[0.02] bg-[#050505] font-sans overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Header - Fomo Styled */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight lowercase">
            trusted by the <span className="text-[#4ade80]">best.</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg font-medium tracking-tight">
            join the growing community of whales who chose chadwallet.
          </p>
        </div>

        {/* Carousel Container */}
        {/* Pause auto-play when the user is hovering to read */}
        <div 
          className="relative w-full min-h-[280px] md:min-h-[250px] flex flex-col items-center justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            
            return (
              <div
                key={testimonial.handle}
                className={`absolute inset-0 w-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                  isActive 
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                }`}
              >
                {/* Premium Glassmorphic Card */}
                <div className="w-full max-w-3xl p-8 md:p-12 rounded-[2rem] bg-[#0a0a0a] border border-white/[0.04] shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center group transition-all duration-500 hover:border-white/[0.08]">
                  
                  {/* The Quote */}
                  <p className="text-xl md:text-3xl font-medium text-white leading-relaxed tracking-tight mb-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  
                  {/* Author Details */}
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 group-hover:bg-white/[0.06] transition-all duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-white tracking-tight lowercase">
                        {testimonial.name}
                      </div>
                      <div className="text-[10px] font-bold text-[#4ade80] uppercase tracking-[0.2em] mt-1">
                        @{testimonial.handle}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Indicators: Line for Active, Dots for Inactive */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {testimonials.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  isActive 
                    ? 'w-10 bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.4)]' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}