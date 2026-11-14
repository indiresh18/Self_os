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
  Settings,
  Sparkles
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export type TabType =
  | 'overview'
  | 'habits'
  | 'career'
  | 'savings'
  | 'tasks'
  | 'shopping'
  | 'reports'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { todayStats, careerTasks, shoppingItems, financialStats } = useApp();

  const pendingCareerCount = careerTasks.filter(t => t.status !== 'completed').length;
  const pendingShoppingCount = shoppingItems.filter(s => !s.is_purchased).length;

  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      color: 'hover:bg-amber-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'habits' as TabType,
      label: 'Daily Habits',
      icon: CheckCircle2,
      badge: `${todayStats.completionPct}%`,
      badgeColor: 'bg-lime-400 text-black',
      color: 'hover:bg-lime-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'career' as TabType,
      label: 'Career Planner',
      icon: GraduationCap,
      badge: pendingCareerCount > 0 ? `${pendingCareerCount}` : null,
      badgeColor: 'bg-blue-600 text-white',
      color: 'hover:bg-blue-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'savings' as TabType,
      label: 'Savings & Expense',
      icon: PiggyBank,
      badge: `₹${financialStats.totalSavings}`,
      badgeColor: 'bg-amber-300 text-black',
      color: 'hover:bg-amber-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'tasks' as TabType,
      label: 'Unified Tasks',
      icon: ListTodo,
      badge: null,
      color: 'hover:bg-purple-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'shopping' as TabType,
      label: 'Shopping List',
      icon: ShoppingBag,
      badge: pendingShoppingCount > 0 ? `${pendingShoppingCount}` : null,
      badgeColor: 'bg-rose-400 text-black',
      color: 'hover:bg-rose-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'reports' as TabType,
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
      color: 'hover:bg-indigo-100 dark:hover:bg-zinc-800'
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
      badge: null,
      color: 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#FAF6EE] dark:bg-zinc-900 border-r-[2.5px] border-black p-4 shrink-0 transition-colors">
      {/* Brand Badge */}
      <div className="mb-6 p-3 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 bg-blue-600 text-white rounded border border-black shadow-[1px_1px_0px_#000]">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="font-black text-sm tracking-tight uppercase text-black dark:text-white">
            Personal Life OS
          </span>
        </div>
        <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 leading-tight">
          Self-Care • Career Growth • Savings
        </p>
      </div>

      {/* Navigation links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 text-sm font-extrabold transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-black shadow-[3px_3px_0px_#000] translate-x-1'
                  : `border-transparent text-zinc-800 dark:text-zinc-200 ${item.color}`
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full border border-black shadow-[1px_1px_0px_#000] ${
                    isActive ? 'bg-amber-300 text-black' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Mini Profile Card */}
      <div className="mt-auto pt-4 border-t-2 border-black">
        <div className="p-2.5 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-300 border-2 border-black flex items-center justify-center font-black text-sm text-black shadow-[1px_1px_0px_#000]">
            OS
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-black truncate text-black dark:text-white">Indhirani / User</div>
            <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">Tier-1 Roadmap</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
