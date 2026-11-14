'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { formatDisplayDate, calculateStreak, cn, exportToCSV } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  Utensils,
  Plus,
  Trash2,
  Edit2,
  Flame,
  Calendar,
  BarChart2,
  Download,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Habit, MealType, RoutineCategory, RoutineItem } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const DailyHabitsModule: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    routines,
    routineLogs,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    toggleRoutineComplete,
    habits,
    habitLogs,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitComplete,
    updateHabitValue,
    foodLogs,
    toggleFoodMeal,
    addCustomFoodMeal,
    weeklyTasks,
    addWeeklyTask,
    toggleWeeklyTask,
    deleteWeeklyTask,
    todayStats
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'habits' | 'routine' | 'food' | 'weekly' | 'analytics'>('habits');

  // Edit / Add Habit modal state
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('Wellness');
  const [newHabitUnit, setNewHabitUnit] = useState<any>('boolean');
  const [newHabitTarget, setNewHabitTarget] = useState('1');

  // Edit / Add Routine state
  const [isAddRoutineOpen, setIsAddRoutineOpen] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<RoutineItem | null>(null);
  const [routineTime, setRoutineTime] = useState('');
  const [routineActivity, setRoutineActivity] = useState('');
  const [routineCategory, setRoutineCategory] = useState<RoutineCategory>('general');

  // Custom Food Meal state
  const [customMealType, setCustomMealType] = useState<MealType>('custom');
  const [customMealItems, setCustomMealItems] = useState('');
  const [customMealNotes, setCustomMealNotes] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);

  // Weekly task input
  const [newWeeklyTitle, setNewWeeklyTitle] = useState('');

  // Logs for current date
  const todayRoutineLogs = routineLogs.filter(l => l.date === selectedDate);
  const todayHabitLogs = habitLogs.filter(l => l.date === selectedDate);
  const todayFoodLogs = foodLogs.filter(l => l.date === selectedDate);

  // Habit CRUD handlers
  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        title: newHabitTitle,
        category: newHabitCategory,
        unit: newHabitUnit,
        target_value: parseFloat(newHabitTarget) || 1
      });
      setEditingHabit(null);
    } else {
      addHabit({
        title: newHabitTitle,
        category: newHabitCategory,
        unit: newHabitUnit,
        target_value: parseFloat(newHabitTarget) || 1,
        color: '#2563EB',
        is_active: true,
        order_index: habits.length + 1
      });
      setIsAddHabitOpen(false);
    }
    setNewHabitTitle('');
    setNewHabitTarget('1');
  };

  // Routine CRUD handlers
  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineTime || !routineActivity) return;

    if (editingRoutine) {
      updateRoutine(editingRoutine.id, {
        time_label: routineTime,
        activity: routineActivity,
        category: routineCategory
      });
      setEditingRoutine(null);
    } else {
      addRoutine({
        time_label: routineTime,
        activity: routineActivity,
        category: routineCategory,
        order_index: routines.length + 1,
        is_active: true
      });
      setIsAddRoutineOpen(false);
    }
    setRoutineTime('');
    setRoutineActivity('');
  };

  // Routine Reordering
  const moveRoutine = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= routines.length) return;

    const newRoutines = [...routines];
    const temp = newRoutines[index];
    newRoutines[index] = newRoutines[targetIndex];
    newRoutines[targetIndex] = temp;

    newRoutines.forEach((r, idx) => {
      updateRoutine(r.id, { order_index: idx + 1 });
    });
  };

  // Weekly task handler
  const handleAddWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeeklyTitle) return;
    addWeeklyTask(newWeeklyTitle);
    setNewWeeklyTitle('');
  };

  // CSV Export
  const handleExportHabits = () => {
    const rows = habits.map(h => {
      const { currentStreak, longestStreak } = calculateStreak(h.id, habitLogs);
      const isTodayDone = todayHabitLogs.some(l => l.habit_id === h.id && l.completed);
      return {
        'Habit ID': h.id,
        'Title': h.title,
        'Category': h.category,
        'Target': `${h.target_value} ${h.unit}`,
        'Active': h.is_active ? 'Yes' : 'No',
        'Done Today': isTodayDone ? 'Yes' : 'No',
        'Current Streak (Days)': currentStreak,
        'Longest Streak (Days)': longestStreak
      };
    });
    exportToCSV('MyLife_OS_Habits_Report', rows);
  };

  // Analytics Calculation for past 7 days
  const [last7DaysData, setLast7DaysData] = useState<any[]>([]);

  React.useEffect(() => {
    const data = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

      const activeH = habits.filter(h => h.is_active);
      const dayLogs = habitLogs.filter(l => l.date === dateStr && l.completed);
      const pct = activeH.length > 0 ? Math.round((dayLogs.length / activeH.length) * 100) : 0;

      return {
        date: dateStr,
        day: dayLabel,
        completion: pct,
        completed: dayLogs.length,
        total: activeH.length
      };
    });
    setLast7DaysData(data);
  }, [habits, habitLogs]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-lime-400 border border-black rounded shadow-[2px_2px_0px_#000]">
              <CheckCircle2 className="w-5 h-5 text-black" />
            </span>
            Daily Habit & Self-Care Tracker
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Tracking rituals for: <span className="text-blue-600 underline font-extrabold">{formatDisplayDate(selectedDate)}</span>
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
          <button
            onClick={() => setActiveSubTab('habits')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeSubTab === 'habits' ? 'bg-lime-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Daily Habits ({todayStats.completedHabits}/{todayStats.totalHabits})
          </button>
          <button
            onClick={() => setActiveSubTab('routine')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeSubTab === 'routine' ? 'bg-purple-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Routine Schedule ({routines.length})
          </button>
          <button
            onClick={() => setActiveSubTab('food')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeSubTab === 'food' ? 'bg-amber-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Food Tracker
          </button>
          <button
            onClick={() => setActiveSubTab('weekly')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeSubTab === 'weekly' ? 'bg-blue-600 text-white border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Weekly Tasks ({weeklyTasks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeSubTab === 'analytics' ? 'bg-rose-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Analytics & Streaks
          </button>
        </div>
      </div>

      {/* 1. DAILY HABITS CHECKLIST SUBTAB */}
      {activeSubTab === 'habits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider bg-lime-300 px-2.5 py-1 rounded border border-black shadow-[1.5px_1.5px_0px_#000]">
                {todayStats.completionPct}% Today Completed
              </span>
              <span className="text-xs text-zinc-500 font-bold hidden sm:inline">
                Historical records are preserved date-by-date
              </span>
            </div>

            <div className="flex items-center gap-2">
              <NeoButton variant="neutral" size="sm" onClick={handleExportHabits}>
                <Download className="w-3.5 h-3.5" /> Export CSV
              </NeoButton>
              <NeoButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingHabit(null);
                  setNewHabitTitle('');
                  setIsAddHabitOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Habit
              </NeoButton>
            </div>
          </div>

          {/* Habit Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map(habit => {
              const log = todayHabitLogs.find(l => l.habit_id === habit.id);
              const isCompleted = Boolean(log?.completed);
              const { currentStreak, longestStreak } = calculateStreak(habit.id, habitLogs);

              return (
                <NeoCard
                  key={habit.id}
                  variant={isCompleted ? 'green' : 'white'}
                  className={cn(
                    'p-4 flex flex-col justify-between transition-all',
                    !habit.is_active && 'opacity-60 bg-zinc-100'
                  )}
                >
                  <div>
                    {/* Header: Title, Category, Action Buttons */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-black text-white rounded">
                          {habit.category}
                        </span>
                        <h3 className={`text-base font-black mt-1 ${isCompleted ? 'text-zinc-900' : 'text-zinc-900'}`}>
                          {habit.title}
                        </h3>
                        {habit.description && (
                          <p className="text-[11px] font-bold text-zinc-600 line-clamp-1 mt-0.5">
                            {habit.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingHabit(habit);
                            setNewHabitTitle(habit.title);
                            setNewHabitCategory(habit.category);
                            setNewHabitUnit(habit.unit);
                            setNewHabitTarget(habit.target_value.toString());
                            setIsAddHabitOpen(true);
                          }}
                          className="p-1 hover:bg-black/10 rounded cursor-pointer"
                          title="Edit Habit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete habit "${habit.title}"?`)) deleteHabit(habit.id);
                          }}
                          className="p-1 hover:bg-rose-500 hover:text-white rounded cursor-pointer"
                          title="Delete Habit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Target & Units */}
                    <div className="text-xs font-bold text-zinc-700 mb-3">
                      Target: {habit.target_value} {habit.unit}
                    </div>

                    {/* Interactive Habit completion controls */}
                    {habit.unit === 'litres' ? (
                      <div className="p-2 bg-white/70 border border-black rounded mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold">
                          Current: {log?.value ?? 0} / {habit.target_value} L
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateHabitValue(habit.id, selectedDate, Math.max(0, (log?.value ?? 0) - 0.25))}
                            className="px-2 py-0.5 text-xs font-black bg-zinc-200 border border-black rounded"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateHabitValue(habit.id, selectedDate, Math.min(4.0, (log?.value ?? 0) + 0.25))}
                            className="px-2 py-0.5 text-xs font-black bg-blue-600 text-white border border-black rounded"
                          >
                            +250ml
                          </button>
                        </div>
                      </div>
                    ) : habit.unit === 'hours' ? (
                      <div className="p-2 bg-white/70 border border-black rounded mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold">
                          Logged: {log?.value ?? 0} hrs
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateHabitValue(habit.id, selectedDate, 8.0)}
                            className="px-2 py-0.5 text-xs font-black bg-purple-600 text-white border border-black rounded"
                          >
                            8 hrs
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Footer: Streak badges + Big Checkbox Toggle */}
                  <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 border border-black rounded">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                        {currentStreak}d streak
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500">
                        Max: {longestStreak}d
                      </span>
                    </div>

                    <button
                      onClick={() => toggleHabitComplete(habit.id, selectedDate)}
                      className={`px-3 py-1.5 text-xs font-black border-2 border-black rounded-md shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 ${
                        isCompleted
                          ? 'bg-black text-white hover:bg-zinc-800'
                          : 'bg-white text-black hover:bg-zinc-100'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" /> Done
                        </>
                      ) : (
                        'Mark Complete'
                      )}
                    </button>
                  </div>
                </NeoCard>
              );
            })}
          </div>

          {/* Add / Edit Habit Modal Dialog */}
          {isAddHabitOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                  <h3 className="font-black text-lg uppercase text-zinc-900">
                    {editingHabit ? 'Edit Habit' : 'Create New Habit'}
                  </h3>
                  <button
                    onClick={() => setIsAddHabitOpen(false)}
                    className="p-1 border border-black rounded bg-white hover:bg-rose-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveHabit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Habit Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 20-min Cold Shower"
                      value={newHabitTitle}
                      onChange={e => setNewHabitTitle(e.target.value)}
                      required
                      className="w-full neo-input"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Category</label>
                      <input
                        type="text"
                        value={newHabitCategory}
                        onChange={e => setNewHabitCategory(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Unit</label>
                      <select
                        value={newHabitUnit}
                        onChange={e => setNewHabitUnit(e.target.value as any)}
                        className="w-full neo-input"
                      >
                        <option value="boolean">Check (Yes/No)</option>
                        <option value="litres">Litres</option>
                        <option value="hours">Hours</option>
                        <option value="times">Count</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Daily Target</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newHabitTarget}
                        onChange={e => setNewHabitTarget(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                    <NeoButton type="button" variant="neutral" onClick={() => setIsAddHabitOpen(false)}>
                      Cancel
                    </NeoButton>
                    <NeoButton type="submit" variant="primary">
                      Save Habit
                    </NeoButton>
                  </div>
                </form>
              </NeoCard>
            </div>
          )}
        </div>
      )}

      {/* 2. EDITABLE ROUTINE SCHEDULE SUBTAB */}
      {activeSubTab === 'routine' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-white">
                Daily Routine Timeline & Order
              </h3>
              <p className="text-xs font-bold text-zinc-500">
                Prepopulated default schedule with full editing, reordering, and date tracking.
              </p>
            </div>

            <NeoButton
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingRoutine(null);
                setRoutineTime('');
                setRoutineActivity('');
                setIsAddRoutineOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Routine Slot
            </NeoButton>
          </div>

          {/* Routine List Table / Cards */}
          <div className="space-y-2.5">
            {routines.map((item, idx) => {
              const isCompleted = todayRoutineLogs.some(l => l.routine_id === item.id && l.completed);

              return (
                <NeoCard
                  key={item.id}
                  variant={isCompleted ? 'green' : 'white'}
                  className="p-3.5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Completion Checkbox */}
                    <button
                      onClick={() => toggleRoutineComplete(item.id, selectedDate)}
                      className={`w-6 h-6 rounded border-2 border-black flex items-center justify-center font-black cursor-pointer shadow-[1px_1px_0px_#000] ${
                        isCompleted ? 'bg-black text-white' : 'bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase bg-zinc-200 text-black px-2 py-0.5 border border-black rounded">
                          {item.time_label}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-zinc-500">
                          {item.category}
                        </span>
                      </div>
                      <div className={`text-sm font-black mt-1 ${isCompleted ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                        {item.activity}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Reorder up/down, Edit, Delete */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveRoutine(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 border border-black rounded bg-white hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveRoutine(idx, 'down')}
                      disabled={idx === routines.length - 1}
                      className="p-1 border border-black rounded bg-white hover:bg-zinc-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingRoutine(item);
                        setRoutineTime(item.time_label);
                        setRoutineActivity(item.activity);
                        setRoutineCategory(item.category);
                        setIsAddRoutineOpen(true);
                      }}
                      className="p-1 border border-black rounded bg-white hover:bg-amber-300 cursor-pointer"
                      title="Edit Slot"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.activity}"?`)) deleteRoutine(item.id);
                      }}
                      className="p-1 border border-black rounded bg-white hover:bg-rose-400 cursor-pointer"
                      title="Delete Slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </NeoCard>
              );
            })}
          </div>

          {/* Add / Edit Routine Slot Modal */}
          {isAddRoutineOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                  <h3 className="font-black text-lg uppercase text-zinc-900">
                    {editingRoutine ? 'Edit Routine Time Slot' : 'Add Routine Time Slot'}
                  </h3>
                  <button
                    onClick={() => setIsAddRoutineOpen(false)}
                    className="p-1 border border-black rounded bg-white hover:bg-rose-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSaveRoutine} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Time Label</label>
                      <input
                        type="text"
                        placeholder="e.g. 6:00 AM or Morning"
                        value={routineTime}
                        onChange={e => setRoutineTime(e.target.value)}
                        required
                        className="w-full neo-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Category</label>
                      <select
                        value={routineCategory}
                        onChange={e => setRoutineCategory(e.target.value as RoutineCategory)}
                        className="w-full neo-input"
                      >
                        <option value="morning">Morning</option>
                        <option value="exercise">Exercise</option>
                        <option value="food">Food</option>
                        <option value="college">College</option>
                        <option value="evening">Evening</option>
                        <option value="night">Night</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Activity</label>
                    <input
                      type="text"
                      placeholder="e.g. Exercise + rose water"
                      value={routineActivity}
                      onChange={e => setRoutineActivity(e.target.value)}
                      required
                      className="w-full neo-input"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                    <NeoButton type="button" variant="neutral" onClick={() => setIsAddRoutineOpen(false)}>
                      Cancel
                    </NeoButton>
                    <NeoButton type="submit" variant="primary">
                      Save Slot
                    </NeoButton>
                  </div>
                </form>
              </NeoCard>
            </div>
          )}
        </div>
      )}

      {/* 3. FOOD TRACKER SUBTAB */}
      {activeSubTab === 'food' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-white">
                Daily Food & Nutrition Log
              </h3>
              <p className="text-xs font-bold text-zinc-500">
                Track morning, afternoon, evening meals, soya/paneer preferences and ABC juice.
              </p>
            </div>

            <NeoButton variant="secondary" size="sm" onClick={() => setShowAddFood(!showAddFood)}>
              <Plus className="w-4 h-4" /> Add Custom Meal
            </NeoButton>
          </div>

          {/* Seeded Default Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Morning Meal */}
            <NeoCard variant="white" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="text-xs font-black uppercase bg-amber-300 px-2 py-0.5 border border-black rounded">
                    Morning Meal
                  </span>
                  <Utensils className="w-4 h-4 text-amber-700" />
                </div>
                <h4 className="font-black text-sm text-zinc-900 mb-1">Breakfast & Hydration</h4>
                <p className="text-xs font-bold text-zinc-700 bg-[#FAF6EE] p-2.5 border border-black rounded mb-2">
                  Oats, banana, milk, ABC juice
                </p>
                <div className="text-[11px] font-medium text-zinc-500">
                  Rich in antioxidants, beta-carotene, and sustained morning energy.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-600">
                  {todayFoodLogs.some(f => f.meal_type === 'morning' && f.completed) ? 'Logged ✓' : 'Pending'}
                </span>
                <button
                  onClick={() => toggleFoodMeal('morning', selectedDate)}
                  className={`px-3 py-1 text-xs font-black border-2 border-black rounded cursor-pointer ${
                    todayFoodLogs.some(f => f.meal_type === 'morning' && f.completed)
                      ? 'bg-lime-400 text-black'
                      : 'bg-white text-zinc-800'
                  }`}
                >
                  {todayFoodLogs.some(f => f.meal_type === 'morning' && f.completed) ? 'Completed ✓' : 'Mark Eaten'}
                </button>
              </div>
            </NeoCard>

            {/* Afternoon Meal */}
            <NeoCard variant="white" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="text-xs font-black uppercase bg-blue-500 text-white px-2 py-0.5 border border-black rounded">
                    Afternoon Meal
                  </span>
                  <Utensils className="w-4 h-4 text-blue-700" />
                </div>
                <h4 className="font-black text-sm text-zinc-900 mb-1">High-Protein Lunch</h4>
                <p className="text-xs font-bold text-zinc-700 bg-[#FAF6EE] p-2.5 border border-black rounded mb-2">
                  Flexible meal; soya / paneer preferred
                </p>
                <div className="text-[11px] font-medium text-zinc-500">
                  Soya chunks or paneer provide high plant-based protein for recovery.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-600">
                  {todayFoodLogs.some(f => f.meal_type === 'afternoon' && f.completed) ? 'Logged ✓' : 'Pending'}
                </span>
                <button
                  onClick={() => toggleFoodMeal('afternoon', selectedDate)}
                  className={`px-3 py-1 text-xs font-black border-2 border-black rounded cursor-pointer ${
                    todayFoodLogs.some(f => f.meal_type === 'afternoon' && f.completed)
                      ? 'bg-lime-400 text-black'
                      : 'bg-white text-zinc-800'
                  }`}
                >
                  {todayFoodLogs.some(f => f.meal_type === 'afternoon' && f.completed) ? 'Completed ✓' : 'Mark Eaten'}
                </button>
              </div>
            </NeoCard>

            {/* Evening Meal */}
            <NeoCard variant="white" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="text-xs font-black uppercase bg-purple-400 text-black px-2 py-0.5 border border-black rounded">
                    Evening Meal
                  </span>
                  <Utensils className="w-4 h-4 text-purple-700" />
                </div>
                <h4 className="font-black text-sm text-zinc-900 mb-1">Recovery & Digestion</h4>
                <p className="text-xs font-bold text-zinc-700 bg-[#FAF6EE] p-2.5 border border-black rounded mb-2">
                  Soya, buttermilk, nellikkai (amla) mix
                </p>
                <div className="text-[11px] font-medium text-zinc-500">
                  Nellikkai (Amla) provides Vitamin C, gut flora boost, and natural immunity.
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-600">
                  {todayFoodLogs.some(f => f.meal_type === 'evening' && f.completed) ? 'Logged ✓' : 'Pending'}
                </span>
                <button
                  onClick={() => toggleFoodMeal('evening', selectedDate)}
                  className={`px-3 py-1 text-xs font-black border-2 border-black rounded cursor-pointer ${
                    todayFoodLogs.some(f => f.meal_type === 'evening' && f.completed)
                      ? 'bg-lime-400 text-black'
                      : 'bg-white text-zinc-800'
                  }`}
                >
                  {todayFoodLogs.some(f => f.meal_type === 'evening' && f.completed) ? 'Completed ✓' : 'Mark Eaten'}
                </button>
              </div>
            </NeoCard>
          </div>

          {/* Custom Meals Form */}
          {showAddFood && (
            <NeoCard className="p-4 bg-amber-50">
              <h4 className="text-xs font-black uppercase mb-3">Add Custom Meal / Food Note</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Meal Type</label>
                  <select
                    value={customMealType}
                    onChange={e => setCustomMealType(e.target.value as any)}
                    className="w-full neo-input"
                  >
                    <option value="custom">Custom Meal / Snack</option>
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Items Eaten</label>
                  <input
                    type="text"
                    placeholder="e.g. Boiled eggs + flax seeds"
                    value={customMealItems}
                    onChange={e => setCustomMealItems(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Food Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Felt light, good energy"
                    value={customMealNotes}
                    onChange={e => setCustomMealNotes(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <NeoButton
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    if (!customMealItems) return;
                    addCustomFoodMeal(customMealType, selectedDate, customMealItems, customMealNotes);
                    setCustomMealItems('');
                    setCustomMealNotes('');
                    setShowAddFood(false);
                  }}
                >
                  Save Food Entry
                </NeoButton>
              </div>
            </NeoCard>
          )}
        </div>
      )}

      {/* 4. WEEKLY CHECKLIST SUBTAB */}
      {activeSubTab === 'weekly' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black uppercase text-zinc-900 dark:text-white">
                Weekly Checklist Tasks
              </h3>
              <p className="text-xs font-bold text-zinc-500">
                Customizable weekly deliverables and milestones with deadlines.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddWeekly} className="flex gap-2">
            <input
              type="text"
              placeholder="Add new weekly deliverable..."
              value={newWeeklyTitle}
              onChange={e => setNewWeeklyTitle(e.target.value)}
              className="flex-1 neo-input"
            />
            <NeoButton type="submit" variant="primary">
              <Plus className="w-4 h-4" /> Add Task
            </NeoButton>
          </form>

          <div className="space-y-2.5">
            {weeklyTasks.map(task => (
              <NeoCard
                key={task.id}
                variant={task.completed ? 'green' : 'white'}
                className="p-3.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleWeeklyTask(task.id)}
                    className={`w-6 h-6 rounded border-2 border-black flex items-center justify-center font-black cursor-pointer ${
                      task.completed ? 'bg-black text-white' : 'bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </button>
                  <div>
                    <div className={`text-sm font-black ${task.completed ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                      {task.title}
                    </div>
                    {task.deadline && (
                      <div className="text-[11px] font-bold text-rose-600">
                        Deadline: {task.deadline}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteWeeklyTask(task.id)}
                  className="p-1 hover:bg-rose-500 hover:text-white rounded border border-black cursor-pointer"
                  title="Delete Task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </NeoCard>
            ))}
          </div>
        </div>
      )}

      {/* 5. PROGRESS ANALYTICS & STREAKS SUBTAB */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <NeoCard variant="white" className="p-4 text-center">
              <div className="text-xs font-black uppercase text-zinc-500 mb-1">Today's Completion</div>
              <div className="text-3xl font-black text-blue-600">{todayStats.completionPct}%</div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">
                {todayStats.completedHabits} of {todayStats.totalHabits} habits
              </div>
            </NeoCard>

            <NeoCard variant="white" className="p-4 text-center">
              <div className="text-xs font-black uppercase text-zinc-500 mb-1">Hydration Rate</div>
              <div className="text-3xl font-black text-emerald-600">
                {todayStats.waterLiters.toFixed(1)}L
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">Target: 2.0 Litres</div>
            </NeoCard>

            <NeoCard variant="white" className="p-4 text-center">
              <div className="text-xs font-black uppercase text-zinc-500 mb-1">Sleep Rest</div>
              <div className="text-3xl font-black text-purple-600">{todayStats.sleepHours}h</div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">Optimal Target: 8.0 hrs</div>
            </NeoCard>

            <NeoCard variant="white" className="p-4 text-center">
              <div className="text-xs font-black uppercase text-zinc-500 mb-1">Top Active Streak</div>
              <div className="text-3xl font-black text-amber-500">
                {Math.max(...habits.map(h => calculateStreak(h.id, habitLogs).currentStreak), 0)}d
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">Consecutive days</div>
            </NeoCard>
          </div>

          {/* 7-Day Completion Bar Chart */}
          <NeoCard variant="white" className="p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-300 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <BarChart2 className="w-4 h-4 text-black" />
                </span>
                <h3 className="font-black text-base uppercase text-zinc-900">
                  Weekly Habit Performance (%)
                </h3>
              </div>
              <span className="text-xs font-bold text-zinc-500">Last 7 Days</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7DaysData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#000" fontWeight="bold" fontSize={12} />
                  <YAxis stroke="#000" fontWeight="bold" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF6EE',
                      border: '2px solid #000',
                      boxShadow: '3px 3px 0px #000',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                    {last7DaysData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.completion >= 80 ? '#84CC16' : entry.completion >= 50 ? '#FACC15' : '#2563EB'}
                        stroke="#000"
                        strokeWidth={2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeoCard>

          {/* Habit by Habit Consistency Matrix */}
          <NeoCard variant="white" className="p-5">
            <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-3">
              Individual Habit Consistency
            </h3>
            <div className="space-y-3">
              {habits.map(h => {
                const { currentStreak, longestStreak } = calculateStreak(h.id, habitLogs);
                const totalCompleted = habitLogs.filter(l => l.habit_id === h.id && l.completed).length;

                return (
                  <div key={h.id} className="p-3 bg-[#FAF6EE] border-2 border-black rounded flex items-center justify-between">
                    <div>
                      <div className="font-black text-xs text-zinc-900">{h.title}</div>
                      <div className="text-[11px] font-bold text-zinc-500">
                        Total Recorded Check-ins: {totalCompleted} days
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-amber-300 px-2 py-0.5 border border-black rounded">
                        Current: {currentStreak}d
                      </span>
                      <span className="text-xs font-bold text-zinc-700">
                        Longest: {longestStreak}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </NeoCard>
        </div>
      )}
    </div>
  );
};
