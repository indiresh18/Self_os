'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { formatINR, exportToCSV, calculateStreak } from '@/lib/utils';
import {
  BarChart3,
  Download,
  CheckCircle2,
  GraduationCap,
  PiggyBank,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ReportsModule: React.FC = () => {
  const {
    habits,
    habitLogs,
    careerTasks,
    careerGoals,
    certifications,
    projects,
    transactions,
    savingsGoals,
    financialStats,
    todayStats
  } = useApp();

  // Export handlers
  const exportAllHabits = () => {
    const rows = habits.map(h => {
      const { currentStreak, longestStreak } = calculateStreak(h.id, habitLogs);
      return {
        'Habit ID': h.id,
        'Title': h.title,
        'Category': h.category,
        'Target': `${h.target_value} ${h.unit}`,
        'Current Streak (Days)': currentStreak,
        'Longest Streak (Days)': longestStreak
      };
    });
    exportToCSV('MyLife_OS_Habits_Full', rows);
  };

  const exportAllTransactions = () => {
    const rows = transactions.map(t => ({
      'Transaction ID': t.id,
      'Date': t.date,
      'Description': t.description,
      'Type': t.type,
      'Category': t.category,
      'Amount (INR)': t.amount,
      'Notes': t.notes || ''
    }));
    exportToCSV('MyLife_OS_Financial_Transactions', rows);
  };

  const exportAllCareer = () => {
    const rows = careerTasks.map(t => ({
      'Task ID': t.id,
      'Title': t.title,
      'Status': t.status,
      'Priority': t.priority,
      'Category': t.semester,
      'Deadline': t.deadline || 'None'
    }));
    exportToCSV('MyLife_OS_Career_Milestones', rows);
  };

  // Cross-Module Summary Numbers
  const totalTasks = careerTasks.length;
  const completedCareerTasks = careerTasks.filter(t => t.status === 'completed').length;
  const careerProgressPct = totalTasks > 0 ? Math.round((completedCareerTasks / totalTasks) * 100) : 0;

  const totalGoals = savingsGoals.length;
  const completedGoals = savingsGoals.filter(g => g.saved_amount >= g.target_amount).length;

  const comparisonData = [
    { name: 'Habits Completed', count: todayStats.completedHabits, fill: '#84CC16' },
    { name: 'Career Tasks Done', count: completedCareerTasks, fill: '#2563EB' },
    { name: 'Projects Active', count: projects.length, fill: '#A855F7' },
    { name: 'Certifications', count: certifications.length, fill: '#F59E0B' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-indigo-400 text-black border border-black rounded shadow-[2px_2px_0px_#000]">
              <BarChart3 className="w-5 h-5" />
            </span>
            Reports & Cross-Module Analytics
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Data insights, consistency metrics and instant CSV export across all three pillars
          </p>
        </div>

        {/* Export All Data Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <NeoButton variant="neutral" size="sm" onClick={exportAllHabits}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Habits CSV
          </NeoButton>
          <NeoButton variant="neutral" size="sm" onClick={exportAllTransactions}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Money CSV
          </NeoButton>
          <NeoButton variant="neutral" size="sm" onClick={exportAllCareer}>
            <FileSpreadsheet className="w-3.5 h-3.5" /> Export Career CSV
          </NeoButton>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Module 1 Summary */}
        <NeoCard variant="white" className="p-5 border-2 border-black">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <span className="text-xs font-black uppercase text-zinc-600">Module 1: Self-Care</span>
            <CheckCircle2 className="w-4 h-4 text-lime-600" />
          </div>
          <div className="text-3xl font-black text-lime-600 mb-1">{todayStats.completionPct}%</div>
          <div className="text-xs font-bold text-zinc-700">Today's active habit completion</div>
          <div className="mt-3 text-xs font-bold text-zinc-500">
            Water: {todayStats.waterLiters.toFixed(1)}L • Sleep: {todayStats.sleepHours}h
          </div>
        </NeoCard>

        {/* Module 2 Summary */}
        <NeoCard variant="white" className="p-5 border-2 border-black">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <span className="text-xs font-black uppercase text-zinc-600">Module 2: Career</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600 mb-1">{careerProgressPct}%</div>
          <div className="text-xs font-bold text-zinc-700">
            {completedCareerTasks} of {totalTasks} roadmap tasks finished
          </div>
          <div className="mt-3 text-xs font-bold text-zinc-500">
            {certifications.length} Certifications • {projects.length} Active Projects
          </div>
        </NeoCard>

        {/* Module 3 Summary */}
        <NeoCard variant="white" className="p-5 border-2 border-black">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <span className="text-xs font-black uppercase text-zinc-600">Module 3: Savings</span>
            <PiggyBank className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600 mb-1">{formatINR(financialStats.totalSavings)}</div>
          <div className="text-xs font-bold text-zinc-700">
            Monthly Target Progress: {financialStats.savingsTargetProgressPct}%
          </div>
          <div className="mt-3 text-xs font-bold text-zinc-500">
            Available Balance: {formatINR(financialStats.availableBalance)}
          </div>
        </NeoCard>
      </div>

      {/* Aggregate Productivity Activity Chart */}
      <NeoCard variant="white" className="p-5">
        <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4">
          Integrated Cross-Module Execution Activity
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#000" fontWeight="bold" fontSize={12} />
              <YAxis stroke="#000" fontWeight="bold" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FAF6EE',
                  border: '2px solid #000',
                  boxShadow: '3px 3px 0px #000',
                  fontWeight: 'bold'
                }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </NeoCard>
    </div>
  );
};
