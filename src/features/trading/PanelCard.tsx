'use client'
import React, { useState, useRef } from "react";
// Assuming QuadrantState is defined elsewhere in your project
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
  content: React.ReactNode; 
  canSplitRight?: boolean;
  canSplitBottom?: boolean;
  onSplitRight?: () => void;
  onSplitBottom?: () => void;
  onClose?: () => void;
  hideClose?: boolean;
  gridPlacement: string;
}

// ============================================================================
// Draggable Scroll Helper Component
// ============================================================================

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
    const walk = (x - startX) * 2; // Scroll-fast multiplier
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
}: PanelProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Find current tab config to check for subTags
  const currentTabConfig = tabs.find(t => t.label === activeTab);
  const hasSubTags = currentTabConfig?.subTags && currentTabConfig.subTags.length > 0;
  
  // Initialize active subtag based on default, or default to the first available subtag
  const [activeSubTag, setActiveSubTag] = useState(
    defaultSubTag || (hasSubTags ? currentTabConfig!.subTags![0] : "")
  );

  // Handle Main Tab Click
  const handleTabClick = (label: string) => {
    setActiveTab(label);
    const newTabConfig = tabs.find(t => t.label === label);
    if (newTabConfig?.subTags && newTabConfig.subTags.length > 0) {
      setActiveSubTag(newTabConfig.subTags[0]); // Auto-select first sub-tag on switch
    } else {
      setActiveSubTag("");
    }
  };

  return (
    <div
      className={cn(
        "bg-[#0A0D14] rounded-xl border border-white/[0.04] shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
        gridPlacement
      )}
    >
      {/* ----------------- Header Section ----------------- */}
      <div className="shrink-0 flex flex-col border-b border-white/[0.04] bg-[#0A0D14] z-10">
        
        {/* Top Row: Main Tabs & Controls */}
        <div className="h-10 flex items-center justify-between px-3">
          <DraggableScroll className="flex-1 gap-4 mr-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => handleTabClick(tab.label)}
                className={cn(
                  "py-2 text-[12px] font-semibold tracking-wide transition-colors whitespace-nowrap",
                  activeTab === tab.label
                    ? "text-white"
                    : "text-[#8F9BB3] hover:text-[#d1d5db]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </DraggableScroll>

          {/* Global Panel Actions (Settings / Close) */}
          <div className="flex items-center gap-1 shrink-0 bg-[#0A0D14] pl-2 border-l border-white/[0.04]">
            <button className="p-1.5 text-[#8F9BB3] hover:text-white rounded-md hover:bg-white/[0.04] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            {!hideClose && onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-[#8F9BB3] hover:text-white rounded-md hover:bg-white/[0.04] transition-colors"
                title="Close panel"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Sub-Tabs (Conditional) */}
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
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#0A0D14]">
        {/* If you need the content to dynamically change based on activeTab/SubTag, 
          you can pass them down into a render prop like:
          {typeof content === 'function' ? content(activeTab, activeSubTag) : content}
        */}
        {content}
      </div>

      {/* ----------------- Bottom Control Bar ----------------- */}
      {(canSplitRight || canSplitBottom) && (
        <div className="h-8 shrink-0 border-t border-white/[0.02] bg-[#07090e] flex items-center gap-1.5 px-2">
          {canSplitBottom && (
            <button
              onClick={onSplitBottom}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-[#8F9BB3] hover:text-white hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.05]"
            >
              <svg className="w-3 h-3 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13H5v-2h14v2z" />
              </svg>
              Split bottom
            </button>
          )}
          {canSplitRight && (
            <button
              onClick={onSplitRight}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-[#8F9BB3] hover:text-white hover:bg-white/[0.04] transition-all border border-transparent hover:border-white/[0.05]"
            >
              <svg className="w-3 h-3 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
              Split right
            </button>
          )}
        </div>
      )}
    </div>
  );
};