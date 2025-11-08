'use client';

import { type ReactNode, useMemo } from 'react';

import { useTranslations } from '@/hooks/useTranslations';

type TabDefinition = Readonly<{
  id: string;
  label: string;
  icon?: ReactNode;
}>;

interface TopNavBarProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (id: TabDefinition['id']) => void;
}

export function TopNavBar({ tabs, activeTab, onTabChange }: TopNavBarProps) {
  const { dir } = useTranslations();

  const containerDirectionClass = useMemo(() => (dir === 'rtl' ? 'flex-row-reverse' : ''), [dir]);

  return (
    <nav className="sticky top-16 z-40 backdrop-blur-xl bg-dark-bg/80 border-b border-glass-border">
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-center gap-2 sm:gap-4 py-3 overflow-x-auto scrollbar-hide ${containerDirectionClass}`}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const buttonClasses = isActive
              ? 'bg-primary border-primary text-white shadow-glow-primary'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10';

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${buttonClasses}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon ? <span className="text-lg">{tab.icon}</span> : null}
                <span className="text-sm font-semibold whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
