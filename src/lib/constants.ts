import {
  RoutineItem,
  Habit,
  WeeklyTask,
  ShoppingItem,
  CareerTask,
  CareerGoal,
  Skill,
  Certification,
  Project,
  SavingsGoal,
  PersonalTask,
  Transaction,
  FoodLog
} from '@/types';

export const INITIAL_ROUTINES: RoutineItem[] = [
  { id: 'r1', time_label: '6:00 AM', activity: 'Wake up + ice wash', category: 'morning', order_index: 1, is_active: true },
  { id: 'r2', time_label: '6:30 AM', activity: 'Freshen up + fruit water', category: 'morning', order_index: 2, is_active: true },
  { id: 'r3', time_label: '7:30 AM', activity: 'Exercise + rose water', category: 'exercise', order_index: 3, is_active: true },
  { id: 'r4', time_label: 'Morning', activity: 'ABC juice + oats', category: 'food', order_index: 4, is_active: true },
  { id: 'r5', time_label: '8:30 AM', activity: 'College', category: 'college', order_index: 5, is_active: true },
  { id: 'r6', time_label: '4:30 PM', activity: 'Banana (if available)', category: 'food', order_index: 6, is_active: true },
  { id: 'r7', time_label: '5:00 PM', activity: 'Gym / home', category: 'exercise', order_index: 7, is_active: true },
  { id: 'r8', time_label: '6:00 PM', activity: 'Exercise', category: 'exercise', order_index: 8, is_active: true },
  { id: 'r9', time_label: 'Evening', activity: 'Buttermilk + nellikkai (amla) mix', category: 'food', order_index: 9, is_active: true },
  { id: 'r10', time_label: 'Before 10:30 PM', activity: 'Sleep', category: 'night', order_index: 10, is_active: true },
];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', title: 'Wake up at 6 AM', description: 'Early morning kick-start routine', target_value: 1, unit: 'boolean', category: 'Discipline', color: '#2563EB', is_active: true, order_index: 1 },
  { id: 'h2', title: 'Drink 2 litres of water', description: 'Daily hydration & skin health', target_value: 2.0, unit: 'litres', category: 'Hydration', color: '#0284C7', is_active: true, order_index: 2 },
  { id: 'h3', title: 'Get 8 hours of sleep', description: 'Deep restorative physical & mental sleep', target_value: 8.0, unit: 'hours', category: 'Wellness', color: '#7C3AED', is_active: true, order_index: 3 },
  { id: 'h4', title: 'Exercise', description: 'Gym, home workout, or cardio session', target_value: 1, unit: 'boolean', category: 'Fitness', color: '#16A34A', is_active: true, order_index: 4 },
  { id: 'h5', title: 'Eat proper food', description: 'Clean meals, ABC juice, oats & nutrient rich', target_value: 1, unit: 'boolean', category: 'Nutrition', color: '#EA580C', is_active: true, order_index: 5 },
  { id: 'h6', title: 'Hair care', description: 'Rose water, oiling and hair nourishment', target_value: 1, unit: 'boolean', category: 'Self-Care', color: '#DB2777', is_active: true, order_index: 6 },
];

export const INITIAL_FOOD_MEALS: Omit<FoodLog, 'id' | 'date'>[] = [
  { meal_type: 'morning', items: 'Oats, banana, milk, ABC juice', completed: false, notes: 'Nutrient-rich start' },
  { meal_type: 'afternoon', items: 'Flexible meal; soya / paneer preferred', completed: false, notes: 'High-protein lunch' },
  { meal_type: 'evening', items: 'Soya, buttermilk, nellikkai (amla) mix', completed: false, notes: 'Recovery & digestion' },
];

export const INITIAL_WEEKLY_TASKS: WeeklyTask[] = [
  { id: 'w1', title: 'Specific Task 1: Complete Weekly Coding Sprint', week_start_date: '2026-11-14', completed: false },
  { id: 'w2', title: 'Specific Task 2: Review Monthly Savings & Shopping List', week_start_date: '2026-11-14', completed: false },
];

export const INITIAL_SHOPPING_ITEMS: ShoppingItem[] = [
  { id: 's1', name: 'ABC powder', quantity: '1 pack / tin', category: 'Self-Care / Health', is_purchased: false },
  { id: 's2', name: 'Oats', quantity: '1 kg', category: 'Food / Breakfast', is_purchased: true, purchase_date: '2026-11-10', price: 180 },
  { id: 's3', name: 'Soya chunks', quantity: '500g', category: 'Nutrition / Protein', is_purchased: false },
  { id: 's4', name: 'Nellikkai (Amla)', quantity: '500g fresh / powder', category: 'Self-Care / Health', is_purchased: false },
  { id: 's5', name: 'Flax seeds', quantity: '250g', category: 'Nutrition / Seeds', is_purchased: false },
  { id: 's6', name: 'Fruits / fruit-water ingredients', quantity: 'Apples, lemons, chia seeds', category: 'Health / Hydration', is_purchased: true, purchase_date: '2026-11-12', price: 220 },
];

export const INITIAL_CAREER_TASKS: CareerTask[] = [
  // Current tasks
  { id: 'ct1', title: 'Complete AI Video Set 1', status: 'in_progress', priority: 'high', semester: 'general', roadmap_category: 'current_tasks', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'ct2', title: 'Complete AI Video Set 2', status: 'not_started', priority: 'high', semester: 'general', roadmap_category: 'current_tasks', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'ct3', title: 'Start MERN Stack', status: 'in_progress', priority: 'urgent', semester: 'semester_4', roadmap_category: 'current_tasks', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'ct4', title: 'Develop the MyLife OS application', status: 'in_progress', priority: 'urgent', semester: 'semester_4', roadmap_category: 'current_tasks', created_at: '2026-11-14T00:00:00.000Z' },

  // Fourth-semester roadmap
  { id: 'sem4_1', title: 'Advanced Java', status: 'not_started', priority: 'high', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem4_2', title: 'MERN Stack Mastery', status: 'in_progress', priority: 'urgent', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem4_3', title: 'Build 4–5 quality projects', status: 'in_progress', priority: 'urgent', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem4_4', title: 'Learn SEO basics', status: 'not_started', priority: 'medium', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem4_5', title: 'Explore free Oracle Java certifications / badges', status: 'in_progress', priority: 'high', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem4_6', title: 'Continue DSA (Arrays, Trees, Graphs, DP)', status: 'in_progress', priority: 'high', semester: 'semester_4', roadmap_category: 'roadmap_sem4', created_at: '2026-11-14T00:00:00.000Z' },

  // Fifth-semester roadmap
  { id: 'sem5_1', title: 'Python for AI & Backend Systems', status: 'not_started', priority: 'high', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem5_2', title: 'Machine Learning Core Algorithms', status: 'not_started', priority: 'high', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem5_3', title: 'AI Agents Architecture & Workflows', status: 'not_started', priority: 'urgent', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem5_4', title: 'LLMs, Fine-tuning & Prompt Engineering', status: 'not_started', priority: 'urgent', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem5_5', title: 'AWS / Cloud Deployment & Serverless', status: 'not_started', priority: 'medium', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
  { id: 'sem5_6', title: 'DSA and Campus Placement Preparation', status: 'not_started', priority: 'urgent', semester: 'semester_5', roadmap_category: 'roadmap_sem5', created_at: '2026-11-14T00:00:00.000Z' },
];

export const INITIAL_CAREER_GOALS: CareerGoal[] = [
  {
    id: 'cg1',
    title: 'Tier-1 Campus Placement & AI Engineering Mastery',
    description: 'Master full-stack and modern AI workflows, solve 250+ LeetCode problems, and secure a top software engineering role.',
    category: 'placement',
    priority: 'urgent',
    progress_pct: 40,
    status: 'in_progress',
    start_date: '2026-10-01',
    target_date: '2027-06-30',
    milestones: [
      { id: 'm1', title: 'Build and deploy 4-5 full-stack portfolio projects', completed: false },
      { id: 'm2', title: 'Solve 150 LeetCode Medium DSA problems', completed: false },
      { id: 'm3', title: 'Attain Oracle Java Badges & Certifications', completed: false },
      { id: 'm4', title: 'Complete AI Agent & LLM specialization pipeline', completed: true },
    ]
  },
  {
    id: 'cg2',
    title: 'Semester 4 GPA & Core CS Excellence',
    description: 'Score 9.0+ SGPA in Semester 4 while balancing daily self-care and gym routine.',
    category: 'semester',
    priority: 'high',
    progress_pct: 65,
    status: 'in_progress',
    start_date: '2026-11-01',
    target_date: '2027-04-15',
    milestones: [
      { id: 'm21', title: 'Internal Exam 1 top score', completed: true },
      { id: 'm22', title: 'Internal Exam 2 top score', completed: false },
      { id: 'm23', title: 'Submit all lab records & mini-projects', completed: true }
    ]
  }
];

export const INITIAL_SKILLS: Skill[] = [
  { id: 'sk1', name: 'MERN Stack (MongoDB, Express, React, Node)', category: 'Web Development', level: 'intermediate', progress_pct: 65 },
  { id: 'sk2', name: 'Advanced Java & OOPs', category: 'Core CS', level: 'intermediate', progress_pct: 70 },
  { id: 'sk3', name: 'Data Structures & Algorithms', category: 'Competitive Coding', level: 'intermediate', progress_pct: 55 },
  { id: 'sk4', name: 'SEO Basics & Web Analytics', category: 'Marketing & Web', level: 'beginner', progress_pct: 30 },
  { id: 'sk5', name: 'Python & Machine Learning', category: 'AI / Data', level: 'beginner', progress_pct: 25 },
  { id: 'sk6', name: 'AI Agents & LLM Integration', category: 'AI / Data', level: 'intermediate', progress_pct: 50 },
  { id: 'sk7', name: 'Next.js & Supabase Architecture', category: 'Full Stack', level: 'advanced', progress_pct: 85 },
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'c1',
    name: 'Oracle Java Foundations Explorer / Badges',
    provider: 'Oracle University',
    course_url: 'https://mylearn.oracle.com',
    start_date: '2026-11-05',
    target_completion_date: '2026-12-15',
    status: 'in_progress',
    notes: 'Free official Oracle digital badges for Java SE foundations.'
  },
  {
    id: 'c2',
    name: 'MERN Stack Full Developer Certificate',
    provider: 'freeCodeCamp / Coursera',
    course_url: 'https://www.freecodecamp.org',
    start_date: '2026-11-15',
    target_completion_date: '2027-01-20',
    status: 'not_started',
    notes: 'Covering React 19, Node API design, MongoDB aggregation pipelines.'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'MyLife OS',
    description: 'Personal Self-Care, Career Growth & Savings Management System with Neo-Brutalist UI and Supabase DB.',
    tech_stack: 'Next.js 15, TypeScript, Tailwind CSS, Supabase PostgreSQL, Recharts',
    github_url: 'https://github.com/self_os/mylife-os',
    live_url: 'https://mylife-os.vercel.app',
    status: 'in_progress',
    start_date: '2026-11-14'
  },
  {
    id: 'p2',
    name: 'AI Video Processor & Auto Shorts Generator',
    description: 'Automated video highlights extraction using FFmpeg, transcription and open-weights LLMs.',
    tech_stack: 'Python, FastAPI, OpenAI Whisper, MoviePy',
    github_url: 'https://github.com/self_os/ai-video-proc',
    status: 'planned',
    start_date: '2026-12-01'
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'sg1', title: 'Trimmer', target_amount: 1500, saved_amount: 500, priority: 'medium', status: 'active', notes: 'Grooming & personal care essential' },
  { id: 'sg2', title: 'Shirts', target_amount: 2000, saved_amount: 400, priority: 'low', status: 'active', notes: 'Formal & casual college wear' },
  { id: 'sg3', title: 'Pants', target_amount: 2500, saved_amount: 600, priority: 'low', status: 'active', notes: 'Comfortable chinos and formal trousers' },
  { id: 'sg4', title: 'Going out with friends', target_amount: 1000, saved_amount: 750, priority: 'medium', status: 'active', notes: 'Weekend cafe & social budget' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', amount: 5000, type: 'income', category: 'Allowance / Stipend', date: '2026-11-01', description: 'Monthly allowance / freelance credit', notes: 'Budget base' },
  { id: 't2', amount: 1000, type: 'savings_deposit', category: 'Savings Contribution', date: '2026-11-02', description: 'Monthly base savings target deposited', notes: 'Allocated to primary reserve' },
  { id: 't3', amount: 450, type: 'expense', category: 'Self-Care & Groceries', date: '2026-11-05', description: 'Oats, buttermilk, and amla ingredients', notes: 'Nutrition support' },
  { id: 't4', amount: 300, type: 'expense', category: 'Education & Study', date: '2026-11-08', description: 'College stationery and notebook supplies' },
  { id: 't5', amount: 500, type: 'savings_deposit', category: 'Savings Contribution', date: '2026-11-10', description: 'Trimmer purchase goal savings allocation', savings_goal_id: 'sg1' },
  { id: 't6', amount: 250, type: 'expense', category: 'Transport', date: '2026-11-12', description: 'College bus/metro pass top-up' },
];

export const INITIAL_PERSONAL_TASKS: PersonalTask[] = [
  { id: 'pt1', title: 'Bank account', status: 'pending', priority: 'high', category: 'administrative', notes: 'Complete KYC and address verification at branch' },
  { id: 'pt2', title: 'ATM card', status: 'pending', priority: 'high', category: 'administrative', notes: 'Apply for contactless debit card and set PIN' },
  { id: 'pt3', title: 'Aadhaar update', status: 'in_progress', priority: 'urgent', category: 'administrative', notes: 'Biometric and mobile number linkage appointment' },
  { id: 'pt4', title: 'PAN card', status: 'pending', priority: 'high', category: 'administrative', notes: 'Verify NSDL application status and download e-PAN' },
];

export const MONTHLY_SAVINGS_TARGET = 1000;
export const FUTURE_SAVINGS_TARGET = 2000;
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
