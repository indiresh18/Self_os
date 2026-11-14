'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoutineItem,
  RoutineLog,
  FoodLog,
  Habit,
  HabitLog,
  WeeklyTask,
  ShoppingItem,
  CareerTask,
  CareerGoal,
  Skill,
  Certification,
  Project,
  Transaction,
  SavingsGoal,
  PersonalTask,
  UserSettings,
  UnifiedTask,
  MealType
} from '@/types';
import {
  INITIAL_ROUTINES,
  INITIAL_HABITS,
  INITIAL_FOOD_MEALS,
  INITIAL_WEEKLY_TASKS,
  INITIAL_SHOPPING_ITEMS,
  INITIAL_CAREER_TASKS,
  INITIAL_CAREER_GOALS,
  INITIAL_SKILLS,
  INITIAL_CERTIFICATIONS,
  INITIAL_PROJECTS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  INITIAL_PERSONAL_TASKS,
  MONTHLY_SAVINGS_TARGET,
  FUTURE_SAVINGS_TARGET
} from '@/lib/constants';
import { getTodayDateString, fireConfetti } from '@/lib/utils';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

interface AppContextType {
  // Selected date for daily tracking
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Supabase state
  isSupabaseLive: boolean;
  userEmail: string | null;

  // Settings & targets
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;

  // Routines
  routines: RoutineItem[];
  routineLogs: RoutineLog[];
  addRoutine: (item: Omit<RoutineItem, 'id'>) => void;
  updateRoutine: (id: string, updates: Partial<RoutineItem>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutineComplete: (routineId: string, date: string, notes?: string) => void;

  // Habits
  habits: Habit[];
  habitLogs: HabitLog[];
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitComplete: (habitId: string, date: string, value?: number, notes?: string) => void;
  updateHabitValue: (habitId: string, date: string, value: number) => void;

  // Food
  foodLogs: FoodLog[];
  toggleFoodMeal: (mealType: MealType, date: string, items?: string, notes?: string) => void;
  addCustomFoodMeal: (mealType: MealType, date: string, items: string, notes?: string) => void;

  // Weekly tasks
  weeklyTasks: WeeklyTask[];
  addWeeklyTask: (title: string, deadline?: string) => void;
  toggleWeeklyTask: (id: string) => void;
  deleteWeeklyTask: (id: string) => void;

  // Shopping
  shoppingItems: ShoppingItem[];
  addShoppingItem: (name: string, quantity: string, category: string, price?: number) => void;
  toggleShoppingItem: (id: string) => void;
  deleteShoppingItem: (id: string) => void;
  updateShoppingItem: (id: string, updates: Partial<ShoppingItem>) => void;

  // Career
  careerTasks: CareerTask[];
  addCareerTask: (task: Omit<CareerTask, 'id' | 'created_at'>) => void;
  updateCareerTask: (id: string, updates: Partial<CareerTask>) => void;
  deleteCareerTask: (id: string) => void;
  toggleCareerTaskStatus: (id: string) => void;

  careerGoals: CareerGoal[];
  addCareerGoal: (goal: Omit<CareerGoal, 'id'>) => void;
  updateCareerGoal: (id: string, updates: Partial<CareerGoal>) => void;
  deleteCareerGoal: (id: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;

  skills: Skill[];
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  certifications: Certification[];
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, updates: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  projects: Project[];
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Savings & Transactions
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;

  // Personal tasks
  personalTasks: PersonalTask[];
  addPersonalTask: (task: Omit<PersonalTask, 'id'>) => void;
  updatePersonalTask: (id: string, updates: Partial<PersonalTask>) => void;
  deletePersonalTask: (id: string) => void;
  togglePersonalTask: (id: string) => void;

  // Unified task aggregation
  unifiedTasks: UnifiedTask[];

  // Quick stats
  todayStats: {
    totalHabits: number;
    completedHabits: number;
    completionPct: number;
    waterLiters: number;
    sleepHours: number;
    exerciseDone: boolean;
  };

  financialStats: {
    totalSavings: number;
    monthlySavings: number;
    monthlyTarget: number;
    futureTarget: number;
    totalIncome: number;
    totalExpenses: number;
    availableBalance: number;
    savingsTargetProgressPct: number;
  };

  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'mylife_settings_v2',
  ROUTINES: 'mylife_routines_v2',
  ROUTINE_LOGS: 'mylife_routine_logs_v2',
  HABITS: 'mylife_habits_v2',
  HABIT_LOGS: 'mylife_habit_logs_v2',
  FOOD_LOGS: 'mylife_food_logs_v2',
  WEEKLY_TASKS: 'mylife_weekly_tasks_v2',
  SHOPPING: 'mylife_shopping_v2',
  CAREER_TASKS: 'mylife_career_tasks_v2',
  CAREER_GOALS: 'mylife_career_goals_v2',
  SKILLS: 'mylife_skills_v2',
  CERTIFICATIONS: 'mylife_certifications_v2',
  PROJECTS: 'mylife_projects_v2',
  SAVINGS_GOALS: 'mylife_savings_goals_v2',
  TRANSACTIONS: 'mylife_transactions_v2',
  PERSONAL_TASKS: 'mylife_personal_tasks_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-14');
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Settings
  const [settings, setSettings] = useState<UserSettings>({
    id: 's1',
    user_id: 'default',
    user_name: 'Indiresh',
    user_email: 'indiresh@example.com',
    theme: 'light',
    monthly_savings_target: MONTHLY_SAVINGS_TARGET,
    future_savings_target: FUTURE_SAVINGS_TARGET,
    daily_water_target_litres: 2.0,
    daily_sleep_target_hours: 8.0,
    notifications_enabled: true
  });

  // State slices
  const [routines, setRoutines] = useState<RoutineItem[]>(INITIAL_ROUTINES);
  const [routineLogs, setRoutineLogs] = useState<RoutineLog[]>([]);
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>(INITIAL_WEEKLY_TASKS);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(INITIAL_SHOPPING_ITEMS);
  const [careerTasks, setCareerTasks] = useState<CareerTask[]>(INITIAL_CAREER_TASKS);
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>(INITIAL_CAREER_GOALS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>(INITIAL_PERSONAL_TASKS);

  // Load from LocalStorage on mount
  useEffect(() => {
    setSelectedDate(getTodayDateString());
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedRoutines = localStorage.getItem(STORAGE_KEYS.ROUTINES);
      if (savedRoutines) setRoutines(JSON.parse(savedRoutines));

      const savedRoutineLogs = localStorage.getItem(STORAGE_KEYS.ROUTINE_LOGS);
      if (savedRoutineLogs) setRoutineLogs(JSON.parse(savedRoutineLogs));

      const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
      if (savedHabits) setHabits(JSON.parse(savedHabits));

      const savedHabitLogs = localStorage.getItem(STORAGE_KEYS.HABIT_LOGS);
      if (savedHabitLogs) setHabitLogs(JSON.parse(savedHabitLogs));

      const savedFoodLogs = localStorage.getItem(STORAGE_KEYS.FOOD_LOGS);
      if (savedFoodLogs) setFoodLogs(JSON.parse(savedFoodLogs));

      const savedWeekly = localStorage.getItem(STORAGE_KEYS.WEEKLY_TASKS);
      if (savedWeekly) setWeeklyTasks(JSON.parse(savedWeekly));

      const savedShopping = localStorage.getItem(STORAGE_KEYS.SHOPPING);
      if (savedShopping) setShoppingItems(JSON.parse(savedShopping));

      const savedCareerTasks = localStorage.getItem(STORAGE_KEYS.CAREER_TASKS);
      if (savedCareerTasks) setCareerTasks(JSON.parse(savedCareerTasks));

      const savedCareerGoals = localStorage.getItem(STORAGE_KEYS.CAREER_GOALS);
      if (savedCareerGoals) setCareerGoals(JSON.parse(savedCareerGoals));

      const savedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (savedSkills) setSkills(JSON.parse(savedSkills));

      const savedCerts = localStorage.getItem(STORAGE_KEYS.CERTIFICATIONS);
      if (savedCerts) setCertifications(JSON.parse(savedCerts));

      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedSavingsGoals = localStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
      if (savedSavingsGoals) setSavingsGoals(JSON.parse(savedSavingsGoals));

      const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (savedTx) setTransactions(JSON.parse(savedTx));

      const savedPersonalTasks = localStorage.getItem(STORAGE_KEYS.PERSONAL_TASKS);
      if (savedPersonalTasks) setPersonalTasks(JSON.parse(savedPersonalTasks));
    } catch (e) {
      console.warn('Could not parse localStorage state', e);
    }

    // Check Supabase Auth session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUserEmail(session.user.email || null);
          setIsSupabaseLive(true);
        }
      });
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(routines));
    } catch (e) {}
  }, [routines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTINE_LOGS, JSON.stringify(routineLogs));
    } catch (e) {}
  }, [routineLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
    } catch (e) {}
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(habitLogs));
    } catch (e) {}
  }, [habitLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(foodLogs));
    } catch (e) {}
  }, [foodLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WEEKLY_TASKS, JSON.stringify(weeklyTasks));
    } catch (e) {}
  }, [weeklyTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(shoppingItems));
    } catch (e) {}
  }, [shoppingItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAREER_TASKS, JSON.stringify(careerTasks));
    } catch (e) {}
  }, [careerTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAREER_GOALS, JSON.stringify(careerGoals));
    } catch (e) {}
  }, [careerGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
    } catch (e) {}
  }, [skills]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CERTIFICATIONS, JSON.stringify(certifications));
    } catch (e) {}
  }, [certifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(savingsGoals));
    } catch (e) {}
  }, [savingsGoals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONAL_TASKS, JSON.stringify(personalTasks));
    } catch (e) {}
  }, [personalTasks]);

  // Sync theme with document element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Settings update
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Routine Actions
  const addRoutine = (item: Omit<RoutineItem, 'id'>) => {
    const newItem: RoutineItem = {
      ...item,
      id: 'r_' + Date.now()
    };
    setRoutines(prev => [...prev, newItem].sort((a, b) => a.order_index - b.order_index));
  };

  const updateRoutine = (id: string, updates: Partial<RoutineItem>) => {
    setRoutines(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const toggleRoutineComplete = (routineId: string, date: string, notes?: string) => {
    setRoutineLogs(prev => {
      const existing = prev.find(l => l.routine_id === routineId && l.date === date);
      if (existing) {
        return prev.map(l =>
          l.routine_id === routineId && l.date === date
            ? { ...l, completed: !l.completed, completed_at: !l.completed ? new Date().toISOString() : undefined, notes: notes ?? l.notes }
            : l
        );
      } else {
        return [
          ...prev,
          {
            id: 'rl_' + Date.now(),
            routine_id: routineId,
            date,
            completed: true,
            completed_at: new Date().toISOString(),
            notes
          }
        ];
      }
    });
  };

  // Habit Actions
  const addHabit = (habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: 'h_' + Date.now()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const toggleHabitComplete = (habitId: string, date: string, value?: number, notes?: string) => {
    setHabitLogs(prev => {
      const existing = prev.find(l => l.habit_id === habitId && l.date === date);
      if (existing) {
        const nextCompleted = !existing.completed;
        if (nextCompleted) fireConfetti();
        return prev.map(l =>
          l.habit_id === habitId && l.date === date
            ? {
                ...l,
                completed: nextCompleted,
                value: value ?? (nextCompleted ? 1 : 0),
                completed_at: nextCompleted ? new Date().toISOString() : undefined,
                notes: notes ?? l.notes
              }
            : l
        );
      } else {
        fireConfetti();
        return [
          ...prev,
          {
            id: 'hl_' + Date.now(),
            habit_id: habitId,
            date,
            completed: true,
            value: value ?? 1,
            completed_at: new Date().toISOString(),
            notes
          }
        ];
      }
    });
  };

  const updateHabitValue = (habitId: string, date: string, value: number) => {
    setHabitLogs(prev => {
      const existing = prev.find(l => l.habit_id === habitId && l.date === date);
      const isComplete = value > 0;
      if (existing) {
        return prev.map(l =>
          l.habit_id === habitId && l.date === date
            ? {
                ...l,
                value,
                completed: isComplete,
                completed_at: isComplete ? l.completed_at || new Date().toISOString() : undefined
              }
            : l
        );
      } else {
        return [
          ...prev,
          {
            id: 'hl_' + Date.now(),
            habit_id: habitId,
            date,
            completed: isComplete,
            value,
            completed_at: isComplete ? new Date().toISOString() : undefined
          }
        ];
      }
    });
  };

  // Food Tracker Actions
  const toggleFoodMeal = (mealType: MealType, date: string, items?: string, notes?: string) => {
    setFoodLogs(prev => {
      const existing = prev.find(f => f.meal_type === mealType && f.date === date);
      if (existing) {
        const next = !existing.completed;
        return prev.map(f =>
          f.meal_type === mealType && f.date === date
            ? { ...f, completed: next, completed_at: next ? new Date().toISOString() : undefined, notes: notes ?? f.notes }
            : f
        );
      } else {
        const defaultItem = INITIAL_FOOD_MEALS.find(m => m.meal_type === mealType)?.items || 'Wholesome balanced meal';
        return [
          ...prev,
          {
            id: 'fl_' + Date.now(),
            date,
            meal_type: mealType,
            items: items || defaultItem,
            completed: true,
            completed_at: new Date().toISOString(),
            notes
          }
        ];
      }
    });
  };

  const addCustomFoodMeal = (mealType: MealType, date: string, items: string, notes?: string) => {
    const newMeal: FoodLog = {
      id: 'fl_' + Date.now(),
      date,
      meal_type: mealType,
      items,
      completed: true,
      completed_at: new Date().toISOString(),
      notes
    };
    setFoodLogs(prev => [...prev, newMeal]);
  };

  // Weekly Tasks
  const addWeeklyTask = (title: string, deadline?: string) => {
    const newTask: WeeklyTask = {
      id: 'w_' + Date.now(),
      title,
      week_start_date: selectedDate,
      deadline,
      completed: false
    };
    setWeeklyTasks(prev => [...prev, newTask]);
  };

  const toggleWeeklyTask = (id: string) => {
    setWeeklyTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: !t.completed, completed_at: !t.completed ? new Date().toISOString() : undefined } : t
      )
    );
  };

  const deleteWeeklyTask = (id: string) => {
    setWeeklyTasks(prev => prev.filter(t => t.id !== id));
  };

  // Shopping Items
  const addShoppingItem = (name: string, quantity: string, category: string, price?: number) => {
    const newItem: ShoppingItem = {
      id: 's_' + Date.now(),
      name,
      quantity,
      category,
      is_purchased: false,
      price
    };
    setShoppingItems(prev => [newItem, ...prev]);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              is_purchased: !item.is_purchased,
              purchase_date: !item.is_purchased ? selectedDate : undefined
            }
          : item
      )
    );
  };

  const deleteShoppingItem = (id: string) => {
    setShoppingItems(prev => prev.filter(item => item.id !== id));
  };

  const updateShoppingItem = (id: string, updates: Partial<ShoppingItem>) => {
    setShoppingItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)));
  };

  // Career Planner Actions
  const addCareerTask = (task: Omit<CareerTask, 'id' | 'created_at'>) => {
    const newTask: CareerTask = {
      ...task,
      id: 'ct_' + Date.now(),
      created_at: new Date().toISOString()
    };
    setCareerTasks(prev => [newTask, ...prev]);
  };

  const updateCareerTask = (id: string, updates: Partial<CareerTask>) => {
    setCareerTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              ...updates,
              completed_at: updates.status === 'completed' && t.status !== 'completed' ? new Date().toISOString() : t.completed_at
            }
          : t
      )
    );
  };

  const deleteCareerTask = (id: string) => {
    setCareerTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleCareerTaskStatus = (id: string) => {
    setCareerTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'not_started' : 'completed';
          if (nextStatus === 'completed') fireConfetti();
          return {
            ...t,
            status: nextStatus,
            completed_at: nextStatus === 'completed' ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
  };

  const addCareerGoal = (goal: Omit<CareerGoal, 'id'>) => {
    const newGoal: CareerGoal = {
      ...goal,
      id: 'cg_' + Date.now()
    };
    setCareerGoals(prev => [newGoal, ...prev]);
  };

  const updateCareerGoal = (id: string, updates: Partial<CareerGoal>) => {
    setCareerGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteCareerGoal = (id: string) => {
    setCareerGoals(prev => prev.filter(g => g.id !== id));
  };

  const toggleGoalMilestone = (goalId: string, milestoneId: string) => {
    setCareerGoals(prev =>
      prev.map(goal => {
        if (goal.id !== goalId) return goal;
        const updatedMilestones = goal.milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const total = updatedMilestones.length;
        const newProgress = total > 0 ? Math.round((completedCount / total) * 100) : goal.progress_pct;
        const isAllDone = completedCount === total && total > 0;
        if (isAllDone) fireConfetti();

        return {
          ...goal,
          milestones: updatedMilestones,
          progress_pct: newProgress,
          status: isAllDone ? 'completed' : 'in_progress'
        };
      })
    );
  };

  // Skills, Certs, Projects
  const addSkill = (skill: Omit<Skill, 'id'>) => {
    setSkills(prev => [{ ...skill, id: 'sk_' + Date.now() }, ...prev]);
  };
  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setSkills(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };
  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const addCertification = (cert: Omit<Certification, 'id'>) => {
    setCertifications(prev => [{ ...cert, id: 'c_' + Date.now() }, ...prev]);
  };
  const updateCertification = (id: string, updates: Partial<Certification>) => {
    setCertifications(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };
  const deleteCertification = (id: string) => {
    setCertifications(prev => prev.filter(c => c.id !== id));
  };

  const addProject = (proj: Omit<Project, 'id'>) => {
    setProjects(prev => [{ ...proj, id: 'p_' + Date.now() }, ...prev]);
  };
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  // Savings & Transactions
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now()
    };
    setTransactions(prev => [newTx, ...prev]);

    // If transaction is linked to a savings goal, update saved amount
    if (tx.savings_goal_id) {
      setSavingsGoals(prev =>
        prev.map(g => {
          if (g.id === tx.savings_goal_id) {
            const added = tx.type === 'savings_deposit' ? tx.amount : -tx.amount;
            const updatedSaved = Math.max(0, g.saved_amount + added);
            return {
              ...g,
              saved_amount: updatedSaved,
              status: updatedSaved >= g.target_amount ? 'completed' : 'active'
            };
          }
          return g;
        })
      );
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    setSavingsGoals(prev => [{ ...goal, id: 'sg_' + Date.now() }, ...prev]);
  };

  const updateSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  // Personal Administrative Tasks
  const addPersonalTask = (task: Omit<PersonalTask, 'id'>) => {
    setPersonalTasks(prev => [{ ...task, id: 'pt_' + Date.now() }, ...prev]);
  };

  const updatePersonalTask = (id: string, updates: Partial<PersonalTask>) => {
    setPersonalTasks(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePersonalTask = (id: string) => {
    setPersonalTasks(prev => prev.filter(p => p.id !== id));
  };

  const togglePersonalTask = (id: string) => {
    setPersonalTasks(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'completed' ? 'pending' : 'completed';
          if (nextStatus === 'completed') fireConfetti();
          return {
            ...p,
            status: nextStatus,
            completed_at: nextStatus === 'completed' ? new Date().toISOString() : undefined
          };
        }
        return p;
      })
    );
  };

  // Unified Task View - Merges administrative personal tasks, career tasks, and weekly tasks by reference
  const unifiedTasks: UnifiedTask[] = [
    ...personalTasks.map(
      (pt): UnifiedTask => ({
        id: `unified_pt_${pt.id}`,
        source: 'personal',
        originalId: pt.id,
        title: pt.title,
        status: pt.status,
        priority: pt.priority,
        deadline: pt.deadline,
        category: pt.category,
        notes: pt.notes
      })
    ),
    ...careerTasks.map(
      (ct): UnifiedTask => ({
        id: `unified_ct_${ct.id}`,
        source: 'career',
        originalId: ct.id,
        title: ct.title,
        status: ct.status === 'not_started' ? 'pending' : ct.status,
        priority: ct.priority,
        deadline: ct.deadline,
        category: ct.semester === 'semester_4' ? 'Semester 4' : ct.semester === 'semester_5' ? 'Semester 5' : 'Career',
        notes: ct.notes
      })
    ),
    ...weeklyTasks.map(
      (wt): UnifiedTask => ({
        id: `unified_wt_${wt.id}`,
        source: 'weekly',
        originalId: wt.id,
        title: wt.title,
        status: wt.completed ? 'completed' : 'pending',
        priority: 'medium',
        deadline: wt.deadline,
        category: 'Weekly Checklist',
        notes: wt.notes
      })
    )
  ];

  // Today Habit Calculations
  const activeHabits = habits.filter(h => h.is_active);
  const todayLogs = habitLogs.filter(l => l.date === selectedDate);
  const completedTodayHabits = activeHabits.filter(h => {
    const log = todayLogs.find(l => l.habit_id === h.id);
    return log?.completed;
  });

  const completionPct =
    activeHabits.length > 0 ? Math.round((completedTodayHabits.length / activeHabits.length) * 100) : 0;

  // Water & sleep from habit logs or defaults
  const waterHabit = habits.find(h => h.title.toLowerCase().includes('water'));
  const waterLog = waterHabit ? todayLogs.find(l => l.habit_id === waterHabit.id) : null;
  const waterLiters = waterLog ? Number(waterLog.value) || (waterLog.completed ? 2.0 : 0) : 0;

  const sleepHabit = habits.find(h => h.title.toLowerCase().includes('sleep'));
  const sleepLog = sleepHabit ? todayLogs.find(l => l.habit_id === sleepHabit.id) : null;
  const sleepHours = sleepLog ? Number(sleepLog.value) || (sleepLog.completed ? 8.0 : 0) : 0;

  const exerciseHabit = habits.find(h => h.title.toLowerCase().includes('exercise'));
  const exerciseLog = exerciseHabit ? todayLogs.find(l => l.habit_id === exerciseHabit.id) : null;
  const exerciseDone = Boolean(exerciseLog?.completed);

  const todayStats = {
    totalHabits: activeHabits.length,
    completedHabits: completedTodayHabits.length,
    completionPct,
    waterLiters,
    sleepHours,
    exerciseDone
  };

  // Financial Stats & Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savingsDeposits = transactions.filter(t => t.type === 'savings_deposit').reduce((sum, t) => sum + t.amount, 0);
  const savingsWithdrawals = transactions.filter(t => t.type === 'savings_withdrawal').reduce((sum, t) => sum + t.amount, 0);
  const totalSavings = Math.max(0, savingsDeposits - savingsWithdrawals);

  // Available cash/account balance = Income - Expenses - Savings Deposits + Savings Withdrawals
  const availableBalance = totalIncome - totalExpenses - savingsDeposits + savingsWithdrawals;

  // Current month savings
  const currentMonthPrefix = selectedDate.substring(0, 7); // 'YYYY-MM'
  const monthlySavingsDeposits = transactions
    .filter(t => t.type === 'savings_deposit' && t.date.startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlySavingsWithdrawals = transactions
    .filter(t => t.type === 'savings_withdrawal' && t.date.startsWith(currentMonthPrefix))
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlySavings = Math.max(0, monthlySavingsDeposits - monthlySavingsWithdrawals);

  const savingsTargetProgressPct = Math.min(
    100,
    Math.round((monthlySavings / settings.monthly_savings_target) * 100)
  );

  const financialStats = {
    totalSavings,
    monthlySavings,
    monthlyTarget: settings.monthly_savings_target,
    futureTarget: settings.future_savings_target,
    totalIncome,
    totalExpenses,
    availableBalance,
    savingsTargetProgressPct
  };

  // Reset to default seed data
  const resetToDefaultData = () => {
    if (confirm('Are you sure you want to reset all data back to the prompt initial specifications?')) {
      localStorage.clear();
      setRoutines(INITIAL_ROUTINES);
      setRoutineLogs([]);
      setHabits(INITIAL_HABITS);
      setHabitLogs([]);
      setFoodLogs([]);
      setWeeklyTasks(INITIAL_WEEKLY_TASKS);
      setShoppingItems(INITIAL_SHOPPING_ITEMS);
      setCareerTasks(INITIAL_CAREER_TASKS);
      setCareerGoals(INITIAL_CAREER_GOALS);
      setSkills(INITIAL_SKILLS);
      setCertifications(INITIAL_CERTIFICATIONS);
      setProjects(INITIAL_PROJECTS);
      setSavingsGoals(INITIAL_SAVINGS_GOALS);
      setTransactions(INITIAL_TRANSACTIONS);
      setPersonalTasks(INITIAL_PERSONAL_TASKS);
      setSettings({
        id: 's1',
        user_id: 'default',
        user_name: 'Indiresh',
        user_email: 'indiresh@example.com',
        theme: 'light',
        monthly_savings_target: MONTHLY_SAVINGS_TARGET,
        future_savings_target: FUTURE_SAVINGS_TARGET,
        daily_water_target_litres: 2.0,
        daily_sleep_target_hours: 8.0,
        notifications_enabled: true
      });
      alert('Data reset successfully to default prompt seed!');
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        isSupabaseLive,
        userEmail,
        settings,
        updateSettings,
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
        shoppingItems,
        addShoppingItem,
        toggleShoppingItem,
        deleteShoppingItem,
        updateShoppingItem,
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
        deleteProject,
        transactions,
        savingsGoals,
        addTransaction,
        deleteTransaction,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        personalTasks,
        addPersonalTask,
        updatePersonalTask,
        deletePersonalTask,
        togglePersonalTask,
        unifiedTasks,
        todayStats,
        financialStats,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
