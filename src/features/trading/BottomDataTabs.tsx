'use client';

import { useState } from 'react';
// Assuming these components exist in your project
import RecentTrades from './RecentTrades';
import TopHolders from './TopHolders';
import { cn } from '@/lib/utils';

// =============================================================================
// Types
// =============================================================================

type TabType = 'holders' | 'swaps' | 'thesis';

interface BottomDataTabsProps {
  tokenAddress: string;
  thesisCount?: number; // Allows dynamic injection of the thesis count
}

// =============================================================================
// Main Component
// =============================================================================

export default function BottomDataTabs({ tokenAddress, thesisCount = 136 }: BottomDataTabsProps) {
  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('holders');
  
  // Filter States (Passed down to child lists so they can filter their API requests/data)
  const [thesisOnly, setThesisOnly] = useState(false);
  const [friendsOnly, setFriendsOnly] = useState(false);

  // Tab Configuration Array for clean mapping
  const tabs = [
    { id: 'holders', label: 'Holders' },
    { id: 'swaps', label: 'Swaps' },
    { id: 'thesis', label: `Thesis (${thesisCount})` },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-transparent rounded-xl border border-white/[0.04] shadow-lg overflow-hidden">
      
      {/* --- Tabs Header --- */}
      <div className="h-11 shrink-0 border-b border-white/[0.04] bg-[#0A0D14] flex items-center justify-between px-4">
        
        {/* Left: Tab Navigation */}
        <div className="flex items-center gap-5 h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative h-full text-[13px] font-semibold transition-colors',
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-[#8F9BB3] hover:text-white'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: Inline Filters */}
        <div className="flex items-center gap-4 hidden sm:flex">
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={thesisOnly}
              onChange={(e) => setThesisOnly(e.target.checked)}
              className="w-3 h-3 rounded-[3px] bg-transparent border-white/20 text-[#3b82f6] focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors checked:border-transparent" 
            />
            <span className="text-[11px] font-medium text-[#8F9BB3] group-hover:text-white transition-colors">
              Thesis only
            </span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={friendsOnly}
              onChange={(e) => setFriendsOnly(e.target.checked)}
              className="w-3 h-3 rounded-[3px] bg-transparent border-white/20 text-[#3b82f6] focus:ring-0 focus:ring-offset-0 cursor-pointer transition-colors checked:border-transparent" 
            />
            <span className="text-[11px] font-medium text-[#8F9BB3] group-hover:text-white transition-colors">
              Friends only
            </span>
          </label>
        </div>
      </div>

      {/* --- Content Area --- */}
      {/* The scrollbar classes here create a highly-styled, thin, dark-mode 
        scrollbar directly via Tailwind arbitrary variants.
      */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        
        {/* Render Active Component & Pass Down Filter Context */}
        {activeTab === 'holders' && (
          <TopHolders 
            tokenAddress={tokenAddress} 
            thesisOnly={thesisOnly} 
            friendsOnly={friendsOnly} 
          />
        )}
        
        {activeTab === 'swaps' && (
          <RecentTrades 
            tokenAddress={tokenAddress} 
            thesisOnly={thesisOnly} 
            friendsOnly={friendsOnly} 
          />
        )}
        
        {activeTab === 'thesis' && (
          <div className="p-4 text-center text-[12px] text-[#8F9BB3] flex h-full items-center justify-center">
            Thesis list component would render here.
          </div>
        )}
      </div>
      
    </div>
  );
}