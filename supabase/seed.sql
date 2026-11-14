-- ============================================================
-- MyLife OS - Seed Data Script
-- Populates default habits, routines, tasks, roadmaps, goals, and sample transactions
-- ============================================================

-- If inserting directly for a test user or demo user:
-- REPLACE '00000000-0000-0000-0000-000000000000' with your auth.users UUID

DO $$
DECLARE
    target_user_id UUID := '00000000-0000-0000-0000-000000000000';
    user_exists BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM auth.users WHERE id = target_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        RAISE NOTICE 'Please run this script after a user signs up or replace target_user_id with a valid user UUID.';
    ELSE
        -- 1. User Settings
        INSERT INTO public.user_settings (user_id, monthly_savings_target, future_savings_target)
        VALUES (target_user_id, 1000.00, 2000.00)
        ON CONFLICT (user_id) DO UPDATE 
        SET monthly_savings_target = 1000.00, future_savings_target = 2000.00;

        -- 2. Routines
        INSERT INTO public.routines (user_id, time_label, activity, category, order_index) VALUES
        (target_user_id, '6:00 AM', 'Wake up + ice wash', 'morning', 1),
        (target_user_id, '6:30 AM', 'Freshen up + fruit water', 'morning', 2),
        (target_user_id, '7:30 AM', 'Exercise + rose water', 'exercise', 3),
        (target_user_id, 'Morning', 'ABC juice + oats', 'food', 4),
        (target_user_id, '8:30 AM', 'College', 'college', 5),
        (target_user_id, '4:30 PM', 'Banana (if available)', 'food', 6),
        (target_user_id, '5:00 PM', 'Gym / home', 'exercise', 7),
        (target_user_id, '6:00 PM', 'Exercise', 'exercise', 8),
        (target_user_id, 'Evening', 'Buttermilk + nellikkai (amla) mix', 'food', 9),
        (target_user_id, 'Before 10:30 PM', 'Sleep', 'night', 10)
        ON CONFLICT DO NOTHING;

        -- 3. Habits
        INSERT INTO public.habits (user_id, title, description, target_value, unit, category, color, order_index) VALUES
        (target_user_id, 'Wake up at 6 AM', 'Early rise routine', 1, 'boolean', 'discipline', '#2563EB', 1),
        (target_user_id, 'Drink 2 litres of water', 'Daily hydration goal', 2.0, 'litres', 'health', '#0284C7', 2),
        (target_user_id, 'Get 8 hours of sleep', 'Optimal recovery and mental clarity', 8.0, 'hours', 'wellness', '#7C3AED', 3),
        (target_user_id, 'Exercise', 'Morning or evening workout session', 1, 'boolean', 'fitness', '#16A34A', 4),
        (target_user_id, 'Eat proper food', 'Wholesome nutritious meals & juices', 1, 'boolean', 'nutrition', '#EA580C', 5),
        (target_user_id, 'Hair care', 'Daily hair maintenance and care routine', 1, 'boolean', 'self_care', '#DB2777', 6)
        ON CONFLICT DO NOTHING;

        -- 4. Sample Transactions
        INSERT INTO public.transactions (user_id, amount, type, category, date, description, notes) VALUES
        (target_user_id, 5000.00, 'income', 'Salary/Allowance', CURRENT_DATE - INTERVAL '10 days', 'Monthly allowance/stipend', 'Received for semester expenses'),
        (target_user_id, 1000.00, 'savings_deposit', 'Savings Contribution', CURRENT_DATE - INTERVAL '8 days', 'Target monthly savings deposit', 'Moved to emergency savings bucket'),
        (target_user_id, 350.00, 'expense', 'Food', CURRENT_DATE - INTERVAL '6 days', 'Oats, milk and fruit supplies', 'Weekly healthy breakfast essentials'),
        (target_user_id, 200.00, 'expense', 'Transport', CURRENT_DATE - INTERVAL '4 days', 'Bus pass recharge', 'College commuting'),
        (target_user_id, 500.00, 'savings_deposit', 'Savings Contribution', CURRENT_DATE - INTERVAL '2 days', 'Trimmer goal allocation', 'Direct savings for purchase goal')
        ON CONFLICT DO NOTHING;

    END IF;
END $$;

