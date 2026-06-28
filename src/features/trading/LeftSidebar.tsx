'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import TrendingTokensList from '@/features/trading/TrendingTokensList';
import { PanelCard, TabConfig } from './PanelCard';

export type QuadrantState = {
  q1: boolean; q2: boolean; q3: boolean; q4: boolean;
};

const COMMON_TABS: TabConfig[] = [
  { label: 'Alerts', subTags: ['All', 'Fills', 'Cancels'] },
  { label: 'Tokens', subTags: ['Watchlist', 'Crypto', 'Trending', 'Volume'] },
  { label: 'Leaderboard', subTags: ['24H', '7D', '30D', 'ALL'] },
  { label: 'Feed', subTags: ['Global', 'Following'] }, 
];

const renderPanelContent = (activeTab: string, activeSubTag: string) => {
  if (activeTab === 'Tokens' && activeSubTag === 'Trending') return <TrendingTokensList />;
  return <div className="p-4 text-xs text-[#8F9BB3]">Select a tab</div>;
};

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function LeftSidebar({ isOpen, onToggle }: LeftSidebarProps) {
  const [qs, setQs] = useState<QuadrantState>({
    q1: true, q2: false, q3: false, q4: false,
  });

  const hasLeftColumn = qs.q1 || qs.q3;
  const hasRightColumn = qs.q2 || qs.q4;
  const hasTopRow = qs.q1 || qs.q2;
  const hasBottomRow = qs.q3 || qs.q4;
  const columnsCount = (hasLeftColumn ? 1 : 0) + (hasRightColumn ? 1 : 0);
  const rowsCount = (hasTopRow ? 1 : 0) + (hasBottomRow ? 1 : 0);

  // Safely find the first active panel (checking q1 -> q2 -> q3 -> q4 in order)
  const firstActivePanel = (['q1', 'q2', 'q3', 'q4'] as const).find(key => qs[key]);

  // Width is fully dynamic now. If closed = 0px. If 1 col = 300px. If 2 col = 600px.
  const sidebarWidth = !isOpen ? "w-0 p-0 border-transparent opacity-0" : 
                       columnsCount === 2 ? "w-[600px] p-2" : 
                       columnsCount === 1 ? "w-[300px] p-2" : 
                       "w-0 p-0 border-transparent opacity-0";

  const totalActivePanels = Object.values(qs).filter(Boolean).length;

  // Helper to inject common props to keep JSX clean
  const getCommonProps = (id: keyof QuadrantState) => ({
    id,
    tabs: COMMON_TABS,
    content: renderPanelContent,
    hideClose: totalActivePanels === 1,
    onClose: () => setQs((p) => ({ ...p, [id]: false })),
    isFirstPanel: firstActivePanel === id,
    onToggleSidebar: onToggle,
  });

  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0 bg-transparent h-full flex-col overflow-hidden",
        "transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] border-r border-white/[0.04]",
        sidebarWidth
      )}
    >
      <div className={cn("grid h-full w-full gap-2 transition-all duration-300", columnsCount === 2 ? "grid-cols-2" : "grid-cols-1", rowsCount === 2 ? "grid-rows-2" : "grid-rows-1")}>
        
        {qs.q1 && (
          <PanelCard
            {...getCommonProps('q1')}
            defaultTab="Tokens"
            defaultSubTag="Trending"
            canSplitRight={!qs.q2 && !hasRightColumn}
            canSplitBottom={!qs.q3 && !hasBottomRow}
            onSplitRight={() => setQs((p) => ({ ...p, q2: true }))}
            onSplitBottom={() => setQs((p) => ({ ...p, q3: true }))}
            gridPlacement={cn("col-start-1 row-start-1", !qs.q3 && rowsCount === 2 ? "row-span-2" : "row-span-1")}
          />
        )}

        {qs.q2 && (
          <PanelCard
            {...getCommonProps('q2')}
            defaultTab="Leaderboard"
            defaultSubTag="24H"
            canSplitRight={false}
            canSplitBottom={!qs.q4 && !hasBottomRow}
            onSplitBottom={() => setQs((p) => ({ ...p, q4: true }))}
            gridPlacement={cn(hasLeftColumn ? "col-start-2" : "col-start-1", "row-start-1", !qs.q4 && rowsCount === 2 ? "row-span-2" : "row-span-1")}
          />
        )}

        {qs.q3 && (
          <PanelCard
            {...getCommonProps('q3')}
            defaultTab="Alerts"
            defaultSubTag="All"
            canSplitRight={!qs.q4 && !hasRightColumn}
            canSplitBottom={false}
            onSplitRight={() => setQs((p) => ({ ...p, q4: true }))}
            gridPlacement={cn("col-start-1", qs.q1 ? "row-start-2" : "row-start-1", !qs.q1 && rowsCount === 2 ? "row-span-2" : "row-span-1")}
          />
        )}

        {qs.q4 && (
          <PanelCard
            {...getCommonProps('q4')}
            defaultTab="Feed"
            defaultSubTag="Global"
            canSplitRight={false}
            canSplitBottom={false}
            gridPlacement={cn(hasLeftColumn ? "col-start-2" : "col-start-1", qs.q2 ? "row-start-2" : "row-start-1", !qs.q2 && rowsCount === 2 ? "row-span-2" : "row-span-1")}
          />
        )}
      </div>
    </aside>
  );
}