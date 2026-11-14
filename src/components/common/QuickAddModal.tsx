'use client';

import React, { useState } from 'react';
import { NeoCard } from './NeoCard';
import { NeoButton } from './NeoButton';
import { useApp } from '@/context/AppContext';
import { X, Plus, Calendar, DollarSign, CheckSquare, Clock, ShoppingBag, Briefcase } from 'lucide-react';
import { Priority, TransactionType, RoutineCategory, SemesterTag } from '@/types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'transaction' | 'task' | 'habit' | 'shopping' | 'routine';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'transaction'
}) => {
  const {
    addTransaction,
    addHabit,
    addRoutine,
    addCareerTask,
    addShoppingItem,
    addPersonalTask,
    savingsGoals,
    selectedDate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'transaction' | 'task' | 'habit' | 'shopping' | 'routine'>(defaultTab);

  // Transaction form state
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState('Food & Groceries');
  const [txDescription, setTxDescription] = useState('');
  const [txSavingsGoalId, setTxSavingsGoalId] = useState('');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<'personal' | 'career'>('career');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskSemester, setTaskSemester] = useState<SemesterTag>('general');

  // Habit form state
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState('Wellness');
  const [habitUnit, setHabitUnit] = useState<'boolean' | 'litres' | 'hours' | 'times'>('boolean');
  const [habitTarget, setHabitTarget] = useState('1');

  // Routine form state
  const [routineTime, setRoutineTime] = useState('');
  const [routineActivity, setRoutineActivity] = useState('');
  const [routineCategory, setRoutineCategory] = useState<RoutineCategory>('general');

  // Shopping form state
  const [shopName, setShopName] = useState('');
  const [shopQuantity, setShopQuantity] = useState('1');
  const [shopCategory, setShopCategory] = useState('Self-Care / Health');
  const [shopPrice, setShopPrice] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'transaction') {
      if (!txAmount || !txDescription) return;
      addTransaction({
        amount: parseFloat(txAmount),
        type: txType,
        category: txCategory,
        date: selectedDate,
        description: txDescription,
        savings_goal_id: txSavingsGoalId || undefined
      });
    } else if (activeTab === 'task') {
      if (!taskTitle) return;
      if (taskType === 'personal') {
        addPersonalTask({
          title: taskTitle,
          status: 'pending',
          priority: taskPriority,
          deadline: taskDeadline || undefined,
          category: 'administrative'
        });
      } else {
        addCareerTask({
          title: taskTitle,
          status: 'not_started',
          priority: taskPriority,
          deadline: taskDeadline || undefined,
          semester: taskSemester,
          roadmap_category: 'current_tasks'
        });
      }
    } else if (activeTab === 'habit') {
      if (!habitTitle) return;
      addHabit({
        title: habitTitle,
        category: habitCategory,
        unit: habitUnit,
        target_value: parseFloat(habitTarget) || 1,
        color: '#2563EB',
        is_active: true,
        order_index: 99
      });
    } else if (activeTab === 'routine') {
      if (!routineTime || !routineActivity) return;
      addRoutine({
        time_label: routineTime,
        activity: routineActivity,
        category: routineCategory,
        order_index: 99,
        is_active: true
      });
    } else if (activeTab === 'shopping') {
      if (!shopName) return;
      addShoppingItem(
        shopName,
        shopQuantity || '1 item',
        shopCategory,
        shopPrice ? parseFloat(shopPrice) : undefined
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <NeoCard className="w-full max-w-lg bg-[#FAF6EE] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-300 border-2 border-black rounded shadow-[2px_2px_0px_#000]">
              <Plus className="w-5 h-5 text-black" />
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900">Quick Add Action</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black rounded hover:bg-rose-400 bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Tab selection buttons */}
        <div className="grid grid-cols-5 gap-1.5 mb-5 p-1 bg-white border-2 border-black rounded-md">
          <button
            type="button"
            onClick={() => setActiveTab('transaction')}
            className={`py-1.5 text-xs font-bold rounded flex flex-col items-center gap-1 border ${
              activeTab === 'transaction'
                ? 'bg-amber-300 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'border-transparent text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Money</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`py-1.5 text-xs font-bold rounded flex flex-col items-center gap-1 border ${
              activeTab === 'task'
                ? 'bg-blue-600 text-white border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'border-transparent text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('habit')}
            className={`py-1.5 text-xs font-bold rounded flex flex-col items-center gap-1 border ${
              activeTab === 'habit'
                ? 'bg-lime-400 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'border-transparent text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('routine')}
            className={`py-1.5 text-xs font-bold rounded flex flex-col items-center gap-1 border ${
              activeTab === 'routine'
                ? 'bg-purple-300 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'border-transparent text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Routine</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shopping')}
            className={`py-1.5 text-xs font-bold rounded flex flex-col items-center gap-1 border ${
              activeTab === 'shopping'
                ? 'bg-rose-400 border-black shadow-[1.5px_1.5px_0px_#000]'
                : 'border-transparent text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>
        </div>

        {/* Dynamic Form per Tab */}
        <form onSubmit={handleCreate} className="space-y-4">
          {activeTab === 'transaction' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'expense' ? 'bg-rose-400 shadow-[2px_2px_0px_#000]' : 'bg-white'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'income' ? 'bg-lime-400 shadow-[2px_2px_0px_#000]' : 'bg-white'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('savings_deposit')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'savings_deposit' ? 'bg-amber-300 shadow-[2px_2px_0px_#000]' : 'bg-white'
                    }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Amount (₹ INR)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  required
                  min="1"
                  className="w-full neo-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Oats & fruit juice supplies"
                  value={txDescription}
                  onChange={e => setTxDescription(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={e => setTxCategory(e.target.value)}
                    className="w-full neo-input"
                  >
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Self-Care & Nutrition">Self-Care & Nutrition</option>
                    <option value="Savings Contribution">Savings Contribution</option>
                    <option value="College & Studies">College & Studies</option>
                    <option value="Transport">Transport</option>
                    <option value="Personal / Social">Personal / Social</option>
                    <option value="Salary / Allowance">Salary / Allowance</option>
                  </select>
                </div>

                {txType === 'savings_deposit' && (
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Allocate to Goal</label>
                    <select
                      value={txSavingsGoalId}
                      onChange={e => setTxSavingsGoalId(e.target.value)}
                      className="w-full neo-input"
                    >
                      <option value="">General Emergency Reserve</option>
                      {savingsGoals.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.title} (₹{g.saved_amount}/₹{g.target_amount})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'task' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Task Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaskType('career')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      taskType === 'career' ? 'bg-blue-600 text-white shadow-[2px_2px_0px_#000]' : 'bg-white'
                    }`}
                  >
                    Career / Coding
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskType('personal')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      taskType === 'personal' ? 'bg-amber-300 shadow-[2px_2px_0px_#000]' : 'bg-white'
                    }`}
                  >
                    Personal / Admin (Bank, KYC)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  placeholder={taskType === 'career' ? 'e.g. Complete AI Video Set 3' : 'e.g. Bank KYC submission'}
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Priority)}
                    className="w-full neo-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Deadline</label>
                  <input
                    type="date"
                    value={taskDeadline}
                    onChange={e => setTaskDeadline(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>

              {taskType === 'career' && (
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Roadmap Segment</label>
                  <select
                    value={taskSemester}
                    onChange={e => setTaskSemester(e.target.value as SemesterTag)}
                    className="w-full neo-input"
                  >
                    <option value="general">Current Active Sprint</option>
                    <option value="semester_4">Semester 4 Roadmap</option>
                    <option value="semester_5">Semester 5 Roadmap</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {activeTab === 'habit' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cold shower & breathwork"
                  value={habitTitle}
                  onChange={e => setHabitTitle(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={habitCategory}
                    onChange={e => setHabitCategory(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Unit</label>
                  <select
                    value={habitUnit}
                    onChange={e => setHabitUnit(e.target.value as any)}
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
                    value={habitTarget}
                    onChange={e => setHabitTarget(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routine' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Time Slot / Label</label>
                  <input
                    type="text"
                    placeholder="e.g. 7:00 AM or Morning"
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
                <label className="block text-xs font-bold uppercase mb-1">Activity Description</label>
                <input
                  type="text"
                  placeholder="e.g. Green tea + journal notes"
                  value={routineActivity}
                  onChange={e => setRoutineActivity(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
            </div>
          )}

          {activeTab === 'shopping' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nellikkai / Amla powder"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Quantity</label>
                  <input
                    type="text"
                    value={shopQuantity}
                    onChange={e => setShopQuantity(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <input
                    type="text"
                    value={shopCategory}
                    onChange={e => setShopCategory(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Est. Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={shopPrice}
                    onChange={e => setShopPrice(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t-2 border-black">
            <NeoButton type="button" variant="neutral" onClick={onClose}>
              Cancel
            </NeoButton>
            <NeoButton type="submit" variant="primary">
              <Plus className="w-4 h-4" /> Save Record
            </NeoButton>
          </div>
        </form>
      </NeoCard>
    </div>
  );
};

