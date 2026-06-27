'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Replace this with your actual layout content component
import TrendingTokensList from '@/features/trading/TrendingTokensList';
import { PanelCard } from './PanelCard';

// ============================================================================
// Types & Layout Interfaces
// ============================================================================

export type QuadrantState = {
  q1: boolean; // Top Left Lane
  q2: boolean; // Top Right Lane
  q3: boolean; // Bottom Left Lane
  q4: boolean; // Bottom Right Lane
};

// ============================================================================
// Layout Engine Window Manager
// ============================================================================

export default function LeftSidebar() {
  const [qs, setQs] = useState<QuadrantState>({
    q1: true,
    q2: false,
    q3: false,
    q4: false,
  });

  // Calculate global structure contexts
  const hasRightColumn = qs.q2 || qs.q4;
  const hasTwoRows = qs.q3 || qs.q4;

  const gridCols = hasRightColumn ? "grid-cols-2" : "grid-cols-1";
  const gridRows = hasTwoRows ? "grid-rows-2" : "grid-rows-1";
  const sidebarWidth = hasRightColumn ? "w-[580px]" : "w-[290px]";

  // Count active panels to manage strict safety overrides
  const totalActivePanels = Object.values(qs).filter(Boolean).length;

  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0 bg-[#050505] p-2 h-full flex-col overflow-hidden",
        "transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] border-r border-white/[0.04]",
        sidebarWidth
      )}
    >
      <div className={cn("grid h-full w-full gap-2", gridCols, gridRows)}>
        
        {/* Q1: TOP LEFT PANEL */}
        {qs.q1 && (
          <PanelCard
            id="q1"
            tabs={[
              { label: 'Alerts' },
              { label: 'Tokens', subTags: ['Watchlist', 'Crypto', 'Trending', 'Volume'] },
              { label: 'Leaderboard' }
            ]}
            defaultTab="Tokens"
            defaultSubTag="Trending"
            content={<TrendingTokensList />}
            canSplitRight={!qs.q2}
            canSplitBottom={!qs.q3}
            onSplitRight={() => setQs((p) => ({ ...p, q2: true }))}
            onSplitBottom={() => setQs((p) => ({ ...p, q3: true }))}
            hideClose={totalActivePanels === 1}
            onClose={() => setQs((p) => ({ ...p, q1: false }))}
            gridPlacement={cn(
              "col-start-1 row-start-1",
              hasTwoRows && !qs.q3 ? "row-span-2" : "row-span-1"
            )}
          />
        )}

        {/* Q2: TOP RIGHT PANEL */}
        {qs.q2 && (
          <PanelCard
            id="q2"
            tabs={[
              { label: 'Leaderboard', subTags: ['24H', '7D', '30D', 'ALL'] },
              { label: 'Whales' }
            ]}
            defaultTab="Leaderboard"
            defaultSubTag="24H"
            content={<div className="p-4 text-xs text-[#8F9BB3]">Leaderboard Monitoring Matrix</div>}
            canSplitRight={false}
            canSplitBottom={!qs.q4}
            onSplitBottom={() => setQs((p) => ({ ...p, q4: true }))}
            hideClose={totalActivePanels === 1}
            onClose={() => setQs((p) => ({ ...p, q2: false }))}
            gridPlacement={cn(
              hasRightColumn ? "col-start-2" : "col-start-1",
              "row-start-1",
              hasTwoRows && !qs.q4 ? "row-span-2" : "row-span-1"
            )}
          />
        )}

        {/* Q3: BOTTOM LEFT PANEL */}
        {qs.q3 && (
          <PanelCard
            id="q3"
            tabs={[
              { label: 'Alerts', subTags: ['All', 'Fills', 'Cancels'] },
              { label: 'Orders' },
              { label: 'Logs' }
            ]}
            defaultTab="Alerts"
            defaultSubTag="All"
            content={<div className="p-4 text-xs text-[#8F9BB3]">Real-time Event Streams</div>}
            canSplitRight={!qs.q4}
            canSplitBottom={false}
            onSplitRight={() => setQs((p) => ({ ...p, q4: true }))}
            hideClose={totalActivePanels === 1}
            onClose={() => setQs((p) => ({ ...p, q3: false }))}
            gridPlacement={cn(
              "col-start-1",
              qs.q1 ? "row-start-2" : "row-start-1 row-span-2"
            )}
          />
        )}

        {/* Q4: BOTTOM RIGHT PANEL */}
        {qs.q4 && (
          <PanelCard
            id="q4"
            tabs={[
              { label: 'Feed', subTags: ['Global', 'Following'] },
              { label: 'Social' }
            ]}
            defaultTab="Feed"
            defaultSubTag="Global"
            content={<div className="p-4 text-xs text-[#8F9BB3]">alpha-chatter ecosystem feed</div>}
            canSplitRight={false}
            canSplitBottom={false}
            hideClose={totalActivePanels === 1}
            onClose={() => setQs((p) => ({ ...p, q4: false }))}
            gridPlacement={cn(
              hasRightColumn ? "col-start-2" : "col-start-1",
              qs.q2 ? "row-start-2" : "row-start-1 row-span-2"
            )}
          />
        )}

      </div>
    </aside>
  );
}