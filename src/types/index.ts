// MyLife OS - Comprehensive TypeScript Domain Types

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  monthly_savings_target: number;
  future_savings_target: number;
  daily_water_target_litres: number;
  daily_sleep_target_hours: number;
  notifications_enabled: boolean;
}

// ---------------- Routine & Daily Schedule ----------------
export type RoutineCategory = 'morning' | 'exercise' | 'food' | 'college' | 'evening' | 'night' | 'general';

export interface RoutineItem {
  id: string;
  user_id?: string;
  time_label: string;
  activity: string;
  category: RoutineCategory;
  order_index: number;
  is_active: boolean;
}

export interface RoutineLog {
  id: string;
  routine_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

// ---------------- Food Tracker ----------------
export type MealType = 'morning' | 'afternoon' | 'evening' | 'custom';

export interface FoodLog {
  id: string;
  date: string;
  meal_type: MealType;
  items: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

// ---------------- Daily Habits Checklist ----------------
export type HabitUnit = 'times' | 'litres' | 'hours' | 'boolean';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  target_value: number;
  unit: HabitUnit;
  category: string;
  color: string;
  is_active: boolean;
  order_index: number;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  value: number;
  completed_at?: string;
  notes?: string;
}

// ---------------- Weekly Tasks Checklist ----------------
export interface WeeklyTask {
  id: string;
  title: string;
  week_start_date: string;
  deadline?: string;
  completed: boolean;
  completed_at?: string;
  notes?: string;
}

// ---------------- Shopping List ----------------
export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  is_purchased: boolean;
  purchase_date?: string;
  price?: number;
  notes?: string;
}

// ---------------- Career Planner ----------------
export type CareerTaskStatus = 'not_started' | 'in_progress' | 'completed';
export type SemesterTag = 'semester_4' | 'semester_5' | 'general';
export type RoadmapCategory = 'current_tasks' | 'roadmap_sem4' | 'roadmap_sem5' | 'dsa' | 'projects' | 'general';

export interface CareerTask {
  id: string;
  title: string;
  status: CareerTaskStatus;
  priority: Priority;
  deadline?: string;
  notes?: string;
  semester: SemesterTag;
  roadmap_category: RoadmapCategory;
  created_at: string;
  completed_at?: string;
}

export interface CareerMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface CareerGoal {
  id: string;
  title: string;
  description?: string;
  category: 'short_term' | 'semester' | 'long_term' | 'placement' | 'personal_project';
  priority: Priority;
  progress_pct: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'on_hold';
  start_date?: string;
  target_date?: string;
  milestones: CareerMilestone[];
  completed_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'master';
  progress_pct: number;
  notes?: string;
}

export interface Certification {
  id: string;
  name: string;
  provider: string;
  course_url?: string;
  start_date?: string;
  target_completion_date?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  certificate_url?: string;
  notes?: string;
  completed_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tech_stack: string;
  github_url?: string;
  live_url?: string;
  status: 'planned' | 'in_progress' | 'completed';
  start_date?: string;
  completion_date?: string;
}

// ---------------- Savings & Expenses ----------------
export type TransactionType = 'income' | 'expense' | 'savings_deposit' | 'savings_withdrawal';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  notes?: string;
  savings_goal_id?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string;
  priority: Priority;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
  completed_at?: string;
}

// ---------------- Personal Administrative Tasks ----------------
export interface PersonalTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: Priority;
  deadline?: string;
  notes?: string;
  category: 'administrative' | 'personal' | 'errand';
  completed_at?: string;
}

// ---------------- Unified Task Model ----------------
export interface UnifiedTask {
  id: string;
  source: 'personal' | 'career' | 'weekly';
  originalId: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: Priority;
  deadline?: string;
  category: string;
  notes?: string;
}
