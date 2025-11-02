'use client';

import type { ReactNode } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface TopNavBarProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: ReactNode;
  }>;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TopNavBar = ({ tabs, activeTab, onTabChange }: TopNavBarProps) => {
  const { dir } = useTranslations();

  return (
    <nav className="sticky top-16 z-40 backdrop-blur-xl bg-dark-bg/80 border-b border-glass-border">
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-center gap-2 sm:gap-4 py-3 overflow-x-auto scrollbar-hide ${
            dir === 'rtl' ? 'flex-row-reverse' : ''
          }`}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                  isActive
                    ? 'bg-primary border-primary text-white shadow-glow-primary'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                }`}
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
