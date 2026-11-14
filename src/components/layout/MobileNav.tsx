'use client';

import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  GraduationCap,
  PiggyBank,
  ListTodo,
  ShoppingBag,
  BarChart3,
  Settings
} from 'lucide-react';
import { TabType } from './Sidebar';

interface MobileNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview' as TabType, label: 'Home', icon: LayoutDashboard },
    { id: 'habits' as TabType, label: 'Habits', icon: CheckCircle2 },
    { id: 'career' as TabType, label: 'Career', icon: GraduationCap },
    { id: 'savings' as TabType, label: 'Savings', icon: PiggyBank },
    { id: 'tasks' as TabType, label: 'Tasks', icon: ListTodo },
    { id: 'shopping' as TabType, label: 'Shop', icon: ShoppingBag },
    { id: 'reports' as TabType, label: 'Stats', icon: BarChart3 },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6EE] dark:bg-zinc-900 border-t-[2.5px] border-black px-2 py-1.5 flex items-center justify-around shadow-[0px_-2px_10px_rgba(0,0,0,0.1)]">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded text-[10px] font-black transition-all ${
              isActive
                ? 'bg-blue-600 text-white border-1.5 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="truncate max-w-[42px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

