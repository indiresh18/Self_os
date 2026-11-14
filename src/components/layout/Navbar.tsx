'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDisplayDate, getGreeting, getTodayDateString } from '@/lib/utils';
import { NeoButton } from '../common/NeoButton';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Moon,
  Sun,
  Database,
  Bell,
  Sparkles
} from 'lucide-react';
import { QuickAddModal } from '../common/QuickAddModal';

export const Navbar: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    isSupabaseLive,
    userEmail,
    settings,
    updateSettings,
    todayStats
  } = useApp();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [greeting, setGreeting] = useState('Welcome');
  const [isToday, setIsToday] = useState(true);

  React.useEffect(() => {
    setGreeting(getGreeting());
    setIsToday(selectedDate === getTodayDateString());
  }, [selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const toggleTheme = () => {
    updateSettings({
      theme: settings.theme === 'dark' ? 'light' : 'dark'
    });
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF6EE] dark:bg-zinc-900 border-b-[2.5px] border-black px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 transition-colors">
        {/* Left: Greeting and Date Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-300 text-black px-2 py-0.5 rounded border-1.5 border-black shadow-[1.5px_1.5px_0px_#000]">
                {greeting}
              </span>
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                IST (Asia/Kolkata)
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-black text-black dark:text-white tracking-tight">
              MyLife OS <span className="text-blue-600 font-extrabold text-sm ml-1">v2.0</span>
            </h1>
          </div>

          {/* Date Selector / Navigation */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 p-1 rounded-md border-2 border-black shadow-[2px_2px_0px_#000]">
            <button
              onClick={handlePrevDay}
              title="Previous Day"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition cursor-pointer text-black dark:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => e.target.value && setSelectedDate(e.target.value)}
                className="text-xs font-bold bg-transparent border-none outline-none cursor-pointer text-black dark:text-white"
              />
              <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300 hidden md:inline">
                ({formatDisplayDate(selectedDate)})
              </span>
            </div>

            <button
              onClick={handleNextDay}
              title="Next Day"
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded transition cursor-pointer text-black dark:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isToday && (
              <button
                onClick={handleToday}
                className="text-[11px] font-black uppercase bg-lime-400 text-black px-2 py-0.5 border border-black rounded shadow-[1px_1px_0px_#000] cursor-pointer hover:bg-lime-500"
              >
                Today
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Add, Status, Dark Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Supabase status badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold border-2 border-black rounded-md shadow-[2px_2px_0px_#000] ${
              isSupabaseLive ? 'bg-emerald-300 text-emerald-950' : 'bg-yellow-200 text-yellow-950'
            }`}
            title={isSupabaseLive ? `Connected: ${userEmail || 'Supabase Active'}` : 'Running with persistent local storage'}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseLive ? 'Supabase Live' : 'Local Demo Mode'}</span>
          </div>

          {/* Habit quick summary pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-black bg-white dark:bg-zinc-800 text-black dark:text-white border-2 border-black rounded-md shadow-[2px_2px_0px_#000]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Habits: {todayStats.completedHabits}/{todayStats.totalHabits} ({todayStats.completionPct}%)</span>
          </div>

          {/* Quick Add Button */}
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1 shadow-[2.5px_2.5px_0px_#000]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Quick Add</span>
          </NeoButton>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-white dark:bg-zinc-800 border-2 border-black rounded-md shadow-[2px_2px_0px_#000] hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer text-black dark:text-white"
              title="Notifications & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border border-black rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 border-2 border-black rounded-md shadow-[4px_4px_0px_#000] p-3 text-xs z-50">
                <div className="font-black border-b border-black pb-1.5 mb-2 uppercase text-black dark:text-white">
                  MyLife OS Alerts
                </div>
                <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                  <div className="p-1.5 bg-blue-50 dark:bg-zinc-800 border border-black rounded">
                    🎯 <strong>Daily Target:</strong> 2L water & 8h sleep tracker active for {formatDisplayDate(selectedDate)}.
                  </div>
                  <div className="p-1.5 bg-amber-50 dark:bg-zinc-800 border border-black rounded">
                    💰 <strong>Savings Goal:</strong> ₹{settings.monthly_savings_target} monthly benchmark in progress.
                  </div>
                  <div className="p-1.5 bg-lime-50 dark:bg-zinc-800 border border-black rounded">
                    💻 <strong>Career Focus:</strong> Complete AI Video Set 1 & MERN Stack modules.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 bg-amber-300 dark:bg-zinc-800 text-black dark:text-white border-2 border-black rounded-md shadow-[2px_2px_0px_#000] hover:bg-amber-400 dark:hover:bg-zinc-700 cursor-pointer"
            title="Toggle Light / Dark Mode"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-black" />}
          </button>
        </div>
      </header>

      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </>
  );
};
