'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { exportToCSV } from '@/lib/utils';
import {
  ListTodo,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Download,
  Filter,
  ShieldCheck,
  Briefcase,
  Calendar
} from 'lucide-react';
import { PersonalTask, Priority } from '@/types';

export const UnifiedTasksModule: React.FC = () => {
  const {
    unifiedTasks,
    personalTasks,
    addPersonalTask,
    updatePersonalTask,
    deletePersonalTask,
    togglePersonalTask,
    toggleCareerTaskStatus,
    toggleWeeklyTask
  } = useApp();

  const [filterSource, setFilterSource] = useState<'all' | 'personal' | 'career' | 'weekly'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form modal for Administrative / Personal tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PersonalTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('high');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Handle task toggling across aggregated sources without duplicating records
  const handleToggleTask = (task: typeof unifiedTasks[0]) => {
    if (task.source === 'personal') {
      togglePersonalTask(task.originalId);
    } else if (task.source === 'career') {
      toggleCareerTaskStatus(task.originalId);
    } else if (task.source === 'weekly') {
      toggleWeeklyTask(task.originalId);
    }
  };

  const handleSaveAdminTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    if (editingTask) {
      updatePersonalTask(editingTask.id, {
        title: taskTitle,
        priority: taskPriority,
        deadline: taskDeadline || undefined,
        notes: taskNotes || undefined
      });
      setEditingTask(null);
    } else {
      addPersonalTask({
        title: taskTitle,
        status: 'pending',
        priority: taskPriority,
        deadline: taskDeadline || undefined,
        notes: taskNotes || undefined,
        category: 'administrative'
      });
      setIsModalOpen(false);
    }
    setTaskTitle('');
    setTaskNotes('');
  };

  const filteredTasks = unifiedTasks.filter(t => {
    if (filterSource !== 'all' && t.source !== filterSource) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all') {
      if (filterStatus === 'completed' && t.status !== 'completed') return false;
      if (filterStatus === 'pending' && t.status === 'completed') return false;
    }
    return true;
  });

  const handleExportTasks = () => {
    const rows = filteredTasks.map(t => ({
      'Task ID': t.id,
      'Source': t.source,
      'Title': t.title,
      'Category': t.category,
      'Status': t.status,
      'Priority': t.priority,
      'Deadline': t.deadline || 'None',
      'Notes': t.notes || ''
    }));
    exportToCSV('MyLife_OS_Unified_Tasks', rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-purple-400 border border-black rounded shadow-[2px_2px_0px_#000]">
              <ListTodo className="w-5 h-5 text-black" />
            </span>
            Unified Tasks View
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            Aggregated Task Management (Administrative KYC, Bank & ATM + Career Roadmaps + Weekly Goals)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NeoButton variant="neutral" size="sm" onClick={handleExportTasks}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </NeoButton>
          <NeoButton
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingTask(null);
              setTaskTitle('');
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Add Admin Task
          </NeoButton>
        </div>
      </div>

      {/* Seeded Administrative Quick Summary Banner */}
      <div className="p-4 bg-purple-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-black uppercase text-purple-950">
            Administrative Essentials Seeded
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {personalTasks.map(pt => (
            <div
              key={pt.id}
              onClick={() => togglePersonalTask(pt.id)}
              className={`p-2 border border-black rounded text-xs font-black flex items-center justify-between cursor-pointer ${
                pt.status === 'completed' ? 'bg-lime-200 line-through text-zinc-600' : 'bg-white'
              }`}
            >
              <span className="truncate">{pt.title}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500">
                {pt.status === 'completed' ? 'Done' : pt.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <Filter className="w-4 h-4" />
          <span>Source:</span>
          <select
            value={filterSource}
            onChange={e => setFilterSource(e.target.value as any)}
            className="neo-input text-xs py-1"
          >
            <option value="all">All Sources</option>
            <option value="personal">Administrative / Personal</option>
            <option value="career">Career & Placement</option>
            <option value="weekly">Weekly Checklist</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>Priority:</span>
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="neo-input text-xs py-1"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
          <span>Status:</span>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="neo-input text-xs py-1"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Aggregated Unified Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => {
          const isDone = task.status === 'completed';
          const sourceBadgeColor =
            task.source === 'personal'
              ? 'bg-purple-300 text-black'
              : task.source === 'career'
              ? 'bg-blue-600 text-white'
              : 'bg-amber-300 text-black';

          return (
            <NeoCard
              key={task.id}
              variant={isDone ? 'green' : 'white'}
              className="p-3.5 flex flex-wrap items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleTask(task)}
                  className={`w-6 h-6 rounded border-2 border-black flex items-center justify-center font-black cursor-pointer shadow-[1px_1px_0px_#000] ${
                    isDone ? 'bg-black text-white' : 'bg-white text-transparent'
                  }`}
                >
                  ✓
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${sourceBadgeColor}`}>
                      {task.source}
                    </span>
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 bg-zinc-200 border border-black rounded">
                      {task.priority}
                    </span>
                    <span className="text-[11px] font-bold text-zinc-500">
                      {task.category}
                    </span>
                  </div>

                  <h4 className={`text-base font-black mt-1 ${isDone ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                    {task.title}
                  </h4>
                  {task.notes && (
                    <p className="text-xs text-zinc-600 font-medium mt-0.5">{task.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {task.deadline && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 border border-black rounded">
                    Due: {task.deadline}
                  </span>
                )}

                {task.source === 'personal' && (
                  <button
                    onClick={() => {
                      const pt = personalTasks.find(p => p.id === task.originalId);
                      if (pt) {
                        setEditingTask(pt);
                        setTaskTitle(pt.title);
                        setTaskPriority(pt.priority);
                        setTaskDeadline(pt.deadline || '');
                        setTaskNotes(pt.notes || '');
                        setIsModalOpen(true);
                      }
                    }}
                    className="p-1 border border-black rounded bg-white hover:bg-amber-300 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {task.source === 'personal' && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${task.title}"?`)) deletePersonalTask(task.originalId);
                    }}
                    className="p-1 border border-black rounded bg-white hover:bg-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </NeoCard>
          );
        })}
      </div>

      {/* Admin Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-lg uppercase text-zinc-900">
                {editingTask ? 'Edit Administrative Task' : 'Add Administrative Task'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
            </div>
            <form onSubmit={handleSaveAdminTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Account or Aadhaar Update"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  className="w-full neo-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as Priority)}
                    className="w-full neo-input"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
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
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Branch visit documentation required"
                  value={taskNotes}
                  onChange={e => setTaskNotes(e.target.value)}
                  className="w-full neo-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <NeoButton type="button" variant="neutral" onClick={() => setIsModalOpen(false)}>Cancel</NeoButton>
                <NeoButton type="submit" variant="primary">Save Task</NeoButton>
              </div>
            </form>
          </NeoCard>
        </div>
      )}
    </div>
  );
};

