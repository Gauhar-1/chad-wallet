'use client'
import React, { useState, useRef } from "react";
import { QuadrantState } from "./LeftSidebar"; 
import { cn } from "@/lib/utils";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface TabConfig {
  label: string;
  subTags?: string[];
}

interface PanelProps {
  id: keyof QuadrantState;
  tabs: TabConfig[];
  defaultTab: string;
  defaultSubTag?: string;
  // Upgrade: Content is now a function that receives the active tab state
  content: (activeTab: string, activeSubTag: string) => React.ReactNode; 
  canSplitRight?: boolean;
  canSplitBottom?: boolean;
  onSplitRight?: () => void;
  onSplitBottom?: () => void;
  onClose?: () => void;
  hideClose?: boolean;
  gridPlacement: string;

  isFirstPanel?: boolean;
  onToggleSidebar?: () => void;
}

// ... (DraggableScroll helper component remains exactly the same as your code) ...
const DraggableScroll = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => { setIsDragging(false); };
  const handleMouseUp = () => { setIsDragging(false); };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={cn(
        "flex items-center overflow-x-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================================
// Premium Card Component
// ============================================================================

export const PanelCard = ({
  tabs,
  defaultTab,
  defaultSubTag,
  content,
  canSplitRight,
  canSplitBottom,
  onSplitRight,
  onSplitBottom,
  onClose,
  hideClose,
  gridPlacement,
  isFirstPanel,
  onToggleSidebar
}: PanelProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const currentTabConfig = tabs.find(t => t.label === activeTab);
  const hasSubTags = currentTabConfig?.subTags && currentTabConfig.subTags.length > 0;
  
  const [activeSubTag, setActiveSubTag] = useState(
    defaultSubTag || (hasSubTags ? currentTabConfig!.subTags![0] : "")
  );

  const handleTabClick = (label: string) => {
    setActiveTab(label);
    const newTabConfig = tabs.find(t => t.label === label);
    if (newTabConfig?.subTags && newTabConfig.subTags.length > 0) {
      setActiveSubTag(newTabConfig.subTags[0]);
    } else {
      setActiveSubTag("");
    }
  };

  return (
    <div
      className={cn(
        "bg-transparent rounded-xl border border-white/[0.04] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 relative group/panel",
        gridPlacement
      )}
    >
      {/* ----------------- Header Section ----------------- */}
      <div className="shrink-0 flex flex-col border-b border-white/[0.04] bg-transparent z-10">
        <div className="h-10 flex items-center bg-[#0A0D14] justify-between px-3">
          <DraggableScroll className="flex-1  gap-4 mr-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={cn(
                  "py-2 text-[12px] font-semibold tracking-wide  transition-colors whitespace-nowrap",
                  activeTab === tab.label
                    ? "text-white"
                    : "text-[#8F9BB3] hover:text-[#d1d5db]"
                )}
              >
                {tab.label}
              </button>
            ))}

            {isFirstPanel && onToggleSidebar && (
              <button 
                onClick={onToggleSidebar}
                className="py-2 ml-1 text-[#8F9BB3] hover:text-white transition-colors flex items-center"
                title="Collapse Sidebar"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
          </DraggableScroll>

          <div className="flex items-center gap-1 shrink-0 bg-transparent pl-2 border-l border-white/[0.04]">
            {!hideClose && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-[#8F9BB3] hover:text-[#f87171] rounded-md hover:bg-white/[0.04] transition-colors"
                title="Close panel"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {hasSubTags && (
          <div className="h-9 flex items-center px-3 pb-1 border-t border-white/[0.02]">
             <DraggableScroll className="flex-1 gap-1.5">
              {currentTabConfig.subTags!.map((subTag) => (
                <button
                  key={subTag}
                  onClick={() => setActiveSubTag(subTag)}
                  className={cn(
                    "px-2.5 py-1 rounded-[4px] text-[11px] font-medium transition-all duration-200 whitespace-nowrap",
                    activeSubTag === subTag
                      ? "bg-white/[0.08] text-white shadow-sm"
                      : "text-[#8F9BB3] hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  {subTag}
                </button>
              ))}
            </DraggableScroll>
          </div>
        )}
      </div>

      {/* ----------------- Internal Content Area ----------------- */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-transparent relative">
        {/* We now execute the content function, passing the state up */}
        {content(activeTab, activeSubTag)}
      </div>

      {/* ----------------- Split Controls Overlay ----------------- */}
      {/* Redesigned to appear at the bottom-center of the panel on hover, matching fomo aesthetics */}
      {(canSplitRight || canSplitBottom) && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5  group-hover/panel:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
          {canSplitBottom && (
            <button
              onClick={onSplitBottom}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#1E222D]/90 backdrop-blur-sm border border-white/10 rounded-full shadow-xl text-[11px] font-semibold text-white hover:bg-[#2A2E39] hover:border-white/20 transition-all hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 13H5v-2h14v2z" />
              </svg>
              Split bottom
            </button>
          )}
          {canSplitRight && (
            <button
              onClick={onSplitRight}
              className="pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 bg-[#1E222D]/90 backdrop-blur-sm border border-white/10 rounded-full shadow-xl text-[11px] font-semibold text-white hover:bg-[#2A2E39] hover:border-white/20 transition-all hover:scale-105"
            >
              <svg className="w-3.5 h-3.5 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14m7-7H5" />
              </svg>
              Split right
            </button>
          )}
        </div>
      )}
    </div>
  );
};