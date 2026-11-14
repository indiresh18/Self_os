'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { formatDisplayDate, formatINR, getGreeting } from '@/lib/utils';
import {
  CheckCircle2,
  Droplet,
  Moon,
  Dumbbell,
  Target,
  Briefcase,
  PiggyBank,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Plus,
  AlertCircle
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface OverviewDashboardProps {
  setActiveTab: (tab: TabType) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ setActiveTab }) => {
  const {
    selectedDate,
    todayStats,
    routines,
    routineLogs,
    toggleRoutineComplete,
    habits,
    toggleHabitComplete,
    updateHabitValue,
    careerGoals,
    careerTasks,
    certifications,
    projects,
    financialStats,
    savingsGoals,
    unifiedTasks
  } = useApp();

  const [greeting, setGreeting] = useState('Welcome');

  React.useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Routines for the day
  const todayRoutineLogs = routineLogs.filter(l => l.date === selectedDate);
  const completedRoutineCount = routines.filter(r =>
    todayRoutineLogs.some(l => l.routine_id === r.id && l.completed)
  ).length;

  // Active top career goal
  const primaryGoal = careerGoals[0];

  // Pending career tasks
  const pendingCareerTasks = careerTasks.filter(t => t.status !== 'completed').slice(0, 3);

  // Water habit reference
  const waterHabit = habits.find(h => h.title.toLowerCase().includes('water'));
  const sleepHabit = habits.find(h => h.title.toLowerCase().includes('sleep'));
  const exerciseHabit = habits.find(h => h.title.toLowerCase().includes('exercise'));

  // Quick water addition (+250ml = 0.25L)
  const addWater = () => {
    if (waterHabit) {
      const nextVal = Math.min(4.0, Math.round((todayStats.waterLiters + 0.25) * 100) / 100);
      updateHabitValue(waterHabit.id, selectedDate, nextVal);
    }
  };

  // Quick exercise toggle
  const toggleExercise = () => {
    if (exerciseHabit) {
      toggleHabitComplete(exerciseHabit.id, selectedDate);
    }
  };

  // Urgent upcoming deadlines across all modules
  const upcomingDeadlines = unifiedTasks
    .filter(t => t.status !== 'completed' && t.deadline)
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner: Greeting + Overall Daily Progress Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeoCard variant="blue" className="lg:col-span-2 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-300 text-black text-xs font-black px-2.5 py-0.5 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                {greeting}
              </span>
              <span className="text-blue-100 text-xs font-bold">
                {formatDisplayDate(selectedDate)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              Welcome back to MyLife OS.
            </h2>
            <p className="text-blue-100 text-sm max-w-xl font-medium">
              Synchronizing daily self-care rituals, 4th & 5th semester career roadmaps, and disciplined ₹
              {financialStats.monthlyTarget} monthly savings targets.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t-2 border-white/20 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white text-black border-2 border-black rounded-lg shadow-[3px_3px_0px_#000]">
                <div className="text-[10px] font-black uppercase text-zinc-600">Daily Completion</div>
                <div className="text-2xl font-black text-blue-600">{todayStats.completionPct}%</div>
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {todayStats.completedHabits} of {todayStats.totalHabits} Habits Finished
                </div>
                <div className="text-xs text-blue-200">
                  {completedRoutineCount} of {routines.length} Daily Routine Time Slots Logged
                </div>
              </div>
            </div>

            <NeoButton
              variant="secondary"
              size="sm"
              onClick={() => setActiveTab('habits')}
              className="text-black"
            >
              Open Daily Tracker <ArrowRight className="w-4 h-4 ml-1" />
            </NeoButton>
          </div>
        </NeoCard>

        {/* Quick Self-Care Trackers: Water, Sleep, Exercise */}
        <NeoCard variant="white" className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
            <span className="font-black text-sm uppercase tracking-tight text-zinc-900">
              Today's Vital Metrics
            </span>
            <span className="text-xs font-bold text-zinc-500">{selectedDate}</span>
          </div>

          <div className="space-y-3.5">
            {/* Water Tracker */}
            <div className="p-2.5 bg-blue-50 border-2 border-black rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-blue-500 text-white rounded border border-black shadow-[1px_1px_0px_#000]">
                  <Droplet className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-black text-zinc-900">Hydration</div>
                  <div className="text-xs font-bold text-blue-800">
                    {todayStats.waterLiters.toFixed(2)} / 2.00 L
                  </div>
                </div>
              </div>
              <NeoButton variant="neutral" size="sm" onClick={addWater} className="text-xs py-1 px-2">
                +250ml
              </NeoButton>
            </div>

            {/* Sleep Tracker */}
            <div className="p-2.5 bg-purple-50 border-2 border-black rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-purple-600 text-white rounded border border-black shadow-[1px_1px_0px_#000]">
                  <Moon className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-black text-zinc-900">Sleep Rest</div>
                  <div className="text-xs font-bold text-purple-800">
                    {todayStats.sleepHours} / 8.0 hrs
                  </div>
                </div>
              </div>
              {sleepHabit && (
                <button
                  onClick={() => toggleHabitComplete(sleepHabit.id, selectedDate)}
                  className={`text-xs font-bold px-2.5 py-1 border-2 border-black rounded shadow-[1.5px_1.5px_0px_#000] cursor-pointer ${
                    todayStats.sleepHours >= 7 ? 'bg-lime-400 text-black' : 'bg-white text-zinc-800'
                  }`}
                >
                  {todayStats.sleepHours >= 7 ? 'Logged ✓' : 'Log 8h'}
                </button>
              )}
            </div>

            {/* Exercise Status */}
            <div className="p-2.5 bg-lime-50 border-2 border-black rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-lime-500 text-black rounded border border-black shadow-[1px_1px_0px_#000]">
                  <Dumbbell className="w-4 h-4" />
                </span>
                <div>
                  <div className="text-xs font-black text-zinc-900">Daily Exercise</div>
                  <div className="text-xs font-bold text-lime-900">
                    {todayStats.exerciseDone ? 'Completed Today 💪' : 'Pending workout'}
                  </div>
                </div>
              </div>
              <button
                onClick={toggleExercise}
                className={`text-xs font-bold px-2.5 py-1 border-2 border-black rounded shadow-[1.5px_1.5px_0px_#000] cursor-pointer ${
                  todayStats.exerciseDone ? 'bg-lime-400 text-black' : 'bg-white text-zinc-800'
                }`}
              >
                {todayStats.exerciseDone ? 'Done ✓' : 'Mark Done'}
              </button>
            </div>
          </div>
        </NeoCard>
      </div>

      {/* Module 2 & 3 Snapshots: Savings + Career Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Savings Snapshot */}
        <NeoCard variant="white" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-300 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <PiggyBank className="w-4 h-4 text-black" />
                </span>
                <span className="font-black text-sm uppercase text-zinc-900">Savings & Finance</span>
              </div>
              <span className="text-xs font-extrabold bg-lime-300 px-2 py-0.5 border border-black rounded">
                Target: {formatINR(financialStats.monthlyTarget)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded">
                <div className="text-[10px] font-black uppercase text-zinc-500">Total Savings</div>
                <div className="text-lg font-black text-emerald-700">
                  {formatINR(financialStats.totalSavings)}
                </div>
              </div>
              <div className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded">
                <div className="text-[10px] font-black uppercase text-zinc-500">Available Balance</div>
                <div className="text-lg font-black text-blue-700">
                  {formatINR(financialStats.availableBalance)}
                </div>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-xs font-bold">
                <span>Month Savings: {formatINR(financialStats.monthlySavings)}</span>
                <span>{financialStats.savingsTargetProgressPct}%</span>
              </div>
              <div className="w-full bg-zinc-200 border-2 border-black rounded-full h-3.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full border-r-2 border-black transition-all"
                  style={{ width: `${Math.min(100, financialStats.savingsTargetProgressPct)}%` }}
                />
              </div>
            </div>

            {/* Purchase Goals Mini Bar */}
            <div className="text-xs font-bold text-zinc-600 mb-1">
              Top Goal: {savingsGoals[0]?.title} ({formatINR(savingsGoals[0]?.saved_amount)} / {formatINR(savingsGoals[0]?.target_amount)})
            </div>
          </div>

          <NeoButton
            variant="neutral"
            size="sm"
            onClick={() => setActiveTab('savings')}
            className="w-full mt-3 justify-center"
          >
            Manage Savings & Expenses <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </NeoButton>
        </NeoCard>

        {/* Career Goal & Tasks Snapshot */}
        <NeoCard variant="white" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-600 text-white border border-black rounded shadow-[1px_1px_0px_#000]">
                  <Target className="w-4 h-4" />
                </span>
                <span className="font-black text-sm uppercase text-zinc-900">Career Goal & Sprints</span>
              </div>
              <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2 py-0.5 border border-black rounded">
                Sem 4 & 5
              </span>
            </div>

            {primaryGoal && (
              <div className="mb-4 p-2.5 bg-blue-50 border-2 border-black rounded">
                <div className="text-xs font-black text-zinc-900 line-clamp-1">{primaryGoal.title}</div>
                <div className="flex items-center justify-between text-xs font-bold text-blue-900 mt-1 mb-1">
                  <span>Goal Progress</span>
                  <span>{primaryGoal.progress_pct}%</span>
                </div>
                <div className="w-full bg-zinc-200 border border-black rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${primaryGoal.progress_pct}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="text-xs font-black uppercase text-zinc-600">Pending Priority Tasks</div>
              {pendingCareerTasks.map(t => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-xs p-1.5 bg-white border border-black rounded font-bold"
                >
                  <span className="truncate max-w-[190px]">{t.title}</span>
                  <span className="text-[10px] uppercase px-1.5 py-0.2 bg-amber-200 border border-black rounded">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <NeoButton
            variant="neutral"
            size="sm"
            onClick={() => setActiveTab('career')}
            className="w-full mt-3 justify-center"
          >
            Explore Career Roadmaps <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </NeoButton>
        </NeoCard>

        {/* Certifications & Quality Projects Snapshot */}
        <NeoCard variant="white" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-lime-400 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <Award className="w-4 h-4 text-black" />
                </span>
                <span className="font-black text-sm uppercase text-zinc-900">Certs & Projects</span>
              </div>
              <span className="text-xs font-extrabold bg-purple-200 text-purple-950 px-2 py-0.5 border border-black rounded">
                Portfolio
              </span>
            </div>

            <div className="space-y-3 mb-3">
              <div className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded">
                <div className="text-[10px] font-black uppercase text-zinc-500">Featured Certification</div>
                <div className="text-xs font-black text-zinc-900">{certifications[0]?.name}</div>
                <div className="text-[11px] font-bold text-blue-700">
                  {certifications[0]?.provider} • {certifications[0]?.status.replace('_', ' ')}
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded">
                <div className="text-[10px] font-black uppercase text-zinc-500">Flagship Project</div>
                <div className="text-xs font-black text-zinc-900">{projects[0]?.name}</div>
                <div className="text-[10px] font-bold text-zinc-600 line-clamp-1">{projects[0]?.tech_stack}</div>
              </div>
            </div>
          </div>

          <NeoButton
            variant="neutral"
            size="sm"
            onClick={() => setActiveTab('tasks')}
            className="w-full mt-3 justify-center"
          >
            View Unified Tasks View <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </NeoButton>
        </NeoCard>
      </div>

      {/* Routine Timeline & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeoCard variant="white" className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-purple-300 border border-black rounded shadow-[1px_1px_0px_#000]">
                <Clock className="w-4 h-4 text-black" />
              </span>
              <h3 className="font-black text-base uppercase text-zinc-900">
                Today's Daily Routine Timeline
              </h3>
            </div>
            <span className="text-xs font-extrabold bg-zinc-100 px-2 py-1 border border-black rounded">
              {completedRoutineCount} / {routines.length} Completed
            </span>
          </div>

          {/* Timeline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {routines.map(routine => {
              const isCompleted = todayRoutineLogs.some(l => l.routine_id === routine.id && l.completed);
              return (
                <div
                  key={routine.id}
                  onClick={() => toggleRoutineComplete(routine.id, selectedDate)}
                  className={`p-2.5 border-2 border-black rounded-md flex items-center justify-between cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-lime-200 shadow-[2px_2px_0px_#000]'
                      : 'bg-[#FAF6EE] hover:bg-zinc-100 shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded border-2 border-black flex items-center justify-center text-xs font-black ${
                        isCompleted ? 'bg-lime-500 text-black' : 'bg-white'
                      }`}
                    >
                      {isCompleted ? '✓' : ''}
                    </span>
                    <div>
                      <div className="text-[11px] font-black uppercase text-zinc-500">
                        {routine.time_label}
                      </div>
                      <div className={`text-xs font-black ${isCompleted ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                        {routine.activity}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-white border border-black rounded">
                    {routine.category}
                  </span>
                </div>
              );
            })}
          </div>
        </NeoCard>

        {/* Urgent Deadlines & Administrative Tasks */}
        <NeoCard variant="white" className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-rose-400 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <AlertCircle className="w-4 h-4 text-black" />
                </span>
                <h3 className="font-black text-sm uppercase text-zinc-900">Upcoming Deadlines</h3>
              </div>
              <span className="text-[11px] font-bold text-zinc-500">Cross-Module</span>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map(task => (
                  <div
                    key={task.id}
                    className="p-2.5 bg-[#FAF6EE] border-2 border-black rounded-md shadow-[2px_2px_0px_#000]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-zinc-900 truncate max-w-[160px]">
                        {task.title}
                      </span>
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-amber-300 border border-black rounded">
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-600">
                      <span>{task.category}</span>
                      <span className="text-rose-600">Due: {task.deadline}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs font-bold text-zinc-500 py-6 text-center">
                  No immediate upcoming deadlines. You are all caught up!
                </div>
              )}
            </div>
          </div>

          <NeoButton
            variant="secondary"
            size="sm"
            onClick={() => setActiveTab('tasks')}
            className="w-full mt-4 justify-center"
          >
            Open Unified Tasks Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </NeoButton>
        </NeoCard>
      </div>
    </div>
  );
};
