'use client';

import type { ReactNode } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export interface TopNavBarTab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TopNavBarProps {
  tabs: TopNavBarTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TopNavBar = ({ tabs, activeTab, onTabChange }: TopNavBarProps) => {
  const { dir } = useTranslations();
  const isRtl = dir === 'rtl';
  const baseTabClasses =
    'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg';
  const activeTabClasses = 'bg-primary border-primary text-white shadow-glow-primary';
  const inactiveTabClasses = 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10';

  return (
    <nav className="sticky top-16 z-40 backdrop-blur-xl bg-dark-bg/80 border-b border-glass-border" role="navigation">
      <div className="container mx-auto px-4" role="tablist" aria-orientation="horizontal">
        <div
          className={`flex items-center justify-center gap-2 sm:gap-4 py-3 overflow-x-auto scrollbar-hide ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                role="tab"
                aria-selected={isActive}
                className={`${baseTabClasses} ${isActive ? activeTabClasses : inactiveTabClasses}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
