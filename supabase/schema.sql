-- ============================================================
-- MyLife OS - Comprehensive Supabase PostgreSQL Database Schema
-- Includes Row Level Security (RLS), Triggers, & Indexes
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. Profiles Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT DEFAULT 'MyLife OS User',
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- 2. User Settings Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    monthly_savings_target NUMERIC(12, 2) DEFAULT 1000.00,
    future_savings_target NUMERIC(12, 2) DEFAULT 2000.00,
    daily_water_target_litres NUMERIC(4, 2) DEFAULT 2.00,
    daily_sleep_target_hours NUMERIC(4, 2) DEFAULT 8.00,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 3. Daily Routines Template Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    time_label TEXT NOT NULL,
    activity TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routines"
    ON public.routines FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routines"
    ON public.routines FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routines"
    ON public.routines FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routines"
    ON public.routines FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_routines_user_order ON public.routines(user_id, order_index);

-- ------------------------------------------------------------
-- 4. Routine Daily Logs Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routine_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    routine_id UUID NOT NULL REFERENCES public.routines(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    UNIQUE(user_id, routine_id, date)
);

ALTER TABLE public.routine_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own routine logs"
    ON public.routine_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own routine logs"
    ON public.routine_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own routine logs"
    ON public.routine_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own routine logs"
    ON public.routine_logs FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_routine_logs_user_date ON public.routine_logs(user_id, date);

-- ------------------------------------------------------------
-- 5. Daily Habits Template Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC(6, 2) DEFAULT 1,
    unit TEXT DEFAULT 'times', -- 'times', 'litres', 'hours', 'boolean'
    category TEXT DEFAULT 'health',
    color TEXT DEFAULT '#2563EB',
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habits"
    ON public.habits FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
    ON public.habits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
    ON public.habits FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
    ON public.habits FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habits_user_active ON public.habits(user_id, is_active, order_index);

-- ------------------------------------------------------------
-- 6. Habit Daily Logs Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    value NUMERIC(6, 2) DEFAULT 0,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    UNIQUE(user_id, habit_id, date)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own habit logs"
    ON public.habit_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit logs"
    ON public.habit_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
    ON public.habit_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit logs"
    ON public.habit_logs FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON public.habit_logs(user_id, date);

-- ------------------------------------------------------------
-- 7. Food Tracker Logs Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('morning', 'afternoon', 'evening', 'custom')),
    items TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food logs"
    ON public.food_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food logs"
    ON public.food_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs"
    ON public.food_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs"
    ON public.food_logs FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_food_logs_user_date ON public.food_logs(user_id, date);

-- ------------------------------------------------------------
-- 8. Weekly Checklist Tasks Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    week_start_date DATE NOT NULL,
    deadline TIMESTAMPTZ,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.weekly_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weekly tasks"
    ON public.weekly_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weekly tasks"
    ON public.weekly_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weekly tasks"
    ON public.weekly_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weekly tasks"
    ON public.weekly_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 9. Shopping List Items Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity TEXT DEFAULT '1 packet',
    category TEXT DEFAULT 'Self-Care / Grocery',
    is_purchased BOOLEAN DEFAULT false,
    purchase_date DATE,
    price NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shopping items"
    ON public.shopping_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping items"
    ON public.shopping_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping items"
    ON public.shopping_items FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping items"
    ON public.shopping_items FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 10. Career Tasks Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    deadline DATE,
    notes TEXT,
    semester TEXT DEFAULT 'general' CHECK (semester IN ('semester_4', 'semester_5', 'general')),
    roadmap_category TEXT DEFAULT 'current_tasks',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.career_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career tasks"
    ON public.career_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career tasks"
    ON public.career_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career tasks"
    ON public.career_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own career tasks"
    ON public.career_tasks FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_career_tasks_user_status ON public.career_tasks(user_id, status);

-- ------------------------------------------------------------
-- 11. Career Goals Table (with Subtasks / Milestones)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.career_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('short_term', 'semester', 'long_term', 'placement', 'personal_project')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
    start_date DATE,
    target_date DATE,
    milestones JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own career goals"
    ON public.career_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own career goals"
    ON public.career_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own career goals"
    ON public.career_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own career goals"
    ON public.career_goals FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 12. Skills Tracker Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'technical',
    level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'master')),
    progress_pct INTEGER DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
    ON public.skills FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
    ON public.skills FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
    ON public.skills FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own skills"
    ON public.skills FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 13. Certifications Tracker Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    course_url TEXT,
    start_date DATE,
    target_completion_date DATE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    certificate_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certifications"
    ON public.certifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certifications"
    ON public.certifications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certifications"
    ON public.certifications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own certifications"
    ON public.certifications FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 14. Projects Tracker Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT NOT NULL,
    github_url TEXT,
    live_url TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('planned', 'in_progress', 'completed')),
    start_date DATE,
    completion_date DATE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 15. Savings Goals (Purchase Goals) Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL,
    saved_amount NUMERIC(12, 2) DEFAULT 0.00,
    target_date DATE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own savings goals"
    ON public.savings_goals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
    ON public.savings_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
    ON public.savings_goals FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
    ON public.savings_goals FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 16. Transactions Table (Income, Expenses, Savings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'savings_deposit', 'savings_withdrawal')),
    category TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    savings_goal_id UUID REFERENCES public.savings_goals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW())
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
    ON public.transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON public.transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
    ON public.transactions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
    ON public.transactions FOR DELETE
    USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON public.transactions(user_id, type);

-- ------------------------------------------------------------
-- 17. Personal Tasks (Administrative Tasks) Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.personal_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    priority TEXT DEFAULT 'high' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    deadline DATE,
    notes TEXT,
    category TEXT DEFAULT 'administrative',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Kolkata', NOW()),
    completed_at TIMESTAMPTZ
);

ALTER TABLE public.personal_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personal tasks"
    ON public.personal_tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own personal tasks"
    ON public.personal_tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own personal tasks"
    ON public.personal_tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own personal tasks"
    ON public.personal_tasks FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 18. Auto-Seed Trigger Function on New User Sign-Up
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER AS $$
DECLARE
    new_user_id UUID := NEW.id;
BEGIN
    -- 1. Create Profile
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new_user_id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Indiresh'));

    -- 2. Create User Settings
    INSERT INTO public.user_settings (user_id, monthly_savings_target, future_savings_target)
    VALUES (new_user_id, 1000.00, 2000.00);

    -- 3. Seed Prepopulated Daily Routines
    INSERT INTO public.routines (user_id, time_label, activity, category, order_index) VALUES
    (new_user_id, '6:00 AM', 'Wake up + ice wash', 'morning', 1),
    (new_user_id, '6:30 AM', 'Freshen up + fruit water', 'morning', 2),
    (new_user_id, '7:30 AM', 'Exercise + rose water', 'exercise', 3),
    (new_user_id, 'Morning', 'ABC juice + oats', 'food', 4),
    (new_user_id, '8:30 AM', 'College', 'college', 5),
    (new_user_id, '4:30 PM', 'Banana (if available)', 'food', 6),
    (new_user_id, '5:00 PM', 'Gym / home', 'exercise', 7),
    (new_user_id, '6:00 PM', 'Exercise', 'exercise', 8),
    (new_user_id, 'Evening', 'Buttermilk + nellikkai (amla) mix', 'food', 9),
    (new_user_id, 'Before 10:30 PM', 'Sleep', 'night', 10);

    -- 4. Seed Prepopulated Daily Habits Checklist
    INSERT INTO public.habits (user_id, title, description, target_value, unit, category, color, order_index) VALUES
    (new_user_id, 'Wake up at 6 AM', 'Early rise routine', 1, 'boolean', 'discipline', '#2563EB', 1),
    (new_user_id, 'Drink 2 litres of water', 'Daily hydration goal', 2.0, 'litres', 'health', '#0284C7', 2),
    (new_user_id, 'Get 8 hours of sleep', 'Optimal recovery and mental clarity', 8.0, 'hours', 'wellness', '#7C3AED', 3),
    (new_user_id, 'Exercise', 'Morning or evening workout session', 1, 'boolean', 'fitness', '#16A34A', 4),
    (new_user_id, 'Eat proper food', 'Wholesome nutritious meals & juices', 1, 'boolean', 'nutrition', '#EA580C', 5),
    (new_user_id, 'Hair care', 'Daily hair maintenance and care routine', 1, 'boolean', 'self_care', '#DB2777', 6);

    -- 5. Seed Prepopulated Weekly Tasks
    INSERT INTO public.weekly_tasks (user_id, title, week_start_date) VALUES
    (new_user_id, 'Specific Task 1', CURRENT_DATE),
    (new_user_id, 'Specific Task 2', CURRENT_DATE);

    -- 6. Seed Prepopulated Shopping List
    INSERT INTO public.shopping_items (user_id, name, quantity, category, is_purchased) VALUES
    (new_user_id, 'ABC powder', '1 tin/pack', 'Self-Care / Health', false),
    (new_user_id, 'Oats', '1 kg', 'Food / Breakfast', false),
    (new_user_id, 'Soya', '500g chunks/granules', 'Nutrition / Protein', false),
    (new_user_id, 'Nellikkai (Amla)', 'Fresh / powder', 'Self-Care / Health', false),
    (new_user_id, 'Flax seeds', '250g', 'Nutrition / Seeds', false),
    (new_user_id, 'Fruits / fruit-water ingredients', 'Apples, lemons, chia seeds', 'Health / Hydration', false);

    -- 7. Seed Prepopulated Career Current Tasks
    INSERT INTO public.career_tasks (user_id, title, status, priority, semester, roadmap_category) VALUES
    (new_user_id, 'Complete AI Video Set 1', 'not_started', 'high', 'general', 'current_tasks'),
    (new_user_id, 'Complete AI Video Set 2', 'not_started', 'high', 'general', 'current_tasks'),
    (new_user_id, 'Start MERN Stack', 'not_started', 'urgent', 'semester_4', 'current_tasks'),
    (new_user_id, 'Develop the MyLife OS application', 'not_started', 'urgent', 'semester_4', 'current_tasks');

    -- 8. Seed Prepopulated 4th Semester Roadmap
    INSERT INTO public.career_tasks (user_id, title, status, priority, semester, roadmap_category) VALUES
    (new_user_id, 'Advanced Java', 'not_started', 'high', 'semester_4', 'roadmap_sem4'),
    (new_user_id, 'MERN Stack mastery', 'not_started', 'urgent', 'semester_4', 'roadmap_sem4'),
    (new_user_id, 'Build 4–5 quality projects', 'not_started', 'urgent', 'semester_4', 'roadmap_sem4'),
    (new_user_id, 'Learn SEO basics', 'not_started', 'medium', 'semester_4', 'roadmap_sem4'),
    (new_user_id, 'Explore free Oracle Java certifications / badges', 'not_started', 'high', 'semester_4', 'roadmap_sem4'),
    (new_user_id, 'Continue DSA practice', 'not_started', 'high', 'semester_4', 'roadmap_sem4');

    -- 9. Seed Prepopulated 5th Semester Roadmap
    INSERT INTO public.career_tasks (user_id, title, status, priority, semester, roadmap_category) VALUES
    (new_user_id, 'Python for AI & Development', 'not_started', 'high', 'semester_5', 'roadmap_sem5'),
    (new_user_id, 'Machine Learning Fundamentals', 'not_started', 'high', 'semester_5', 'roadmap_sem5'),
    (new_user_id, 'AI Agents Architecture & Tools', 'not_started', 'urgent', 'semester_5', 'roadmap_sem5'),
    (new_user_id, 'LLMs & Prompt Engineering', 'not_started', 'urgent', 'semester_5', 'roadmap_sem5'),
    (new_user_id, 'AWS / Cloud Deployment', 'not_started', 'medium', 'semester_5', 'roadmap_sem5'),
    (new_user_id, 'DSA & Placement Preparation', 'not_started', 'urgent', 'semester_5', 'roadmap_sem5');

    -- 10. Seed Prepopulated Career Goals
    INSERT INTO public.career_goals (user_id, title, description, category, priority, progress_pct, status, milestones) VALUES
    (new_user_id, 'Master Full-Stack & AI Agent Development', 'Build real-world production systems and secure tier-1 placements', 'placement', 'urgent', 0, 'not_started', 
     '[{"id": "m1", "title": "Complete 4-5 Full Stack Projects", "completed": false}, {"id": "m2", "title": "Master LeetCode Medium DSA", "completed": false}, {"id": "m3", "title": "Deploy AI Agent App", "completed": false}]'::jsonb);

    -- 10b. Seed Prepopulated Skills Tracker (all 0% beginner)
    INSERT INTO public.skills (user_id, name, category, level, progress_pct) VALUES
    (new_user_id, 'MERN Stack (MongoDB, Express, React, Node)', 'technical', 'beginner', 0),
    (new_user_id, 'Advanced Java & OOPs', 'technical', 'beginner', 0),
    (new_user_id, 'Data Structures & Algorithms', 'technical', 'beginner', 0),
    (new_user_id, 'SEO Basics & Web Analytics', 'technical', 'beginner', 0),
    (new_user_id, 'Python & Machine Learning', 'technical', 'beginner', 0),
    (new_user_id, 'AI Agents & LLM Integration', 'technical', 'beginner', 0),
    (new_user_id, 'Next.js & Supabase Architecture', 'technical', 'beginner', 0);

    -- 11. Seed Prepopulated Certifications
    INSERT INTO public.certifications (user_id, name, provider, course_url, status) VALUES
    (new_user_id, 'Oracle Free Java Explorer Badges', 'Oracle University', 'https://mylearn.oracle.com', 'not_started'),
    (new_user_id, 'Full-Stack Modern Web Certification', 'FreeCodeCamp / Coursera', 'https://www.freecodecamp.org', 'not_started');

    -- 12. Seed Prepopulated Projects
    INSERT INTO public.projects (user_id, name, description, tech_stack, status) VALUES
    (new_user_id, 'MyLife OS', 'Personal self-care, career growth and savings management system', 'Next.js, TypeScript, Tailwind CSS, Supabase', 'planned');

    -- 13. Seed Prepopulated Purchase Goals
    INSERT INTO public.savings_goals (user_id, title, target_amount, saved_amount, priority, status) VALUES
    (new_user_id, 'Trimmer', 1500.00, 0.00, 'medium', 'active'),
    (new_user_id, 'Shirts', 2000.00, 0.00, 'low', 'active'),
    (new_user_id, 'Pants', 2500.00, 0.00, 'low', 'active'),
    (new_user_id, 'Going out with friends', 1000.00, 0.00, 'medium', 'active');

    -- 14. Seed Prepopulated Administrative Tasks
    INSERT INTO public.personal_tasks (user_id, title, status, priority, category) VALUES
    (new_user_id, 'Bank account', 'pending', 'high', 'administrative'),
    (new_user_id, 'ATM card', 'pending', 'high', 'administrative'),
    (new_user_id, 'Aadhaar update', 'pending', 'urgent', 'administrative'),
    (new_user_id, 'PAN card', 'pending', 'high', 'administrative');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();

