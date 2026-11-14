# 🌟 MyLife OS — Personal Self-Care, Career Growth & Savings Management System

> **A full-stack, Supabase-powered personal operating system built with Next.js App Router, TypeScript, Tailwind CSS, and a bold Neo-Brutalist aesthetic.**

---

## ⚡ Highlights & Overview

**MyLife OS** is a unified personal productivity platform with three interconnected modules designed around your daily life, college semester roadmaps, and financial milestones:

1. **Daily Habit & Self-Care Tracker**:
   - **Editable Daily Routine**: Prepopulated with ice washes, fruit water, rose water, ABC juice, oats, college hours, workouts, buttermilk + nellikkai mix, and sleep schedules. Supports drag/reorder, slot edits, completion timestamps, and date-specific tracking.
   - **Daily Food Tracker**: Morning, afternoon, and evening meal tracking with soya/paneer high-protein preferences, ABC juice notes, and custom snack logging.
   - **Habits Checklist**: Wake up at 6 AM, Drink 2L water (interactive quick +250ml logger), 8h sleep tracker, exercise status, healthy nutrition, and hair care.
   - **Weekly Checklist**: Milestone deliverables with deadlines and completion statuses.
   - **Streak & Analytics Engine**: Real-time streak counter (current & longest streaks), 7-day completion percentage bar charts, habit heatmaps, and zero penalty for future dates.
   - **Self-Care Shopping List**: Prepopulated with ABC powder, oats, soya chunks, nellikkai (amla), flax seeds, and fruit-water ingredients with price and purchase history.

2. **Career Planner & Placement Tracker**:
   - **Current Active Tasks**: Preloaded with *Complete AI Video Set 1 & 2*, *Start MERN Stack*, and *Develop MyLife OS application*.
   - **4th Semester Roadmap**: Advanced Java, MERN Stack mastery, 4–5 quality portfolio projects, SEO basics, Oracle free Java badges, and DSA practice.
   - **5th Semester Roadmap**: Python, Machine Learning fundamentals, AI Agents architecture, LLMs & prompt engineering, AWS/Cloud deployment, and placement preparation.
   - **Career Goals & Milestones**: Multi-milestone goal tracking with dynamic progress calculation (0–100%).
   - **Certifications Hub**: Track providers, course URLs, dates, and official certificates (e.g. Oracle University, FreeCodeCamp).
   - **Project Portfolio Tracker**: Track live URLs, GitHub repositories, and full tech stacks.
   - **Skills Proficiency Matrix**: Real-time proficiency progress bars across web development, core CS, and AI.

3. **Savings & Expense Management**:
   - **Monthly Savings Target Plan**: Configured with an initial ₹1,000 monthly benchmark and a future progression target of ₹2,000.
   - **Double-Entry Financial Math**: Accurate financial ledger that distinguishes operational expenses from savings deposits. Savings contributions increase net worth and purchase goal progress without double-counting as expenses.
   - **Target Purchase Allocations**: Dedicated visual progress goals for *Trimmer* (₹1,500), *Shirts* (₹2,000), *Pants* (₹2,500), and *Going out with friends* (₹1,000).
   - **Interactive Recharts Visualizations**: Income vs Expense vs Savings bar charts, and expense category breakdown donut charts.

4. **Unified Administrative Tasks View**:
   - Single aggregated hub bringing together essential administrative tasks (*Bank account*, *ATM card*, *Aadhaar update*, *PAN card*) alongside Career roadmaps and Self-Care tasks by reference without duplicating database records.

5. **Neo-Brutalist Visual Design**:
   - Light sand/cream canvas (`#F5F0E8`), cobalt blue (`#2563EB`), bright yellow (`#FACC15`), lime green (`#84CC16`), and coral red (`#EF4444`).
   - Thick 2.5px solid black borders, hard offset drop shadows (`4px 4px 0px #000`), tactile button presses (`active:translate-x-1 active:translate-y-1`), and built-in dark mode support.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router with Turbopack) |
| **Language** | TypeScript (Strict typing with zero errors) |
| **Styling** | Tailwind CSS v4 with custom Neo-Brutalist utilities |
| **Database & Auth** | Supabase PostgreSQL, Row-Level Security (RLS) & Auth Triggers |
| **Visual Charts** | Recharts |
| **Icons** | Lucide React |
| **Date & Time** | date-fns & native Intl with `Asia/Kolkata` (IST) timezone awareness |
| **Forms & Validation** | React Hook Form + Zod |
| **Delight** | Canvas Confetti celebratory animations |
| **Deployment** | Vercel Ready |

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

> **Note**: MyLife OS features a **Hybrid Engine**. If Supabase credentials are not yet configured, the application automatically runs in **Local Demo Mode** using persistent browser storage pre-seeded with all docx prompt data, so you can test all features immediately!

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase PostgreSQL Setup & Migration

When connecting your live Supabase cloud database:

1. Create a project on [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository and run it. This script:
   - Enables UUID extensions.
   - Creates all 17 normalized tables: `profiles`, `user_settings`, `routines`, `routine_logs`, `habits`, `habit_logs`, `food_logs`, `weekly_tasks`, `shopping_items`, `career_tasks`, `career_goals`, `skills`, `certifications`, `projects`, `savings_goals`, `transactions`, `personal_tasks`.
   - Enables **Row-Level Security (RLS)** on every table restricting reads, updates, and inserts to `auth.uid() = user_id`.
   - Installs the trigger function `handle_new_user_setup()`: **Automatically seeds default habits, routines, roadmaps, goals, and shopping list for every new user upon sign up!**
4. Copy your Supabase credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_TIMEZONE=Asia/Kolkata
   ```

---

## 📦 Vercel Deployment Instructions

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete MyLife OS application build"
   git push origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_TIMEZONE` (`Asia/Kolkata`)
5. Click **Deploy**. Vercel will build and serve your production application with automatic SSL and edge CDN caching.

---

## 📂 Project Directory Structure

```
├── public/                 # Favicons and static assets
├── src/
│   ├── app/
│   │   ├── globals.css     # Tailwind v4 & Neo-Brutalism design tokens
│   │   ├── layout.tsx      # Root layout & AppProvider context wrapper
│   │   └── page.tsx        # Dynamic dashboard hub & tab router
│   ├── components/
│   │   ├── analytics/      # ReportsModule & CSV data export
│   │   ├── career/         # CareerPlannerModule (Sem 4, Sem 5, Certs, Projects)
│   │   ├── common/         # NeoCard, NeoButton, QuickAddModal
│   │   ├── dashboard/      # OverviewDashboard (Executive summaries)
│   │   ├── habits/         # DailyHabitsModule (Routine, Habits, Food, Weekly)
│   │   ├── layout/         # Navbar, Sidebar, MobileNav
│   │   ├── savings/        # SavingsModule (Transactions, Goals, Targets, Charts)
│   │   ├── shopping/       # ShoppingListModule (Inventory & Purchases)
│   │   ├── settings/       # SettingsModule (Profile, DB Sync, Theme)
│   │   └── tasks/          # UnifiedTasksModule (Administrative & KYC)
│   ├── context/
│   │   └── AppContext.tsx  # Central State & Persistence Provider with full CRUD
│   ├── lib/
│   │   ├── constants.ts    # Prompt seed data & routine templates
│   │   ├── supabase.ts     # Supabase client initialization
│   │   └── utils.ts        # Currency (INR), timezone, streaks & CSV export
│   └── types/
│       └── index.ts        # TypeScript domain models and database types
├── supabase/
│   ├── schema.sql          # Complete DDL, RLS policies, indexes & auth triggers
│   └── seed.sql            # Standalone seed script for testing
├── .env.local.example      # Environment variables template
└── README.md               # Complete documentation
```

---

## 🎯 Verification & QA Checklist

- [x] All forms, checkboxes, modals, and buttons work with immediate UI reactivity.
- [x] Zero mock or fake calculations: financial balances and streak counts derive from real logs.
- [x] Date switcher supports historical corrections without counting future dates as missed.
- [x] Tested production build (`npm run build`) completed with 0 errors.
- [x] Neo-Brutalist design tokens applied consistently with high-contrast accessibility.
