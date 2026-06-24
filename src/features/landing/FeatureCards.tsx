'use client';

import { useEffect, useState, useRef } from 'react';

const features = [
  {
    id: 0,
    tag: "DEGEN MODE",
    title: "snag tokens instantly.",
    desc: "detect trending tokens milliseconds after deployment. built-in rug protection and instant liquidity routing across all major chains.",
    img: "/flow/memecoin-4.png",
  },
  {
    id: 1,
    tag: "INSTANT EXECUTION",
    title: "gigachad speeds.",
    desc: "one-click buy and sell controls. zero confirmation lag. by the time they see the chart move, you've already taken profit.",
    img: "/flow/buy-sell-4.png",
  },
  {
    id: 2,
    tag: "ANALYTICS",
    title: "track every penny.",
    desc: "view real-time token balances, net worth, and performance metrics cleanly. no more refreshing clunky block explorers.",
    img: "/flow/portfolio-4.png",
  },
  {
    id: 3,
    tag: "SOCIAL",
    title: "copytrade the whales.",
    desc: "auto-follow validated, high-hit-rate smart wallets and top kol portfolios instantly. let the whales do the heavy lifting.",
    img: "/flow/kol-4.png",
  },
  {
    id: 4,
    tag: "SECURE",
    title: "fair launchpad.",
    desc: "deploy or ride clean token launches securely. advanced mitigation tools protect against sniper bots and instant developer dumps.",
    img: "/flow/launch-4.png",
  }
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-[#050505] text-white border-t border-white/[0.02] z-30 font-sans">
      
      {/* 1. Header Section - Fomo Lowercase Style */}
      <div className="pt-32 pb-16 px-4 md:px-8 max-w-5xl mx-auto relative z-10 text-center md:text-left">
        <h2 className="text-5xl md:text-[5rem] font-bold tracking-tight mb-4 text-white leading-none">
          the chad arsenal.
        </h2>
        <p className="text-[#a1a1aa] text-lg md:text-2xl font-medium tracking-tight max-w-2xl">
          stop trading like a normie. weaponize your workflow with tools designed for max volume.
        </p>
      </div>

      {/* 2. The Sticky Layout Container */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start pb-32">
        
        {/* LEFT PANEL: Sticky Image Container */}
        <div className="sticky top-20 md:top-0 w-full md:w-1/2 h-[40vh] md:h-screen flex items-center justify-center z-20 mb-12 md:mb-0 pr-0 md:pr-8">
          {/* Changed to max-w-2xl and aspect-video (16:9) for maximum width */}
          <div className="relative w-full max-w-2xl aspect-video rounded-[2rem] overflow-hidden border border-white/[0.04] bg-[#0a0a0a] shadow-2xl">
            {features.map((feature, index) => (
              <img
                key={feature.id}
                src={feature.img}
                alt={feature.title}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out ${
                  activeIndex === index 
                    ? 'opacity-100 scale-100 blur-0' 
                    : 'opacity-0 scale-105 blur-sm'
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>
        </div>

        {/* RIGHT PANEL: Fomo-Styled Text Cards */}
        <div className="w-full md:w-1/2 relative z-10 md:pl-20">
          <div className="md:py-[30vh]">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => { textRefs.current[index] = el; }}
                data-index={index}
                className={`min-h-[50vh] flex flex-col justify-center transition-all duration-700 ease-out ${
                  activeIndex === index ? 'opacity-100' : 'opacity-20 hover:opacity-40'
                }`}
              >
                {/* Fomo-style Card styling */}
                <div className={`relative p-8 md:p-10 rounded-[2rem] transition-all duration-700 ${
                  activeIndex === index 
                    ? 'bg-[#0a0a0a] border border-white/[0.04] shadow-2xl translate-x-0' 
                    : 'bg-transparent border border-transparent -translate-x-4'
                }`}>
                  
                  {/* Fomo-style Tag: Tiny, uppercase, wide tracking, brand color */}
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#4ade80] mb-4 block">
                    {feature.tag}
                  </span>
                  
                  {/* Fomo-style Title: Lowercase, tight tracking, medium-bold */}
                  <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white">
                    {feature.title}
                  </h3>
                  
                  {/* Fomo-style Description: Clean, soft gray, medium weight */}
                  <p className="text-[#a1a1aa] text-base md:text-xl font-medium leading-relaxed tracking-tight">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}