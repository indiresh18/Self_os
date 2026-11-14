'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar, TabType } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { DailyHabitsModule } from '@/components/habits/DailyHabitsModule';
import { CareerPlannerModule } from '@/components/career/CareerPlannerModule';
import { SavingsModule } from '@/components/savings/SavingsModule';
import { UnifiedTasksModule } from '@/components/tasks/UnifiedTasksModule';
import { ShoppingListModule } from '@/components/shopping/ShoppingListModule';
import { ReportsModule } from '@/components/analytics/ReportsModule';
import { SettingsModule } from '@/components/settings/SettingsModule';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F0E8] dark:bg-zinc-950 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <Navbar />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {activeTab === 'overview' && <OverviewDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'habits' && <DailyHabitsModule />}
          {activeTab === 'career' && <CareerPlannerModule />}
          {activeTab === 'savings' && <SavingsModule />}
          {activeTab === 'tasks' && <UnifiedTasksModule />}
          {activeTab === 'shopping' && <ShoppingListModule />}
          {activeTab === 'reports' && <ReportsModule />}
          {activeTab === 'settings' && <SettingsModule />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
