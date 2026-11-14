'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { formatINR, exportToCSV } from '@/lib/utils';
import {
  PiggyBank,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  Download,
  Filter,
  ShoppingBag,
  DollarSign
} from 'lucide-react';
import { Priority, SavingsGoal, Transaction, TransactionType } from '@/types';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const SavingsModule: React.FC = () => {
  const {
    financialStats,
    transactions,
    savingsGoals,
    addTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    settings,
    updateSettings,
    selectedDate
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'goals' | 'plan'>('dashboard');

  // Transaction form modal
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [txCategory, setTxCategory] = useState('Food & Groceries');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(selectedDate);
  const [txNotes, setTxNotes] = useState('');
  const [txGoalId, setTxGoalId] = useState('');

  // Purchase Goal form modal
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalSaved, setGoalSaved] = useState('0');
  const [goalPriority, setGoalPriority] = useState<Priority>('medium');

  // Plan targets form
  const [monthlyTargetInput, setMonthlyTargetInput] = useState(settings.monthly_savings_target.toString());
  const [futureTargetInput, setFutureTargetInput] = useState(settings.future_savings_target.toString());

  // Filter for transactions
  const [txFilterType, setTxFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter(t => {
    if (txFilterType === 'all') return true;
    return t.type === txFilterType;
  });

  // Handle Add Transaction
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || !txDescription) return;

    addTransaction({
      amount: parseFloat(txAmount),
      type: txType,
      category: txCategory,
      date: txDate || selectedDate,
      description: txDescription,
      notes: txNotes || undefined,
      savings_goal_id: txGoalId || undefined
    });

    setTxAmount('');
    setTxDescription('');
    setTxNotes('');
    setIsTxModalOpen(false);
  };

  // Handle Add Goal
  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    addSavingsGoal({
      title: goalTitle,
      target_amount: parseFloat(goalTarget),
      saved_amount: parseFloat(goalSaved) || 0,
      priority: goalPriority,
      status: 'active'
    });

    setGoalTitle('');
    setGoalTarget('');
    setGoalSaved('0');
    setIsGoalModalOpen(false);
  };

  // CSV Export
  const handleExportTransactions = () => {
    const rows = transactions.map(t => ({
      'ID': t.id,
      'Date': t.date,
      'Description': t.description,
      'Type': t.type,
      'Category': t.category,
      'Amount (INR)': t.amount,
      'Notes': t.notes || ''
    }));
    exportToCSV('MyLife_OS_Transactions_Report', rows);
  };

  // Monthly summary bar chart data
  const monthlyData = [
    {
      name: 'Income',
      amount: financialStats.totalIncome,
      fill: '#10B981'
    },
    {
      name: 'Expenses',
      amount: financialStats.totalExpenses,
      fill: '#EF4444'
    },
    {
      name: 'Savings',
      amount: financialStats.totalSavings,
      fill: '#FACC15'
    }
  ];

  // Expense Category Breakdown for Pie Chart
  const expenseCategories = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expenseCategories).map(([name, value]) => ({
    name,
    value
  }));

  const PIE_COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-amber-300 border border-black rounded shadow-[2px_2px_0px_#000]">
              <PiggyBank className="w-5 h-5 text-black" />
            </span>
            Savings & Expense Tracker
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Personal Cash Flow • ₹{settings.monthly_savings_target} Monthly Plan • Purchase Goals • True Net Worth
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'dashboard' ? 'bg-amber-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'transactions' ? 'bg-blue-600 text-white border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'goals' ? 'bg-lime-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Purchase Goals ({savingsGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'plan' ? 'bg-rose-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Monthly Targets
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Savings */}
            <NeoCard variant="white" className="p-4 border-2 border-black flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-zinc-500">Total Savings</span>
                <span className="p-1 bg-amber-300 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <PiggyBank className="w-3.5 h-3.5 text-black" />
                </span>
              </div>
              <div className="text-2xl font-black text-amber-600">
                {formatINR(financialStats.totalSavings)}
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">
                Net contributions preserved
              </div>
            </NeoCard>

            {/* Monthly Target Progress */}
            <NeoCard variant="white" className="p-4 border-2 border-black flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-zinc-500">Monthly Savings</span>
                <span className="p-1 bg-lime-400 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <Target className="w-3.5 h-3.5 text-black" />
                </span>
              </div>
              <div className="text-2xl font-black text-lime-700">
                {formatINR(financialStats.monthlySavings)}
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">
                Target: {formatINR(financialStats.monthlyTarget)} ({financialStats.savingsTargetProgressPct}%)
              </div>
            </NeoCard>

            {/* Total Expenses */}
            <NeoCard variant="white" className="p-4 border-2 border-black flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-zinc-500">Total Expenses</span>
                <span className="p-1 bg-rose-400 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <ArrowDownRight className="w-3.5 h-3.5 text-black" />
                </span>
              </div>
              <div className="text-2xl font-black text-rose-600">
                {formatINR(financialStats.totalExpenses)}
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">
                Operational spending
              </div>
            </NeoCard>

            {/* Available Balance */}
            <NeoCard variant="white" className="p-4 border-2 border-black flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-zinc-500">Available Balance</span>
                <span className="p-1 bg-blue-600 text-white border border-black rounded shadow-[1px_1px_0px_#000]">
                  <Wallet className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="text-2xl font-black text-blue-700">
                {formatINR(financialStats.availableBalance)}
              </div>
              <div className="text-[11px] font-bold text-zinc-600 mt-1">
                Cash in bank / pocket
              </div>
            </NeoCard>
          </div>

          {/* Charts Row: Income vs Expense Bar + Expense Breakdown Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income vs Expense vs Savings */}
            <NeoCard variant="white" className="p-5">
              <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4">
                Cashflow Breakdown (INR ₹)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#000" fontWeight="bold" fontSize={12} />
                    <YAxis stroke="#000" fontWeight="bold" fontSize={12} />
                    <Tooltip
                      formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                      contentStyle={{
                        backgroundColor: '#FAF6EE',
                        border: '2px solid #000',
                        boxShadow: '3px 3px 0px #000',
                        fontWeight: 'bold'
                      }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </NeoCard>

            {/* Expense Categories Breakdown */}
            <NeoCard variant="white" className="p-5">
              <h3 className="font-black text-sm uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4">
                Expense Category Allocations
              </h3>
              {pieData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        stroke="#000"
                        strokeWidth={2}
                        label={({ name, percent }: any) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatINR(Number(val)), 'Total Spent']}
                        contentStyle={{
                          backgroundColor: '#FAF6EE',
                          border: '2px solid #000',
                          boxShadow: '3px 3px 0px #000',
                          fontWeight: 'bold'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-xs font-bold text-zinc-500">
                  No expense records logged yet.
                </div>
              )}
            </NeoCard>
          </div>

          {/* Purchase Goals Progress Bars */}
          <NeoCard variant="white" className="p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-lime-400 border border-black rounded shadow-[1px_1px_0px_#000]">
                  <ShoppingBag className="w-4 h-4 text-black" />
                </span>
                <h3 className="font-black text-sm uppercase text-zinc-900">
                  Purchase Goals Progress Bars
                </h3>
              </div>
              <NeoButton variant="secondary" size="sm" onClick={() => setIsGoalModalOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Add Goal
              </NeoButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savingsGoals.map(goal => {
                const remaining = Math.max(0, goal.target_amount - goal.saved_amount);
                const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));
                return (
                  <div key={goal.id} className="p-3 bg-[#FAF6EE] border-2 border-black rounded-lg">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-black text-sm text-zinc-900">{goal.title}</span>
                      <span className="text-xs font-black bg-amber-300 px-2 py-0.5 border border-black rounded">
                        {pct}% Saved
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 border border-black rounded-full h-3 overflow-hidden mb-2">
                      <div className="bg-lime-500 h-full transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
                      <span>Saved: {formatINR(goal.saved_amount)}</span>
                      <span>Target: {formatINR(goal.target_amount)}</span>
                    </div>
                    <div className="text-[11px] font-extrabold text-blue-700 mt-1">
                      Remaining to save: {formatINR(remaining)}
                    </div>
                  </div>
                );
              })}
            </div>
          </NeoCard>
        </div>
      )}

      {/* 2. TRANSACTIONS SUBTAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">Filter Type:</span>
              <select
                value={txFilterType}
                onChange={e => setTxFilterType(e.target.value)}
                className="neo-input text-xs py-1"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="savings_deposit">Savings Deposit</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <NeoButton variant="neutral" size="sm" onClick={handleExportTransactions}>
                <Download className="w-3.5 h-3.5" /> Export CSV
              </NeoButton>
              <NeoButton variant="primary" size="sm" onClick={() => setIsTxModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Transaction
              </NeoButton>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredTransactions.map(tx => {
              const isIncome = tx.type === 'income';
              const isExpense = tx.type === 'expense';
              const isSavings = tx.type === 'savings_deposit' || tx.type === 'savings_withdrawal';

              return (
                <NeoCard
                  key={tx.id}
                  variant="white"
                  className="p-3.5 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`p-2 rounded border-2 border-black font-black text-xs ${
                        isIncome
                          ? 'bg-emerald-400 text-black'
                          : isExpense
                          ? 'bg-rose-400 text-black'
                          : 'bg-amber-300 text-black'
                      }`}
                    >
                      {isIncome ? '+₹' : isExpense ? '-₹' : '💾'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-900">{tx.description}</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 bg-zinc-100 border border-black rounded">
                          {tx.category}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-zinc-500 mt-0.5">
                        {tx.date} {tx.notes ? `• ${tx.notes}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`text-base font-black ${
                        isIncome ? 'text-emerald-700' : isExpense ? 'text-rose-600' : 'text-amber-700'
                      }`}
                    >
                      {isIncome ? '+' : isExpense ? '-' : ''}
                      {formatINR(tx.amount)}
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Delete transaction "${tx.description}"?`)) deleteTransaction(tx.id);
                      }}
                      className="p-1 hover:bg-rose-400 border border-black rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </NeoCard>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. PURCHASE GOALS SUBTAB */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-lime-300 px-2.5 py-1 rounded border border-black">
              Target Purchase Allocations (Trimmer, Shirts, Pants, Friends)
            </span>
            <NeoButton variant="primary" size="sm" onClick={() => setIsGoalModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Purchase Goal
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map(goal => {
              const remaining = Math.max(0, goal.target_amount - goal.saved_amount);
              const pct = Math.min(100, Math.round((goal.saved_amount / goal.target_amount) * 100));

              return (
                <NeoCard key={goal.id} variant="white" className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase px-2 py-0.5 bg-amber-300 border border-black rounded">
                        Priority: {goal.priority}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete goal "${goal.title}"?`)) deleteSavingsGoal(goal.id);
                        }}
                        className="p-1 hover:bg-rose-400 border border-black rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <h4 className="text-lg font-black text-zinc-900 mb-1">{goal.title}</h4>
                    {goal.notes && <p className="text-xs text-zinc-600 font-medium mb-2">{goal.notes}</p>}

                    <div className="w-full bg-zinc-200 border-2 border-black rounded-full h-3.5 overflow-hidden mb-2">
                      <div className="bg-lime-400 h-full" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="flex justify-between text-xs font-bold text-zinc-700">
                      <span>Saved: {formatINR(goal.saved_amount)}</span>
                      <span>Target: {formatINR(goal.target_amount)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                    <span className="text-xs font-extrabold text-blue-700">
                      Need: {formatINR(remaining)}
                    </span>
                    <NeoButton
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const amt = prompt(`Enter amount to add to "${goal.title}":`, '200');
                        if (amt && parseFloat(amt) > 0) {
                          addTransaction({
                            amount: parseFloat(amt),
                            type: 'savings_deposit',
                            category: 'Savings Contribution',
                            date: selectedDate,
                            description: `Allocated to ${goal.title}`,
                            savings_goal_id: goal.id
                          });
                        }
                      }}
                    >
                      + Save Towards Goal
                    </NeoButton>
                  </div>
                </NeoCard>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MONTHLY TARGETS PLAN SUBTAB */}
      {activeTab === 'plan' && (
        <div className="space-y-6 max-w-xl">
          <NeoCard variant="white" className="p-6">
            <h3 className="font-black text-lg uppercase text-zinc-900 border-b-2 border-black pb-2 mb-4">
              Monthly Savings Target Plan
            </h3>
            <p className="text-xs font-bold text-zinc-600 mb-4">
              Configure your core financial milestones. The initial monthly target is seeded at ₹1,000,
              with a future progression target of ₹2,000.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Current Monthly Target (₹ INR)
                </label>
                <input
                  type="number"
                  value={monthlyTargetInput}
                  onChange={e => setMonthlyTargetInput(e.target.value)}
                  className="w-full neo-input"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">
                  Future Target (₹ INR)
                </label>
                <input
                  type="number"
                  value={futureTargetInput}
                  onChange={e => setFutureTargetInput(e.target.value)}
                  className="w-full neo-input"
                />
              </div>

              <div className="pt-2">
                <NeoButton
                  variant="primary"
                  onClick={() => {
                    updateSettings({
                      monthly_savings_target: parseFloat(monthlyTargetInput) || 1000,
                      future_savings_target: parseFloat(futureTargetInput) || 2000
                    });
                    alert('Savings targets updated successfully!');
                  }}
                >
                  Save New Targets
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </div>
      )}

      {/* Transaction Modal */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-lg uppercase text-zinc-900">Add Transaction</h3>
              <button onClick={() => setIsTxModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
            </div>
            <form onSubmit={handleSaveTransaction} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('expense')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'expense' ? 'bg-rose-400' : 'bg-white'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('income')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'income' ? 'bg-lime-400' : 'bg-white'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxType('savings_deposit')}
                    className={`py-1.5 text-xs font-bold border-2 border-black rounded ${
                      txType === 'savings_deposit' ? 'bg-amber-300' : 'bg-white'
                    }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={txAmount}
                  onChange={e => setTxAmount(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Soya & oatmeal breakfast items"
                  value={txDescription}
                  onChange={e => setTxDescription(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Category</label>
                  <select
                    value={txCategory}
                    onChange={e => setTxCategory(e.target.value)}
                    className="w-full neo-input"
                  >
                    <option value="Food & Groceries">Food & Groceries</option>
                    <option value="Self-Care & Nutrition">Self-Care & Nutrition</option>
                    <option value="Transport">Transport</option>
                    <option value="Education">Education</option>
                    <option value="Social & Friends">Social & Friends</option>
                    <option value="Salary / Allowance">Salary / Allowance</option>
                    <option value="Savings Contribution">Savings Contribution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={e => setTxDate(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <NeoButton type="button" variant="neutral" onClick={() => setIsTxModalOpen(false)}>Cancel</NeoButton>
                <NeoButton type="submit" variant="primary">Record</NeoButton>
              </div>
            </form>
          </NeoCard>
        </div>
      )}

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-lg uppercase text-zinc-900">Add Purchase Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
            </div>
            <form onSubmit={handleSaveGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Trimmer or Formal Shoes"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="1500"
                    value={goalTarget}
                    onChange={e => setGoalTarget(e.target.value)}
                    required
                    className="w-full neo-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Initial Saved (₹)</label>
                  <input
                    type="number"
                    value={goalSaved}
                    onChange={e => setGoalSaved(e.target.value)}
                    className="w-full neo-input"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <NeoButton type="button" variant="neutral" onClick={() => setIsGoalModalOpen(false)}>Cancel</NeoButton>
                <NeoButton type="submit" variant="primary">Create Goal</NeoButton>
              </div>
            </form>
          </NeoCard>
        </div>
      )}
    </div>
  );
};

