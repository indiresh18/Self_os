'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { NeoCard } from '../common/NeoCard';
import { NeoButton } from '../common/NeoButton';
import { exportToCSV, cn } from '@/lib/utils';
import {
  GraduationCap,
  Target,
  Award,
  FolderGit2,
  Code2,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  CheckCircle,
  Clock,
  Download,
  CheckSquare,
  Sparkles,
  BookOpen
} from 'lucide-react';
import {
  CareerGoal,
  CareerTask,
  CareerTaskStatus,
  Certification,
  Priority,
  Project,
  SemesterTag,
  Skill
} from '@/types';

export const CareerPlannerModule: React.FC = () => {
  const {
    careerTasks,
    addCareerTask,
    updateCareerTask,
    deleteCareerTask,
    toggleCareerTaskStatus,
    careerGoals,
    addCareerGoal,
    updateCareerGoal,
    deleteCareerGoal,
    toggleGoalMilestone,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    projects,
    addProject,
    updateProject,
    deleteProject
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tasks' | 'sem4' | 'sem5' | 'goals' | 'certs' | 'projects' | 'skills'>('tasks');

  // Task form modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CareerTask | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskSemester, setTaskSemester] = useState<SemesterTag>('general');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Project form modal
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStack, setProjStack] = useState('');
  const [projGithub, setProjGithub] = useState('');
  const [projLive, setProjLive] = useState('');

  // Cert form modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certName, setCertName] = useState('');
  const [certProvider, setCertProvider] = useState('');
  const [certUrl, setCertUrl] = useState('');
  const [certDate, setCertDate] = useState('');

  // Skill form modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Web Development');
  const [skillProgress, setSkillProgress] = useState(50);

  // Filter tasks
  const currentSprintTasks = careerTasks.filter(t => t.roadmap_category === 'current_tasks');
  const sem4Tasks = careerTasks.filter(t => t.roadmap_category === 'roadmap_sem4');
  const sem5Tasks = careerTasks.filter(t => t.roadmap_category === 'roadmap_sem5');

  // Handle Task Submit
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    if (editingTask) {
      updateCareerTask(editingTask.id, {
        title: taskTitle,
        priority: taskPriority,
        semester: taskSemester,
        deadline: taskDeadline || undefined,
        notes: taskNotes || undefined
      });
      setEditingTask(null);
    } else {
      addCareerTask({
        title: taskTitle,
        status: 'not_started',
        priority: taskPriority,
        semester: taskSemester,
        roadmap_category: taskSemester === 'semester_4' ? 'roadmap_sem4' : taskSemester === 'semester_5' ? 'roadmap_sem5' : 'current_tasks',
        deadline: taskDeadline || undefined,
        notes: taskNotes || undefined
      });
      setIsTaskModalOpen(false);
    }
    setTaskTitle('');
    setTaskNotes('');
  };

  // Export Career Data
  const handleExportCareer = () => {
    const rows = careerTasks.map(t => ({
      'Task ID': t.id,
      'Title': t.title,
      'Status': t.status,
      'Priority': t.priority,
      'Semester / Category': t.semester,
      'Deadline': t.deadline || 'None',
      'Notes': t.notes || ''
    }));
    exportToCSV('MyLife_OS_Career_Tasks', rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="p-1 bg-blue-600 text-white border border-black rounded shadow-[2px_2px_0px_#000]">
              <GraduationCap className="w-5 h-5" />
            </span>
            Career Planner & Certification Tracker
          </h2>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">
            4th & 5th Semester Roadmaps • Technical Skills • Production Projects • Certifications
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white dark:bg-zinc-800 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'tasks' ? 'bg-blue-600 text-white border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Current Tasks ({currentSprintTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('sem4')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'sem4' ? 'bg-amber-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            4th Sem Roadmap ({sem4Tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('sem5')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'sem5' ? 'bg-purple-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            5th Sem Roadmap ({sem5Tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'goals' ? 'bg-lime-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Goals ({careerGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'certs' ? 'bg-rose-400 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Certifications ({certifications.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'projects' ? 'bg-indigo-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 text-xs font-black rounded cursor-pointer transition ${
              activeTab === 'skills' ? 'bg-emerald-300 text-black border border-black shadow-[1.5px_1.5px_0px_#000]' : 'text-zinc-700 dark:text-zinc-300'
            }`}
          >
            Skills ({skills.length})
          </button>
        </div>
      </div>

      {/* 1. CURRENT ACTIVE TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-1 rounded border border-black">
              Current Active Career Tasks
            </span>
            <div className="flex items-center gap-2">
              <NeoButton variant="neutral" size="sm" onClick={handleExportCareer}>
                <Download className="w-3.5 h-3.5" /> Export CSV
              </NeoButton>
              <NeoButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setEditingTask(null);
                  setTaskSemester('general');
                  setIsTaskModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Task
              </NeoButton>
            </div>
          </div>

          <div className="space-y-3">
            {currentSprintTasks.map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <NeoCard
                  key={task.id}
                  variant={isCompleted ? 'green' : 'white'}
                  className="p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCareerTaskStatus(task.id)}
                      className={`w-6 h-6 rounded border-2 border-black flex items-center justify-center font-black cursor-pointer shadow-[1px_1px_0px_#000] ${
                        isCompleted ? 'bg-black text-white' : 'bg-white text-transparent'
                      }`}
                    >
                      ✓
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${
                            task.priority === 'urgent'
                              ? 'bg-rose-400 text-black'
                              : task.priority === 'high'
                              ? 'bg-amber-300 text-black'
                              : 'bg-zinc-200 text-black'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-zinc-500">
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <h4 className={`text-base font-black mt-1 ${isCompleted ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
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
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setTaskTitle(task.title);
                        setTaskPriority(task.priority);
                        setTaskSemester(task.semester);
                        setTaskDeadline(task.deadline || '');
                        setTaskNotes(task.notes || '');
                        setIsTaskModalOpen(true);
                      }}
                      className="p-1 border border-black rounded bg-white hover:bg-amber-300 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${task.title}"?`)) deleteCareerTask(task.id);
                      }}
                      className="p-1 border border-black rounded bg-white hover:bg-rose-400 cursor-pointer"
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

      {/* 2. FOURTH SEMESTER ROADMAP */}
      {activeTab === 'sem4' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase bg-amber-300 px-2.5 py-0.5 border border-black rounded">
                Semester 4 Academic & Dev Plan
              </span>
              <h3 className="text-lg font-black text-zinc-900 mt-1">
                Advanced Java • MERN Stack • 4–5 Projects • SEO • Oracle Java Badges • DSA
              </h3>
            </div>
            <NeoButton
              variant="secondary"
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setTaskSemester('semester_4');
                setIsTaskModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Sem 4 Item
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sem4Tasks.map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <NeoCard
                  key={task.id}
                  variant={isCompleted ? 'green' : 'white'}
                  className="p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-300 border border-black rounded">
                        Priority: {task.priority}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className={`text-base font-black ${isCompleted ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                    <button
                      onClick={() => toggleCareerTaskStatus(task.id)}
                      className={`px-3 py-1 text-xs font-black border-2 border-black rounded cursor-pointer ${
                        isCompleted ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => deleteCareerTask(task.id)}
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

      {/* 3. FIFTH SEMESTER ROADMAP */}
      {activeTab === 'sem5' && (
        <div className="space-y-6">
          <div className="p-4 bg-purple-50 border-2 border-black rounded-lg shadow-[3px_3px_0px_#000] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-black uppercase bg-purple-300 px-2.5 py-0.5 border border-black rounded">
                Semester 5 Placement & AI Specialization
              </span>
              <h3 className="text-lg font-black text-zinc-900 mt-1">
                Python • Machine Learning • AI Agents • LLMs • AWS / Cloud • DSA Preparation
              </h3>
            </div>
            <NeoButton
              variant="purple"
              size="sm"
              onClick={() => {
                setEditingTask(null);
                setTaskSemester('semester_5');
                setIsTaskModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Add Sem 5 Item
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sem5Tasks.map(task => {
              const isCompleted = task.status === 'completed';
              return (
                <NeoCard
                  key={task.id}
                  variant={isCompleted ? 'green' : 'white'}
                  className="p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-purple-300 border border-black rounded">
                        Priority: {task.priority}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-zinc-500">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className={`text-base font-black ${isCompleted ? 'line-through text-zinc-700' : 'text-zinc-900'}`}>
                      {task.title}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                    <button
                      onClick={() => toggleCareerTaskStatus(task.id)}
                      className={`px-3 py-1 text-xs font-black border-2 border-black rounded cursor-pointer ${
                        isCompleted ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => deleteCareerTask(task.id)}
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

      {/* 4. CAREER GOALS & MILESTONES */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-lime-300 px-2.5 py-1 rounded border border-black">
              Placement & High-Value Objectives
            </span>
          </div>

          <div className="space-y-4">
            {careerGoals.map(goal => (
              <NeoCard key={goal.id} variant="white" className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-600 text-white rounded">
                        {goal.category}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">
                        Target: {goal.target_date || 'Ongoing'}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-zinc-900 mt-1">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-xs font-bold text-zinc-600 mt-1 max-w-2xl">{goal.description}</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-blue-600">{goal.progress_pct}%</div>
                    <div className="text-[10px] font-black uppercase text-zinc-500">Milestones Done</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-200 border-2 border-black rounded-full h-3.5 overflow-hidden mb-4">
                  <div className="bg-lime-400 h-full transition-all" style={{ width: `${goal.progress_pct}%` }} />
                </div>

                {/* Subtask Milestones */}
                <div className="space-y-2 pt-2 border-t-2 border-black">
                  <div className="text-xs font-black uppercase text-zinc-600">Subtasks & Milestones:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {goal.milestones.map(m => (
                      <div
                        key={m.id}
                        onClick={() => toggleGoalMilestone(goal.id, m.id)}
                        className={`p-2 border border-black rounded flex items-center gap-2 cursor-pointer transition ${
                          m.completed ? 'bg-lime-100 line-through text-zinc-700' : 'bg-white hover:bg-zinc-50 text-zinc-900'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded border border-black flex items-center justify-center text-xs font-black ${m.completed ? 'bg-lime-500 text-black' : 'bg-white'}`}>
                          {m.completed ? '✓' : ''}
                        </span>
                        <span className="text-xs font-bold">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </NeoCard>
            ))}
          </div>
        </div>
      )}

      {/* 5. CERTIFICATIONS TRACKER */}
      {activeTab === 'certs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-rose-300 px-2.5 py-1 rounded border border-black">
              Official Badges & Certifications
            </span>
            <NeoButton variant="primary" size="sm" onClick={() => setIsCertModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Certification
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map(cert => (
              <NeoCard key={cert.id} variant="white" className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-300 border border-black rounded">
                      {cert.provider}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-zinc-500">
                      {cert.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-zinc-900 mb-1">{cert.name}</h4>
                  {cert.notes && <p className="text-xs text-zinc-600 font-medium mb-3">{cert.notes}</p>}
                </div>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                  {cert.course_url && (
                    <a
                      href={cert.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-black text-blue-700 flex items-center gap-1 hover:underline"
                    >
                      Open Course <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (confirm(`Remove cert "${cert.name}"?`)) deleteCertification(cert.id);
                    }}
                    className="p-1 hover:bg-rose-400 border border-black rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </NeoCard>
            ))}
          </div>

          {/* Add Cert Modal */}
          {isCertModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                  <h3 className="font-black text-lg uppercase text-zinc-900">Add Certification</h3>
                  <button onClick={() => setIsCertModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Certification Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Oracle Java Foundations Explorer"
                      value={certName}
                      onChange={e => setCertName(e.target.value)}
                      className="w-full neo-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Provider</label>
                      <input
                        type="text"
                        placeholder="e.g. Oracle / AWS"
                        value={certProvider}
                        onChange={e => setCertProvider(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Course URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={certUrl}
                        onChange={e => setCertUrl(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                    <NeoButton variant="neutral" onClick={() => setIsCertModalOpen(false)}>Cancel</NeoButton>
                    <NeoButton
                      variant="primary"
                      onClick={() => {
                        if (!certName) return;
                        addCertification({
                          name: certName,
                          provider: certProvider || 'Online',
                          course_url: certUrl || undefined,
                          status: 'in_progress'
                        });
                        setCertName('');
                        setCertProvider('');
                        setIsCertModalOpen(false);
                      }}
                    >
                      Save Cert
                    </NeoButton>
                  </div>
                </div>
              </NeoCard>
            </div>
          )}
        </div>
      )}

      {/* 6. PROJECTS TRACKER */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-indigo-200 px-2.5 py-1 rounded border border-black">
              Portfolio & Production Deployments
            </span>
            <NeoButton variant="primary" size="sm" onClick={() => setIsProjectModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Project
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(proj => (
              <NeoCard key={proj.id} variant="white" className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black uppercase px-2 py-0.5 bg-lime-300 border border-black rounded">
                      {proj.status.replace('_', ' ')}
                    </span>
                    <FolderGit2 className="w-4 h-4 text-zinc-700" />
                  </div>
                  <h4 className="text-lg font-black text-zinc-900 mb-1">{proj.name}</h4>
                  <p className="text-xs text-zinc-600 font-medium mb-2">{proj.description}</p>
                  <div className="p-2 bg-[#FAF6EE] border border-black rounded text-[11px] font-bold text-zinc-800 mb-3">
                    Tech Stack: {proj.tech_stack}
                  </div>
                </div>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-blue-700 flex items-center gap-1 hover:underline"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-emerald-700 flex items-center gap-1 hover:underline ml-2"
                      >
                        Live App <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Remove project "${proj.name}"?`)) deleteProject(proj.id);
                    }}
                    className="p-1 hover:bg-rose-400 border border-black rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </NeoCard>
            ))}
          </div>

          {/* Add Project Modal */}
          {isProjectModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                  <h3 className="font-black text-lg uppercase text-zinc-900">Add Quality Project</h3>
                  <button onClick={() => setIsProjectModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Project Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Video Set Generator"
                      value={projName}
                      onChange={e => setProjName(e.target.value)}
                      className="w-full neo-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Short summary of value proposition"
                      value={projDesc}
                      onChange={e => setProjDesc(e.target.value)}
                      className="w-full neo-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1">Tech Stack</label>
                    <input
                      type="text"
                      placeholder="e.g. Next.js, Express, MongoDB, Tailwind"
                      value={projStack}
                      onChange={e => setProjStack(e.target.value)}
                      className="w-full neo-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">GitHub Repo</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={projGithub}
                        onChange={e => setProjGithub(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase mb-1">Live URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={projLive}
                        onChange={e => setProjLive(e.target.value)}
                        className="w-full neo-input"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                    <NeoButton variant="neutral" onClick={() => setIsProjectModalOpen(false)}>Cancel</NeoButton>
                    <NeoButton
                      variant="primary"
                      onClick={() => {
                        if (!projName) return;
                        addProject({
                          name: projName,
                          description: projDesc,
                          tech_stack: projStack || 'Next.js & TypeScript',
                          github_url: projGithub || undefined,
                          live_url: projLive || undefined,
                          status: 'in_progress'
                        });
                        setProjName('');
                        setProjDesc('');
                        setProjStack('');
                        setIsProjectModalOpen(false);
                      }}
                    >
                      Save Project
                    </NeoButton>
                  </div>
                </div>
              </NeoCard>
            </div>
          )}
        </div>
      )}

      {/* 7. SKILLS MATRIX */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider bg-emerald-200 px-2.5 py-1 rounded border border-black">
              Technical Skill Proficiencies
            </span>
            <NeoButton variant="primary" size="sm" onClick={() => setIsSkillModalOpen(true)}>
              <Plus className="w-4 h-4" /> Add Skill
            </NeoButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map(s => (
              <NeoCard key={s.id} variant="white" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-zinc-900">{s.name}</span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 border border-black rounded">
                    {s.level} ({s.progress_pct}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-200 border border-black rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${s.progress_pct}%` }} />
                </div>
              </NeoCard>
            ))}
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <NeoCard className="w-full max-w-md bg-[#FAF6EE] p-5">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <h3 className="font-black text-lg uppercase text-zinc-900">
                {editingTask ? 'Edit Task' : 'Add Career Task'}
              </h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-1 border border-black rounded bg-white">✕</button>
            </div>
            <form onSubmit={handleSaveTask} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master LeetCode Trees & Graphs"
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
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">Roadmap Segment</label>
                  <select
                    value={taskSemester}
                    onChange={e => setTaskSemester(e.target.value as SemesterTag)}
                    className="w-full neo-input"
                  >
                    <option value="general">Current Active</option>
                    <option value="semester_4">Semester 4</option>
                    <option value="semester_5">Semester 5</option>
                  </select>
                </div>
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
              <div className="flex justify-end gap-2 pt-3 border-t-2 border-black">
                <NeoButton type="button" variant="neutral" onClick={() => setIsTaskModalOpen(false)}>Cancel</NeoButton>
                <NeoButton type="submit" variant="primary">Save Task</NeoButton>
              </div>
            </form>
          </NeoCard>
        </div>
      )}
    </div>
  );
};
