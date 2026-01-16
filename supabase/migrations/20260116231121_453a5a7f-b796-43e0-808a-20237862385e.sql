-- =============================================
-- ADMIN ANALYTICS FUNCTIONS
-- =============================================

-- Function to get conversion funnel metrics
CREATE OR REPLACE FUNCTION public.get_conversion_funnel(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  total_signups bigint,
  completed_onboarding bigint,
  selected_agent bigint,
  started_phase1 bigint,
  completed_phase1 bigint,
  converted_to_paid bigint,
  active_last_7_days bigint,
  churned_users bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total signups in period
    (SELECT COUNT(DISTINCT id) FROM auth.users 
     WHERE created_at BETWEEN start_date AND end_date)::bigint as total_signups,
    
    -- Completed onboarding (has user_progress)
    (SELECT COUNT(DISTINCT up.user_id) FROM user_progress up
     JOIN auth.users u ON u.id = up.user_id
     WHERE u.created_at BETWEEN start_date AND end_date)::bigint as completed_onboarding,
    
    -- Selected an agent
    (SELECT COUNT(DISTINCT ua.user_id) FROM user_agents ua
     JOIN auth.users u ON u.id = ua.user_id
     WHERE u.created_at BETWEEN start_date AND end_date)::bigint as selected_agent,
    
    -- Started phase 1 (has any phase progress)
    (SELECT COUNT(DISTINCT upp.user_id) FROM user_phase_progress upp
     JOIN auth.users u ON u.id = upp.user_id
     WHERE u.created_at BETWEEN start_date AND end_date)::bigint as started_phase1,
    
    -- Completed phase 1
    (SELECT COUNT(DISTINCT upp.user_id) FROM user_phase_progress upp
     JOIN migrei_phases mp ON mp.id = upp.phase_id
     JOIN auth.users u ON u.id = upp.user_id
     WHERE mp.phase_number = 1 AND upp.status = 'completed'
     AND u.created_at BETWEEN start_date AND end_date)::bigint as completed_phase1,
    
    -- Converted to paid
    (SELECT COUNT(DISTINCT us.user_id) FROM user_subscriptions us
     JOIN auth.users u ON u.id = us.user_id
     WHERE us.status = 'active'
     AND u.created_at BETWEEN start_date AND end_date)::bigint as converted_to_paid,
    
    -- Active in last 7 days
    (SELECT COUNT(DISTINCT user_id) FROM user_progress
     WHERE last_activity_at >= now() - interval '7 days')::bigint as active_last_7_days,
    
    -- Churned (no activity in 14+ days, not completed)
    (SELECT COUNT(DISTINCT up.user_id) FROM user_progress up
     WHERE up.last_activity_at < now() - interval '14 days'
     AND up.overall_progress < 100)::bigint as churned_users;
END;
$$;

-- Function to get daily signups for charts
CREATE OR REPLACE FUNCTION public.get_daily_signups(
  start_date timestamptz DEFAULT now() - interval '30 days',
  end_date timestamptz DEFAULT now()
)
RETURNS TABLE (
  day date,
  signups bigint,
  with_agent bigint,
  paid bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.day::date,
    COALESCE((SELECT COUNT(*) FROM auth.users WHERE created_at::date = d.day), 0)::bigint as signups,
    COALESCE((SELECT COUNT(DISTINCT ua.user_id) FROM user_agents ua 
              JOIN auth.users u ON u.id = ua.user_id 
              WHERE u.created_at::date = d.day), 0)::bigint as with_agent,
    COALESCE((SELECT COUNT(DISTINCT us.user_id) FROM user_subscriptions us 
              JOIN auth.users u ON u.id = us.user_id 
              WHERE us.created_at::date = d.day AND us.status = 'active'), 0)::bigint as paid
  FROM generate_series(start_date::date, end_date::date, interval '1 day') as d(day)
  ORDER BY d.day;
END;
$$;

-- Function to get phase distribution
CREATE OR REPLACE FUNCTION public.get_phase_distribution()
RETURNS TABLE (
  phase_number integer,
  phase_name text,
  user_count bigint,
  avg_days_in_phase numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    mp.phase_number,
    mp.name,
    COUNT(DISTINCT up.user_id)::bigint as user_count,
    ROUND(AVG(EXTRACT(EPOCH FROM (now() - COALESCE(upp.started_at, now()))) / 86400), 1) as avg_days
  FROM migrei_phases mp
  LEFT JOIN user_progress up ON up.current_phase_id = mp.id
  LEFT JOIN user_phase_progress upp ON upp.phase_id = mp.id AND upp.user_id = up.user_id
  GROUP BY mp.phase_number, mp.name
  ORDER BY mp.phase_number;
END;
$$;

-- Function to get retention cohorts
CREATE OR REPLACE FUNCTION public.get_retention_cohorts()
RETURNS TABLE (
  cohort_week date,
  total_users bigint,
  week_1_retention numeric,
  week_2_retention numeric,
  week_4_retention numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH user_cohorts AS (
    SELECT 
      id as user_id,
      date_trunc('week', created_at)::date as cohort_week
    FROM auth.users
    WHERE created_at >= now() - interval '8 weeks'
  ),
  activity AS (
    SELECT 
      uc.user_id,
      uc.cohort_week,
      up.last_activity_at
    FROM user_cohorts uc
    LEFT JOIN user_progress up ON up.user_id = uc.user_id
  )
  SELECT
    a.cohort_week,
    COUNT(DISTINCT a.user_id)::bigint as total_users,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.last_activity_at >= a.cohort_week + interval '7 days' THEN a.user_id END) / NULLIF(COUNT(DISTINCT a.user_id), 0), 1) as week_1_retention,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.last_activity_at >= a.cohort_week + interval '14 days' THEN a.user_id END) / NULLIF(COUNT(DISTINCT a.user_id), 0), 1) as week_2_retention,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.last_activity_at >= a.cohort_week + interval '28 days' THEN a.user_id END) / NULLIF(COUNT(DISTINCT a.user_id), 0), 1) as week_4_retention
  FROM activity a
  GROUP BY a.cohort_week
  ORDER BY a.cohort_week DESC
  LIMIT 8;
END;
$$;

-- Grant execute permissions (admin only via RPC)
GRANT EXECUTE ON FUNCTION public.get_conversion_funnel TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_daily_signups TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_phase_distribution TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_retention_cohorts TO authenticated;